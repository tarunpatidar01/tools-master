'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type IFSCResponse = {
  MICR: string | null;
  BRANCH: string;
  ADDRESS: string;
  STATE: string;
  CONTACT: string | null;
  UPI: boolean;
  RTGS: boolean;
  CITY: string;
  CENTRE: string;
  DISTRICT: string;
  NEFT: boolean;
  IMPS: boolean;
  SWIFT: string | null;
  ISO3166: string;
  BANK: string;
  BANKCODE: string;
  IFSC: string;
};

type BranchRow = {
  IFSC: string;
  BRANCH: string;
  CITY: string;
  DISTRICT: string;
  STATE: string;
  ADDRESS: string;
  MICR: string | null;
  CONTACT: string;
  NEFT: boolean;
  RTGS: boolean;
  IMPS: boolean;
  UPI: boolean;
};

type BankIndex = Record<string, { name: string; branchCount: number; states: string[] }>;

const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;

type Mode = 'byCode' | 'byBank';

export default function IFSCLookup() {
  const [mode, setMode] = useState<Mode>('byCode');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <TabButton active={mode === 'byCode'} onClick={() => setMode('byCode')}>
          Search by IFSC Code
        </TabButton>
        <TabButton active={mode === 'byBank'} onClick={() => setMode('byBank')}>
          Search by Bank &amp; Location
        </TabButton>
      </div>

      {mode === 'byCode' ? <ByCodeTab /> : <ByBankTab />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-semibold transition border-b-2 -mb-px ${
        active
          ? 'text-blue-700 border-blue-600'
          : 'text-gray-600 border-transparent hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

function ByCodeTab() {
  const [code, setCode] = useState('');
  const [data, setData] = useState<IFSCResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const normalizedCode = useMemo(() => code.trim().toUpperCase(), [code]);
  const isValidFormat = useMemo(() => IFSC_PATTERN.test(normalizedCode), [normalizedCode]);

  const lookup = useCallback(async () => {
    setError(null);
    setData(null);

    if (!normalizedCode) {
      setError('Please enter an IFSC code.');
      return;
    }
    if (!isValidFormat) {
      setError(
        'Invalid IFSC format. It must be 11 characters: 4 letters + "0" + 6 letters/digits (e.g. HDFC0000001).'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${normalizedCode}`);
      if (res.status === 404) {
        setError(
          'IFSC code not found. Check for typos — especially the zero in position 5 (often confused with the letter O).'
        );
        return;
      }
      if (!res.ok) {
        setError('Lookup service is unavailable. Please try again in a moment.');
        return;
      }
      const json = (await res.json()) as IFSCResponse;
      setData(json);
    } catch {
      setError('Could not reach the lookup service. Check your internet and try again.');
    } finally {
      setLoading(false);
    }
  }, [normalizedCode, isValidFormat]);

  const copyIfsc = useCallback(async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.IFSC);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked
    }
  }, [data]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <label htmlFor="ifsc-input" className="block text-sm font-semibold text-gray-800 mb-2">
        Enter IFSC Code
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="ifsc-input"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') lookup();
          }}
          placeholder="e.g. HDFC0000001"
          maxLength={11}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base font-mono tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={lookup}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg"
        >
          {loading ? 'Looking up...' : 'Find Branch'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        11 characters: 4 bank letters, a zero, then 6 characters for the branch.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm"
        >
          {error}
        </div>
      )}

      {data && (
        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-5 py-4 flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-100">Bank</p>
              <h3 className="text-xl font-bold">{data.BANK}</h3>
              <p className="text-sm text-blue-100 mt-1">{data.BRANCH}</p>
            </div>
            <button
              onClick={copyIfsc}
              className="bg-white/10 hover:bg-white/20 border border-white/30 px-3 py-2 rounded text-xs font-semibold"
            >
              {copied ? 'Copied!' : `Copy ${data.IFSC}`}
            </button>
          </div>

          <dl className="divide-y divide-gray-100">
            <Row label="IFSC" value={data.IFSC} mono />
            <Row label="MICR" value={data.MICR || '—'} mono />
            <Row label="Branch" value={data.BRANCH} />
            <Row label="Address" value={data.ADDRESS} />
            <Row label="City" value={data.CITY} />
            <Row label="District" value={data.DISTRICT} />
            <Row label="State" value={data.STATE} />
            <Row label="Contact" value={data.CONTACT || 'Not listed'} />
            <div className="px-5 py-3 grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-50">
              <Badge label="NEFT" enabled={data.NEFT} />
              <Badge label="RTGS" enabled={data.RTGS} />
              <Badge label="IMPS" enabled={data.IMPS} />
              <Badge label="UPI" enabled={data.UPI} />
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

function ByBankTab() {
  const [index, setIndex] = useState<BankIndex | null>(null);
  const [indexError, setIndexError] = useState<string | null>(null);

  const [bankCode, setBankCode] = useState('');
  const [state, setState] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  const [branches, setBranches] = useState<BranchRow[] | null>(null);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branchError, setBranchError] = useState<string | null>(null);
  const [selected, setSelected] = useState<BranchRow | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/data/ifsc/_index.json')
      .then((r) => {
        if (!r.ok) throw new Error(`index ${r.status}`);
        return r.json();
      })
      .then((j: BankIndex) => {
        if (!cancelled) setIndex(j);
      })
      .catch(() => {
        if (!cancelled)
          setIndexError('Bank list could not be loaded. Please try again shortly.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const bankList = useMemo(() => {
    if (!index) return [];
    return Object.entries(index)
      .map(([code, v]) => ({ code, ...v }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [index]);

  const states = useMemo(() => {
    if (!bankCode || !index?.[bankCode]) return [];
    return index[bankCode].states;
  }, [bankCode, index]);

  useEffect(() => {
    if (!bankCode || !state) {
      setBranches(null);
      setSelected(null);
      return;
    }
    let cancelled = false;
    setLoadingBranches(true);
    setBranchError(null);
    setSelected(null);
    fetch(`/data/ifsc/${bankCode}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`branches ${r.status}`);
        return r.json();
      })
      .then((j: { branches: BranchRow[] }) => {
        if (cancelled) return;
        setBranches(j.branches.filter((b) => b.STATE === state));
      })
      .catch(() => {
        if (!cancelled)
          setBranchError('Could not load branches for this bank. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoadingBranches(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bankCode, state]);

  const filteredBranches = useMemo(() => {
    if (!branches) return [];
    const city = cityFilter.trim().toLowerCase();
    const br = branchFilter.trim().toLowerCase();
    return branches
      .filter(
        (b) =>
          (!city ||
            b.CITY.toLowerCase().includes(city) ||
            b.DISTRICT.toLowerCase().includes(city)) &&
          (!br || b.BRANCH.toLowerCase().includes(br) || b.IFSC.toLowerCase().includes(br))
      )
      .slice(0, 100);
  }, [branches, cityFilter, branchFilter]);

  const copyIfsc = useCallback(async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.IFSC);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked
    }
  }, [selected]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      {!index && !indexError && (
        <p className="text-sm text-gray-500">Loading bank list...</p>
      )}
      {indexError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
          {indexError}
        </div>
      )}

      {index && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="bank-select"
                className="block text-sm font-semibold text-gray-800 mb-1"
              >
                Bank
              </label>
              <select
                id="bank-select"
                value={bankCode}
                onChange={(e) => {
                  setBankCode(e.target.value);
                  setState('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a bank...</option>
                {bankList.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name} ({b.branchCount.toLocaleString('en-IN')} branches)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="state-select"
                className="block text-sm font-semibold text-gray-800 mb-1"
              >
                State
              </label>
              <select
                id="state-select"
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled={!bankCode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">{bankCode ? 'Select a state...' : 'Pick a bank first'}</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {state && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city-filter"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                >
                  City / District (optional)
                </label>
                <input
                  id="city-filter"
                  type="text"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="branch-filter"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                >
                  Branch / IFSC contains (optional)
                </label>
                <input
                  id="branch-filter"
                  type="text"
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  placeholder="e.g. Andheri"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {loadingBranches && (
            <p className="mt-4 text-sm text-gray-500">Loading branches...</p>
          )}
          {branchError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
              {branchError}
            </div>
          )}

          {branches && !loadingBranches && (
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2">
                Showing {filteredBranches.length} of {branches.length} branches
                {branches.length > 100 && filteredBranches.length === 100 && ' (first 100 — refine filters to see more)'}
              </p>
              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto divide-y divide-gray-100">
                {filteredBranches.length === 0 && (
                  <p className="p-4 text-sm text-gray-500">
                    No branches match your filters.
                  </p>
                )}
                {filteredBranches.map((b) => (
                  <button
                    key={b.IFSC}
                    onClick={() => setSelected(b)}
                    className={`w-full text-left p-3 hover:bg-blue-50 transition ${
                      selected?.IFSC === b.IFSC ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {b.BRANCH}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {b.CITY}
                          {b.DISTRICT && b.DISTRICT !== b.CITY ? `, ${b.DISTRICT}` : ''}
                        </p>
                      </div>
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded tracking-wider">
                        {b.IFSC}
                      </code>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selected && (
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white px-5 py-4 flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs uppercase tracking-wider text-blue-100">
                    {index[selected.IFSC.slice(0, 4)]?.name || 'Bank'}
                  </p>
                  <h3 className="text-xl font-bold">{selected.BRANCH}</h3>
                </div>
                <button
                  onClick={copyIfsc}
                  className="bg-white/10 hover:bg-white/20 border border-white/30 px-3 py-2 rounded text-xs font-semibold"
                >
                  {copied ? 'Copied!' : `Copy ${selected.IFSC}`}
                </button>
              </div>
              <dl className="divide-y divide-gray-100">
                <Row label="IFSC" value={selected.IFSC} mono />
                <Row label="MICR" value={selected.MICR || '—'} mono />
                <Row label="Address" value={selected.ADDRESS} />
                <Row label="City" value={selected.CITY} />
                <Row label="District" value={selected.DISTRICT} />
                <Row label="State" value={selected.STATE} />
                <Row label="Contact" value={selected.CONTACT || 'Not listed'} />
                <div className="px-5 py-3 grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-50">
                  <Badge label="NEFT" enabled={selected.NEFT} />
                  <Badge label="RTGS" enabled={selected.RTGS} />
                  <Badge label="IMPS" enabled={selected.IMPS} />
                  <Badge label="UPI" enabled={selected.UPI} />
                </div>
              </dl>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-5 py-3 grid grid-cols-3 gap-3">
      <dt className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{label}</dt>
      <dd
        className={`col-span-2 text-sm text-gray-900 break-words ${
          mono ? 'font-mono tracking-wider' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function Badge({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div
      className={`text-xs font-semibold text-center px-2 py-1 rounded ${
        enabled
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-gray-100 text-gray-500 border border-gray-200'
      }`}
    >
      {enabled ? `${label} ✓` : `${label} ✕`}
    </div>
  );
}
