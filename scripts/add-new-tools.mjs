/**
 * One-off migration: appends the eight new calculators to data/tools.json.
 *
 * Idempotent — re-running it will not create duplicates. Kept in the repo so
 * the provenance of these entries is reviewable alongside the components.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'data/tools.json');
const tools = JSON.parse(readFileSync(path, 'utf8'));

const NEW_TOOLS = [
  {
    keyword: 'EPF Calculator',
    hindi: 'ईपीएफ कैलकुलेटर',
    monthlySearches: 60500,
    category: 'Savings',
    slug: 'epf-calculator',
    title: 'EPF Calculator — Employee Provident Fund Maturity & Interest',
    description:
      'Calculate your EPF corpus at retirement with employer contribution, EPS diversion, annual salary hikes and the current 8.25% EPFO interest rate.',
    content: {
      h1: 'EPF Calculator',
      h2: 'Project your Employee Provident Fund balance at retirement',
      sections: [
        {
          heading: 'What is EPF and who contributes to it?',
          content:
            'The Employees’ Provident Fund is a mandatory retirement savings scheme for salaried employees at establishments with 20 or more workers. You contribute 12% of your basic salary plus dearness allowance every month, and your employer contributes a matching 12%. The money sits in an account managed by the EPFO and earns interest declared annually by the government. For most salaried Indians this is the single largest retirement asset they will ever own, and it accumulates almost invisibly through payroll deduction.',
        },
        {
          heading: 'The employer contribution is not what you think',
          content:
            'This is the detail most EPF calculators get wrong. Your employer does contribute 12%, but only part of it reaches your provident fund. Of the employer’s share, 8.33% is diverted to the Employees’ Pension Scheme (EPS), capped at 8.33% of the statutory wage ceiling of Rs. 15,000 — a maximum of Rs. 1,250 a month. Only the remainder lands in your EPF account and earns interest. The EPS portion comes back to you as a monthly pension after 58, not as a lump sum, so it should never be counted inside your EPF corpus. This calculator separates the two so you see the real number.',
        },
        {
          heading: 'How EPF interest is calculated',
          content:
            'Interest is computed on the monthly running balance at the rate declared by the EPFO for that financial year, and credited at the end of the year. The rate has moved between 8.10% and 8.65% over the past decade and stands at 8.25% for FY 2024-25. Because it is compounded on a growing balance while your salary also rises, the corpus curve is steeper than most people expect — the last ten years of a 30-year career typically contribute more than the first twenty combined.',
        },
        {
          heading: 'Should you raise your contribution with VPF?',
          content:
            'The Voluntary Provident Fund lets you contribute more than the statutory 12% of basic, up to 100%, at the same interest rate. The employer is not obliged to match the extra. VPF is compelling for conservative savers: it beats almost every fixed deposit on post-tax return, carries sovereign backing, and qualifies for Section 80C. The catch is liquidity — the money is locked until you leave employment, and since April 2021 interest on contributions above Rs. 2.5 lakh a year is taxable. Model the higher rate in this calculator before committing.',
        },
        {
          heading: 'Withdrawal, tax and the 5-year rule',
          content:
            'EPF is an EEE instrument: contributions are deductible under 80C, interest accrues tax-free, and maturity is tax-free — provided you complete five years of continuous service. Withdraw earlier and the entire amount becomes taxable, with TDS deducted at source. Transfers between employers preserve the service clock, so always transfer rather than withdraw when you switch jobs. Partial withdrawals are permitted for a house purchase, medical treatment, marriage and education, each with its own eligibility period.',
        },
        {
          heading: 'How to use this EPF calculator',
          content:
            'Enter your monthly basic salary plus DA — not your gross or CTC, since EPF is calculated only on basic and DA. Set your current age, the age at which you expect to retire, and a realistic annual increment. If you already have a balance, look it up on the EPFO member portal or your latest passbook and enter it, since existing money compounds for the entire remaining tenure and dominates the result. Adjust the interest rate to run a conservative scenario at 8% and an optimistic one at 8.5%.',
        },
      ],
      faq: [
        {
          question: 'Is EPF calculated on basic salary or gross salary?',
          answer:
            'On basic salary plus dearness allowance only. HRA, special allowance, bonus and reimbursements are excluded, which is why your EPF deduction looks small relative to your CTC.',
        },
        {
          question: 'What is the current EPF interest rate?',
          answer:
            'The EPFO declared 8.25% for FY 2024-25. The rate is reviewed every year by the Central Board of Trustees and notified by the Ministry of Labour, so it is not fixed for the life of your account.',
        },
        {
          question: 'Why is my employer contribution lower than mine in the result?',
          answer:
            'Because 8.33% of the employer share (up to Rs. 1,250 a month) is diverted to the EPS pension scheme rather than your provident fund. That money returns as a monthly pension after 58 instead of a lump sum.',
        },
        {
          question: 'Can I contribute more than 12% to EPF?',
          answer:
            'Yes, through the Voluntary Provident Fund, up to 100% of basic plus DA at the same interest rate. Your employer is not required to match it, and interest on your own contributions above Rs. 2.5 lakh a year is taxable.',
        },
        {
          question: 'Is EPF withdrawal taxable?',
          answer:
            'It is fully tax-free after five years of continuous service. Withdraw before that and the whole amount, including the employer share and all interest, becomes taxable in the year of withdrawal.',
        },
        {
          question: 'What happens to my EPF when I change jobs?',
          answer:
            'Transfer it to the new employer using your UAN. A transfer keeps your service period continuous for the five-year rule; withdrawing and restarting resets the clock and can make the withdrawal taxable.',
        },
      ],
    },
  },
  {
    keyword: 'Sukanya Samriddhi Yojana Calculator',
    hindi: 'सुकन्या समृद्धि योजना कैलकुलेटर',
    monthlySearches: 49500,
    category: 'Savings',
    slug: 'sukanya-samriddhi-yojana-calculator',
    title: 'Sukanya Samriddhi Yojana Calculator — SSY Maturity Amount',
    description:
      'Calculate the SSY maturity amount for your daughter at 8.2% interest. See year-wise growth across the 15-year deposit period and 21-year maturity.',
    content: {
      h1: 'Sukanya Samriddhi Yojana Calculator',
      h2: 'Work out the maturity amount for your daughter’s SSY account',
      sections: [
        {
          heading: 'What is the Sukanya Samriddhi Yojana?',
          content:
            'Sukanya Samriddhi Yojana is a government-backed savings scheme launched under the Beti Bachao Beti Padhao campaign, designed to fund a girl child’s education and marriage. A parent or guardian can open the account at any post office or authorised bank for a girl below the age of 10, and only one account per girl is allowed, with a maximum of two accounts per family. It carries one of the highest interest rates of any small savings scheme in India and is fully sovereign-backed.',
        },
        {
          heading: 'The 15-year and 21-year rule',
          content:
            'The scheme has two clocks running, and confusing them is the most common mistake. You deposit for 15 years from the date the account is opened. The account then continues to earn interest for a further six years without any deposits and matures 21 years after opening. Those last six silent years do a remarkable amount of work — with no fresh money going in, compounding alone typically adds a third of the final corpus. Closing the account early forfeits that.',
        },
        {
          heading: 'Deposit limits and the default rule',
          content:
            'The minimum deposit is Rs. 250 per financial year and the maximum is Rs. 1,50,000, matching the Section 80C ceiling. You can deposit in a lump sum or in instalments, with no restriction on the number of deposits. If you fail to deposit the Rs. 250 minimum in any year the account is classified as in default. It can be revived by paying Rs. 50 penalty per defaulted year plus the minimum deposit, but a defaulted account that is never revived still earns interest at the scheme rate until maturity.',
        },
        {
          heading: 'Interest rate and how it is applied',
          content:
            'SSY currently pays 8.2% per annum, compounded annually. The rate is reviewed every quarter by the Ministry of Finance and applies to the whole balance, not just new deposits, so a rate cut affects money already in the account. Interest is calculated on the lowest balance between the close of the fifth day and the end of the month, which is why depositing before the 5th of the month earns you a full month of interest rather than losing it.',
        },
        {
          heading: 'Tax treatment: the rare triple exemption',
          content:
            'SSY is one of only a handful of EEE instruments left in India. Deposits qualify for deduction under Section 80C up to Rs. 1.5 lakh, the interest accrues completely tax-free, and the maturity amount is tax-free in the hands of the girl. For a parent in the 30% bracket, an 8.2% tax-free return is equivalent to roughly 11.8% pre-tax — a return no fixed deposit or debt fund can match at comparable risk.',
        },
        {
          heading: 'Withdrawal and premature closure',
          content:
            'Up to 50% of the balance at the end of the previous financial year can be withdrawn once the girl turns 18 or passes class 10, whichever is earlier, and only for higher education with proof of admission. The account can be closed after she turns 18 if she is getting married, with closure permitted one month before to three months after the wedding. Premature closure on other grounds is allowed only in cases of the account holder’s death or documented medical hardship.',
        },
      ],
      faq: [
        {
          question: 'What is the current SSY interest rate?',
          answer:
            'Sukanya Samriddhi Yojana pays 8.2% per annum, compounded annually. The Ministry of Finance reviews small savings rates every quarter, and any revision applies to the full balance, not just new deposits.',
        },
        {
          question: 'How long do I need to deposit money into an SSY account?',
          answer:
            'For 15 years from the date the account is opened. The account then keeps earning interest for another six years and matures at the end of year 21, so no deposit is needed in those final years.',
        },
        {
          question: 'How much can I deposit in a year?',
          answer:
            'Between Rs. 250 and Rs. 1,50,000 per financial year, in as many instalments as you like. The upper limit aligns with the Section 80C deduction ceiling.',
        },
        {
          question: 'Can I open two SSY accounts for two daughters?',
          answer:
            'Yes. One account is permitted per girl child and a maximum of two per family, with an exception allowing a third if twins or triplets are born.',
        },
        {
          question: 'Is the SSY maturity amount taxable?',
          answer:
            'No. SSY has EEE status — deposits are deductible under 80C, interest accrues tax-free, and the entire maturity amount is tax-free in the girl’s hands.',
        },
        {
          question: 'What happens if I miss a yearly deposit?',
          answer:
            'The account is marked in default. Revive it by paying a Rs. 50 penalty for each defaulted year plus the Rs. 250 minimum. Even if never revived, the balance keeps earning interest until maturity.',
        },
      ],
    },
  },
  {
    keyword: 'SWP Calculator',
    hindi: 'एसडब्ल्यूपी कैलकुलेटर',
    monthlySearches: 40500,
    category: 'Investment',
    slug: 'swp-calculator',
    title: 'SWP Calculator — Systematic Withdrawal Plan Monthly Income',
    description:
      'Calculate how long your mutual fund corpus lasts under a systematic withdrawal plan. See total withdrawn, remaining balance and the safe withdrawal amount.',
    content: {
      h1: 'SWP Calculator',
      h2: 'See how long your corpus lasts under a systematic withdrawal plan',
      sections: [
        {
          heading: 'What is a Systematic Withdrawal Plan?',
          content:
            'A Systematic Withdrawal Plan is the mirror image of a SIP. Instead of putting a fixed amount into a mutual fund every month, you take a fixed amount out while the remaining corpus stays invested and keeps compounding. It is the standard way retirees and anyone needing predictable monthly cash flow draw from mutual funds, and it is far more tax-efficient than the alternatives most people default to.',
        },
        {
          heading: 'Why an SWP beats a dividend plan',
          content:
            'Before 2020 many investors used dividend (now IDCW) plans for regular income. Since the Finance Act 2020, IDCW payouts are added to your total income and taxed at your slab rate, so a retiree in the 30% bracket loses nearly a third of every payout. With an SWP you redeem units instead, and only the capital gain portion of each redemption is taxed — typically a small fraction of the withdrawal in the early years. You also control the amount and the date, which a dividend plan never guarantees.',
        },
        {
          heading: 'The withdrawal rate that decides everything',
          content:
            'The single number that determines whether your corpus survives is the withdrawal rate: annual withdrawal divided by corpus. Withdraw less than what the corpus earns and the balance grows indefinitely. Withdraw more and you are eating capital, and the depletion accelerates because there is less money left to generate returns. This calculator shows the break-even withdrawal — the monthly amount equal to the corpus’s monthly return — so you can see exactly where that line sits for your numbers.',
        },
        {
          heading: 'Sequence of returns risk',
          content:
            'The calculator assumes a steady return, but real markets do not deliver one. The order in which returns arrive matters enormously for an SWP. Two portfolios with identical average returns over 20 years can end in completely different places depending on whether the bad years came first or last. A 30% drawdown in year one, while you are also withdrawing, can permanently cripple a plan that would have survived the same crash in year fifteen. This is why withdrawal plans you actually depend on are usually built on debt or conservative hybrid funds rather than pure equity.',
        },
        {
          heading: 'How SWP withdrawals are taxed',
          content:
            'Each withdrawal is a redemption of units, and tax applies only to the gain embedded in those units. For equity funds, gains on units held over 12 months are long-term and taxed at 12.5% beyond the Rs. 1.25 lakh annual exemption; shorter holdings are taxed at 20%. Debt fund gains are taxed at your slab rate regardless of holding period. Because units are redeemed on a first-in-first-out basis, the oldest units go first, which usually means your earliest withdrawals qualify for the most favourable treatment.',
        },
        {
          heading: 'How to use this SWP calculator',
          content:
            'Enter the corpus you are starting with, the monthly amount you need, a realistic annual return for the fund category you are using, and the number of years you need the income to last. The calculator reports total withdrawn, what is left at the end, and warns you with the exact month if the corpus runs dry. Compare your desired withdrawal against the break-even figure; if it is meaningfully higher, either the corpus needs to be larger or the withdrawal smaller.',
        },
      ],
      faq: [
        {
          question: 'How much can I safely withdraw every month?',
          answer:
            'A withdrawal equal to the corpus’s monthly return leaves the capital untouched indefinitely. On Rs. 50 lakh earning 10% a year that is roughly Rs. 41,000 a month. Withdrawing more means drawing down capital, which this calculator will show you.',
        },
        {
          question: 'Is SWP better than a fixed deposit for monthly income?',
          answer:
            'Usually yes on tax and returns, but not on certainty. FD interest is taxed fully at slab rate every year; SWP taxes only the gain portion of each redemption. The trade-off is that an FD guarantees the payout while a fund’s value fluctuates.',
        },
        {
          question: 'How is SWP taxed?',
          answer:
            'Only the capital gain within each redemption is taxed, not the whole withdrawal. Equity funds held over a year attract 12.5% long-term capital gains tax above the Rs. 1.25 lakh annual exemption; debt fund gains are taxed at your slab rate.',
        },
        {
          question: 'Can I start an SWP and a SIP in the same fund?',
          answer:
            'Technically yes, but it is self-defeating — you would be paying transaction and tax costs to move money in and out of the same place. Use SIPs during accumulation and switch to an SWP when you need income.',
        },
        {
          question: 'What if the market crashes during my SWP?',
          answer:
            'Your fixed withdrawal redeems more units at a lower price, permanently reducing the corpus. This is sequence risk, and it is why income-critical SWPs are usually run on debt or hybrid funds rather than pure equity.',
        },
        {
          question: 'Can I change the withdrawal amount later?',
          answer:
            'Yes. Most fund houses let you stop, restart or modify the withdrawal amount at any time with no exit penalty beyond the fund’s normal exit load rules.',
        },
      ],
    },
  },
  {
    keyword: 'CAGR Calculator',
    hindi: 'सीएजीआर कैलकुलेटर',
    monthlySearches: 33100,
    category: 'Investment',
    slug: 'cagr-calculator',
    title: 'CAGR Calculator — Compound Annual Growth Rate of Investments',
    description:
      'Calculate the compound annual growth rate between any two values. Compare investments held for different periods and see the doubling time at that rate.',
    content: {
      h1: 'CAGR Calculator',
      h2: 'Find the annualised return between any two investment values',
      sections: [
        {
          heading: 'What CAGR actually measures',
          content:
            'Compound Annual Growth Rate is the single constant yearly rate that would have taken your investment from its starting value to its ending value over the holding period. It is a smoothing device: real returns arrive unevenly, and CAGR compresses that lumpy path into one comparable number. The formula is straightforward — divide the final value by the initial value, raise it to the power of one over the number of years, and subtract one.',
        },
        {
          heading: 'Why absolute return misleads you',
          content:
            'A fund advertising a 150% return sounds spectacular until you learn it took fifteen years, which works out to 6.3% a year — worse than a fixed deposit. Absolute return has no time dimension, so it cannot be compared across investments held for different periods. This is the most common way retail investors are misled by performance marketing, and converting to CAGR is the one-step fix. Any time someone quotes a total return without a period attached, the number is meaningless.',
        },
        {
          heading: 'What CAGR hides',
          content:
            'CAGR tells you nothing about the ride. Two investments can both compound at 12% while one moves in a straight line and the other swings between +60% and -40%. For an investor who might need to sell at a bad moment, or who will panic during a drawdown, that difference matters more than the average. Always look at CAGR alongside a volatility measure such as standard deviation or maximum drawdown before concluding two investments are equivalent.',
        },
        {
          heading: 'When to use XIRR instead',
          content:
            'CAGR assumes a single investment at the start and a single value at the end. The moment you add or withdraw money in between — as any SIP does — CAGR stops being valid, because it cannot account for the fact that later instalments were invested for less time. XIRR handles irregular cash flows and is the correct measure for SIPs, staggered purchases, or any portfolio you keep adding to. Use CAGR for lumpsums and single assets; use XIRR for everything else.',
        },
        {
          heading: 'The rule of 72 and doubling time',
          content:
            'Divide 72 by the CAGR and you get a close approximation of how many years the money takes to double. At 12% that is six years; at 8% it is nine; at 6% it is twelve. This shortcut is why small differences in return matter so much over long horizons — the gap between 8% and 12% is not a third more money at the end of thirty years, it is roughly three times more. This calculator shows the exact doubling time rather than the approximation.',
        },
        {
          heading: 'Realistic CAGR benchmarks in India',
          content:
            'For context when judging your own numbers: Indian large-cap equity indices have delivered roughly 11-13% CAGR over long periods, gold around 9-10%, residential real estate 6-9% before costs, fixed deposits 6-7%, and inflation has averaged about 6%. Any product marketed with a guaranteed CAGR far above these ranges deserves serious scrutiny, because sustained outperformance of that scale is rare and rarely comes without matching risk.',
        },
      ],
      faq: [
        {
          question: 'What is a good CAGR for an investment?',
          answer:
            'It depends on the asset class. Indian equity has historically compounded at roughly 11-13% a year over long periods, debt at 6-8%, and inflation at about 6%. Any return meaningfully below inflation is losing purchasing power regardless of how positive it looks.',
        },
        {
          question: 'What is the difference between CAGR and absolute return?',
          answer:
            'Absolute return is the total percentage gain with no reference to time. CAGR annualises that gain, which is the only way to compare investments held for different lengths of time. A 100% absolute return is 100% in one year but only about 7.2% a year over ten.',
        },
        {
          question: 'Can CAGR be negative?',
          answer:
            'Yes. If the final value is lower than what you started with, the CAGR is negative and represents the constant annual rate of loss over the holding period.',
        },
        {
          question: 'Should I use CAGR for my SIP returns?',
          answer:
            'No. CAGR assumes one investment at the start. Because each SIP instalment is invested for a different length of time, XIRR is the correct measure for SIP returns.',
        },
        {
          question: 'Does CAGR account for inflation?',
          answer:
            'No, it is a nominal figure. To get the real return, subtract inflation from the CAGR. A 10% CAGR with 6% inflation is roughly 4% of genuine purchasing-power growth.',
        },
        {
          question: 'How does the rule of 72 relate to CAGR?',
          answer:
            'Dividing 72 by the CAGR gives a close estimate of the years needed to double your money. It is accurate enough for mental arithmetic in the 6-15% range where most long-term returns fall.',
        },
      ],
    },
  },
  {
    keyword: 'Step-Up SIP Calculator',
    hindi: 'स्टेप-अप एसआईपी कैलकुलेटर',
    monthlySearches: 27100,
    category: 'Investment',
    slug: 'step-up-sip-calculator',
    title: 'Step-Up SIP Calculator — Top-Up SIP Returns with Annual Increase',
    description:
      'Calculate returns on a step-up SIP that rises every year with your salary. Compare the final corpus against a flat SIP and see the extra wealth created.',
    content: {
      h1: 'Step-Up SIP Calculator',
      h2: 'See what raising your SIP every year does to the final corpus',
      sections: [
        {
          heading: 'What is a step-up SIP?',
          content:
            'A step-up SIP, also called a top-up SIP, automatically increases your monthly investment by a fixed percentage every twelve months. Instead of investing Rs. 10,000 a month for twenty years, you invest Rs. 10,000 in year one, Rs. 11,000 in year two at a 10% step-up, and so on. Most fund houses let you register the increase once when you start the SIP, and the mandate raises itself without any further action from you.',
        },
        {
          heading: 'Why a flat SIP quietly shrinks',
          content:
            'A fixed Rs. 10,000 monthly SIP is not a constant commitment — it is a shrinking one. At 6% inflation, that Rs. 10,000 buys what Rs. 5,600 buys today after ten years, and about Rs. 3,100 after twenty. Meanwhile your salary has probably doubled. A flat SIP therefore represents a steadily falling share of your income, which is why long-term investors who never step up routinely fall short of goals they thought they had planned for.',
        },
        {
          heading: 'The size of the difference',
          content:
            'The effect is larger than most people expect. On a Rs. 10,000 SIP for twenty years at 12%, a 10% annual step-up roughly doubles the final corpus compared to keeping the instalment flat. The reason is that each increase compounds for all the remaining years, so an increase in year three has seventeen years to work. This also means step-ups you start early matter far more than ones you start late — adding 10% in the final three years barely moves the result.',
        },
        {
          heading: 'Choosing a step-up percentage',
          content:
            'The natural anchor is your expected annual salary increase, which for most salaried professionals in India runs between 8% and 12%. Setting the step-up at or slightly below your hike keeps your savings rate constant or gently rising without squeezing your lifestyle. Setting it above your hike means your savings rate climbs every year, which accelerates the corpus but needs to be checked against your actual cash flow before you commit to a twenty-year mandate.',
        },
        {
          heading: 'Step-up SIP versus starting with a bigger SIP',
          content:
            'If you can afford Rs. 15,000 a month today, investing Rs. 15,000 flat beats starting at Rs. 10,000 with a step-up, because every rupee gets maximum time to compound. The step-up is not a superior strategy in the abstract — it is the right strategy when your current income genuinely limits you but your future income will not. Its real value is behavioural: it commits your future raises to investing before lifestyle inflation absorbs them.',
        },
        {
          heading: 'How to use this calculator',
          content:
            'Enter the SIP you can start with today, the percentage you expect to raise it by each year, a realistic long-term return for the fund category, and the number of years you will keep investing. The calculator shows the final corpus, your total contribution including every increase, the last instalment you will be paying, and the extra wealth the step-up created over an equivalent flat SIP. Twelve percent is a reasonable long-term assumption for diversified equity; use 8-9% for hybrid and 6-7% for debt.',
        },
      ],
      faq: [
        {
          question: 'What step-up percentage should I choose?',
          answer:
            'Match it to your expected annual salary increase, typically 8-12% for salaried professionals in India. That keeps your savings rate constant in real terms without cutting into your lifestyle.',
        },
        {
          question: 'How much more does a step-up SIP generate?',
          answer:
            'On a twenty-year SIP at 12% returns, a 10% annual step-up roughly doubles the final corpus versus a flat instalment. The gap widens with the tenure because each increase compounds for all the remaining years.',
        },
        {
          question: 'Can I set up an automatic step-up with my fund house?',
          answer:
            'Yes. Most AMCs and platforms offer a top-up SIP that you register once at the start. The mandate raises itself annually, so no fresh instruction is needed each year.',
        },
        {
          question: 'Is a step-up SIP better than increasing my SIP manually?',
          answer:
            'The maths is identical; the difference is behavioural. An automatic step-up happens whether or not you remember, which is why it outperforms manual increases in practice.',
        },
        {
          question: 'Can I pause or reduce a step-up SIP?',
          answer:
            'Yes. You can pause, cancel or restart the SIP and modify the top-up percentage at any time. Nothing is locked in beyond the fund’s standard exit load rules.',
        },
        {
          question: 'Should I step up or just start with a larger amount?',
          answer:
            'If you can afford the larger amount today, invest it — earlier rupees compound longer. The step-up exists for the common case where your current income limits you but your future income will not.',
        },
      ],
    },
  },
  {
    keyword: 'Home Loan Prepayment Calculator',
    hindi: 'होम लोन प्रीपेमेंट कैलकुलेटर',
    monthlySearches: 22200,
    category: 'Loan',
    slug: 'home-loan-prepayment-calculator',
    title: 'Home Loan Prepayment Calculator — Interest Saved & Tenure Cut',
    description:
      'Calculate how much interest a part payment saves and how many years it cuts off your home loan. Compare a one-time lump sum against paying extra every month.',
    content: {
      h1: 'Home Loan Prepayment Calculator',
      h2: 'See exactly what a part payment saves you in interest and years',
      sections: [
        {
          heading: 'What prepayment actually does to your loan',
          content:
            'Every rupee you prepay goes straight against the outstanding principal, and since interest is charged on that outstanding balance, the saving compounds for the entire remaining tenure. This is why a Rs. 5 lakh part payment on a twenty-year home loan can save far more than Rs. 5 lakh in interest. The calculator replays your full amortisation schedule twice — once as scheduled and once with the prepayment applied — so the saving shown is the exact rupee difference, not an approximation.',
        },
        {
          heading: 'Why timing matters more than amount',
          content:
            'Home loan EMIs are heavily front-loaded with interest. In the first year of a twenty-year loan at 8.5%, roughly 80% of every EMI is interest and only 20% touches the principal. By year fifteen that ratio has inverted. A prepayment in year two therefore removes principal that would otherwise have accrued interest for eighteen more years, while the same amount in year fifteen only saves five years of interest. If you are choosing when to prepay, earlier is dramatically better — often worth two to three times as much.',
        },
        {
          heading: 'Reduce the tenure, not the EMI',
          content:
            'After a part payment your bank will ask whether you want a lower EMI or a shorter tenure. Reducing the tenure is almost always the better choice, because it keeps your monthly outflow the same while eliminating years of interest entirely. Reducing the EMI feels like relief but preserves the full remaining tenure, which means you keep paying interest for the original term and capture only a fraction of the benefit. Many banks default to tenure reduction, but confirm it in writing rather than assuming.',
        },
        {
          heading: 'Prepayment charges and what the RBI mandates',
          content:
            'The Reserve Bank of India prohibits prepayment or foreclosure charges on floating-rate loans sanctioned to individual borrowers, whatever the source of funds. This covers the vast majority of home loans in India. Fixed-rate loans are a different matter and can still carry a penalty of 2-5% of the amount prepaid, and loans taken in the name of a business entity are not protected either. Confirm which category yours falls into before making a large payment.',
        },
        {
          heading: 'The tax angle most people miss',
          content:
            'Section 24(b) allows a deduction of up to Rs. 2 lakh a year on home loan interest for a self-occupied property, and Section 80C covers principal repayment within the Rs. 1.5 lakh limit. Prepaying reduces your interest outgo, which also reduces the deduction you can claim. For someone in the 30% bracket paying more than Rs. 2 lakh in interest annually, the effective interest cost is lower than the headline rate, which narrows the case for aggressive prepayment. Compare the interest saved against the tax benefit forgone before deciding.',
        },
        {
          heading: 'Prepay or invest the money instead?',
          content:
            'Prepaying a loan is a guaranteed, risk-free return equal to your interest rate. At 8.5%, prepaying is equivalent to a risk-free 8.5% investment — better than any fixed deposit after tax. Equity might beat it over long horizons, but not with any guarantee, and the comparison should use your post-tax effective rate rather than the headline one. The honest answer for most borrowers is to keep an emergency fund intact first, then prepay, and only invest surplus beyond that.',
        },
      ],
      faq: [
        {
          question: 'Can banks charge a penalty for home loan prepayment?',
          answer:
            'Not on floating-rate loans taken by individual borrowers — the RBI prohibits it. Fixed-rate loans may still carry a 2-5% charge, and loans in a business entity’s name are not covered by the prohibition.',
        },
        {
          question: 'Should I reduce my EMI or my tenure after a part payment?',
          answer:
            'Reduce the tenure. It keeps your monthly outflow unchanged while eliminating years of interest entirely. Cutting the EMI keeps you in the loan for the original term and captures far less of the benefit.',
        },
        {
          question: 'When is the best time to prepay a home loan?',
          answer:
            'As early as possible. EMIs are front-loaded with interest, so a prepayment in year two of a twenty-year loan saves several times what the same amount saves in year fifteen.',
        },
        {
          question: 'Is it better to prepay my home loan or invest the money?',
          answer:
            'Prepaying gives a guaranteed return equal to your interest rate, which beats fixed deposits after tax. Equity may do better over long horizons but carries no guarantee. Keep your emergency fund intact before doing either.',
        },
        {
          question: 'Does prepayment affect my tax deductions?',
          answer:
            'Yes. Less interest paid means a smaller Section 24(b) deduction, capped at Rs. 2 lakh a year for a self-occupied home. Compare the interest saved against the tax benefit you give up.',
        },
        {
          question: 'How much interest can a part payment actually save?',
          answer:
            'It depends on the amount, your rate and how early you pay. On a Rs. 30 lakh loan at 8.5% for twenty years, a Rs. 5 lakh payment in year two typically saves over Rs. 10 lakh in interest and cuts several years off the tenure. Enter your own numbers above for the exact figure.',
        },
      ],
    },
  },
  {
    keyword: 'Retirement Calculator',
    hindi: 'रिटायरमेंट कैलकुलेटर',
    monthlySearches: 18100,
    category: 'Investment',
    slug: 'retirement-calculator',
    title: 'Retirement Calculator — Corpus Needed & Monthly SIP to Get There',
    description:
      'Calculate the retirement corpus you need after inflation and the monthly SIP required to build it. Accounts for existing savings and post-retirement returns.',
    content: {
      h1: 'Retirement Calculator',
      h2: 'Find the corpus you need and the SIP that gets you there',
      sections: [
        {
          heading: 'The two questions this calculator answers',
          content:
            'Retirement planning reduces to two numbers: how much you need on the day you stop working, and how much you must invest every month between now and then to get it. The first depends on your expenses, inflation and how long you expect to live. The second depends on the first, on what you have already saved, and on the return you can realistically earn. This calculator computes both, and separates them so you can see which assumption is driving your result.',
        },
        {
          heading: 'Why your current expenses are the wrong number',
          content:
            'The most common planning error is sizing a corpus against today’s expenses. If you spend Rs. 50,000 a month now and retire in thirty years, at 6% inflation that same lifestyle will cost about Rs. 2.87 lakh a month on the day you retire. Planning against Rs. 50,000 would leave you with roughly a sixth of what you need. This calculator inflates your expenses to the retirement date first, then sizes the corpus, which is why the figure it produces will look uncomfortably large at first glance.',
        },
        {
          heading: 'Real return is the number that matters',
          content:
            'After you retire, your corpus keeps earning, but your withdrawals keep rising with inflation. What determines whether the money lasts is the real return — the post-retirement return minus inflation. At 7% returns and 6% inflation, the real return is under 1%, which means the corpus is doing almost no work and you are essentially living off capital. Push the post-retirement return too high in your assumptions and the calculator will tell you that you need a comfortingly small corpus, which is exactly the kind of comfortable wrong answer that ruins retirements.',
        },
        {
          heading: 'Do not forget what you already have',
          content:
            'EPF, PPF, NPS, gratuity and any existing mutual fund holdings earmarked for retirement all count. Money you have already saved compounds for the entire period until you retire, so it does disproportionate work — Rs. 10 lakh today at 12% becomes roughly Rs. 3 crore in thirty years. Entering your existing corpus accurately usually reduces the required monthly SIP substantially, and omitting it is the second most common reason people conclude retirement is impossible and give up.',
        },
        {
          heading: 'Plan for a longer life than you expect',
          content:
            'Life expectancy in India is rising, and the relevant figure is not the national average but conditional life expectancy — how long someone who has already reached 60 tends to live. Planning to 85 is a reasonable baseline and planning to 90 is prudent. The asymmetry matters: over-saving means leaving money behind, while under-saving means running out at 82 with no income and no ability to return to work. When in doubt, extend the horizon.',
        },
        {
          heading: 'Revisit this every couple of years',
          content:
            'A retirement plan built on assumptions about thirty years of salary growth, inflation and returns will drift. Salaries jump, expenses expand with children and housing, inflation regimes shift, and market returns come in above or below expectation. Re-running this calculator every two or three years and adjusting your SIP is far more effective than getting the initial assumptions perfect. The plan that gets reviewed beats the plan that was optimal on day one and then ignored.',
        },
      ],
      faq: [
        {
          question: 'How much retirement corpus do I actually need?',
          answer:
            'It is driven by your inflated monthly expenses at retirement, how many years the corpus must last, and the real return it earns afterwards. As a rough guide, 25-30 times your first-year retirement expenses is a common benchmark, but enter your own numbers above for a figure specific to you.',
        },
        {
          question: 'What inflation rate should I assume?',
          answer:
            'Around 6% matches India’s long-run CPI average. Consider 7-8% if a large share of your future spending is education or healthcare, both of which have consistently run above the headline index.',
        },
        {
          question: 'Why is the return after retirement lower than before?',
          answer:
            'Because the portfolio shifts towards debt once you stop earning. You can no longer wait out a market crash with fresh income, so the allocation gets more conservative and the expected return falls with it.',
        },
        {
          question: 'Does EPF count towards my retirement corpus?',
          answer:
            'Yes. EPF, PPF, NPS and gratuity are all retirement assets. Enter their current combined value under existing savings so the calculator does not ask you to save for money you already have.',
        },
        {
          question: 'What if I cannot afford the monthly SIP it calculates?',
          answer:
            'You have four levers: retire later, spend less in retirement, save more now, or accept a higher-return and higher-risk allocation. Working two extra years is usually the most powerful of the four, because it adds contributions and removes withdrawal years at the same time.',
        },
        {
          question: 'Should I include my house in the corpus?',
          answer:
            'Only if you genuinely intend to sell or reverse-mortgage it. A home you plan to live in generates no income, so counting its market value in a corpus meant to fund monthly expenses overstates your position.',
        },
      ],
    },
  },
  {
    keyword: 'Inflation Calculator',
    hindi: 'मुद्रास्फीति कैलकुलेटर',
    monthlySearches: 14800,
    category: 'Savings',
    slug: 'inflation-calculator',
    title: 'Inflation Calculator — Future Cost & Purchasing Power of Money',
    description:
      'Calculate what today’s money will be worth in the future and what your goals will cost after inflation. Year-by-year breakdown at any inflation rate.',
    content: {
      h1: 'Inflation Calculator',
      h2: 'See what your money will be worth and what your goals will cost',
      sections: [
        {
          heading: 'What inflation does to money sitting still',
          content:
            'Inflation is the rate at which prices rise, which means it is also the rate at which idle money loses purchasing power. At 6% a year, Rs. 1 lakh kept in cash buys what Rs. 55,800 buys today after ten years, and about Rs. 31,200 after twenty. Nothing was stolen and the number in the account never changed — the money simply bought less each year. This calculator shows both directions: what a future goal will cost, and what a future rupee is worth in today’s terms.',
        },
        {
          heading: 'Why the headline number understates your experience',
          content:
            'India’s Consumer Price Index has averaged around 6% over the long run, but the basket it measures is not your basket. Private school fees and medical costs have compounded at 8-10% a year for two decades, well above the index. If a large share of your future spending falls into those categories — which it does for anyone planning for children’s education or retirement healthcare — planning at the headline rate systematically understates what you will need.',
        },
        {
          heading: 'Real return is the only return that counts',
          content:
            'A fixed deposit paying 7% while inflation runs at 6% delivers a real return of about 1% before tax. After tax at the 30% slab the post-tax return is roughly 4.9%, which is a real loss of over 1% a year. This is the trap behind the belief that fixed deposits are safe: they protect the nominal amount perfectly while quietly eroding what it can buy. Tax is levied on the nominal return, not the real one, which makes the arithmetic worse than most savers realise.',
        },
        {
          heading: 'Sizing goals correctly',
          content:
            'The practical use of this calculator is goal setting. A four-year engineering degree costing Rs. 20 lakh today will cost roughly Rs. 50 lakh in twelve years at 8% education inflation. A wedding budgeted at Rs. 25 lakh today runs to about Rs. 45 lakh in ten years at 6%. Sizing a SIP against the current price and discovering the shortfall at the moment you need the money is the most common way long-term financial plans fail, and it is entirely avoidable.',
        },
        {
          heading: 'What actually beats inflation',
          content:
            'Over long horizons, equity has been the most reliable inflation-beating asset in India, compounding at roughly 11-13% against 6% inflation. Real estate and gold have roughly kept pace, with gold performing best during inflationary shocks. Fixed deposits, savings accounts and endowment insurance policies have generally lagged after tax. The uncomfortable conclusion is that avoiding volatility entirely guarantees a slow, certain loss, while accepting volatility offers an uncertain gain — which is why time horizon, not risk appetite, should drive the allocation.',
        },
        {
          heading: 'How to use this calculator',
          content:
            'Enter an amount, the inflation rate you want to test, and a number of years. The calculator shows what that amount of goods will cost in the future, what the same rupee figure will be worth in today’s purchasing power, and the percentage of value lost. Use 6% for general planning, 8% for education and healthcare goals, and run a 7-8% scenario alongside your base case to see how sensitive your plan is to an inflation regime that runs hotter than expected.',
        },
      ],
      faq: [
        {
          question: 'What is the average inflation rate in India?',
          answer:
            'Consumer price inflation has averaged roughly 6% a year over the long run, though it has ranged from under 4% to over 10% in individual years. The RBI targets 4% with a tolerance band of plus or minus 2%.',
        },
        {
          question: 'How do I calculate the future cost of something?',
          answer:
            'Multiply today’s cost by (1 + inflation rate) raised to the number of years. Rs. 1 lakh at 6% for ten years becomes about Rs. 1.79 lakh. The calculator above does this along with the year-by-year path.',
        },
        {
          question: 'What return do I need just to beat inflation?',
          answer:
            'More than the inflation rate after tax. At 6% inflation and a 30% tax slab you need roughly 8.6% pre-tax simply to preserve purchasing power, which rules out most savings accounts and many fixed deposits.',
        },
        {
          question: 'Does inflation affect my loan EMI?',
          answer:
            'Not the EMI amount itself on a fixed-rate loan, but it does reduce the real burden — you repay tomorrow’s cheaper rupees on a fixed EMI. Floating-rate loans are different, since rates typically rise to fight inflation and the EMI rises with them.',
        },
        {
          question: 'Why is education inflation higher than general inflation?',
          answer:
            'Education and healthcare are labour-intensive services with rising demand and limited quality supply, so their prices have compounded at 8-10% a year, well ahead of the general index. Plan those goals at the higher rate.',
        },
        {
          question: 'Is gold a good hedge against inflation in India?',
          answer:
            'Historically it has roughly kept pace with inflation over long periods and performed particularly well during inflationary shocks and currency weakness. It is a reasonable diversifier, but it generates no income and has underperformed equity over long horizons.',
        },
      ],
    },
  },
];

const existing = new Set(tools.map((t) => t.slug));
const maxId = tools.reduce((m, t) => Math.max(m, t.id || 0), 0);

let nextId = maxId + 1;
let added = 0;

for (const tool of NEW_TOOLS) {
  if (existing.has(tool.slug)) {
    console.log(`skip (already present): ${tool.slug}`);
    continue;
  }
  tools.push({ id: nextId++, ...tool });
  added++;
  console.log(`added: ${tool.slug}`);
}

if (added > 0) {
  writeFileSync(path, JSON.stringify(tools, null, 2) + '\n', 'utf8');
}
console.log(`\n${added} tool(s) added. data/tools.json now has ${tools.length} tools.`);
