'use client';

import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';

interface GstCalculatorProps {
  toolName?: string;
}

export default function GstCalculator({ toolName }: GstCalculatorProps) {
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');
  const [price, setPrice] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);

  const result = useMemo(() => {
    if (mode === 'forward') {
      // Price is exclusive of GST
      const gstAmount = price * (gstRate / 100);
      const finalPrice = price + gstAmount;
      return {
        basePrice: price,
        gstAmount,
        finalPrice,
      };
    } else {
      // Price is inclusive of GST
      const basePrice = price / (1 + gstRate / 100);
      const gstAmount = price - basePrice;
      return {
        basePrice,
        gstAmount,
        finalPrice: price,
      };
    }
  }, [price, gstRate, mode]);

  const gstCategories = [
    { rate: 0, category: 'Nil GST' },
    { rate: 5, category: 'Essential Items' },
    { rate: 12, category: 'Regular Items' },
    { rate: 18, category: 'Luxury Items' },
    { rate: 28, category: 'Premium Luxury' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{toolName || 'GST Calculator'}</h2>

      {/* Mode Selection */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setMode('forward')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            mode === 'forward'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Price + GST
        </button>
        <button
          onClick={() => setMode('reverse')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            mode === 'reverse'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Reverse GST
        </button>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {mode === 'forward' ? 'Price (excluding GST)' : 'Price (including GST)'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            GST Rate (%)
          </label>
          <select
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>0% - Nil GST</option>
            <option value={5}>5% - Essential Items</option>
            <option value={12}>12% - Regular Items</option>
            <option value={18}>18% - Luxury Items</option>
            <option value={28}>28% - Premium Luxury</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Base Price</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.basePrice)}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">GST Amount</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(result.gstAmount)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Final Price</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.finalPrice)}</p>
        </div>
      </div>

      {/* GST Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">GST Slab Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {gstCategories.map((cat) => (
            <button
              key={cat.rate}
              onClick={() => setGstRate(cat.rate)}
              className={`p-3 rounded-lg text-sm font-semibold transition ${
                gstRate === cat.rate
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div>{cat.rate}%</div>
              <div className="text-xs">{cat.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-gray-700 mb-2">
          <strong>How to use:</strong>
        </p>
        <ul className="text-sm text-gray-600 space-y-1 ml-4">
          <li>• <strong>Price + GST:</strong> Enter price without GST to calculate final price</li>
          <li>• <strong>Reverse GST:</strong> Enter price with GST to extract GST amount</li>
        </ul>
      </div>
    </div>
  );
}
