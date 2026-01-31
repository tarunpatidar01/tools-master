'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/emi';

interface CompoundInterestCalculatorProps {
  toolName?: string;
}

export default function CompoundInterestCalculator({
  toolName = 'Compound Interest Calculator',
}: CompoundInterestCalculatorProps) {
  const getInitialNumber = (key: string, fallback: number) => {
    try {
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      return Number(params.get(key)) || fallback;
    } catch {
      return fallback;
    }
  };

  const [principal, setPrincipal] = useState<number>(() => getInitialNumber('principal', 100000));
  const [annualRate, setAnnualRate] = useState<number>(() => getInitialNumber('rate', 8));
  const [years, setYears] = useState<number>(() => getInitialNumber('years', 5));
  const [compoundFrequency, setCompoundFrequency] = useState<number>(() => getInitialNumber('frequency', 1));
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  /* ---------------- Sync URL ---------------- */
  useEffect(() => {
    const params = new URLSearchParams({
      principal: String(principal),
      rate: String(annualRate),
      years: String(years),
      frequency: String(compoundFrequency),
    });

    window.history.replaceState({}, '', `?${params.toString()}`);
  }, [principal, annualRate, years, compoundFrequency]);

  /* ---------------- Core Calculation ---------------- */
  const result = useMemo(() => {
    const r = annualRate / 100;
    const n = compoundFrequency;
    const t = years;

    if (principal <= 0 || r <= 0 || n <= 0 || t <= 0) {
      return {
        totalAmount: 0,
        compoundInterest: 0,
        avgMonthlyInterest: 0,
      };
    }

    const totalAmount = principal * Math.pow(1 + r / n, n * t);
    const compoundInterest = totalAmount - principal;

    const avgMonthlyInterest =
      Math.pow(totalAmount / principal, 1 / (t * 12)) - 1;

    return {
      totalAmount,
      compoundInterest,
      avgMonthlyInterest: principal * avgMonthlyInterest,
    };
  }, [principal, annualRate, years, compoundFrequency]);

  /* ---------------- Year-wise Breakdown ---------------- */
  const yearWiseBreakdown = useMemo(() => {
    const rows: {
      year: number;
      interestEarned: number;
      totalAmount: number;
    }[] = [];

    const r = annualRate / 100;
    const n = compoundFrequency;

    let lastAmount = principal;

    for (let year = 1; year <= years; year++) {
      const currentAmount =
        principal * Math.pow(1 + r / n, n * year);

      rows.push({
        year,
        interestEarned: currentAmount - lastAmount,
        totalAmount: currentAmount,
      });

      lastAmount = currentAmount;
    }

    return rows;
  }, [principal, annualRate, years, compoundFrequency]);

  /* ---------------- Handlers ---------------- */
  const onNumber =
    (setter: (v: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(Math.max(0, Number(e.target.value) || 0));

  return (
    <div className="bg-white rounded-lg border p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">{toolName}</h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Input
          label="Principal Amount (₹)"
          value={principal}
          min={1000}
          max={10000000}
          step={10000}
          onChange={onNumber(setPrincipal)}
        />

        <Input
          label="Interest Rate (% P.A.)"
          value={annualRate}
          min={0.5}
          max={50}
          step={0.1}
          onChange={onNumber(setAnnualRate)}
        />

        <Input
          label="Time Period (Years)"
          value={years}
          min={1}
          max={50}
          step={1}
          onChange={onNumber(setYears)}
        />

        <div>
          <label className="block text-sm font-semibold mb-2">
            Compounded
          </label>
          <select
            value={compoundFrequency}
            onChange={(e) => setCompoundFrequency(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value={1}>Annually</option>
            <option value={2}>Semi-Annually</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Result title="Principal" value={formatCurrency(principal)} />
        <Result
          title="Compound Interest"
          value={formatCurrency(result.compoundInterest)}
          color="green"
        />
        <Result
          title="Total Amount"
          value={formatCurrency(result.totalAmount)}
          color="purple"
        />
        <Result
          title="Avg Monthly Growth"
          value={formatCurrency(result.avgMonthlyInterest)}
          color="orange"
        />
      </div>

      {/* Schedule */}
      <button
        onClick={() => setShowSchedule((v) => !v)}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        {showSchedule ? 'Hide' : 'Show'} Year-Wise Breakdown
      </button>

      {showSchedule && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Year</th>
                <th className="border p-2 text-right">Interest</th>
                <th className="border p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {yearWiseBreakdown.map((r) => (
                <tr key={r.year}>
                  <td className="border p-2">{r.year}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(r.interestEarned)}
                  </td>
                  <td className="border p-2 text-right font-semibold">
                    {formatCurrency(r.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Small UI Helpers ---------- */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({ label, ...rest }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        {label}
      </label>
      <input
        type="number"
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="range"
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        className="w-full mt-2"
      />
    </div>
  );
}

type Color = 'blue' | 'green' | 'purple' | 'orange';

interface ResultProps {
  title: string;
  value: string | number;
  color?: Color;
}

const COLOR_CLASSES: Record<Color, string> = {
  blue: 'bg-blue-50 border-blue-200 text-blue-900',
  green: 'bg-green-50 border-green-200 text-green-900',
  purple: 'bg-purple-50 border-purple-200 text-purple-900',
  orange: 'bg-orange-50 border-orange-200 text-orange-900',
};

function Result({ title, value, color = 'blue' }: ResultProps) {
  return (
    <div className={`border rounded-lg p-4 ${COLOR_CLASSES[color]}`}>
      <div className="text-xs font-semibold uppercase mb-1">
        {title}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
