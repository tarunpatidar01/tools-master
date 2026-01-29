'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface NpsCalculatorProps {
  toolName?: string;
}

export default function NpsCalculator({ toolName }: NpsCalculatorProps) {
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000);
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [expectedReturn, setExpectedReturn] = useState<number>(8);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = useMemo(() => {
    const yearsToRetirement = retirementAge - currentAge;
    const months = yearsToRetirement * 12;
    const monthlyRate = expectedReturn / 100 / 12;

    // FV of annuity: FV = PMT × (((1 + r)^n - 1) / r)
    const corpus = monthlyContribution * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
    const totalContributed = monthlyContribution * months;
    const gains = corpus - totalContributed;

    // 60% can be withdrawn as lump sum, 40% used for annuity
    const lumpsumWithdrawal = corpus * 0.6;
    const annuityAmount = corpus * 0.4;
    
    // Annuity calculation (assuming 6% annuity rate): Annual pension = Amount / 12 × 12 × 0.06
    const annuityRate = 0.06;
    const monthlyPension = (annuityAmount * annuityRate) / 12;
    const annualPension = monthlyPension * 12;

    const yearlyData = [];
    let balance = 0;

    for (let year = 1; year <= yearsToRetirement; year++) {
      let yearEndBalance = 0;
      
      for (let month = 1; month <= 12; month++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
      }
      yearEndBalance = balance;

      yearlyData.push({
        year: currentAge + year,
        balance: yearEndBalance,
      });
    }

    return {
      corpus,
      totalContributed,
      gains,
      lumpsumWithdrawal,
      annuityAmount,
      monthlyPension,
      annualPension,
      yearlyData,
    };
  }, [monthlyContribution, currentAge, retirementAge, expectedReturn]);

  const yearsToRetirement = retirementAge - currentAge;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'NPS Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monthly Contribution
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Age
          </label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value) || 18)}
            min="18"
            max="60"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Retirement Age
          </label>
          <input
            type="number"
            value={retirementAge}
            onChange={(e) => setRetirementAge(Number(e.target.value) || 60)}
            min={currentAge + 1}
            max="75"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value) || 1)}
            min="1"
            max="20"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Retirement Corpus</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.corpus)}</p>
          <p className="text-xs text-gray-500 mt-1">In {yearsToRetirement} years</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Lumpsum Withdrawal (60%)</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.lumpsumWithdrawal)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Monthly Pension</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(result.monthlyPension)}</p>
        </div>
      </div>

      {/* Pension Info */}
      <div className="bg-amber-50 rounded-lg p-4 mb-8">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Annual Pension:</strong> {formatCurrency(result.annualPension)}
        </p>
        <p className="text-xs text-gray-600">
          40% of corpus converted to annuity at 6% p.a. (approximate)
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
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Age</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">NPS Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyData.map((year) => (
                  <tr key={year.year} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{year.year}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{formatCurrency(year.balance)}</td>
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
