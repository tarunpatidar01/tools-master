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
 * Sukanya Samriddhi Yojana maturity projection.
 *
 * Scheme rules: deposits are accepted for the first 15 years from opening, the
 * account then keeps earning interest until it matures 21 years after opening.
 * Interest compounds annually.
 */
const DEPOSIT_YEARS = 15;
const MATURITY_YEARS = 21;
const MIN_DEPOSIT = 250;
const MAX_DEPOSIT = 150000;

export default function SukanyaSamriddhiCalculator({ toolName }: { toolName?: string }) {
  const [yearlyDeposit, setYearlyDeposit] = useState(50000);
  const [girlAge, setGirlAge] = useState(3);
  const [interestRate, setInterestRate] = useState(8.2);

  const result = useMemo(() => {
    let balance = 0;
    const yearly: { year: number; deposit: number; interest: number; balance: number }[] = [];

    for (let year = 1; year <= MATURITY_YEARS; year++) {
      const deposit = year <= DEPOSIT_YEARS ? yearlyDeposit : 0;
      balance += deposit;
      const interest = balance * (interestRate / 100);
      balance += interest;
      yearly.push({ year, deposit, interest, balance });
    }

    const totalDeposited = yearlyDeposit * DEPOSIT_YEARS;

    return {
      maturity: balance,
      totalDeposited,
      totalInterest: balance - totalDeposited,
      maturityAge: girlAge + MATURITY_YEARS,
      yearly,
    };
  }, [yearlyDeposit, girlAge, interestRate]);

  const tableRows = result.yearly
    .filter((r, i) => r.year % 3 === 0 || r.year === DEPOSIT_YEARS || i === result.yearly.length - 1)
    .map((r) => [
      `Year ${r.year}`,
      r.deposit > 0 ? formatCurrency(r.deposit) : '—',
      formatCurrency(r.interest),
      formatCurrency(r.balance),
    ]);

  return (
    <CalcShell title={toolName || 'Sukanya Samriddhi Yojana Calculator'}>
      <FieldGrid>
        <NumberField
          label="Yearly deposit"
          value={yearlyDeposit}
          onChange={setYearlyDeposit}
          prefix="₹"
          min={MIN_DEPOSIT}
          max={MAX_DEPOSIT}
          step={500}
          slider
          hint={`Scheme limits: ₹${MIN_DEPOSIT} minimum and ₹${MAX_DEPOSIT.toLocaleString('en-IN')} maximum per financial year.`}
        />
        <NumberField
          label="Girl's age when the account is opened"
          value={girlAge}
          onChange={setGirlAge}
          suffix="yrs"
          min={0}
          max={10}
          slider
          hint="The account can only be opened before she turns 10."
        />
        <NumberField
          label="Interest rate"
          value={interestRate}
          onChange={setInterestRate}
          suffix="%"
          min={1}
          max={15}
          step={0.1}
          slider
          hint="Currently 8.2% p.a., revised every quarter by the Ministry of Finance."
        />
      </FieldGrid>

      <ResultGrid>
        <ResultCard
          label="Maturity amount"
          value={formatCurrency(result.maturity)}
          tone="green"
          note={`Payable when she turns ${result.maturityAge}`}
        />
        <ResultCard
          label="Total deposited"
          value={formatCurrency(result.totalDeposited)}
          tone="blue"
          note={`₹${yearlyDeposit.toLocaleString('en-IN')} × ${DEPOSIT_YEARS} years`}
        />
        <ResultCard
          label="Interest earned"
          value={formatCurrency(result.totalInterest)}
          tone="orange"
          note={`${((result.totalInterest / result.totalDeposited) * 100).toFixed(0)}% of what you put in`}
        />
      </ResultGrid>

      <BreakdownTable
        caption="Year-wise growth"
        headers={['Period', 'Deposit', 'Interest credited', 'Closing balance']}
        rows={tableRows}
      />

      <InfoBox
        title="Key scheme rules"
        items={[
          `You deposit for ${DEPOSIT_YEARS} years, but the account keeps earning until year ${MATURITY_YEARS}.`,
          'Deposits qualify for a Section 80C deduction, and both the interest and the maturity amount are fully tax-free (EEE).',
          'Up to 50% of the balance can be withdrawn for higher education once she turns 18.',
          'At least ₹250 must be deposited each year, otherwise the account is treated as in default.',
        ]}
      />
    </CalcShell>
  );
}
