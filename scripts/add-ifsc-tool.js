/* eslint-disable */
// One-time script to add the IFSC Code Finder tool to data/tools.json.
// Run: node scripts/add-ifsc-tool.js
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'tools.json');

const NEW_TOOL = {
  id: 101,
  keyword: 'IFSC Code Finder',
  hindi: 'आईएफएससी कोड फाइंडर',
  monthlySearches: 500000,
  category: 'Banking',
  slug: 'ifsc-code-finder',
  title: 'IFSC Code Finder — Look up Any Bank Branch Details',
  description:
    'Find bank, branch, address, MICR, NEFT/RTGS/IMPS/UPI status, and contact from any 11-digit IFSC code. Fast, free, covers every Indian bank branch.',
  content: {
    h1: 'IFSC Code Finder',
    h2: 'Look up bank branch details from any IFSC code',
    sections: [
      {
        heading: 'What is an IFSC code?',
        content:
          'Indian Financial System Code (IFSC) is an 11-character alphanumeric code assigned by the Reserve Bank of India to every bank branch that participates in electronic fund transfers. It uniquely identifies one specific branch so that NEFT, RTGS, IMPS, and UPI transactions can be routed correctly. Without the right IFSC, the money does not reach the intended account — the bank cannot locate the destination branch.'
      },
      {
        heading: 'How to read an IFSC code',
        content:
          'The IFSC has 11 characters in a fixed format. The first four letters represent the bank code (SBIN for State Bank of India, HDFC for HDFC Bank, ICIC for ICICI Bank). The fifth character is always a zero, reserved for future expansion. The last six characters are the branch code. For example, SBIN0000691 is State Bank of India, branch code 000691. Our finder parses any valid IFSC and returns the full branch record.'
      },
      {
        heading: 'Where do you need an IFSC code?',
        content:
          'You need the IFSC whenever money is being sent to a bank account through NEFT, RTGS, or IMPS — salary credits, vendor payments, loan EMIs auto-debited from a specific account, mutual fund redemptions, and insurance payouts all use IFSC to route funds. UPI transfers do not ask for IFSC because the IFSC is already mapped to the VPA, but adding a beneficiary for a bank transfer does require it.'
      },
      {
        heading: 'How to find the IFSC of your bank branch',
        content:
          'The easiest way is to enter your 11-character IFSC in the field above. If you do not know it, the IFSC is printed on the front page of your chequebook, on your account passbook, and on the bank\'s branch locator on its official website. You can also call the branch or your customer care number. Every bank statement issued by an Indian bank also carries the IFSC near the account number.'
      },
      {
        heading: 'What information do you get from an IFSC lookup?',
        content:
          'From one IFSC lookup, you get the bank name, branch name, complete branch address, city, district, state, contact number, MICR code (used on cheques for faster clearing), and the supported payment networks — NEFT, RTGS, IMPS, and UPI. This tells you at a glance whether the branch supports modern digital payments or only traditional transfers. Many older branches still do not support IMPS, so the beneficiary would have to use NEFT instead.'
      },
      {
        heading: 'IFSC vs MICR vs SWIFT — what is the difference?',
        content:
          'IFSC is used for domestic electronic transfers within India. MICR (Magnetic Ink Character Recognition) is a 9-digit code printed on the bottom of cheques that helps banks sort physical cheques faster — it is not used for online transfers. SWIFT is an international code used for cross-border money transfers; Indian banks have their own SWIFT codes separate from IFSC. Use IFSC for NEFT/RTGS/IMPS inside India, SWIFT for international remittance.'
      },
      {
        heading: 'Do IFSC codes ever change?',
        content:
          'Yes. When a bank merges with another bank, the IFSC codes of the absorbed bank are replaced by the parent bank\'s new codes. This happened at scale in 2020–2021 when Dena Bank and Vijaya Bank merged into Bank of Baroda; Oriental Bank of Commerce and United Bank merged into Punjab National Bank; Syndicate Bank merged into Canara Bank; Allahabad Bank merged into Indian Bank; Andhra Bank and Corporation Bank merged into Union Bank. Always verify the IFSC before adding a beneficiary if you have not transacted with that branch in over a year.'
      },
      {
        heading: 'How our IFSC finder works',
        content:
          'The tool uses a live lookup against a public, continuously-updated IFSC database maintained by Razorpay. When you enter a code, the request fetches the current bank, branch, address, and payment network data directly — so you always see the up-to-date record, including post-merger changes. There is no signup and no rate limit for normal use. Search results are not stored.'
      },
      {
        heading: 'Common IFSC errors and how to fix them',
        content:
          'If the tool says "IFSC not found", check for typos — especially the zero in the fifth position (often mistyped as the letter O). Make sure the code is exactly 11 characters. If the branch was recently merged, the old IFSC will not exist anymore — look up the new one on your bank\'s website. Sending money to a wrong IFSC usually results in the bank rejecting the transfer within 24–48 hours and refunding it, but always double-check before a large transfer to avoid delays.'
      },
      {
        heading: 'Privacy and safety',
        content:
          'We never ask for your account number, card details, or any personal information — only the public IFSC code, which does not identify any individual or account. The lookup is completely anonymous. Never share your account number, PIN, OTP, or card CVV with anyone, including bank staff. Official banks will never call you asking for these details.'
      }
    ],
    faq: [
      {
        question: 'Is the IFSC Code Finder free?',
        answer:
          'Yes, the tool is 100% free with no signup, no limits, and no ads on the lookup result itself. It works on mobile and desktop.'
      },
      {
        question: 'Are the results real-time?',
        answer:
          'Yes. Every lookup queries a live IFSC database so you see the current bank, branch, address, and payment-network support for the code — including updates after bank mergers.'
      },
      {
        question: 'Can I look up a branch without knowing the IFSC?',
        answer:
          'The current version requires the 11-character IFSC. If you do not have it, check the front page of your chequebook, your passbook, or your bank\'s branch locator, then return and paste the code here.'
      },
      {
        question: 'Why does the tool say IFSC not found?',
        answer:
          'Most commonly it is a typo — the fifth character must be the digit zero, not the letter O. Sometimes the branch has been merged and the old IFSC is discontinued. Verify the current IFSC on your bank\'s official website.'
      }
    ]
  }
};

function main() {
  const raw = fs.readFileSync(FILE, 'utf-8');
  const tools = JSON.parse(raw);

  const existing = tools.find((t) => t.slug === NEW_TOOL.slug);
  if (existing) {
    Object.assign(existing, NEW_TOOL);
    console.log('Updated existing IFSC tool entry.');
  } else {
    tools.push(NEW_TOOL);
    console.log('Added new IFSC tool entry.');
  }

  fs.writeFileSync(FILE, JSON.stringify(tools, null, 2) + '\n');
  console.log('Total tools:', tools.length);
}

main();
