'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface IncomeCalculatorProps {
  toolName?: string;
}

export default function IncomeCalculator({ toolName }: IncomeCalculatorProps) {
  const [grossIncome, setGrossIncome] = useState<number>(1000000);
  const [section80c, setSection80c] = useState<number>(150000);
  const [section80d, setSection80d] = useState<number>(25000);
  const [section80e, setSection80e] = useState<number>(0);
  const [section80ccd1b, setSection80ccd1b] = useState<number>(0);
  const [age, setAge] = useState<number>(30);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const result = useMemo(() => {
    // Calculate total deductions
    const totalDeductions = section80c + section80d + section80e + section80ccd1b;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    let tax = 0;
    let taxSlabDetails = '';

    // Tax calculation for FY 2024-25
    if (age < 60) {
      // Regular taxpayer
      if (taxableIncome <= 250000) {
        tax = 0;
        taxSlabDetails = 'Nil (Income up to ₹2.5L is tax-exempt)';
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
        taxSlabDetails = '5% on income above ₹2.5L';
      } else if (taxableIncome <= 1000000) {
        tax = (250000 * 0.05) + ((taxableIncome - 500000) * 0.2);
        taxSlabDetails = '5% up to ₹5L + 20% on income above ₹5L';
      } else {
        tax = (250000 * 0.05) + (500000 * 0.2) + ((taxableIncome - 1000000) * 0.3);
        taxSlabDetails = '5% up to ₹5L + 20% on ₹5L to ₹10L + 30% above ₹10L';
      }
    } else if (age < 80) {
      // Senior citizen (60-79)
      if (taxableIncome <= 300000) {
        tax = 0;
        taxSlabDetails = 'Nil (Income up to ₹3L is tax-exempt for senior citizens)';
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 300000) * 0.05;
        taxSlabDetails = '5% on income above ₹3L';
      } else if (taxableIncome <= 1000000) {
        tax = (200000 * 0.05) + ((taxableIncome - 500000) * 0.2);
        taxSlabDetails = '5% up to ₹5L + 20% on income above ₹5L';
      } else {
        tax = (200000 * 0.05) + (500000 * 0.2) + ((taxableIncome - 1000000) * 0.3);
        taxSlabDetails = '5% up to ₹5L + 20% on ₹5L to ₹10L + 30% above ₹10L';
      }
    } else {
      // Super senior citizen (80+)
      if (taxableIncome <= 500000) {
        tax = 0;
        taxSlabDetails = 'Nil (Income up to ₹5L is tax-exempt for super senior citizens)';
      } else if (taxableIncome <= 1000000) {
        tax = (taxableIncome - 500000) * 0.2;
        taxSlabDetails = '20% on income above ₹5L';
      } else {
        tax = (500000 * 0.2) + ((taxableIncome - 1000000) * 0.3);
        taxSlabDetails = '20% up to ₹10L + 30% above ₹10L';
      }
    }

    // Add Medicare cess (4% on total income)
    const medicareCess = taxableIncome > 1000000 ? grossIncome * 0.04 : 0;
    const totalTax = tax + medicareCess;

    return {
      taxableIncome,
      tax,
      medicareCess,
      totalTax,
      taxSlab: taxSlabDetails,
      effectiveRate: grossIncome > 0 ? ((totalTax / grossIncome) * 100).toFixed(2) : '0.00',
    };
  }, [grossIncome, section80c, section80d, section80e, section80ccd1b, age]);

  const totalDeductions = section80c + section80d + section80e + section80ccd1b;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'Income Tax Calculator'}</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gross Annual Income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={grossIncome}
              onChange={(e) => setGrossIncome(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Age
          </label>
          <select
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={30}>Below 60 Years</option>
            <option value={65}>60-79 Years (Senior Citizen)</option>
            <option value={85}>80+ Years (Super Senior)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Section 80C Deduction (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={section80c}
              onChange={(e) => setSection80c(Math.min(150000, Number(e.target.value) || 0))}
              max="150000"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Max: ₹1,50,000</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Section 80D Deduction (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={section80d}
              onChange={(e) => setSection80d(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Medical Insurance Premium</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Section 80E Deduction (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={section80e}
              onChange={(e) => setSection80e(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Education Loan Interest</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Section 80CCD(1B) Deduction (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={section80ccd1b}
              onChange={(e) => setSection80ccd1b(Math.min(50000, Number(e.target.value) || 0))}
              max="50000"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">NPS Contribution - Max: ₹50,000</p>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total Deductions</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalDeductions)}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Taxable Income</p>
          <p className="text-2xl font-bold text-amber-600">{formatCurrency(result.taxableIncome)}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total Tax Liability</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(result.totalTax)}</p>
          <p className="text-xs text-gray-500 mt-1">Effective Rate: {result.effectiveRate}%</p>
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
            <span className="text-gray-600">Gross Income</span>
            <span className="font-semibold">{formatCurrency(grossIncome)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Less: Total Deductions</span>
            <span className="font-semibold">-{formatCurrency(totalDeductions)}</span>
          </div>
          <div className="flex justify-between py-3 bg-amber-100 rounded px-3">
            <span className="text-gray-700 font-semibold">Taxable Income</span>
            <span className="font-bold">{formatCurrency(result.taxableIncome)}</span>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
            <p className="text-gray-600 mb-2"><strong>Tax Slab:</strong> {result.taxSlab}</p>
          </div>
          <div className="flex justify-between py-3 border-t-2 border-gray-300">
            <span className="text-gray-600">Income Tax</span>
            <span className="font-semibold">{formatCurrency(result.tax)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Medicare Cess (4%)</span>
            <span className="font-semibold">{formatCurrency(result.medicareCess)}</span>
          </div>
          <div className="flex justify-between py-3 bg-red-100 rounded px-3">
            <span className="text-gray-700 font-bold">Total Tax Liability</span>
            <span className="font-bold text-red-600">{formatCurrency(result.totalTax)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
