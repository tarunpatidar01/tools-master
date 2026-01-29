export interface EMIResult {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  principal: number;
  schedule: EMISchedule[];
}

export interface EMISchedule {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export const calculateEMI = (
  principal: number,
  annualRate: number,
  monthlyRate: number,
  months: number
): EMIResult => {
  const r = monthlyRate / 100;
  const n = months;
  const p = principal;

  if (r === 0) {
    const emi = principal / months;
    const totalAmount = principal;
    const totalInterest = 0;
    const schedule: EMISchedule[] = [];

    for (let i = 1; i <= months; i++) {
      const balance = principal - (emi * i);
      schedule.push({
        month: i,
        emi,
        principal: emi,
        interest: 0,
        balance: Math.max(0, balance),
      });
    }

    return { emi, totalAmount, totalInterest, principal, schedule };
  }

  const numerator = p * r * Math.pow(1 + r, n);
  const denominator = Math.pow(1 + r, n) - 1;
  const emi = numerator / denominator;

  const totalAmount = emi * months;
  const totalInterest = totalAmount - principal;

  const schedule: EMISchedule[] = [];
  let balance = principal;

  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principalPay = emi - interest;
    balance -= principalPay;

    schedule.push({
      month: i,
      emi: parseFloat(emi.toFixed(2)),
      principal: parseFloat(principalPay.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
      balance: parseFloat(Math.max(0, balance).toFixed(2)),
    });
  }

  return {
    emi: parseFloat(emi.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    principal,
    schedule,
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(Math.round(value));
};
