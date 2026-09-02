'use client';

import { useMemo, useState } from 'react';
import { calculateEMI, formatCurrency } from '@/lib/emi';
import {
  CalcShell,
  FieldGrid,
  NumberField,
  SelectField,
  ResultGrid,
  ResultCard,
  InfoBox,
} from '@/app/components/CalculatorUI';

type PrepayMode = 'lumpsum' | 'monthly';

/**
 * Loan prepayment / part-payment impact.
 *
 * Amortises the loan month by month twice: once as scheduled, and once with the
 * prepayment applied. The EMI is held constant in both runs, so the prepayment
 * shows up as a shorter tenure and lower total interest — which is how banks
 * handle part-payments by default unless you explicitly ask to reduce the EMI.
 */
export default function LoanPrepaymentCalculator({ toolName }: { toolName?: string }) {
  const [principal, setPrincipal] = useState(3000000);
  const [annualRate, setAnnualRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [mode, setMode] = useState<PrepayMode>('lumpsum');
  const [lumpsumAmount, setLumpsumAmount] = useState(500000);
  const [lumpsumAfterMonths, setLumpsumAfterMonths] = useState(24);
  const [extraMonthly, setExtraMonthly] = useState(5000);

  const result = useMemo(() => {
    const months = Math.max(1, Math.round(tenureYears * 12));
    const monthlyRate = annualRate / 100 / 12;

    const base = calculateEMI(principal, annualRate, annualRate / 12, months);
    const emi = base.emi;

    // Replay the schedule with the prepayment applied, EMI held constant.
    let balance = principal;
    let interestPaid = 0;
    let monthsTaken = 0;
    let prepaid = 0;

    for (let month = 1; month <= months * 2 && balance > 0.5; month++) {
      const interest = balance * monthlyRate;
      interestPaid += interest;

      let principalPaid = emi - interest;

      if (mode === 'monthly') {
        principalPaid += extraMonthly;
        prepaid += extraMonthly;
      } else if (month === lumpsumAfterMonths) {
        principalPaid += lumpsumAmount;
        prepaid += lumpsumAmount;
      }

      if (principalPaid >= balance) {
        // Final month: only what is actually outstanding is repaid.
        prepaid -= Math.max(0, principalPaid - balance - (emi - interest));
        balance = 0;
      } else {
        balance -= principalPaid;
      }

      monthsTaken = month;
    }

    const monthsSaved = months - monthsTaken;

    return {
      emi,
      originalInterest: base.totalInterest,
      originalMonths: months,
      newInterest: interestPaid,
      newMonths: monthsTaken,
      interestSaved: base.totalInterest - interestPaid,
      monthsSaved,
      totalPrepaid: prepaid,
    };
  }, [principal, annualRate, tenureYears, mode, lumpsumAmount, lumpsumAfterMonths, extraMonthly]);

  const fmtMonths = (m: number) => {
    const y = Math.floor(m / 12);
    const rem = m % 12;
    if (y === 0) return `${rem} month${rem !== 1 ? 's' : ''}`;
    if (rem === 0) return `${y} year${y !== 1 ? 's' : ''}`;
    return `${y}y ${rem}m`;
  };

  return (
    <CalcShell title={toolName || 'Home Loan Prepayment Calculator'}>
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          type="button"
          onClick={() => setMode('lumpsum')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            mode === 'lumpsum' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          One-time part payment
        </button>
        <button
          type="button"
          onClick={() => setMode('monthly')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            mode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Extra every month
        </button>
      </div>

      <FieldGrid>
        <NumberField
          label="Loan amount"
          value={principal}
          onChange={setPrincipal}
          prefix="₹"
          min={50000}
          max={100000000}
          step={50000}
          slider
        />
        <NumberField
          label="Interest rate"
          value={annualRate}
          onChange={setAnnualRate}
          suffix="%"
          min={1}
          max={25}
          step={0.05}
          slider
        />
        <NumberField
          label="Original tenure"
          value={tenureYears}
          onChange={setTenureYears}
          suffix="yrs"
          min={1}
          max={30}
          slider
        />

        {mode === 'lumpsum' ? (
          <>
            <NumberField
              label="Part payment amount"
              value={lumpsumAmount}
              onChange={setLumpsumAmount}
              prefix="₹"
              min={0}
              max={principal}
              step={25000}
              slider
            />
            <SelectField
              label="Paid after"
              value={lumpsumAfterMonths}
              onChange={(v) => setLumpsumAfterMonths(Number(v))}
              options={[12, 24, 36, 48, 60, 84, 120].map((m) => ({
                value: m,
                label: `${m / 12} year${m / 12 !== 1 ? 's' : ''} (month ${m})`,
              }))}
            />
          </>
        ) : (
          <NumberField
            label="Extra paid every month"
            value={extraMonthly}
            onChange={setExtraMonthly}
            prefix="₹"
            min={0}
            max={500000}
            step={1000}
            slider
            hint="Paid on top of your regular EMI, straight against the principal."
          />
        )}
      </FieldGrid>

      <ResultGrid>
        <ResultCard
          label="Interest saved"
          value={formatCurrency(Math.max(0, result.interestSaved))}
          tone="green"
          note={`On ${formatCurrency(result.totalPrepaid)} prepaid`}
        />
        <ResultCard
          label="Tenure reduced by"
          value={fmtMonths(Math.max(0, result.monthsSaved))}
          tone="purple"
          note={`${fmtMonths(result.newMonths)} instead of ${fmtMonths(result.originalMonths)}`}
        />
        <ResultCard label="Your EMI (unchanged)" value={formatCurrency(result.emi)} tone="blue" />
      </ResultGrid>

      <ResultGrid>
        <ResultCard
          label="Interest without prepayment"
          value={formatCurrency(result.originalInterest)}
          tone="orange"
        />
        <ResultCard
          label="Interest with prepayment"
          value={formatCurrency(result.newInterest)}
          tone="blue"
        />
        <ResultCard
          label="Total paid to the bank"
          value={formatCurrency(principal + result.newInterest)}
          tone="purple"
        />
      </ResultGrid>

      <InfoBox
        title="Before you prepay"
        items={[
          'The RBI bars prepayment charges on floating-rate loans taken by individuals. Fixed-rate loans can still carry a 2-5% fee — confirm with your lender first.',
          'Prepaying early saves the most, because the early EMIs are almost entirely interest.',
          'Banks keep the EMI and shorten the tenure by default. Ask explicitly if you want a lower EMI instead.',
          'If you claim the Section 24(b) deduction on home-loan interest, a large prepayment reduces that deduction too. Compare the tax saved against the interest saved.',
        ]}
      />
    </CalcShell>
  );
}
