/* eslint-disable */
// Expand the emi-calculator entry (top keyword, 74K monthly) with more sections.
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'tools.json');

const EXTRA_SECTIONS = [
  {
    heading: 'Why your EMI matters — planning, not just paying',
    content: 'The EMI you commit to decides how much of your income is locked for the next 3, 5, or 20 years. Most financial advisors recommend keeping all EMIs combined under 40% of net monthly income, and home-loan EMI specifically under 30%. Before any loan, run three scenarios in this calculator: optimistic (current income), conservative (80% income), and crisis (50% income). If the EMI still fits the crisis scenario, the loan is safe. If it only fits the optimistic scenario, you are one job loss away from default.'
  },
  {
    heading: 'Interest rate — the biggest lever',
    content: 'Interest rate has the largest impact on total cost. On a Rs. 30 lakh home loan for 20 years, the difference between 8% and 9% is roughly Rs. 4.3 lakh in total interest — enough to buy a small car. Even 0.25% matters. When comparing loans, always look at the Annual Percentage Rate (APR) that includes processing fees and insurance, not just the headline interest rate. A 8.5% loan with 1% fee often costs more than an 8.75% loan with zero fee.'
  },
  {
    heading: 'Tenure — the hidden trap',
    content: 'Lenders love long tenures because they maximize interest revenue. A 30-year home loan has a barely-lower EMI than a 20-year loan but costs 70% to 100% more in total interest. Example: Rs. 30 lakh at 8.5% — 20-year EMI is Rs. 26,035 with total interest of Rs. 32.5 lakh; 30-year EMI is Rs. 23,070 with total interest of Rs. 53 lakh. The Rs. 3,000 monthly saving costs you Rs. 20.5 lakh over the loan. Choose the shortest tenure your budget can support.'
  },
  {
    heading: 'Amortization — why early EMIs are mostly interest',
    content: 'In the first year of a 20-year home loan at 8.5%, roughly 82% of each EMI goes to interest and only 18% reduces principal. By year 10, the split is nearly 50-50. By year 19, almost the full EMI is principal. This front-loaded interest structure is why prepayments in the first 5 to 7 years save dramatically more interest than later prepayments. Our calculator shows this breakdown month by month so you can plan prepayments strategically.'
  },
  {
    heading: 'How prepayments save massive interest',
    content: 'A one-time Rs. 2 lakh prepayment on a Rs. 30 lakh, 20-year, 8.5% home loan in year 2 saves about Rs. 4.5 lakh in total interest and shortens the loan by 2 years. The same prepayment in year 15 saves only Rs. 40,000. Annual prepayment of just one extra EMI typically cuts 4 to 5 years off a 20-year loan. Use our calculator to test different prepayment schedules and see exact interest savings.'
  },
  {
    heading: 'Fixed vs floating interest rates',
    content: 'Fixed-rate loans lock the rate for the full tenure (or a portion). Floating-rate loans reset every 3 months based on the lender\'s external benchmark (usually the RBI repo rate). Fixed rates are typically 1% to 2% higher than floating at the start. In a rising-rate environment, fixed looks attractive; in a falling-rate environment, floating wins. Most home loans in India are floating. Short-term personal and car loans are usually fixed.'
  },
  {
    heading: 'Processing fees and hidden costs',
    content: 'Typical processing fee on a home loan is 0.25% to 1% of the loan amount. Car and personal loans charge 1% to 3%. Additional costs can include legal appraisal fees, stamp duty on the mortgage deed, insurance premium, and convenience charges. Always ask the lender for the total outgo before disbursement — the real cost can be 1% to 2% higher than the interest rate alone suggests.'
  },
  {
    heading: 'Credit score — the rate you are offered',
    content: 'Your CIBIL score directly affects the interest rate you get. A score above 800 usually gets the lowest advertised rate. 750 to 800 gets standard pricing. 700 to 750 may add 0.5% to 1%. Below 700, many banks decline, and NBFCs charge 2% to 4% extra. Before applying, check your score for free (CIBIL, Equifax, Experian provide one free report per year) and fix any errors. Bringing your score from 720 to 780 can save Rs. 3 to 5 lakh on a typical home loan.'
  },
  {
    heading: 'Top-up, balance transfer, and refinance',
    content: 'If you are in the first half of your loan tenure and another bank offers a 0.5% lower rate, a balance transfer can save lakhs even after paying the transfer fees. A top-up loan is an additional loan against an existing home loan at nearly the same rate — cheaper than a personal loan. Refinancing into a lower-rate loan 5 to 10 years into a 20-year mortgage is one of the highest-ROI financial moves most homeowners can make.'
  },
  {
    heading: 'Calculator limitations and real-world adjustments',
    content: 'This calculator uses standard formulas, but real EMIs can differ slightly due to lender-specific compounding conventions, rounding rules, and the exact date of disbursement. For under-construction properties, pre-EMI interest during construction adds to your cash outflow. For step-up loans (EMI increases yearly), use the step-up variant. For loans with moratoriums, interest accrues during the moratorium and is capitalized. Always match the calculator output against the lender\'s Sanction Letter before signing.'
  }
];

function main() {
  const raw = fs.readFileSync(FILE, 'utf-8');
  const tools = JSON.parse(raw);
  const tool = tools.find((t) => t.slug === 'emi-calculator');
  if (!tool) {
    console.error('emi-calculator not found');
    process.exit(1);
  }

  tool.content = tool.content || {};
  tool.content.sections = tool.content.sections || [];

  const existing = new Set(tool.content.sections.map((s) => s.heading.toLowerCase().trim()));
  let added = 0;
  for (const section of EXTRA_SECTIONS) {
    if (existing.has(section.heading.toLowerCase().trim())) continue;
    tool.content.sections.push(section);
    added += 1;
  }

  fs.writeFileSync(FILE, JSON.stringify(tools, null, 2) + '\n');
  console.log(`Added ${added} sections. emi-calculator now has ${tool.content.sections.length} sections.`);
}

main();
