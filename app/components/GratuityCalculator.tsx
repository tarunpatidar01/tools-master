'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface GratuityCalculatorProps {
  toolName?: string;
}

export default function GratuityCalculator({ toolName }: GratuityCalculatorProps) {
  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [dearness, setDearness] = useState<number>(5000);
  const [yearsOfService, setYearsOfService] = useState<number>(10);
  const [lastMonthSalary, setLastMonthSalary] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const result = useMemo(() => {
    if (yearsOfService < 5) {
      return {
        gratuity: 0,
        message: 'Not eligible - Gratuity available after 5 years of service',
        eligible: false,
        yearsDone: yearsOfService,
      };
    }

    const last = lastMonthSalary || (basicSalary + dearness);
    const salaryFor26Days = (last / 26);
    const gratuity = salaryFor26Days * yearsOfService;
    const maxGratuity = 2000000; // ₹20 lakhs max

    return {
      gratuity: Math.min(gratuity, maxGratuity),
      message: gratuity > maxGratuity ? `Capped at ₹${maxGratuity}` : 'Fully eligible',
      eligible: true,
      yearsDone: yearsOfService,
      salaryFor26Days,
      uncappedGratuity: gratuity,
    };
  }, [basicSalary, dearness, yearsOfService, lastMonthSalary]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'Gratuity Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Basic Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dearness Allowance
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={dearness}
              onChange={(e) => setDearness(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Years of Service
          </label>
          <input
            type="number"
            value={yearsOfService}
            onChange={(e) => setYearsOfService(Number(e.target.value) || 0)}
            min="0"
            max="60"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 5 years for eligibility</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Last Month Salary (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={lastMonthSalary}
              onChange={(e) => setLastMonthSalary(Number(e.target.value) || 0)}
              placeholder="Leave empty to use Basic + DA"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Or average of last 10 months</p>
        </div>
      </div>

      {/* Result */}
      {result.eligible ? (
        <>
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Estimated Gratuity Amount</p>
              <p className="text-4xl font-bold text-green-600 mb-2">{formatCurrency(result.gratuity)}</p>
              <p className="text-sm text-gray-600">{result.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {result.yearsDone} years of service completed
              </p>
            </div>
          </div>

          {/* Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            {showDetails ? '▼ Hide Details' : '▶ Show Details'}
          </button>

          {showDetails && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Basic Salary</span>
                <span className="font-semibold">{formatCurrency(basicSalary)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Dearness Allowance</span>
                <span className="font-semibold">{formatCurrency(dearness)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 bg-blue-50 rounded px-2">
                <span className="text-gray-700 font-semibold">Base Salary (Basic + DA)</span>
                <span className="font-bold">{formatCurrency(basicSalary + dearness)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Salary for 26 Days</span>
                <span className="font-semibold">{formatCurrency(result.salaryFor26Days)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Years of Service</span>
                <span className="font-semibold">{result.yearsDone}</span>
              </div>
              <div className="flex justify-between py-3 bg-green-100 rounded px-2">
                <span className="text-gray-700 font-bold">Gratuity Amount</span>
                <span className="font-bold text-green-600">{formatCurrency(result.gratuity)}</span>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 rounded-lg p-4 mt-8">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Formula:</strong> Gratuity = (Basic + DA) ÷ 26 × Years of Service
            </p>
            <p className="text-xs text-gray-600 mb-2">
              • Maximum limit: ₹20 lakh (or 10 months average salary, whichever is higher)
            </p>
            <p className="text-xs text-gray-600">
              • Gratuity is tax-exempt up to ₹10 lakh
            </p>
          </div>
        </>
      ) : (
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold text-red-600 mb-2">⚠️ Not Eligible Yet</p>
          <p className="text-gray-600">{result.message}</p>
          <p className="text-sm text-gray-500 mt-2">
            Years pending: {Math.max(0, 5 - yearsOfService)} years
          </p>
        </div>
      )}
    </div>
  );
}
