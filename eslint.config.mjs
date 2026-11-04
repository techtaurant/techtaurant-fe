import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';

import { fsdImportBoundaryConfig } from './eslint/fsd-boundaries.mjs';
import { importSortConfig } from './eslint/import-sort.mjs';
import { namedExportOnlyConfig } from './eslint/named-export-only.mjs';
import { noUnusedVarsConfig } from './eslint/no-unused-vars.mjs';
import { tailwindConfig } from './eslint/tailwind.mjs';
import { typeImportConfig } from './eslint/type-imports.mjs';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  importSortConfig,
  typeImportConfig,
  noUnusedVarsConfig,
  fsdImportBoundaryConfig,
  namedExportOnlyConfig,
  tailwindConfig,
  prettierConfig,
  globalIgnores(['.next/**', '.open-next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
