'use client';

import dynamic from 'next/dynamic';
import EmiCalculator from '@/app/components/EmiCalculator';

const SimpleInterestCalculator = dynamic(() => import('@/app/components/SimpleInterestCalculator'));
const CompoundInterestCalculator = dynamic(() => import('@/app/components/CompoundInterestCalculator'));
const LoanEligibilityCalculator = dynamic(() => import('@/app/components/LoanEligibilityCalculator'));
const PersonalLoanCalculator = dynamic(() => import('@/app/components/PersonalLoanCalculator'));
const CreditCardEmiCalculator = dynamic(() => import('@/app/components/CreditCardEmiCalculator'));
const SipCalculator = dynamic(() => import('@/app/components/SipCalculator'));
const LumpsumCalculator = dynamic(() => import('@/app/components/LumpsumCalculator'));
const MutualFundCalculator = dynamic(() => import('@/app/components/MutualFundCalculator'));
const FdCalculator = dynamic(() => import('@/app/components/FdCalculator'));
const RdCalculator = dynamic(() => import('@/app/components/RdCalculator'));
const PpfCalculator = dynamic(() => import('@/app/components/PpfCalculator'));
const NpsCalculator = dynamic(() => import('@/app/components/NpsCalculator'));
const IncomeCalculator = dynamic(() => import('@/app/components/IncomeCalculator'));
const GstCalculator = dynamic(() => import('@/app/components/GstCalculator'));
const SalaryCalculator = dynamic(() => import('@/app/components/SalaryCalculator'));
const GratuityCalculator = dynamic(() => import('@/app/components/GratuityCalculator'));
const HraCalculator = dynamic(() => import('@/app/components/HraCalculator'));
const IFSCLookup = dynamic(() => import('@/app/components/IFSCLookup'));
const EpfCalculator = dynamic(() => import('@/app/components/EpfCalculator'));
const SukanyaSamriddhiCalculator = dynamic(() => import('@/app/components/SukanyaSamriddhiCalculator'));
const SwpCalculator = dynamic(() => import('@/app/components/SwpCalculator'));
const CagrCalculator = dynamic(() => import('@/app/components/CagrCalculator'));
const StepUpSipCalculator = dynamic(() => import('@/app/components/StepUpSipCalculator'));
const LoanPrepaymentCalculator = dynamic(() => import('@/app/components/LoanPrepaymentCalculator'));
const RetirementCalculator = dynamic(() => import('@/app/components/RetirementCalculator'));
const InflationCalculator = dynamic(() => import('@/app/components/InflationCalculator'));

/**
 * Slug -> calculator routing.
 *
 * This is a client component on purpose: next/dynamic only emits a separate
 * webpack chunk per calculator when the dynamic() call lives in the client
 * graph. Declaring the same map in a server component pulls all 27 calculators
 * into the single /tools/[slug] page chunk (~224 KB) because they all end up in
 * that route's client-reference manifest.
 *
 * It is also rendered outside any Suspense boundary. The previous version sat
 * inside one that also contained <Analytics /> from @vercel/analytics/next;
 * that component calls useSearchParams(), which forces its nearest boundary
 * into a client-side-rendering bailout, so every tool page hydrated to a
 * permanent "Loading calculator..." fallback with the real calculator hidden.
 *
 * Slugs not listed here (bank- and loan-type variants such as sbi-, hdfc-,
 * home-loan-, bike-loan-) fall back to the generic EMI calculator.
 */
const CALCULATORS: Record<string, React.ComponentType<{ toolName?: string }>> = {
  'simple-interest-calculator': SimpleInterestCalculator,
  'compound-interest-calculator': CompoundInterestCalculator,
  'loan-eligibility-calculator': LoanEligibilityCalculator,
  'personal-loan-calculator': PersonalLoanCalculator,
  'personal-loan-emi-calculator': PersonalLoanCalculator,
  'credit-card-emi-calculator': CreditCardEmiCalculator,
  'sip-calculator': SipCalculator,
  'lumpsum-investment-calculator': LumpsumCalculator,
  'mutual-fund-return-calculator': MutualFundCalculator,
  'fd-calculator': FdCalculator,
  'rd-calculator': RdCalculator,
  'ppf-calculator': PpfCalculator,
  'nps-calculator': NpsCalculator,
  'income-tax-calculator': IncomeCalculator,
  'gst-calculator': GstCalculator,
  'salary-calculator': SalaryCalculator,
  'gratuity-calculator': GratuityCalculator,
  'hra-calculator': HraCalculator,
  'ifsc-code-finder': IFSCLookup,
  'epf-calculator': EpfCalculator,
  'sukanya-samriddhi-yojana-calculator': SukanyaSamriddhiCalculator,
  'swp-calculator': SwpCalculator,
  'cagr-calculator': CagrCalculator,
  'step-up-sip-calculator': StepUpSipCalculator,
  'home-loan-prepayment-calculator': LoanPrepaymentCalculator,
  'retirement-calculator': RetirementCalculator,
  'inflation-calculator': InflationCalculator,
};

export default function CalculatorFor({
  slug,
  toolName,
  initialRate = 8.5,
}: {
  slug: string;
  toolName: string;
  initialRate?: number;
}) {
  const Calculator = CALCULATORS[slug];

  if (Calculator) {
    return <Calculator toolName={toolName} />;
  }
  return <EmiCalculator toolName={toolName} initialRate={initialRate} />;
}
