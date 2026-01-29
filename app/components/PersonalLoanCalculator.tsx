'use client';

import React, { useMemo, useState } from 'react';
import { calculateEMI, formatCurrency } from '@/lib/emi';

interface PersonalLoanCalculatorProps {
  toolName?: string;
}

export default function PersonalLoanCalculator({ toolName }: PersonalLoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [annualRate, setAnnualRate] = useState<number>(12);
  const [months, setMonths] = useState<number>(60);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = useMemo(() => {
    const monthlyRate = annualRate / 12;
    return calculateEMI(loanAmount, annualRate, monthlyRate, months);
  }, [loanAmount, annualRate, months]);

  const yearWiseSummary = useMemo(() => {
    const summary: Array<{
      year: number;
      principalPaid: number;
      interestPaid: number;
      endingBalance: number;
    }> = [];

    let yearStartIdx = 0;
    const yearsInLoan = Math.ceil(months / 12);

    for (let year = 1; year <= yearsInLoan; year++) {
      const yearEndIdx = Math.min(year * 12, months);
      const yearSchedule = result.schedule.slice(yearStartIdx, yearEndIdx);

      const totalPrincipal = yearSchedule.reduce((sum, row) => sum + row.principal, 0);
      const totalInterest = yearSchedule.reduce((sum, row) => sum + row.interest, 0);
      const endingBalance = yearSchedule.length > 0 ? yearSchedule[yearSchedule.length - 1].balance : 0;

      summary.push({
        year,
        principalPaid: totalPrincipal,
        interestPaid: totalInterest,
        endingBalance,
      });

      yearStartIdx = yearEndIdx;
    }

    return summary;
  }, [result.schedule, months]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'Personal Loan Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Loan Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value) || 1)}
            min="1"
            max="30"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tenure (Months)
          </label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value) || 1)}
            min="12"
            max="360"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Monthly EMI</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.emi)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total Interest</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.totalInterest)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(result.totalAmount)}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Loan Tenure</p>
          <p className="text-2xl font-bold text-orange-600">{(months / 12).toFixed(1)} Yrs</p>
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
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Principal Paid</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Interest Paid</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearWiseSummary.map((year) => (
                  <tr key={year.year} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{year.year}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(year.principalPaid)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(year.interestPaid)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{formatCurrency(year.endingBalance)}</td>
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
