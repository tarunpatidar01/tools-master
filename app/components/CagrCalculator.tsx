'use client';

import { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';
import {
  CalcShell,
  FieldGrid,
  NumberField,
  ResultGrid,
  ResultCard,
  BreakdownTable,
  InfoBox,
} from '@/app/components/CalculatorUI';

/**
 * Compound Annual Growth Rate.
 *
 *   CAGR = (final / initial)^(1/years) - 1
 *
 * CAGR smooths a lumpy return into the single constant rate that would have
 * produced the same end value, which is why it is the fair way to compare two
 * investments held for different lengths of time.
 */
export default function CagrCalculator({ toolName }: { toolName?: string }) {
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(250000);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const safeInitial = Math.max(1, initialValue);
    const safeYears = Math.max(0.5, years);

    const cagr = (Math.pow(finalValue / safeInitial, 1 / safeYears) - 1) * 100;
    const absoluteReturn = ((finalValue - safeInitial) / safeInitial) * 100;

    // Year-by-year path implied by that constant growth rate.
    const path: { year: number; value: number }[] = [];
    for (let year = 1; year <= Math.ceil(safeYears); year++) {
      path.push({ year, value: safeInitial * Math.pow(1 + cagr / 100, Math.min(year, safeYears)) });
    }

    return {
      cagr,
      absoluteReturn,
      gain: finalValue - safeInitial,
      // How long a constant CAGR takes to double the money.
      doublingYears: cagr > 0 ? Math.log(2) / Math.log(1 + cagr / 100) : null,
      path,
    };
  }, [initialValue, finalValue, years]);

  return (
    <CalcShell title={toolName || 'CAGR Calculator'}>
      <FieldGrid>
        <NumberField
          label="Initial investment value"
          value={initialValue}
          onChange={setInitialValue}
          prefix="₹"
          min={1}
          max={100000000}
          step={10000}
          slider
        />
        <NumberField
          label="Final value"
          value={finalValue}
          onChange={setFinalValue}
          prefix="₹"
          min={0}
          max={100000000}
          step={10000}
          slider
        />
        <NumberField
          label="Investment period"
          value={years}
          onChange={setYears}
          suffix="yrs"
          min={1}
          max={40}
          step={1}
          slider
        />
      </FieldGrid>

      <ResultGrid>
        <ResultCard
          label="CAGR"
          value={`${result.cagr.toFixed(2)}%`}
          tone={result.cagr >= 0 ? 'green' : 'orange'}
          note="Annualised growth rate"
        />
        <ResultCard
          label="Absolute return"
          value={`${result.absoluteReturn.toFixed(2)}%`}
          tone="blue"
          note="Total growth, not annualised"
        />
        <ResultCard
          label="Total gain"
          value={formatCurrency(result.gain)}
          tone="orange"
          note={`Over ${years} year${years !== 1 ? 's' : ''}`}
        />
      </ResultGrid>

      {result.doublingYears !== null && (
        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          At {result.cagr.toFixed(2)}% a year, money doubles roughly every{' '}
          <strong>{result.doublingYears.toFixed(1)} years</strong>.
        </div>
      )}

      <BreakdownTable
        caption="Value at a constant CAGR"
        headers={['Period', 'Value']}
        rows={result.path.map((p) => [`Year ${p.year}`, formatCurrency(p.value)])}
      />

      <InfoBox
        title="CAGR vs. absolute return"
        items={[
          'Absolute return tells you how much you made in total; CAGR tells you how fast, so only CAGR is comparable across different holding periods.',
          'A 150% absolute return sounds impressive, but over 10 years that is only about 9.6% a year.',
          'CAGR assumes a single lumpsum. For a SIP with monthly instalments, XIRR is the right measure instead.',
          'CAGR hides volatility — two investments with the same CAGR can have very different year-to-year swings.',
        ]}
      />
    </CalcShell>
  );
}
