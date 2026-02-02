import re
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
files = list(repo.rglob('**/*.{tsx,ts,js,jsx,json,md,mdx}'))

report = {
    'og_images': [],
    'missing_emi_in_alt': [],
    'missing_calculator_in_alt': [],
}

for f in files:
    try:
        txt = f.read_text(encoding='utf-8')
    except Exception:
        continue
    for m in re.finditer(r"(og-image[^\s\"'`]*)", txt):
        report['og_images'].append({'file': str(f), 'match': m.group(1)})

    # find image alt occurrences nearby
    for m in re.finditer(r"alt:\s*`?\$?\{?([^}`\']+)`?", txt):
        alt = m.group(1)
        if 'emi' not in alt.lower():
            report['missing_emi_in_alt'].append({'file': str(f), 'alt': alt})
        if 'calculator' not in alt.lower():
            report['missing_calculator_in_alt'].append({'file': str(f), 'alt': alt})

# Deduplicate and print summary
print('OG image references found:', len(report['og_images']))
print('Alts without "emi":', len(report['missing_emi_in_alt']))
print('Alts without "calculator":', len(report['missing_calculator_in_alt']))

# sample of missing
print('\nSamples:')
print('without emi (first 5):')
for i in report['missing_emi_in_alt'][:5]:
    print('-', i)
print('\nwithout calculator (first 5):')
for i in report['missing_calculator_in_alt'][:5]:
    print('-', i)
