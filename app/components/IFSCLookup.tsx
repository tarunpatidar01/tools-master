'use client';

import { useCallback, useMemo, useState } from 'react';

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

const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;

type IFSCLookupProps = {
  toolName?: string;
};

export default function IFSCLookup(_props: IFSCLookupProps = {}) {
  const [code, setCode] = useState('');
  const [data, setData] = useState<IFSCResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const normalizedCode = useMemo(() => code.trim().toUpperCase(), [code]);
  const isValidFormat = useMemo(
    () => IFSC_PATTERN.test(normalizedCode),
    [normalizedCode]
  );

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
      // clipboard blocked — ignore silently
    }
  }, [data]);

  return (
    <div className="max-w-3xl mx-auto">
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
            aria-describedby="ifsc-help"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base font-mono tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={lookup}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition"
          >
            {loading ? 'Looking up...' : 'Find Branch'}
          </button>
        </div>
        <p id="ifsc-help" className="mt-2 text-xs text-gray-500">
          11 characters: 4 bank letters, a zero, then 6 characters for the branch. Example:
          SBIN0000691, HDFC0000123, ICIC0001234.
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
                <h3 className="text-xl font-bold leading-tight">{data.BANK}</h3>
                <p className="text-sm text-blue-100 mt-1">{data.BRANCH}</p>
              </div>
              <button
                onClick={copyIfsc}
                className="bg-white/10 hover:bg-white/20 border border-white/30 px-3 py-2 rounded text-xs font-semibold"
                aria-label="Copy IFSC code"
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

        {!data && !error && (
          <div className="mt-6 bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-800 mb-2">Where to find your IFSC:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Front page of your chequebook</li>
              <li>Your account passbook</li>
              <li>Any bank statement (near the account number)</li>
              <li>Your bank&apos;s official branch locator</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-5 py-3 grid grid-cols-3 gap-3">
      <dt className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{label}</dt>
      <dd
        className={`col-span-2 text-sm text-gray-900 ${mono ? 'font-mono tracking-wider' : ''}`}
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
