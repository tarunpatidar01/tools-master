'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface RdCalculatorProps {
  toolName?: string;
}

export default function RdCalculator({ toolName }: RdCalculatorProps) {
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(5000);
  const [annualRate, setAnnualRate] = useState<number>(5.5);
  const [months, setMonths] = useState<number>(60);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    
    // RD Formula: FV = P * (((1 + r)^n - 1) / r) * (1 + r)
    // Where P = monthly deposit, r = monthly rate, n = number of months
    const fv = monthlyDeposit * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvested = monthlyDeposit * months;
    const interest = fv - totalInvested;

    // Calculate year-wise
    const yearlyData = [];
    let balance = 0;

    for (let year = 1; year <= Math.ceil(months / 12); year++) {
      const yearEndMonth = Math.min(year * 12, months);
      let yearBalance = 0;
      let yearDeposit = 0;

      for (let month = (year - 1) * 12 + 1; month <= yearEndMonth; month++) {
        yearBalance = yearBalance * (1 + monthlyRate) + monthlyDeposit;
        yearDeposit += monthlyDeposit;
      }

      yearlyData.push({
        year,
        invested: yearDeposit,
        balance: yearBalance,
        interest: yearBalance - yearDeposit,
      });
    }

    return {
      maturityAmount: fv,
      totalInvested,
      interest,
      yearlyData,
    };
  }, [monthlyDeposit, annualRate, months]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'Recurring Deposit Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monthly Deposit
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value) || 0)}
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
            <option value={6}>6 Months</option>
            <option value={12}>1 Year</option>
            <option value={24}>2 Years</option>
            <option value={36}>3 Years</option>
            <option value={60}>5 Years</option>
            <option value={120}>10 Years</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.totalInvested)}</p>
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
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Amount Invested</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Interest Earned</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Total Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyData.map((year) => (
                  <tr key={year.year} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{year.year}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(year.invested)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right text-green-600">{formatCurrency(year.interest)}</td>
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
