'use client';

import React from 'react';

/**
 * Shared input/result primitives for the calculator components.
 * Matches the visual language of the existing calculators (GstCalculator etc.)
 * so the newer tools do not each re-declare the same Tailwind strings.
 */

export function CalcShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      {children}
    </div>
  );
}

export function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">{children}</div>;
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  /** Renders a range slider under the input for quick scenario testing. */
  slider?: boolean;
  hint?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  slider = false,
  hint,
}: NumberFieldProps) {
  const id = `field-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

  const clamp = (n: number) => {
    if (Number.isNaN(n)) return min;
    if (max !== undefined && n > max) return max;
    return n < min ? min : n;
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-2.5 text-gray-500">{prefix}</span>}
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          className={`w-full ${prefix ? 'pl-8' : 'pl-4'} ${suffix ? 'pr-12' : 'pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
        {suffix && <span className="absolute right-3 top-2.5 text-gray-500 text-sm">{suffix}</span>}
      </div>
      {slider && max !== undefined && (
        <input
          type="range"
          aria-label={`${label} slider`}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full mt-2 accent-blue-600"
        />
      )}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  options: { value: number | string; label: string }[];
}) {
  const id = `select-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const TONES = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
} as const;

export function ResultGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">{children}</div>;
}

export function ResultCard({
  label,
  value,
  tone = 'blue',
  note,
}: {
  label: string;
  value: string;
  tone?: keyof typeof TONES;
  note?: string;
}) {
  const [bg, text] = TONES[tone].split(' ');
  return (
    <div className={`${bg} rounded-lg p-4`}>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold ${text}`}>{value}</p>
      {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
    </div>
  );
}

export function InfoBox({ title, items }: { title: string; items: React.ReactNode[] }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <p className="text-sm text-gray-700 mb-2">
        <strong>{title}</strong>
      </p>
      <ul className="text-sm text-gray-600 space-y-1 ml-4">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export function BreakdownTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: (string | number)[][];
  caption?: string;
}) {
  return (
    <div className="mb-8">
      {caption && <h3 className="text-lg font-semibold text-gray-900 mb-4">{caption}</h3>}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h) => (
                <th key={h} scope="col" className="text-left px-4 py-2 font-semibold text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-gray-100">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
