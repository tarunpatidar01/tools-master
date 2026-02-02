import json
import re
from pathlib import Path

p = Path(__file__).resolve().parents[1] / 'data' / 'tools.json'
obj = json.loads(p.read_text(encoding='utf-8'))

threshold = 0.02
results = []

for item in obj:
    texts = []
    if 'title' in item: texts.append(item['title'])
    if 'description' in item: texts.append(item['description'])
    content = item.get('content', {})
    # collect h1, h2, and sections
    if 'h1' in content: texts.append(content['h1'])
    if 'h2' in content: texts.append(content['h2'])
    for sec in content.get('sections', []):
        texts.append(sec.get('heading',''))
        texts.append(sec.get('content',''))

    full = ' '.join(texts)
    words = re.findall(r"\w+", full)
    total_words = len(words)
    # count 'calculator' case-insensitive
    calc_count = len(re.findall(r"calculator", full, flags=re.I))
    density = (calc_count / total_words) if total_words>0 else 0
    results.append((item.get('slug',''), item.get('keyword',''), total_words, calc_count, density))

# print items over threshold
for slug, kw, words, count, density in sorted(results, key=lambda x: -x[4]):
    print(f"{slug}\t{kw}\twords:{words}\tcalc:{count}\tdensity:{density:.3%}")

print('\nThreshold:', threshold)
print('Over threshold:')
for slug, kw, words, count, density in sorted(results, key=lambda x: -x[4]):
    if density > threshold:
        print(f" - {slug} ({kw}): {count} occurrences in {words} words ({density:.2%})")
