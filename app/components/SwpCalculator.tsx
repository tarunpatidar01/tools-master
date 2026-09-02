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
 * Systematic Withdrawal Plan.
 *
 * Each month the remaining corpus earns one month of return, then the fixed
 * withdrawal is taken out. If the corpus runs dry mid-tenure the calculator
 * reports the month it happens rather than showing a negative balance.
 */
export default function SwpCalculator({ toolName }: { toolName?: string }) {
  const [investment, setInvestment] = useState(2500000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(20000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;

    let balance = investment;
    let totalWithdrawn = 0;
    let withdrawnThisYear = 0;
    let depletedAtMonth: number | null = null;
    const yearly: { year: number; withdrawn: number; balance: number }[] = [];

    for (let month = 1; month <= months; month++) {
      balance += balance * monthlyRate;

      const withdrawal = Math.min(monthlyWithdrawal, Math.max(0, balance));
      balance -= withdrawal;
      totalWithdrawn += withdrawal;
      withdrawnThisYear += withdrawal;

      if (balance <= 0 && depletedAtMonth === null) {
        depletedAtMonth = month;
      }

      if (month % 12 === 0) {
        yearly.push({ year: month / 12, withdrawn: withdrawnThisYear, balance: Math.max(0, balance) });
        withdrawnThisYear = 0;
      }
    }

    return {
      finalBalance: Math.max(0, balance),
      totalWithdrawn,
      depletedAtMonth,
      yearly,
    };
  }, [investment, monthlyWithdrawal, expectedReturn, years]);

  // Withdrawing only the monthly return leaves the capital untouched forever.
  const breakEvenWithdrawal = (investment * (expectedReturn / 100)) / 12;

  const tableRows = result.yearly
    .filter((r, i) => r.year % 2 === 0 || i === result.yearly.length - 1)
    .map((r) => [`Year ${r.year}`, formatCurrency(r.withdrawn), formatCurrency(r.balance)]);

  return (
    <CalcShell title={toolName || 'SWP Calculator'}>
      <FieldGrid>
        <NumberField
          label="Total investment"
          value={investment}
          onChange={setInvestment}
          prefix="₹"
          min={10000}
          max={100000000}
          step={50000}
          slider
        />
        <NumberField
          label="Monthly withdrawal"
          value={monthlyWithdrawal}
          onChange={setMonthlyWithdrawal}
          prefix="₹"
          min={500}
          max={1000000}
          step={500}
          slider
        />
        <NumberField
          label="Expected annual return"
          value={expectedReturn}
          onChange={setExpectedReturn}
          suffix="%"
          min={0}
          max={30}
          step={0.5}
          slider
        />
        <NumberField
          label="Withdrawal period"
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
          label="Total withdrawn"
          value={formatCurrency(result.totalWithdrawn)}
          tone="blue"
          note={`Over ${years} year${years !== 1 ? 's' : ''}`}
        />
        <ResultCard
          label="Balance left"
          value={formatCurrency(result.finalBalance)}
          tone={result.depletedAtMonth ? 'orange' : 'green'}
          note={
            result.depletedAtMonth
              ? `Corpus ran out in year ${Math.ceil(result.depletedAtMonth / 12)}`
              : 'Corpus survives the full period'
          }
        />
        <ResultCard
          label="Withdrawal that never depletes"
          value={formatCurrency(breakEvenWithdrawal)}
          tone="purple"
          note="Draws only the returns, leaving capital intact"
        />
      </ResultGrid>

      {result.depletedAtMonth !== null && (
        <div className="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
          At ₹{monthlyWithdrawal.toLocaleString('en-IN')} a month your corpus is exhausted after{' '}
          {Math.floor(result.depletedAtMonth / 12)} years and {result.depletedAtMonth % 12} months.
          Reducing the withdrawal to about {formatCurrency(breakEvenWithdrawal)} would let you draw
          indefinitely.
        </div>
      )}

      <BreakdownTable
        caption="Withdrawals and remaining corpus"
        headers={['Period', 'Withdrawn that year', 'Closing balance']}
        rows={tableRows}
      />

      <InfoBox
        title="Things to keep in mind"
        items={[
          'Returns here are assumed steady. Real equity returns swing year to year, and a weak first few years hurts an SWP disproportionately.',
          'Every withdrawal is a redemption, so capital gains tax applies to the gain portion of the units sold.',
          'Debt or hybrid funds are usually preferred over pure equity for a withdrawal plan you depend on for income.',
        ]}
      />
    </CalcShell>
  );
}
