/* eslint-disable */
// Adds targeted FAQ entries to every tool lacking them.
// Run: node scripts/add-tool-faqs.js
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'tools.json');

const GENERIC_FAQ = (tool) => [
  {
    question: `Is the ${tool.keyword} free to use?`,
    answer: `Yes, the ${tool.keyword} is 100% free with no signup, no hidden charges, and no usage limits. It works on mobile and desktop.`
  },
  {
    question: `How accurate is this ${tool.keyword}?`,
    answer: `Results are calculated using standard formulas used by Indian banks and financial institutions. The output is accurate for planning and comparison, though actual amounts may vary slightly based on bank-specific rounding, processing fees, and other charges.`
  },
  {
    question: `Do I need to download any software?`,
    answer: `No. The ${tool.keyword} runs entirely in your browser. There is no app to install, no signup, and nothing to download. Your inputs stay on your device.`
  },
  {
    question: `Can I use the ${tool.keyword} on mobile?`,
    answer: `Yes, the tool is fully responsive and designed to work on any smartphone or tablet as well as desktops. All features including charts and detailed breakdowns work on mobile.`
  }
];

const SPECIFIC_FAQS = {
  'emi-calculator': [
    { question: 'What is the EMI calculation formula?', answer: 'The reducing balance EMI formula is EMI = P × R × (1 + R)^N ÷ ((1 + R)^N − 1), where P is the principal amount, R is the monthly interest rate (annual rate divided by 12 and by 100), and N is the total number of monthly installments.' },
    { question: 'Does this calculator handle prepayments?', answer: 'Yes, you can simulate prepayments to see how they reduce future interest and shorten the loan tenure. Prepayments in the early years save dramatically more interest than later ones.' },
    { question: 'What is the difference between flat and reducing rate?', answer: 'Flat rate charges interest on the full original principal throughout the tenure. Reducing rate charges interest only on the outstanding balance, which decreases each month. A 12% flat rate is roughly equivalent to a 21% reducing rate — always ask which one a lender is quoting.' },
    { question: 'Can I include processing fees in the calculation?', answer: 'Yes, add the processing fee and any one-time charges to the loan amount before calculating. This gives you the true cost of the loan including upfront charges.' }
  ],
  'home-loan-emi-calculator': [
    { question: 'What is the current home loan interest rate in India?', answer: 'Home loan interest rates in 2026 range from 7% to 9% per annum depending on the lender and your credit profile. Public-sector banks like SBI, Bank of Baroda, and Canara Bank offer the most competitive rates, while NBFCs charge 1% to 2% higher.' },
    { question: 'How much home loan can I get on my salary?', answer: 'Most banks offer a home loan of 60 to 72 times your net monthly salary, subject to an EMI-to-income ratio under 40% to 50%. A person earning Rs. 1 lakh per month can usually get a Rs. 60 to 75 lakh home loan.' },
    { question: 'What is the maximum home loan tenure?', answer: 'Most lenders offer up to 30-year tenures, though the final tenure is capped by your age at loan maturity (typically 60 for salaried, 65 for self-employed).' },
    { question: 'Are home loan EMIs tax-deductible?', answer: 'Under the old tax regime, principal repayment qualifies under Section 80C up to Rs. 1.5 lakh, and interest qualifies under Section 24(b) up to Rs. 2 lakh for self-occupied property. First-time buyers may claim an additional Rs. 1.5 lakh under Section 80EEA.' }
  ],
  'car-loan-emi-calculator': [
    { question: 'What is the minimum down payment for a car loan?', answer: 'Most banks require 10% to 20% of the on-road price as down payment. Some banks offer 100% financing to salaried customers with strong credit profiles, but at a slightly higher interest rate.' },
    { question: 'What is the typical car loan interest rate?', answer: 'Car loan rates in 2026 range from 8.5% to 12% per annum. Public-sector banks offer the lowest rates starting around 8.75%, while NBFCs charge 11% to 14%.' },
    { question: 'Can I prepay my car loan without penalty?', answer: 'RBI has restricted prepayment penalties on floating-rate loans to individual borrowers. Fixed-rate car loans may still carry a 2% to 5% prepayment charge. Most banks allow partial prepayment after 6 months.' },
    { question: 'Is a car loan EMI tax-deductible?', answer: 'Not for salaried individuals using the car for personal purposes. Self-employed professionals can claim the interest as a business expense and also claim depreciation on the vehicle, reducing the effective cost substantially.' }
  ],
  'personal-loan-calculator': [
    { question: 'What is the interest rate for a personal loan?', answer: 'Personal loan rates range from 10.5% to 24% per annum. Top banks like SBI, HDFC, ICICI, and Axis offer 10.5% to 15% for salaried applicants with a credit score above 750. NBFCs and fintech lenders charge 15% to 24%.' },
    { question: 'What is the maximum personal loan tenure?', answer: 'Personal loans typically offer tenures of 12 to 60 months (sometimes up to 7 years). A shorter tenure means higher EMI but substantially lower total interest.' },
    { question: 'Can I get a personal loan with a low credit score?', answer: 'A credit score above 750 gets the best rates. Scores between 700 and 750 get standard rates. Below 700, most banks reject the application or offer loans at a 2% to 4% higher rate via NBFCs.' },
    { question: 'Are there prepayment charges on personal loans?', answer: 'RBI has prohibited prepayment penalties on floating-rate personal loans to individuals. Fixed-rate loans may still carry a 2% to 5% charge. Prepaying early in the tenure saves the most interest.' }
  ],
  'sip-calculator': [
    { question: 'What is the minimum SIP amount?', answer: 'Most mutual fund SIPs start at Rs. 500 per month. Some funds allow SIPs as low as Rs. 100. There is no upper limit.' },
    { question: 'What return should I assume in a SIP calculator?', answer: 'For equity mutual fund SIPs, use 11% to 13% as a long-term expected return. For debt fund SIPs, use 6% to 8%. For hybrid funds, 9% to 11%. Past returns are not guaranteed.' },
    { question: 'How is SIP different from lump sum investing?', answer: 'A SIP invests a fixed amount monthly, averaging cost over time (rupee-cost averaging). A lump sum invests everything at once, which earns more if markets rise but loses more if they fall. SIPs are better for volatile markets and disciplined investing.' },
    { question: 'Are SIP returns taxable?', answer: 'Equity mutual fund gains held beyond 12 months are taxed at 12.5% LTCG beyond Rs. 1.25 lakh per year. Short-term gains are taxed at 20%. Debt fund SIP gains are taxed at your income-tax slab rate.' }
  ],
  'fd-calculator': [
    { question: 'What is the current FD interest rate in India?', answer: 'Regular FD rates in 2026 range from 5.5% to 7.5% for tenures of 1 to 5 years. Senior citizens earn an extra 0.25% to 0.75%. Small finance banks offer 7.5% to 9% on select tenures.' },
    { question: 'How is FD interest compounded?', answer: 'Most bank FDs in India compound interest quarterly. A cumulative FD reinvests the interest and pays the total at maturity. A non-cumulative FD pays interest monthly, quarterly, half-yearly, or yearly without reinvesting.' },
    { question: 'Is FD interest tax-free?', answer: 'No. FD interest is fully taxable as Income from Other Sources. Banks deduct 10% TDS if total FD interest across their branches exceeds Rs. 40,000 per year (Rs. 50,000 for senior citizens under Section 80TTB).' },
    { question: 'Can I break my FD before maturity?', answer: 'Yes, most banks allow premature withdrawal after 7 days with a penalty of 0.5% to 1% on the applicable rate. Tax-saving 5-year FDs under Section 80C cannot be broken before maturity.' }
  ],
  'rd-calculator': [
    { question: 'What is a Recurring Deposit (RD)?', answer: 'An RD is a savings scheme where you deposit a fixed amount every month for a chosen tenure (6 months to 10 years) and receive the principal plus compounded interest at maturity.' },
    { question: 'How is RD interest calculated?', answer: 'RD interest is compounded quarterly on each monthly installment. Maturity value = sum of ((each installment × (1 + r/4)^(4 × remaining years))). Our calculator automates this for any RD amount, rate, and tenure.' },
    { question: 'Is RD better than FD?', answer: 'RDs suit people with monthly surplus wanting to build a corpus; FDs suit those with a lump sum. Effective RD returns are slightly lower than FDs because most of your money is invested for less time.' },
    { question: 'Can I withdraw RD early?', answer: 'Yes, with a penalty. Early closure usually reduces the interest rate by 0.5% to 1%. Some banks allow partial withdrawal; most require full closure.' }
  ],
  'ppf-calculator': [
    { question: 'What is the current PPF interest rate?', answer: 'PPF currently pays 7.1% per annum, compounded yearly. The rate is reviewed every quarter by the government.' },
    { question: 'What is the PPF maturity period?', answer: 'PPF matures after 15 full financial years. After maturity, you can extend the account in 5-year blocks with or without contributions.' },
    { question: 'What are the tax benefits of PPF?', answer: 'PPF enjoys Exempt-Exempt-Exempt (EEE) status. Contributions up to Rs. 1.5 lakh per year qualify for Section 80C deduction (old regime), annual interest is tax-free, and the maturity amount is fully tax-free.' },
    { question: 'Can I withdraw from PPF before maturity?', answer: 'Partial withdrawal is allowed from the 7th financial year onwards, up to 50% of the balance at the end of the 4th year preceding the withdrawal year.' }
  ],
  'nps-calculator': [
    { question: 'What is NPS?', answer: 'NPS (National Pension System) is a government-backed retirement savings scheme regulated by PFRDA. It invests contributions across equity, corporate debt, and government securities based on your chosen allocation.' },
    { question: 'What is the tax benefit of NPS?', answer: 'NPS contributions qualify under Section 80C (within the Rs. 1.5 lakh limit) plus an additional Rs. 50,000 deduction under Section 80CCD(1B). Employer NPS contributions up to 10% of basic salary qualify under 80CCD(2), over and above.' },
    { question: 'When can I withdraw from NPS?', answer: 'At age 60, you can withdraw up to 60% of the corpus tax-free as lump sum; the remaining 40% must be used to buy an annuity. Partial early withdrawal is allowed after 3 years for specified purposes (education, housing, medical).' },
    { question: 'What return does NPS offer?', answer: 'Long-term NPS returns depend on your asset allocation. Equity-heavy portfolios (up to 75% equity) have historically returned 10% to 12% annually. Government-security-heavy portfolios return 7% to 9%.' }
  ],
  'income-tax-calculator': [
    { question: 'Which tax regime should I choose — old or new?', answer: 'The new regime is better if your total deductions (80C + 80D + HRA + home loan interest + NPS) are below about Rs. 2.5 to 3 lakh. The old regime wins if you claim all available deductions. Use our calculator to compute tax under both.' },
    { question: 'What is the Section 87A tax rebate?', answer: 'Under the new regime, total tax is zero for income up to Rs. 7 lakh due to the Section 87A rebate. Under the old regime, the rebate applies up to Rs. 5 lakh of total income.' },
    { question: 'Is the standard deduction available under the new regime?', answer: 'Yes, from FY 2024-25 onwards, salaried taxpayers can claim a Rs. 75,000 standard deduction under the new regime (Rs. 50,000 under the old regime).' },
    { question: 'Can I switch between tax regimes every year?', answer: 'Salaried individuals without business income can switch between old and new regimes every financial year. Those with business or professional income can switch only once and then must stick with the choice.' }
  ],
  'gst-calculator': [
    { question: 'What are the GST slab rates in India?', answer: 'GST has five main slabs: 0% (essentials), 5% (packaged food, economy air tickets), 12% (processed food), 18% (most goods and services), and 28% (luxury and sin goods). A cess may apply on top of 28% for certain items.' },
    { question: 'How do I calculate GST on a price?', answer: 'For forward calculation (base to inclusive): GST amount = base × rate ÷ 100, total = base + GST. For reverse (inclusive to base): base = inclusive × 100 ÷ (100 + rate). Our calculator handles both modes.' },
    { question: 'What is the difference between CGST, SGST, and IGST?', answer: 'For intra-state sales, GST splits equally into Central GST (CGST) and State GST (SGST). For inter-state sales, a single Integrated GST (IGST) is charged. An 18% intra-state invoice is 9% CGST + 9% SGST.' },
    { question: 'When is GST registration mandatory?', answer: 'Registration is mandatory if annual turnover exceeds Rs. 40 lakh for goods (Rs. 20 lakh for special-category states) or Rs. 20 lakh for services. It is also mandatory for inter-state suppliers and e-commerce sellers regardless of turnover.' }
  ],
  'salary-calculator': [
    { question: 'What is the difference between CTC and in-hand salary?', answer: 'CTC (Cost to Company) is the total annual cost including salary, bonuses, employer PF contribution, gratuity, and insurance. In-hand salary is the monthly amount credited to your bank account after employee PF, professional tax, and income tax (TDS).' },
    { question: 'How much is typically deducted from gross salary?', answer: 'Typical deductions are employee PF (12% of basic), professional tax (Rs. 200 per month in most states), and income tax via TDS. Together these can reduce gross salary by 15% to 25% depending on your tax slab and declared investments.' },
    { question: 'How do I maximize my in-hand salary?', answer: 'Choose tax-friendly salary components like employer NPS contribution, meal coupons, telephone/internet reimbursements, LTA (old regime), and a company-leased car. Compare both tax regimes before declaring your preferred regime at the start of the year.' },
    { question: 'Is HRA taxable?', answer: 'HRA is partially exempt under the old regime: the minimum of (actual HRA, 50% of basic in metros or 40% in non-metros, or rent paid minus 10% of basic) is exempt. Under the new regime, HRA is fully taxable.' }
  ],
  'simple-interest-calculator': [
    { question: 'What is simple interest?', answer: 'Simple interest is calculated only on the original principal throughout the term. Formula: SI = P × R × T ÷ 100, where P is principal, R is annual rate, and T is time in years.' },
    { question: 'Where is simple interest used?', answer: 'Simple interest is common in short-term loans, some government securities, cash credit facilities, and certain student loans. Most consumer loans in India use reducing balance (compound) interest.' },
    { question: 'Is simple interest better than compound interest for borrowers?', answer: 'Yes — for the same rate and tenure, simple interest costs less than compound interest. But few modern loans use simple interest, so this mostly applies to short-term or specialty products.' }
  ],
  'compound-interest-calculator': [
    { question: 'What is compound interest?', answer: 'Compound interest is interest on the principal plus all previously accumulated interest. Formula: A = P × (1 + r/n)^(n × t), where P is principal, r is annual rate, n is compounding frequency, and t is years.' },
    { question: 'How does compounding frequency affect returns?', answer: 'More frequent compounding (monthly vs yearly) produces higher returns for the same annual rate. An 8% rate compounded monthly yields an effective 8.30% annual return, compared to 8% with yearly compounding.' },
    { question: 'Why is compound interest called the eighth wonder?', answer: 'Because it produces exponential (not linear) growth. Rs. 10,000 invested at 12% grows to Rs. 31,000 in 10 years, Rs. 97,000 in 20 years, and Rs. 3 lakh in 30 years — tripling in each successive decade.' }
  ],
  'ifsc-code-finder': [
    { question: 'Is the IFSC Code Finder free?', answer: 'Yes, the tool is 100% free with no signup and no usage limits.' },
    { question: 'Are the IFSC results real-time?', answer: 'Yes. Each IFSC lookup queries a live database to show current bank, branch, address, and payment-network support — including updates after bank mergers.' },
    { question: 'Why does the tool say IFSC not found?', answer: 'Most commonly it is a typo — the fifth character must be the digit zero, not the letter O. Some branches have been merged post-2020 and their old IFSC discontinued.' },
    { question: 'Can I search by bank name and city?', answer: 'Yes — use the "By Bank & Location" tab to pick a bank, state, and filter by city or branch name to find the IFSC without knowing the code.' }
  ]
};

function main() {
  const raw = fs.readFileSync(FILE, 'utf-8');
  const tools = JSON.parse(raw);

  let added = 0;
  for (const tool of tools) {
    tool.content = tool.content || {};
    const existing = Array.isArray(tool.content.faq) ? tool.content.faq : [];
    if (existing.length >= 3) continue;

    const targeted = SPECIFIC_FAQS[tool.slug];
    const faq = targeted && targeted.length >= 3 ? targeted : GENERIC_FAQ(tool);

    const existingQs = new Set(existing.map((f) => f.question.toLowerCase().trim()));
    const merged = [...existing];
    for (const f of faq) {
      if (existingQs.has(f.question.toLowerCase().trim())) continue;
      merged.push(f);
    }
    tool.content.faq = merged;
    added += 1;
    console.log(`  ${tool.slug}: ${merged.length} FAQs`);
  }

  fs.writeFileSync(FILE, JSON.stringify(tools, null, 2) + '\n');
  console.log(`Done. Added/expanded FAQs on ${added} tools.`);
}

main();
