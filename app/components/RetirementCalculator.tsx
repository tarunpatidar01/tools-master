'use client';

import { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/emi';
import {
  CalcShell,
  FieldGrid,
  NumberField,
  ResultGrid,
  ResultCard,
  InfoBox,
} from '@/app/components/CalculatorUI';

/**
 * Retirement corpus and the monthly SIP needed to reach it.
 *
 * Two stages:
 *  1. Inflate today's monthly expenses to what they will cost at retirement.
 *  2. Size the corpus that funds those inflating expenses through retirement,
 *     using the inflation-adjusted ("real") return the corpus earns after you
 *     stop working — this is the standard annuity-with-growth formula.
 * The required SIP is then the future-value-of-annuity solved for the payment.
 */
export default function RetirementCalculator({ toolName }: { toolName?: string }) {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [preRetirementReturn, setPreRetirementReturn] = useState(12);
  const [postRetirementReturn, setPostRetirementReturn] = useState(7);
  const [existingCorpus, setExistingCorpus] = useState(500000);

  const result = useMemo(() => {
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    const yearsInRetirement = Math.max(1, lifeExpectancy - retirementAge);

    // Stage 1 — what today's lifestyle costs on day one of retirement.
    const monthlyExpensesAtRetirement =
      monthlyExpenses * Math.pow(1 + inflation / 100, yearsToRetire);
    const firstYearExpenses = monthlyExpensesAtRetirement * 12;

    // Stage 2 — corpus that sustains an inflating withdrawal for the full
    // retirement, discounted at the real post-retirement return.
    const realReturn = (1 + postRetirementReturn / 100) / (1 + inflation / 100) - 1;
    const corpusRequired =
      Math.abs(realReturn) < 1e-9
        ? firstYearExpenses * yearsInRetirement
        : (firstYearExpenses * (1 - Math.pow(1 + realReturn, -yearsInRetirement))) / realReturn;

    // What the money you already have grows into by retirement.
    const existingGrowsTo =
      existingCorpus * Math.pow(1 + preRetirementReturn / 100, yearsToRetire);
    const gap = Math.max(0, corpusRequired - existingGrowsTo);

    // Monthly SIP that closes the gap.
    const monthlyRate = preRetirementReturn / 100 / 12;
    const months = yearsToRetire * 12;
    let requiredSip = 0;
    if (months > 0) {
      requiredSip =
        monthlyRate === 0
          ? gap / months
          : gap / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    }

    return {
      yearsToRetire,
      yearsInRetirement,
      monthlyExpensesAtRetirement,
      corpusRequired,
      existingGrowsTo,
      gap,
      requiredSip,
      realReturn: realReturn * 100,
    };
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    monthlyExpenses,
    inflation,
    preRetirementReturn,
    postRetirementReturn,
    existingCorpus,
  ]);

  return (
    <CalcShell title={toolName || 'Retirement Calculator'}>
      <FieldGrid>
        <NumberField
          label="Your current age"
          value={currentAge}
          onChange={setCurrentAge}
          suffix="yrs"
          min={18}
          max={70}
          slider
        />
        <NumberField
          label="Planned retirement age"
          value={retirementAge}
          onChange={setRetirementAge}
          suffix="yrs"
          min={Math.min(currentAge + 1, 75)}
          max={75}
          slider
        />
        <NumberField
          label="Life expectancy"
          value={lifeExpectancy}
          onChange={setLifeExpectancy}
          suffix="yrs"
          min={Math.min(retirementAge + 1, 100)}
          max={100}
          slider
          hint="Plan long. Running out of money at 85 is a worse mistake than over-saving."
        />
        <NumberField
          label="Monthly expenses today"
          value={monthlyExpenses}
          onChange={setMonthlyExpenses}
          prefix="₹"
          min={5000}
          max={1000000}
          step={5000}
          slider
        />
        <NumberField
          label="Expected inflation"
          value={inflation}
          onChange={setInflation}
          suffix="%"
          min={0}
          max={15}
          step={0.5}
          slider
          hint="India's long-run CPI has averaged roughly 6%."
        />
        <NumberField
          label="Return before retirement"
          value={preRetirementReturn}
          onChange={setPreRetirementReturn}
          suffix="%"
          min={1}
          max={25}
          step={0.5}
          slider
        />
        <NumberField
          label="Return after retirement"
          value={postRetirementReturn}
          onChange={setPostRetirementReturn}
          suffix="%"
          min={1}
          max={20}
          step={0.5}
          slider
          hint="Usually lower — the portfolio shifts towards debt once you stop earning."
        />
        <NumberField
          label="Savings you already have"
          value={existingCorpus}
          onChange={setExistingCorpus}
          prefix="₹"
          min={0}
          step={50000}
          hint="EPF, PPF, NPS, mutual funds — anything earmarked for retirement."
        />
      </FieldGrid>

      <ResultGrid>
        <ResultCard
          label="Corpus you need"
          value={formatCurrency(result.corpusRequired)}
          tone="green"
          note={`To fund ${result.yearsInRetirement} years of retirement`}
        />
        <ResultCard
          label="Monthly SIP required"
          value={formatCurrency(result.requiredSip)}
          tone="blue"
          note={`For the next ${result.yearsToRetire} years`}
        />
        <ResultCard
          label="Expenses at retirement"
          value={formatCurrency(result.monthlyExpensesAtRetirement)}
          tone="orange"
          note={`Today's ${formatCurrency(monthlyExpenses)} lifestyle`}
        />
      </ResultGrid>

      <ResultGrid>
        <ResultCard
          label="Existing savings grow to"
          value={formatCurrency(result.existingGrowsTo)}
          tone="purple"
        />
        <ResultCard
          label="Gap still to fund"
          value={formatCurrency(result.gap)}
          tone={result.gap > 0 ? 'orange' : 'green'}
          note={result.gap > 0 ? 'What your SIP has to build' : 'You are already on track'}
        />
        <ResultCard
          label="Real return in retirement"
          value={`${result.realReturn.toFixed(2)}%`}
          tone="blue"
          note="Post-retirement return net of inflation"
        />
      </ResultGrid>

      <InfoBox
        title="How to read this"
        items={[
          'The corpus assumes your withdrawals rise with inflation every year, so your standard of living stays flat rather than eroding.',
          'The real return is what actually matters. A 7% return with 6% inflation leaves you under 1% of genuine growth.',
          'EPF, NPS and gratuity all count towards the corpus — add them under existing savings so you do not double-save.',
          'Re-run this every couple of years. Salary, expenses and inflation all drift, and small drifts compound over decades.',
        ]}
      />
    </CalcShell>
  );
}
