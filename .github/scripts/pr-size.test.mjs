import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const workflowUrl = new URL('../workflows/pr-size.yml', import.meta.url);

async function runGuard(additions, deletions, files = []) {
  const workflow = await readFile(workflowUrl, 'utf8');
  const block = workflow.match(/ {10}script: \|\n([\s\S]*)$/);
  assert.ok(block, 'Workflow must contain the executable github-script block');
  const script = block[1].replace(/^ {12}/gm, '');
  const failures = [];
  const logs = [];
  await vm.runInNewContext(`(async () => {\n${script}\n})()`, {
    context: { repo: { owner: 'example', repo: 'repository' }, issue: { number: 83 } },
    github: {
      rest: { pulls: { get: async () => ({ data: { additions, deletions } }), listFiles: {} } },
      paginate: async () => files,
    },
    core: { info: (message) => logs.push(message), setFailed: (message) => failures.push(message) },
  });
  return { failures, logs };
}

for (const [additions, deletions, shouldFail] of [
  [0, 0, false],
  [300, 200, false],
  [300, 201, true],
]) {
  test(`${additions} additions + ${deletions} deletions: ${shouldFail ? 'reject' : 'accept'}`, async () => {
    const { failures, logs } = await runGuard(additions, deletions);
    assert.equal(failures.length, shouldFail ? 1 : 0);
    assert.ok(logs.some((line) => line.includes(`additions=${additions}, deletions=${deletions}`)));
  });
}

for (const filename of ['src/generated/api.ts', 'pnpm-lock.yaml', 'docs/moved.md']) {
  test(`Counts GitHub total without excluding ${filename}`, async () => {
    const { failures } = await runGuard(501, 0, [
      { filename, status: 'renamed', additions: 501, deletions: 0, patch: 'diff' },
    ]);
    assert.equal(failures.length, 1);
  });
}

test('Logs binary or unavailable patches without replacing authoritative PR totals', async () => {
  const { failures, logs } = await runGuard(300, 201, [
    { filename: 'image.png', status: 'modified', additions: 0, deletions: 0 },
  ]);
  assert.equal(failures.length, 1);
  assert.ok(logs.some((line) => line.includes('image.png') && line.includes('Binary or unavailable patch')));
});

test('Uses a read-only pull_request workflow without executing PR files', async () => {
  const workflow = await readFile(workflowUrl, 'utf8');
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /pull-requests: read/);
  assert.doesNotMatch(workflow, /pull_request_target|actions\/checkout|\brun:|contents: write/);
});
