'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface FdCalculatorProps {
  toolName?: string;
}

export default function FdCalculator({ toolName }: FdCalculatorProps) {
  const [principal, setPrincipal] = useState<number>(100000);
  const [annualRate, setAnnualRate] = useState<number>(6.5);
  const [months, setMonths] = useState<number>(12);
  const [compoundingFrequency, setCompoundingFrequency] = useState<'monthly' | 'quarterly' | 'annual'>('quarterly');
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = useMemo(() => {
    const frequencyMap = {
      monthly: 12,
      quarterly: 4,
      annual: 1,
    };
    const n = frequencyMap[compoundingFrequency];
    const r = annualRate / 100 / n;
    const t = months / 12;
    const periods = Math.round(months / (12 / n));

    const maturityAmount = principal * Math.pow(1 + r, periods);
    const interest = maturityAmount - principal;

    // Calculate monthly breakdown
    const monthlyData = [];
    let balance = principal;
    let monthCounter = 0;

    for (let i = 1; i <= months; i++) {
      monthCounter++;
      const monthlyRateApplied = (i % (12 / n) === 0) ? r : 0;
      const interestThisMonth = balance * monthlyRateApplied;
      balance += interestThisMonth;

      if (i % 3 === 0 || i === months) {
        monthlyData.push({
          month: i,
          interest: interestThisMonth,
          balance: balance,
        });
      }
    }

    return {
      maturityAmount,
      interest,
      monthlyData,
      years: (months / 12).toFixed(1),
    };
  }, [principal, annualRate, months, compoundingFrequency]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'Fixed Deposit Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Principal Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value) || 0)}
            min="1"
            max="15"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tenure (Months)
          </label>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>1 Year</option>
            <option value={24}>2 Years</option>
            <option value={36}>3 Years</option>
            <option value={60}>5 Years</option>
            <option value={120}>10 Years</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Compounding Frequency
          </label>
          <select
            value={compoundingFrequency}
            onChange={(e) => setCompoundingFrequency(e.target.value as 'monthly' | 'quarterly' | 'annual')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Principal Amount</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(principal)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Interest Earned</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.interest)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Maturity Amount</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(result.maturityAmount)}</p>
        </div>
      </div>

      {/* Schedule */}
      <div className="mb-8">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
        >
          {showSchedule ? '▼ Hide Schedule' : '▶ Show Schedule'}
        </button>

        {showSchedule && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Month</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold">Interest</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold">Total Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.monthlyData.map((row) => (
                  <tr key={row.month} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">{row.month}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(row.interest)}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-semibold">{formatCurrency(row.balance)}</td>
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
