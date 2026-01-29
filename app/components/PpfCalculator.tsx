'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface PpfCalculatorProps {
  toolName?: string;
}

export default function PpfCalculator({ toolName }: PpfCalculatorProps) {
  const [annualDeposit, setAnnualDeposit] = useState<number>(150000);
  const [annualRate, setAnnualRate] = useState<number>(7.1);
  const [years, setYears] = useState<number>(15);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = useMemo(() => {
    const rate = annualRate / 100;
    
    // PPF compounds annually
    let balance = 0;
    const yearlyData = [];
    let totalInvested = 0;

    for (let year = 1; year <= years; year++) {
      // Add interest first
      balance = balance * (1 + rate) + annualDeposit;
      totalInvested += annualDeposit;
      
      yearlyData.push({
        year,
        invested: totalInvested,
        balance: balance,
        interestEarned: balance - totalInvested,
      });
    }

    return {
      maturityAmount: balance,
      totalInvested,
      interestEarned: balance - totalInvested,
      yearlyData,
    };
  }, [annualDeposit, annualRate, years]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'PPF Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual Deposit
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={annualDeposit}
              onChange={(e) => setAnnualDeposit(Number(e.target.value) || 0)}
              min="500"
              max="1500000"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Min: ₹500, Max: ₹1,50,000</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value) || 1)}
            min="1"
            max="15"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Current: 7.1% p.a.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Investment Period (Years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value) || 1)}
            min="1"
            max="50"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Maturity: 15 years</p>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.totalInvested)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Interest Earned (Tax-Free)</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.interestEarned)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Maturity Amount</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(result.maturityAmount)}</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 mb-8">
        <p className="text-sm text-gray-700">
          <strong>Tax Benefits:</strong> Investment under Section 80C (max ₹1.5 lakh/year). Interest income is completely tax-free.
        </p>
      </div>

      {/* Yearly Summary */}
      <div className="mb-8">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
        >
          {showSchedule ? '▼ Hide Yearly Summary' : '▶ Show Yearly Summary'}
        </button>

        {showSchedule && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Year</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Total Invested</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Interest Earned</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Total Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyData.map((year) => (
                  <tr key={year.year} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{year.year}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(year.invested)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right text-green-600">{formatCurrency(year.interestEarned)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-bold">{formatCurrency(year.balance)}</td>
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
