const fs=require('fs'); const s=fs.readFileSync('data/tools.json.bak','utf8'); const idStr='"id": 2'; const idx=s.indexOf(idStr); if(idx===-1){ console.error('id2 not found'); process.exit(1);} // find faq array
const faqKey = '"faq"'; const faqIdx = s.indexOf(faqKey, idx); if(faqIdx===-1){ console.error('faq not found'); process.exit(1);} const arrStart = s.indexOf('[', faqIdx); let j=arrStart; let d=0; for(; j<s.length; j++){ if(s[j]=='[') d++; else if(s[j]==']'){ d--; if(d===0) break; } } const faqArray = s.slice(arrStart, j+1);
console.log('FAQ extracted length', faqArray.length); console.log('faqIdx', faqIdx, 'arr end', j);
// find last section heading 'Impact of Loan Tenure' after idx
const heading = '\"heading\": \"Impact of Loan Tenure\"'; const hIdx = s.indexOf(heading, idx); console.log('hIdx', hIdx); if(hIdx===-1){ console.error('impact heading not found'); process.exit(1);} // find end of that section object (the next '},' following it)
let secEnd = s.indexOf('},', hIdx); if(secEnd===-1) secEnd = s.indexOf('}', hIdx); // position after that
console.log('secEnd', secEnd);
secEnd = secEnd + 2; // include '},'
// find next object start after idx
let nextObj = s.indexOf('\n  {\n    \"id\":', secEnd); if(nextObj===-1) nextObj = s.indexOf('\r\n  {\r\n    \"id\":', secEnd); console.log('nextObj', nextObj); if(nextObj===-1){ console.error('next object not found'); process.exit(1);} // Build new content: insert closing of sections and faq
const insert = '\n      ]\n    },\n      \"faq\": ' + faqArray + '\n    }\n  },\n';
// Remove the misplaced faq earlier: remove from faqIdx to j+1 and any trailing commas/newlines
let before = s.slice(0, faqIdx);
let after = s.slice(j+1);
// normalize: remove leading commas/newlines in after
after = after.replace(/^\s*,?\s*/,'');
// Now find location to insert: after secEnd, but because we removed faq earlier, indices changed; recompute secEnd in new string
const s2 = before + after; // new string sans faq
// find new secEnd: find heading in s2
const hIdx2 = s2.indexOf(heading, idx); console.log('hIdx2', hIdx2); if(hIdx2===-1){ console.error('impact heading not found in new string'); process.exit(1);} let secEnd2 = s2.indexOf('},', hIdx2); if(secEnd2===-1) secEnd2 = s2.indexOf('}', hIdx2); console.log('secEnd2 candidate', secEnd2); secEnd2 = secEnd2 + 2;
// find next object pos after secEnd2
let nextObj2 = s2.indexOf('\n  {\n    "id":', secEnd2); if(nextObj2===-1) nextObj2 = s2.indexOf('\r\n  {\r\n    "id":', secEnd2); console.log('nextObj2', nextObj2);
if(nextObj2===-1){ console.error('next object not found in new string'); // dump surrounding context
 console.log('context after secEnd2:\n', s2.slice(Math.max(0,secEnd2-200), Math.min(s2.length, secEnd2+400))); process.exit(1);} // insert content before nextObj2
const final = s2.slice(0, nextObj2) + insert + s2.slice(nextObj2);
console.log('final length', final.length, 's length', s.length);
fs.writeFileSync('data/tools.json.repaired_id2_v1', final, 'utf8'); console.log('WROTE data/tools.json.repaired_id2_v1'); try{ JSON.parse(final); console.log('PARSE_OK'); }catch(e){ console.error('PARSE_FAILED', e.message); // write to file for inspection
 fs.writeFileSync('scripts/parse_error.json', final); console.log('WROTE scripts/parse_error.json'); }
