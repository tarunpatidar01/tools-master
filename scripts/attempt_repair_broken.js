const fs = require('fs');
const dir = 'scripts/broken_objects';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json.txt'));
fs.mkdirSync('scripts/repaired_objects', { recursive: true });
let fixed = 0;
let failed = [];
for (const f of files) {
  const p = `${dir}/${f}`;
  let s = fs.readFileSync(p, 'utf8');
  try {
    // Move faq inside content if misplaced
    if (s.indexOf('"faq"') !== -1) {
      const faqIdx = s.indexOf('"faq"');
      const contentIdx = s.indexOf('"content"');
      if (faqIdx !== -1 && (faqIdx < contentIdx || (faqIdx > contentIdx && s.lastIndexOf('}', s.indexOf('}', contentIdx)) < faqIdx))) {
        const arrStart = s.indexOf('[', faqIdx);
        let j = arrStart; let d = 0;
        for (; j < s.length; j++) { if (s[j] === '[') d++; else if (s[j] === ']') { d--; if (d === 0) break; } }
        const faqArray = s.slice(arrStart, j + 1);
        const before = s.slice(0, faqIdx);
        const after = s.slice(j + 1);
        s = before + after.replace(/^\s*,?\s*/, '');
        const contentStart = s.indexOf('"content"');
        if (contentStart !== -1) {
          const contentOpen = s.indexOf('{', contentStart);
          let k = contentOpen; let depth = 0;
          for (; k < s.length; k++) { if (s[k] === '{') depth++; else if (s[k] === '}') { depth--; if (depth === 0) break; } }
          s = s.slice(0, k) + ',\n      "faq": ' + faqArray + s.slice(k);
        }
      }
    }
    // remove duplicated array closings
    s = s.replace(/\],\s*\],/g, '],');
    JSON.parse(s);
    fs.writeFileSync(`scripts/repaired_objects/${f.replace('.json.txt', '.json')}`, s, 'utf8');
    fixed++;
  } catch (e) {
    failed.push({ file: f, err: e.message });
    fs.writeFileSync(`scripts/repaired_objects/${f.replace('.json.txt', '.err.txt')}`, `ERR:${e.message}\n\nSOURCE:\n${s.slice(0, 2000)}`, 'utf8');
  }
}
console.log('fixed', fixed, 'failed', failed.length);
if (failed.length) console.log('failed samples written');