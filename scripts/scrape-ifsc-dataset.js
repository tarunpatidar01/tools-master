/* eslint-disable */
/**
 * Scrapes the Razorpay public IFSC API and builds per-bank JSON files
 * with (IFSC, BRANCH, CITY, STATE) tuples for reverse lookup.
 *
 * Output: public/data/ifsc/<BANKCODE>.json
 * Index:  public/data/ifsc/_index.json  { bankCode: { name, branchCount, states: [...] } }
 *
 * Usage:
 *   node scripts/scrape-ifsc-dataset.js            # all banks
 *   node scripts/scrape-ifsc-dataset.js SBIN HDFC  # only these banks
 *
 * Resumable: skips banks whose output file already exists unless --force is passed.
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'data', 'ifsc');
const INDEX_FILE = path.join(OUT_DIR, '_index.json');

const CONCURRENCY = 12;
const RETRY_LIMIT = 3;
const RETRY_DELAY_MS = 800;

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'emitools-ifsc-scraper/1.0' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchWithRetry(url) {
  let lastErr;
  for (let i = 0; i < RETRY_LIMIT; i += 1) {
    try {
      return await fetchJson(url);
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (i + 1)));
    }
  }
  throw lastErr;
}

function padBranch(code) {
  const str = String(code);
  if (/[A-Z]/.test(str)) return str.padStart(6, '0');
  return str.padStart(6, '0');
}

async function loadInputs() {
  console.log('Loading Razorpay bank and branch lists...');
  const [ifscMap, banks] = await Promise.all([
    fetchWithRetry('https://raw.githubusercontent.com/razorpay/ifsc/master/src/IFSC.json'),
    fetchWithRetry('https://raw.githubusercontent.com/razorpay/ifsc/master/src/banknames.json'),
  ]);
  return { ifscMap, banks };
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const runners = Array.from({ length: limit }, async () => {
    while (true) {
      const i = nextIndex;
      nextIndex += 1;
      if (i >= items.length) return;
      try {
        results[i] = await worker(items[i], i);
      } catch (e) {
        results[i] = { __error: true, message: String(e), item: items[i] };
      }
    }
  });
  await Promise.all(runners);
  return results;
}

async function scrapeBank(bankCode, branchCodes, bankName) {
  const total = branchCodes.length;
  const ifscs = branchCodes.map((code) => `${bankCode}0${padBranch(code)}`);

  let done = 0;
  const started = Date.now();

  const rows = await mapLimit(ifscs, CONCURRENCY, async (ifsc) => {
    const res = await fetchWithRetry(`https://ifsc.razorpay.com/${ifsc}`);
    done += 1;
    if (done % 250 === 0 || done === total) {
      const elapsed = ((Date.now() - started) / 1000).toFixed(0);
      process.stdout.write(`\r  ${bankCode}: ${done}/${total} (${elapsed}s)`);
    }
    if (!res) return null;
    return {
      IFSC: res.IFSC,
      BRANCH: res.BRANCH,
      CITY: res.CITY,
      DISTRICT: res.DISTRICT,
      STATE: res.STATE,
      ADDRESS: res.ADDRESS,
      MICR: res.MICR,
      CONTACT: res.CONTACT,
      NEFT: !!res.NEFT,
      RTGS: !!res.RTGS,
      IMPS: !!res.IMPS,
      UPI: !!res.UPI,
    };
  });

  process.stdout.write('\n');

  const clean = rows.filter((r) => r && !r.__error && r.IFSC);
  const states = Array.from(new Set(clean.map((r) => r.STATE).filter(Boolean))).sort();

  const payload = {
    bankCode,
    bankName,
    scrapedAt: new Date().toISOString(),
    count: clean.length,
    branches: clean,
  };

  fs.writeFileSync(path.join(OUT_DIR, `${bankCode}.json`), JSON.stringify(payload));
  return { branchCount: clean.length, states };
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const wantList = args.filter((a) => !a.startsWith('--')).map((a) => a.toUpperCase());

  const { ifscMap, banks } = await loadInputs();

  let index = {};
  if (fs.existsSync(INDEX_FILE)) {
    try {
      index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
    } catch {
      index = {};
    }
  }

  const allCodes = Object.keys(ifscMap);
  const codes = wantList.length ? allCodes.filter((c) => wantList.includes(c)) : allCodes;

  console.log(`Scraping ${codes.length} banks (concurrency=${CONCURRENCY})`);

  for (const code of codes) {
    const outFile = path.join(OUT_DIR, `${code}.json`);
    if (fs.existsSync(outFile) && !force) {
      const cached = JSON.parse(fs.readFileSync(outFile, 'utf-8'));
      if (!index[code] && cached.branches) {
        const states = Array.from(new Set(cached.branches.map((b) => b.STATE).filter(Boolean))).sort();
        index[code] = {
          name: banks[code] || code,
          branchCount: cached.branches.length,
          states,
        };
      }
      continue;
    }

    const branches = ifscMap[code];
    if (!Array.isArray(branches) || branches.length === 0) continue;

    const bankName = banks[code] || code;
    console.log(`\n[${code}] ${bankName} — ${branches.length} branches`);
    const { branchCount, states } = await scrapeBank(code, branches, bankName);
    index[code] = { name: bankName, branchCount, states };
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  }

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  console.log(`\nDone. Index has ${Object.keys(index).length} banks.`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
