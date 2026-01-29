'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface HraCalculatorProps {
  toolName?: string;
}

export default function HraCalculator({ toolName }: HraCalculatorProps) {
  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [dearness, setDearness] = useState<number>(5000);
  const [hraReceived, setHraReceived] = useState<number>(15000);
  const [actualRent, setActualRent] = useState<number>(25000);
  const [city, setCity] = useState<'metro' | 'non-metro'>('metro');
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const result = useMemo(() => {
    const baseSalary = basicSalary + dearness;
    
    // HRA exemption criteria
    // 1. Minimum of: Actual HRA, 50% of base (metro) or 40% (non-metro), Actual rent - 10% of base
    
    const percentage = city === 'metro' ? 0.5 : 0.4;
    const option1 = hraReceived; // Actual HRA received
    const option2 = baseSalary * percentage; // 50% or 40% of base
    const option3 = Math.max(0, actualRent - (baseSalary * 0.1)); // Rent - 10% of base
    
    // Check if rent exceeds 10% of basic+DA
    const rentExceeds10Percent = actualRent > (baseSalary * 0.1);
    
    let hraExemption = 0;
    let exemptionReason = '';
    
    if (!rentExceeds10Percent) {
      hraExemption = 0;
      exemptionReason = 'Rent does not exceed 10% of Basic+DA. No exemption.';
    } else {
      hraExemption = Math.min(option1, option2, option3);
      exemptionReason = 'Minimum of (Actual HRA, ' + percentage * 100 + '% of Base, Rent - 10% of Base)';
    }

    const taxableHra = Math.max(0, hraReceived - hraExemption);

    return {
      basicSalary,
      dearness,
      baseSalary,
      hraReceived,
      actualRent,
      option1,
      option2,
      option3,
      rentThreshold: baseSalary * 0.1,
      hraExemption,
      taxableHra,
      exemptionReason,
      rentExceeds10Percent,
    };
  }, [basicSalary, dearness, hraReceived, actualRent, city]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'HRA Calculator'}</h2>

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
            HRA Received
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={hraReceived}
              onChange={(e) => setHraReceived(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Actual Monthly Rent Paid
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={actualRent}
              onChange={(e) => setActualRent(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City Type
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value as 'metro' | 'non-metro')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="metro">Metro Cities (50% exemption)</option>
            <option value="non-metro">Non-Metro Cities (40% exemption)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">HRA Exemption</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.hraExemption)}</p>
          <p className="text-xs text-gray-500 mt-1">Tax-free portion</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Taxable HRA</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(result.taxableHra)}</p>
          <p className="text-xs text-gray-500 mt-1">Included in taxable income</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total HRA Received</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.hraReceived)}</p>
          <p className="text-xs text-gray-500 mt-1">Monthly salary component</p>
        </div>
      </div>

      {/* Eligibility Status */}
      <div className={`rounded-lg p-4 mb-8 ${result.rentExceeds10Percent ? 'bg-blue-50' : 'bg-red-50'}`}>
        <p className={`font-semibold mb-1 ${result.rentExceeds10Percent ? 'text-blue-900' : 'text-red-900'}`}>
          {result.rentExceeds10Percent ? '✓ Eligible for HRA Exemption' : '✗ Not Eligible for Exemption'}
        </p>
        <p className={`text-sm ${result.rentExceeds10Percent ? 'text-blue-700' : 'text-red-700'}`}>
          {result.rentExceeds10Percent
            ? `Rent (₹${result.actualRent}) exceeds 10% of Basic+DA (₹${result.rentThreshold.toFixed(0)})`
            : `Rent (₹${result.actualRent}) does not exceed 10% of Basic+DA (₹${result.rentThreshold.toFixed(0)})`}
        </p>
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
            <span className="font-semibold">{formatCurrency(result.basicSalary)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Dearness Allowance</span>
            <span className="font-semibold">{formatCurrency(result.dearness)}</span>
          </div>
          <div className="flex justify-between py-3 bg-blue-100 rounded px-2 mb-2">
            <span className="text-gray-700 font-semibold">Base (Basic + DA)</span>
            <span className="font-bold">{formatCurrency(result.baseSalary)}</span>
          </div>

          <div className="pt-2 border-t-2 border-gray-300">
            <p className="text-sm font-semibold text-gray-700 mb-3">HRA Exemption Calculation (Minimum of):</p>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">1. Actual HRA Received</span>
              <span className="font-semibold">{formatCurrency(result.option1)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">2. {city === 'metro' ? '50%' : '40%'} of Base</span>
              <span className="font-semibold">{formatCurrency(result.option2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">3. Rent - 10% of Base</span>
              <span className="font-semibold">{formatCurrency(result.option3)}</span>
            </div>
          </div>

          <div className="flex justify-between py-3 bg-green-100 rounded px-2 mt-4">
            <span className="text-gray-700 font-bold">HRA Exemption (Min value)</span>
            <span className="font-bold text-green-600">{formatCurrency(result.hraExemption)}</span>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 mt-8">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Key Requirements:</strong>
        </p>
        <ul className="text-xs text-gray-600 space-y-1 ml-4">
          <li>• Rent paid must exceed 10% of Basic + DA</li>
          <li>• Living in rented accommodation (not your own property)</li>
          <li>• Valid rent receipts must be maintained</li>
          <li>• Exemption is minimum of actual HRA, {city === 'metro' ? '50%' : '40%'} of base, or rent minus 10%</li>
        </ul>
      </div>
    </div>
  );
}
