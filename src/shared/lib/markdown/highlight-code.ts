import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import http from 'highlight.js/lib/languages/http';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import kotlin from 'highlight.js/lib/languages/kotlin';
import lua from 'highlight.js/lib/languages/lua';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('http', http);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('lua', lua);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

export function highlightCode(code: string, language: string) {
  if (!language || !hljs.getLanguage(language)) return '';

  try {
    return hljs.highlight(code, { language, ignoreIllegals: true }).value;
  } catch {
    return '';
  }
}
