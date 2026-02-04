const fs=require('fs'); const srcDir='scripts/broken_objects'; const outDir='scripts/repaired_objects_manual'; fs.mkdirSync(outDir,{recursive:true}); const files=fs.readdirSync(srcDir).filter(f=>f.endsWith('.json.txt'));
function tryParse(s){ try{ JSON.parse(s); return true;}catch(e){ return e.message;} }
function removeTrailingComma(s){ // remove trailing comma from end of file if present after a bracket
  return s.replace(/,\s*$/,''); }
function hasClosingQuoteForContent(s){ const contentIdx = s.lastIndexOf('"content"'); if(contentIdx===-1) return true; const valStart = s.indexOf('"', contentIdx + 9); if(valStart===-1) return false; // no opening quote
  // find closing unescaped quote
  let inEsc=false; for(let i=valStart+1;i<s.length;i++){ const ch=s[i]; if(inEsc){ inEsc=false; continue;} if(ch==='\\'){ inEsc=true; continue;} if(ch==='"') return true; if(i-valStart>5000) break;} return false; }

let report=[];
for(const f of files){ const path=`${srcDir}/${f}`; let s=fs.readFileSync(path,'utf8'); s=removeTrailingComma(s); let before=tryParse(s); if(before===true){ fs.writeFileSync(`${outDir}/${f.replace('.json.txt','.json')}`, s); report.push({file:f,status:'ok'}); continue;} // attempt closure
 let changed=false;
 if(!hasClosingQuoteForContent(s)){
   s = s + ' (truncated)"\n          }\n      ]\n    }\n  }'; changed=true;
 }
 if(!changed){ // try appending closers
   s = s + '\n    }\n  }'; changed=true;
 }
 let after=tryParse(s);
 if(after===true){ fs.writeFileSync(`${outDir}/${f.replace('.json.txt','.json')}`, s); report.push({file:f,status:'fixed',note:changed}); continue; }
 fs.writeFileSync(`${outDir}/${f.replace('.json.txt','.err.txt')}`, `ERR:${before}\n\nSOURCE:\n${s.slice(0,5000)}`,'utf8'); report.push({file:f,status:'failed',err:before}); }
fs.writeFileSync('scripts/repaired_objects_manual_report.json', JSON.stringify(report,null,2)); console.log('done', report.length);