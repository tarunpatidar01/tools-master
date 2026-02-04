const fs=require('fs'); const s=fs.readFileSync('data/tools.json.bak','utf8'); const idStr='"id": 2'; const idx=s.indexOf(idStr); if(idx===-1){ console.error('id2 not found'); process.exit(1);} // find object bounds by brace matching
let start = s.lastIndexOf('{', idx); let i=start; let depth=0; for(; i<s.length; i++){ if(s[i]==='{') depth++; else if(s[i]==='}') { depth--; if(depth===0){ break; } } } const obj = s.slice(start, i+1); // work on obj
// find faq array
const faqKey = '"faq"'; const faqIdx = obj.indexOf(faqKey); if(faqIdx===-1){ console.log('No faq in obj'); process.exit(0);} const arrStart = obj.indexOf('[', faqIdx); // find matching ] for array
let j=arrStart; let d=0; for(; j<obj.length; j++){ if(obj[j]==='[') d++; else if(obj[j]===']'){ d--; if(d===0) break; } }
const faqArray = obj.slice(arrStart, j+1);
// remove faqArray and any leading commas/newlines before next section object
let prefix = obj.slice(0, faqIdx);
let suffix = obj.slice(j+1);
// remove any extra commas/newlines at start of suffix
suffix = suffix.replace(/^\s*,?\s*/,'');
let newObj = prefix + suffix;
// find place to insert faq: before the final closing of sections (look for final '      ]\n    }')
const sectionsClose = '      ]\n    }'; const posSectionsClose = newObj.lastIndexOf(sectionsClose);
if(posSectionsClose===-1){ console.error('sections close not found'); process.exit(1);} // insert faq before sectionsClose
newObj = newObj.slice(0,posSectionsClose) + '      ],\n      "faq": ' + faqArray + '\n    }' + newObj.slice(posSectionsClose+sectionsClose.length);
// replace in file
const newFile = s.slice(0,start) + newObj + s.slice(i+1);
fs.writeFileSync('data/tools.json.repaired_id2', newFile,'utf8'); console.log('WROTE data/tools.json.repaired_id2');
try{ JSON.parse(newFile); console.log('PARSE_OK'); }catch(e){ console.error('PARSE_FAILED', e.message); }
