'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { formatCurrency, formatNumber } from '@/lib/emi';

interface LoanEligibilityCalculatorProps {
  toolName?: string;
}

export default function LoanEligibilityCalculator({ toolName }: LoanEligibilityCalculatorProps) {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(50000);
  const [existingEmi, setExistingEmi] = useState<number>(5000);
  const [employmentType, setEmploymentType] = useState<string>('salaried');
  const [loanTenure, setLoanTenure] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const result = useMemo(() => {
    // Maximum EMI that can be taken (40-50% of monthly income)
    const maxEmiRatio = employmentType === 'self-employed' ? 0.35 : 0.45;
    const maxAllowedEmi = monthlyIncome * maxEmiRatio;
    
    // Available EMI after existing obligations
    const availableEmi = maxAllowedEmi - existingEmi;

    if (availableEmi <= 0) {
      return {
        maxEligibleLoan: 0,
        maxAllowedEmi,
        availableEmi,
        monthlyEmi: 0,
        message: 'Your existing EMI exceeds maximum allowed EMI capacity.'
      };
    }

    // Calculate loan amount from EMI
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTenure * 12;
    const factor = (Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
    const maxEligibleLoan = Math.floor(availableEmi * factor);

    return {
      maxEligibleLoan,
      maxAllowedEmi,
      availableEmi,
      monthlyEmi: availableEmi,
      message: 'Based on income and existing obligations.'
    };
  }, [monthlyIncome, existingEmi, employmentType, loanTenure, interestRate]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'Loan Eligibility Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monthly Income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Existing Monthly EMI
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={existingEmi}
              onChange={(e) => setExistingEmi(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Employment Type
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="salaried">Salaried</option>
            <option value="self-employed">Self-Employed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Loan Tenure (Years)
          </label>
          <input
            type="number"
            value={loanTenure}
            onChange={(e) => setLoanTenure(Number(e.target.value) || 1)}
            min="1"
            max="20"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
      </div>

      {/* Results Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        {result.availableEmi > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">Maximum Eligible Loan</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(result.maxEligibleLoan)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Based on your income and tenure</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">Available Monthly EMI</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(result.availableEmi)}
              </p>
              <p className="text-xs text-gray-500 mt-2">After existing obligations</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-lg font-semibold text-red-600 mb-2">⚠️ Not Eligible Currently</p>
            <p className="text-gray-600">{result.message}</p>
          </div>
        )}
      </div>

      {/* Details Section */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
      >
        {showDetails ? '▼ Hide Details' : '▶ Show Details'}
      </button>

      {showDetails && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Monthly Income</span>
            <span className="font-semibold">{formatCurrency(monthlyIncome)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Max EMI Allowed (45%)</span>
            <span className="font-semibold">{formatCurrency(result.maxAllowedEmi)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Existing EMI</span>
            <span className="font-semibold">{formatCurrency(existingEmi)}</span>
          </div>
          <div className="flex justify-between py-3 bg-blue-50 rounded px-3">
            <span className="text-gray-700 font-semibold">Available for New EMI</span>
            <span className="font-bold text-blue-600">{formatCurrency(result.availableEmi)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
