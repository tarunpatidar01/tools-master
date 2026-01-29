'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface LumpsumCalculatorProps {
  toolName?: string;
}

export default function LumpsumCalculator({ toolName }: LumpsumCalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState<number>(500000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = useMemo(() => {
    const rateDecimal = annualReturn / 100;
    const futureValue = investmentAmount * Math.pow(1 + rateDecimal, years);
    const gains = futureValue - investmentAmount;

    const yearlyData = [];
    for (let year = 1; year <= years; year++) {
      const yearValue = investmentAmount * Math.pow(1 + rateDecimal, year);
      yearlyData.push({
        year,
        value: yearValue,
        gains: yearValue - investmentAmount,
        returnPercent: ((yearValue - investmentAmount) / investmentAmount) * 100,
      });
    }

    return {
      futureValue,
      gains,
      yearlyData,
      totalReturn: (gains / investmentAmount) * 100,
    };
  }, [investmentAmount, annualReturn, years]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'Lumpsum Investment Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Investment Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value) || 0)}
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
          <p className="text-gray-600 text-sm mb-1">Initial Investment</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(investmentAmount)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Expected Gains</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.gains)}</p>
          <p className="text-xs text-gray-500 mt-1">{result.totalReturn.toFixed(2)}% return</p>
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
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Investment Value</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Total Gains</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Return %</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyData.map((year) => (
                  <tr key={year.year} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{year.year}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{formatCurrency(year.value)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right text-green-600">{formatCurrency(year.gains)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{year.returnPercent.toFixed(2)}%</td>
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
