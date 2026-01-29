'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency, formatNumber } from '@/lib/emi';

interface SipCalculatorProps {
  toolName?: string;
}

export default function SipCalculator({ toolName }: SipCalculatorProps) {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(10000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = useMemo(() => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;

    // FV = PMT × (((1 + r)^n - 1) / r)
    const futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
    const totalInvested = monthlyAmount * months;
    const gains = futureValue - totalInvested;

    const yearlyData = [];
    let balance = 0;

    for (let year = 1; year <= years; year++) {
      let yearEndBalance = 0;
      let yearInvested = 0;
      
      for (let month = 1; month <= 12; month++) {
        balance = balance * (1 + monthlyRate) + monthlyAmount;
        yearEndBalance = balance;
        yearInvested += monthlyAmount;
      }

      yearlyData.push({
        year,
        invested: yearInvested,
        balance: yearEndBalance,
        gains: yearEndBalance - yearInvested,
      });
    }

    return {
      futureValue,
      totalInvested,
      gains,
      yearlyData,
      cagr: annualReturn,
    };
  }, [monthlyAmount, annualReturn, years]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'SIP Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monthly Investment
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(Number(e.target.value) || 1)}
            min="1"
            max="50"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.totalInvested)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Expected Gains</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.gains)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Future Value</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(result.futureValue)}</p>
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
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Gains</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyData.map((year) => (
                  <tr key={year.year} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{year.year}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(year.invested)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right text-green-600 font-semibold">{formatCurrency(year.gains)}</td>
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
