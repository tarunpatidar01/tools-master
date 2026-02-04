const fs = require('fs');
const s = fs.readFileSync('data/tools.json.repaired_id2_v1', 'utf8');
let inStr = false;
let esc = false;
let arrDepth = 0;
let objDepth = 0;
for (let i = 0; i < s.length; i++) {
  const ch = s[i];
  if (inStr) {
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (ch === '"') { inStr = false; continue; }
  } else {
    if (ch === '"') { inStr = true; continue; }
    if (ch === '[') { arrDepth++; if(arrDepth===1) console.log('ARR START at', i); }
    else if (ch === ']') {
      if (arrDepth === 0) {
        console.log('Unexpected ] at', i, 'objDepth', objDepth, 'arrDepth', arrDepth);
        console.log('context:', s.slice(Math.max(0, i - 200), i + 80));
        process.exit(1);
      }
      arrDepth--;
      if(arrDepth===0) console.log('ARR END at', i);
    }
    else if (ch === '{') { objDepth++; if(i%1000<2) console.log('obj++ at', i, 'objDepth', objDepth); }
    else if (ch === '}') {
      if (objDepth === 0) { console.log('Unexpected } at', i); process.exit(1); }
      objDepth--;
      if(i%1000<2) console.log('obj-- at', i, 'objDepth', objDepth);
    }
  }
}
console.log('scanned OK, arrDepth', arrDepth, 'objDepth', objDepth);
if (arrDepth !== 0 || objDepth !== 0) console.log('non-zero depths - possible unclosed structures');