'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface SalaryCalculatorProps {
  toolName?: string;
}

export default function SalaryCalculator({ toolName }: SalaryCalculatorProps) {
  const [ctc, setCtc] = useState<number>(1000000);
  const [basicPercent, setBasicPercent] = useState<number>(40);
  const [daPercent, setDaPercent] = useState<number>(10);
  const [hrPercent, setHrPercent] = useState<number>(20);
  const [otherAllowances, setOtherAllowances] = useState<number>(100000);
  const [state, setState] = useState<string>('delhi');
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const result = useMemo(() => {
    const basic = (ctc * basicPercent) / 100;
    const da = (basic * daPercent) / 100;
    const hra = (basic * hrPercent) / 100;
    const grossSalary = basic + da + hra + otherAllowances;

    // EPF (employee contribution - 12% of basic)
    const epf = basic * 0.12;

    // Professional tax (varies by state)
    const ptMap: Record<string, number> = {
      delhi: 200,
      maharashtra: 200,
      karnataka: 200,
      tamilnadu: 200,
      telangana: 200,
      others: 0,
    };
    const pt = ptMap[state] || 0;

    // Income tax (simplified - basic calculation)
    const taxableIncome = grossSalary - epf;
    let tax = 0;
    if (taxableIncome > 250000) {
      if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2;
      } else {
        tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.3;
      }
    }

    const totalDeductions = epf + pt + tax;
    const monthlyInhand = (grossSalary - totalDeductions) / 12;
    const annualInhand = grossSalary - totalDeductions;

    return {
      basic,
      da,
      hra,
      otherAllowances,
      grossSalary,
      epf,
      pt,
      tax,
      totalDeductions,
      monthlyInhand,
      annualInhand,
    };
  }, [ctc, basicPercent, daPercent, hrPercent, otherAllowances, state]);

  const stateOptions = [
    { value: 'delhi', label: 'Delhi - ₹200' },
    { value: 'maharashtra', label: 'Maharashtra - ₹200' },
    { value: 'karnataka', label: 'Karnataka - ₹200' },
    { value: 'tamilnadu', label: 'Tamil Nadu - ₹200' },
    { value: 'telangana', label: 'Telangana - ₹200' },
    { value: 'others', label: 'Others - ₹0' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'Salary Calculator (CTC to In-Hand)'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual CTC
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State (for Professional Tax)
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {stateOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Basic Salary (% of CTC)
          </label>
          <input
            type="number"
            value={basicPercent}
            onChange={(e) => setBasicPercent(Number(e.target.value) || 0)}
            min="20"
            max="60"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dearness Allowance (% of Basic)
          </label>
          <input
            type="number"
            value={daPercent}
            onChange={(e) => setDaPercent(Number(e.target.value) || 0)}
            min="0"
            max="50"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            HRA (% of Basic)
          </label>
          <input
            type="number"
            value={hrPercent}
            onChange={(e) => setHrPercent(Number(e.target.value) || 0)}
            min="0"
            max="50"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Other Allowances
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={otherAllowances}
              onChange={(e) => setOtherAllowances(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Key Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Gross Salary</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.grossSalary)}</p>
          <p className="text-xs text-gray-500 mt-1">Monthly: {formatCurrency(result.grossSalary / 12)}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total Deductions</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(result.totalDeductions)}</p>
          <p className="text-xs text-gray-500 mt-1">EPF + PT + Tax</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">In-Hand Salary</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.annualInhand)}</p>
          <p className="text-xs text-gray-500 mt-1">Monthly: {formatCurrency(result.monthlyInhand)}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Earnings</h3>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Basic Salary</span>
                <span className="font-semibold">{formatCurrency(result.basic)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Dearness Allowance</span>
                <span className="font-semibold">{formatCurrency(result.da)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">HRA</span>
                <span className="font-semibold">{formatCurrency(result.hra)}</span>
              </div>
              <div className="flex justify-between py-2 bg-blue-100 rounded px-2">
                <span className="text-gray-700 font-semibold">Other Allowances</span>
                <span className="font-bold">{formatCurrency(result.otherAllowances)}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Deductions</h3>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">EPF (12% of Basic)</span>
                <span className="font-semibold">{formatCurrency(result.epf)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Professional Tax</span>
                <span className="font-semibold">{formatCurrency(result.pt)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Income Tax</span>
                <span className="font-semibold">{formatCurrency(result.tax)}</span>
              </div>
              <div className="flex justify-between py-2 bg-orange-100 rounded px-2">
                <span className="text-gray-700 font-semibold">Total Deductions</span>
                <span className="font-bold">{formatCurrency(result.totalDeductions)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-gray-300">
            <div className="flex justify-between py-3 bg-green-100 rounded px-3">
              <span className="text-gray-700 font-bold">Net In-Hand Salary (Annual)</span>
              <span className="font-bold text-green-600">{formatCurrency(result.annualInhand)}</span>
            </div>
            <div className="flex justify-between py-3 mt-2 text-center justify-center">
              <span className="text-gray-700 font-semibold">Monthly In-Hand: {formatCurrency(result.monthlyInhand)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
