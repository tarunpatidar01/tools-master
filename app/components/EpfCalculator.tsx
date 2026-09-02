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
 * EPF corpus projection.
 *
 * Statutory split (EPF Scheme 1952 / EPS 1995):
 *   - Employee contributes 12% of basic + DA, all of it to EPF.
 *   - Employer also contributes 12%, but 8.33% is diverted to the pension
 *     scheme (EPS), capped at 8.33% of the ₹15,000 statutory wage ceiling.
 *     Whatever is left of the employer's 12% lands in EPF.
 * Interest is credited on the running balance at the EPFO-declared rate.
 */
const EPS_WAGE_CEILING = 15000;
const EPS_RATE = 0.0833;
const EPS_MONTHLY_CAP = Math.round(EPS_WAGE_CEILING * EPS_RATE);

export default function EpfCalculator({ toolName }: { toolName?: string }) {
  const [basicSalary, setBasicSalary] = useState(30000);
  const [currentAge, setCurrentAge] = useState(28);
  const [retirementAge, setRetirementAge] = useState(58);
  const [employeeRate, setEmployeeRate] = useState(12);
  const [annualIncrement, setAnnualIncrement] = useState(5);
  const [interestRate, setInterestRate] = useState(8.25);
  const [existingBalance, setExistingBalance] = useState(0);

  const result = useMemo(() => {
    const years = Math.max(0, retirementAge - currentAge);
    const monthlyRate = interestRate / 100 / 12;

    let balance = existingBalance;
    let employeeTotal = 0;
    let employerTotal = 0;
    let epsTotal = 0;
    let salary = basicSalary;
    const yearly: { year: number; age: number; contribution: number; interest: number; balance: number }[] = [];

    for (let year = 1; year <= years; year++) {
      let contributionThisYear = 0;
      let interestThisYear = 0;

      for (let month = 0; month < 12; month++) {
        const employee = salary * (employeeRate / 100);
        // EPS diversion is capped at the statutory wage ceiling.
        const eps = Math.min(salary, EPS_WAGE_CEILING) * EPS_RATE;
        const employer = Math.max(0, salary * 0.12 - eps);

        employeeTotal += employee;
        employerTotal += employer;
        epsTotal += eps;
        contributionThisYear += employee + employer;

        balance += employee + employer;
        const interest = balance * monthlyRate;
        interestThisYear += interest;
        balance += interest;
      }

      yearly.push({
        year,
        age: currentAge + year,
        contribution: contributionThisYear,
        interest: interestThisYear,
        balance,
      });

      salary *= 1 + annualIncrement / 100;
    }

    return {
      years,
      maturity: balance,
      employeeTotal,
      employerTotal,
      epsTotal,
      totalInterest: balance - existingBalance - employeeTotal - employerTotal,
      yearly,
    };
  }, [basicSalary, currentAge, retirementAge, employeeRate, annualIncrement, interestRate, existingBalance]);

  // A 30+ year table is unreadable in full; show every 5th year plus the last.
  const tableRows = result.yearly
    .filter((r, i) => r.year % 5 === 0 || i === result.yearly.length - 1)
    .map((r) => [
      `Year ${r.year}`,
      r.age,
      formatCurrency(r.contribution),
      formatCurrency(r.interest),
      formatCurrency(r.balance),
    ]);

  return (
    <CalcShell title={toolName || 'EPF Calculator'}>
      <FieldGrid>
        <NumberField
          label="Monthly basic salary + DA"
          value={basicSalary}
          onChange={setBasicSalary}
          prefix="₹"
          min={1000}
          max={500000}
          step={1000}
          slider
        />
        <NumberField
          label="Your current age"
          value={currentAge}
          onChange={setCurrentAge}
          suffix="yrs"
          min={18}
          max={57}
          slider
        />
        <NumberField
          label="Retirement age"
          value={retirementAge}
          onChange={setRetirementAge}
          suffix="yrs"
          min={Math.min(currentAge + 1, 58)}
          max={60}
          slider
        />
        <NumberField
          label="Your contribution"
          value={employeeRate}
          onChange={setEmployeeRate}
          suffix="%"
          min={12}
          max={100}
          step={0.5}
          slider
          hint="12% is statutory. Raise it for Voluntary Provident Fund (VPF)."
        />
        <NumberField
          label="Expected annual salary increase"
          value={annualIncrement}
          onChange={setAnnualIncrement}
          suffix="%"
          min={0}
          max={20}
          step={0.5}
          slider
        />
        <NumberField
          label="EPF interest rate"
          value={interestRate}
          onChange={setInterestRate}
          suffix="%"
          min={1}
          max={15}
          step={0.05}
          slider
          hint="EPFO declared 8.25% for FY 2024-25."
        />
        <NumberField
          label="Existing EPF balance"
          value={existingBalance}
          onChange={setExistingBalance}
          prefix="₹"
          min={0}
          step={10000}
          hint="Check your latest passbook on the EPFO member portal."
        />
      </FieldGrid>

      <ResultGrid>
        <ResultCard
          label={`EPF corpus at ${retirementAge}`}
          value={formatCurrency(result.maturity)}
          tone="green"
          note={`After ${result.years} years of service`}
        />
        <ResultCard
          label="Your total contribution"
          value={formatCurrency(result.employeeTotal)}
          tone="blue"
        />
        <ResultCard
          label="Interest earned"
          value={formatCurrency(result.totalInterest)}
          tone="orange"
        />
      </ResultGrid>

      <ResultGrid>
        <ResultCard
          label="Employer's EPF share"
          value={formatCurrency(result.employerTotal)}
          tone="purple"
          note="12% minus the EPS diversion"
        />
        <ResultCard
          label="Diverted to pension (EPS)"
          value={formatCurrency(result.epsTotal)}
          tone="blue"
          note="Paid as monthly pension, not lump sum"
        />
        <ResultCard
          label="Total invested"
          value={formatCurrency(result.employeeTotal + result.employerTotal + existingBalance)}
          tone="orange"
        />
      </ResultGrid>

      {tableRows.length > 0 && (
        <BreakdownTable
          caption="Year-wise EPF growth"
          headers={['Period', 'Age', 'Contribution', 'Interest', 'Closing balance']}
          rows={tableRows}
        />
      )}

      <InfoBox
        title="How this is calculated"
        items={[
          'You contribute 12% of basic + DA; your employer matches it.',
          `Of the employer's 12%, 8.33% (capped at ₹${EPS_MONTHLY_CAP.toLocaleString('en-IN')} a month) goes to the EPS pension scheme instead of EPF.`,
          'Interest is credited on the running balance at the EPFO rate, which is reviewed every year.',
          'EPF maturity is tax-free if you complete 5 continuous years of service.',
        ]}
      />
    </CalcShell>
  );
}
