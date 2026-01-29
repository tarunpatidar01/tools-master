'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface CreditCardEmiCalculatorProps {
  toolName?: string;
}

export default function CreditCardEmiCalculator({ toolName }: CreditCardEmiCalculatorProps) {
  const [purchaseAmount, setPurchaseAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(15);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const monthlyEmi = (purchaseAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                       (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const totalAmount = monthlyEmi * tenureMonths;
    const totalInterest = totalAmount - purchaseAmount;

    const schedule = [];
    let balance = purchaseAmount;

    for (let i = 1; i <= tenureMonths; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyEmi - interest;
      balance -= principal;

      schedule.push({
        month: i,
        emi: monthlyEmi,
        principal: Math.max(0, principal),
        interest,
        balance: Math.max(0, balance),
      });
    }

    return {
      monthlyEmi,
      totalInterest,
      totalAmount,
      schedule,
    };
  }, [purchaseAmount, interestRate, tenureMonths]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'Credit Card EMI Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Purchase Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(Number(e.target.value) || 0)}
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
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value) || 1)}
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
          <select
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
            <option value={18}>18 Months</option>
            <option value={24}>24 Months</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Monthly EMI</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.monthlyEmi)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total Interest</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.totalInterest)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(result.totalAmount)}</p>
        </div>
      </div>

      {/* Schedule */}
      <div className="mb-8">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
        >
          {showSchedule ? '▼ Hide Payment Schedule' : '▶ Show Payment Schedule'}
        </button>

        {showSchedule && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Month</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold">EMI</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold">Principal</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold">Interest</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.slice(0, 10).map((row) => (
                  <tr key={row.month} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">{row.month}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(row.emi)}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(row.principal)}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(row.interest)}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-semibold">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.schedule.length > 10 && (
              <p className="text-gray-500 text-sm mt-2">Showing first 10 months...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
