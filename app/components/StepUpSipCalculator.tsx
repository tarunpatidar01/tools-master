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
 * Step-up (top-up) SIP.
 *
 * A normal SIP keeps the instalment flat for the whole tenure. A step-up SIP
 * raises it by a fixed percentage every 12 months, which tracks salary growth
 * and materially changes the final corpus. Both paths are computed so the
 * difference is visible.
 */
export default function StepUpSipCalculator({ toolName }: { toolName?: string }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [stepUpRate, setStepUpRate] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(15);

  const result = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;

    let stepUpCorpus = 0;
    let stepUpInvested = 0;
    let flatCorpus = 0;
    let flatInvested = 0;
    let instalment = monthlyInvestment;

    const yearly: { year: number; instalment: number; invested: number; corpus: number }[] = [];

    for (let year = 1; year <= years; year++) {
      for (let month = 0; month < 12; month++) {
        stepUpCorpus = (stepUpCorpus + instalment) * (1 + monthlyRate);
        stepUpInvested += instalment;

        flatCorpus = (flatCorpus + monthlyInvestment) * (1 + monthlyRate);
        flatInvested += monthlyInvestment;
      }

      yearly.push({ year, instalment, invested: stepUpInvested, corpus: stepUpCorpus });
      instalment *= 1 + stepUpRate / 100;
    }

    return {
      corpus: stepUpCorpus,
      invested: stepUpInvested,
      gains: stepUpCorpus - stepUpInvested,
      flatCorpus,
      flatInvested,
      extraCorpus: stepUpCorpus - flatCorpus,
      finalInstalment: instalment / (1 + stepUpRate / 100),
      yearly,
    };
  }, [monthlyInvestment, stepUpRate, expectedReturn, years]);

  const tableRows = result.yearly
    .filter((r, i) => r.year % 3 === 0 || i === result.yearly.length - 1)
    .map((r) => [
      `Year ${r.year}`,
      formatCurrency(r.instalment),
      formatCurrency(r.invested),
      formatCurrency(r.corpus),
    ]);

  return (
    <CalcShell title={toolName || 'Step-Up SIP Calculator'}>
      <FieldGrid>
        <NumberField
          label="Starting monthly SIP"
          value={monthlyInvestment}
          onChange={setMonthlyInvestment}
          prefix="₹"
          min={500}
          max={1000000}
          step={500}
          slider
        />
        <NumberField
          label="Annual step-up"
          value={stepUpRate}
          onChange={setStepUpRate}
          suffix="%"
          min={0}
          max={50}
          step={1}
          slider
          hint="Most investors match this to their yearly salary hike."
        />
        <NumberField
          label="Expected annual return"
          value={expectedReturn}
          onChange={setExpectedReturn}
          suffix="%"
          min={1}
          max={30}
          step={0.5}
          slider
        />
        <NumberField
          label="Investment period"
          value={years}
          onChange={setYears}
          suffix="yrs"
          min={1}
          max={40}
          slider
        />
      </FieldGrid>

      <ResultGrid>
        <ResultCard
          label="Final corpus"
          value={formatCurrency(result.corpus)}
          tone="green"
          note={`After ${years} years`}
        />
        <ResultCard
          label="Total invested"
          value={formatCurrency(result.invested)}
          tone="blue"
          note={`Last instalment: ${formatCurrency(result.finalInstalment)}`}
        />
        <ResultCard
          label="Wealth gained"
          value={formatCurrency(result.gains)}
          tone="orange"
        />
      </ResultGrid>

      <div className="mb-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-900">
          Stepping up {stepUpRate}% a year adds {formatCurrency(result.extraCorpus)} to your corpus.
        </p>
        <p className="mt-1 text-sm text-emerald-800">
          A flat ₹{monthlyInvestment.toLocaleString('en-IN')} SIP for the same {years} years would
          reach {formatCurrency(result.flatCorpus)} on {formatCurrency(result.flatInvested)}{' '}
          invested.
        </p>
      </div>

      <BreakdownTable
        caption="Year-wise growth"
        headers={['Period', 'Monthly instalment', 'Invested so far', 'Corpus']}
        rows={tableRows}
      />

      <InfoBox
        title="Why step-up matters"
        items={[
          'A flat SIP loses purchasing power every year to inflation; a step-up keeps your real contribution constant.',
          'The increase compounds for the remaining tenure, so early step-ups matter far more than late ones.',
          'Most fund houses let you register a top-up SIP once, and the mandate raises itself automatically each year.',
          'Returns shown are indicative. Equity markets are not steady, and past returns do not guarantee future ones.',
        ]}
      />
    </CalcShell>
  );
}
