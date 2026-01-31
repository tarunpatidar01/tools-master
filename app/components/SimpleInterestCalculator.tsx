'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { formatCurrency, formatNumber } from '@/lib/emi';

interface SimpleInterestCalculatorProps {
  toolName?: string;
}

export default function SimpleInterestCalculator({ toolName = 'Simple Interest Calculator' }: SimpleInterestCalculatorProps) {
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
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Simple Interest Calculation: SI = (P * R * T) / 100
  const result = useMemo(() => {
    const simpleInterest = (principal * annualRate * years) / 100;
    const totalAmount = principal + simpleInterest;
    const monthlyInterestEarned = simpleInterest / (years * 12);

    return {
      principal,
      rate: annualRate,
      time: years,
      simpleInterest,
      totalAmount,
      monthlyPayment: monthlyInterestEarned,
    };
  }, [principal, annualRate, years]);

  // Generate year-wise breakdown
  const yearWiseBreakdown = useMemo(() => {
    const breakdown = [];
    const annualInterest = (principal * annualRate) / 100;

    for (let year = 1; year <= years; year++) {
      breakdown.push({
        year,
        principalPaid: 0,
        interestPaid: annualInterest,
        totalPaid: annualInterest,
        endingBalance: principal,
      });
    }

    return breakdown;
  }, [principal, annualRate, years]);

  const handlePrincipalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPrincipal(Number(e.target.value) || 0);
  }, []);

  const handleRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnualRate(Number(e.target.value) || 0);
  }, []);

  const handleYearsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setYears(Number(e.target.value) || 0);
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Principal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Principal Amount (₹)
          </label>
          <input
            type="number"
            value={principal}
            onChange={handlePrincipalChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1000"
            step="10000"
          />
          <input
            type="range"
            min="1000"
            max="10000000"
            step="10000"
            value={principal}
            onChange={handlePrincipalChange}
            className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-xs text-gray-500 mt-1">₹1,000 - ₹1,00,00,000</div>
        </div>

        {/* Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Interest Rate (% P.A.)
          </label>
          <input
            type="number"
            value={annualRate}
            onChange={handleRateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0.5"
            max="50"
            step="0.1"
          />
          <input
            type="range"
            min="0.5"
            max="50"
            step="0.1"
            value={annualRate}
            onChange={handleRateChange}
            className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-xs text-gray-500 mt-1">0.5% - 50%</div>
        </div>

        {/* Years */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Time Period (Years)
          </label>
          <input
            type="number"
            value={years}
            onChange={handleYearsChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="50"
            step="1"
          />
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={years}
            onChange={handleYearsChange}
            className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-xs text-gray-500 mt-1">1 - 50 Years</div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Principal Amount</div>
          <div className="text-2xl font-bold text-blue-900">{formatCurrency(result.principal)}</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-green-600 uppercase mb-1">Simple Interest</div>
          <div className="text-2xl font-bold text-green-900">{formatCurrency(result.simpleInterest)}</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-purple-900">{formatCurrency(result.totalAmount)}</div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-orange-600 uppercase mb-1">Avg Monthly Interest</div>
          <div className="text-2xl font-bold text-orange-900">{formatCurrency(result.monthlyPayment)}</div>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
        <div className="text-sm font-semibold text-gray-700 mb-2">Simple Interest Formula:</div>
        <div className="text-gray-600 font-mono text-sm">
          SI = (P × R × T) / 100
          <br />
          Where: P = Principal, R = Rate (%), T = Time (Years)
          <br />
          Total Amount = P + SI = {formatCurrency(result.principal)} + {formatCurrency(result.simpleInterest)} = {formatCurrency(result.totalAmount)}
        </div>
      </div>

      {/* Year-wise Schedule */}
      <div className="mb-8">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          {showSchedule ? 'Hide' : 'Show'} Year-Wise Breakdown
        </button>

        {showSchedule && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Year</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Interest (₹)</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Total Paid (₹)</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {yearWiseBreakdown.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{row.year}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(row.interestPaid)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(row.totalPaid)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-medium">{formatCurrency(row.endingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
