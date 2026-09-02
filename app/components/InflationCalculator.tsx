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
 * Inflation impact, both directions.
 *
 *   Future cost   = amount × (1 + i)^n     — what today's basket will cost later
 *   Today's worth = amount ÷ (1 + i)^n     — what that future rupee buys today
 */
export default function InflationCalculator({ toolName }: { toolName?: string }) {
  const [amount, setAmount] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const factor = Math.pow(1 + inflationRate / 100, years);
    const futureCost = amount * factor;
    const presentValue = amount / factor;

    const path: { year: number; cost: number; worth: number }[] = [];
    for (let year = 1; year <= years; year++) {
      const f = Math.pow(1 + inflationRate / 100, year);
      path.push({ year, cost: amount * f, worth: amount / f });
    }

    return {
      futureCost,
      presentValue,
      erosion: amount - presentValue,
      erosionPct: ((amount - presentValue) / amount) * 100,
      // Return needed just to stand still after inflation and no tax.
      breakEvenReturn: inflationRate,
      path,
    };
  }, [amount, inflationRate, years]);

  const tableRows = result.path
    .filter((p, i) => p.year % Math.max(1, Math.ceil(years / 8)) === 0 || i === result.path.length - 1)
    .map((p) => [`Year ${p.year}`, formatCurrency(p.cost), formatCurrency(p.worth)]);

  return (
    <CalcShell title={toolName || 'Inflation Calculator'}>
      <FieldGrid>
        <NumberField
          label="Amount today"
          value={amount}
          onChange={setAmount}
          prefix="₹"
          min={100}
          max={100000000}
          step={10000}
          slider
        />
        <NumberField
          label="Expected inflation rate"
          value={inflationRate}
          onChange={setInflationRate}
          suffix="%"
          min={0}
          max={20}
          step={0.25}
          slider
          hint="India's long-run CPI inflation has averaged roughly 6% a year."
        />
        <NumberField
          label="Number of years"
          value={years}
          onChange={setYears}
          suffix="yrs"
          min={1}
          max={50}
          slider
        />
      </FieldGrid>

      <ResultGrid>
        <ResultCard
          label={`Cost in ${years} years`}
          value={formatCurrency(result.futureCost)}
          tone="orange"
          note={`What ${formatCurrency(amount)} of goods will cost`}
        />
        <ResultCard
          label={`${formatCurrency(amount)} will be worth`}
          value={formatCurrency(result.presentValue)}
          tone="blue"
          note="In today's purchasing power"
        />
        <ResultCard
          label="Value lost"
          value={`${result.erosionPct.toFixed(1)}%`}
          tone="purple"
          note={`${formatCurrency(result.erosion)} of purchasing power`}
        />
      </ResultGrid>

      <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        Money parked in a savings account at 3% while inflation runs at {inflationRate}% loses about{' '}
        <strong>{(inflationRate - 3).toFixed(1)}% a year</strong> in real terms. You need to earn at
        least <strong>{result.breakEvenReturn.toFixed(2)}%</strong> before tax just to stand still.
      </div>

      <BreakdownTable
        caption="Year-by-year impact"
        headers={['Period', `Cost of today's ${formatCurrency(amount)}`, `What ${formatCurrency(amount)} buys`]}
        rows={tableRows}
      />

      <InfoBox
        title="Where inflation bites hardest"
        items={[
          'Headline CPI understates what most households feel — education and healthcare have run at 8-10% a year, well above the general index.',
          'Long goals suffer most. Over 25 years at 6%, prices roughly quadruple.',
          'Compare investments on real return (return minus inflation), not the headline rate.',
          'Tax comes off the nominal return, not the real one, which is why a 7% FD in a 30% bracket loses to 6% inflation.',
        ]}
      />
    </CalcShell>
  );
}
