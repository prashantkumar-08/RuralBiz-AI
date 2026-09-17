/**
 * AI Advisory Layer with Gemini Integration & Intelligent Heuristic Rule Engine Fallback
 */

const businessProfiles = require('../data/businessProfiles.json');
const schemes = require('../data/schemes.json');

// Heuristic conversational responses for common rural questions
function getHeuristicChatResponse(userMessage, language = 'en') {
  const msg = (userMessage || '').toLowerCase();

  // Dairy farming query
  if (msg.includes('dairy') || msg.includes('milk') || msg.includes('cow') || msg.includes('buffalo') || msg.includes('दूध') || msg.includes('डेयरी')) {
    return {
      text: `🐄 **Dairy Farming Advisory**:
For a 10-animal dairy unit in rural areas:
- **Total Project Cost**: ~₹10,00,000 (Includes 10 milch cows, shed, and milk chilling unit).
- **Your Margin**: ₹50,000 - ₹1,00,000 (5% to 10% under PMEGP or AHIDF).
- **Subsidy**: Up to 35% (₹3.5 Lakhs) under PMEGP Special/Rural category, or 3% interest subvention under AHIDF.
- **Estimated Net Income**: ₹40,000 - ₹65,000/month after feed expenses and EMI.
- **Next Step**: Tie up with local dairy cooperative (Amul, Nandini, Saras) and get quotations for cowshed & milking machinery.`,
      quickReplies: ['PMEGP Subsidy Details', 'Download Dairy DPR', 'Nearest DIC Office', 'Animal Feed Guidance']
    };
  }

  // Capital / ₹1 Lakh starting query
  if (msg.includes('1 lakh') || msg.includes('100000') || msg.includes('1,00,000') || msg.includes('lakh') || msg.includes('लाख')) {
    return {
      text: `💡 **Top Recommendations for ₹1,00,000 Capital**:
With ₹1 Lakh equity, bank schemes like PMEGP & Mudra allow you to leverage a **₹5 to ₹10 Lakhs project**:
1. **Mustard & Spices Grinding Unit** (Project: ₹5 Lakhs | Subsidy: ₹1.75L | Net EMI: ~₹6,500/mo)
2. **Dairy Farming (10 Animals)** (Project: ₹10 Lakhs | Subsidy: ₹3.5L | Net EMI: ~₹13,500/mo)
3. **Mushroom Cultivation & Packaging** (Project: ₹3.5 Lakhs | Subsidy: ₹1.2L | Fast 25-day cashflow)
4. **Vermicompost & Bio-fertilizer** (Project: ₹3.5 Lakhs | High demand among organic farmers)

Would you like to analyze market demand for any of these in your village?`,
      quickReplies: ['Analyze Dairy Farm', 'Analyze Spices Unit', 'Check Mudra Loan', 'Talk to DIC Mitra']
    };
  }

  // Mudra loan query
  if (msg.includes('mudra') || msg.includes('मुद्रा') || msg.includes('loan') || msg.includes('कर्ज') || msg.includes('ऋण')) {
    return {
      text: `🏦 **Pradhan Mantri MUDRA Yojana (PMMY)**:
- **Shishu**: Loans up to ₹50,000 (Zero collateral, 0% margin). Best for vegetable carts, small kirana, tailors.
- **Kishore**: Loans from ₹50,000 to ₹5,00,000 (10% margin). Best for mini flour mills, footwear, service centers.
- **Tarun**: Loans from ₹5,00,000 to ₹10,00,000 (15% margin). Best for automated packaging and transport units.
- **Required Documents**: Aadhaar, PAN, residence proof, 6-month bank statement, and machinery quotation.`,
      quickReplies: ['Check PMEGP instead', 'Required Documents', 'Generate Mudra DPR', 'Nearest Bank Branch']
    };
  }

  // Subsidy query
  if (msg.includes('subsidy') || msg.includes('सब्सिडी') || msg.includes('pmegp') || msg.includes('छूट')) {
    return {
      text: `💰 **Government Subsidy Highlights**:
- **PMEGP Rural Special (Women, SC, ST, OBC)**: **35% Capital Subsidy** on manufacturing projects up to ₹50 Lakhs!
- **PMFME Scheme**: **35% Subsidy** (up to ₹10 Lakhs) for food processing, flour mills, and spice units under ODOP.
- **Stand-Up India**: Collateral-free greenfield loans up to ₹1 Crore for Women & SC/ST entrepreneurs.
- **AHIDF**: 3% Interest Rebate for dairy chilling, poultry, and animal feed units.`,
      quickReplies: ['Check My Eligibility', 'PMEGP Application Steps', 'Detailed Project Report', 'Village Market Insights']
    };
  }

  // Default fallback conversational advisory
  return {
    text: `Namaste! 🙏 I am your **RuralBiz AI Advisor**.
I can assist you with:
- Finding the most profitable business for your capital (e.g. ₹50k, ₹1 Lakh, ₹5 Lakhs).
- Checking government subsidies (PMEGP 35%, PMFME, Mudra loans).
- Calculating your monthly EMI, margin, and break-even timeline.
- Generating a bankable Detailed Project Report (DPR) to submit to your branch manager.

What business or idea are you exploring today?`,
    quickReplies: ['₹1 Lakh Best Businesses', 'Dairy Farming Feasibility', '35% PMEGP Subsidy', 'Mandi Commodity Rates']
  };
}

// Generate complete personalized step-by-step roadmap
function generateMilestoneRoadmap({
  businessName = 'Dairy Farming',
  schemeName = 'PMEGP',
  projectCost = 1000000,
  subsidyAmount = 350000
}) {
  return [
    {
      phase: 'Phase 1: Approvals & In-Principle Registration',
      duration: 'Days 1 - 15',
      status: 'Ready to Start',
      tasks: [
        'Register for Udyam MSME certificate online (Free, instant via Aadhaar).',
        'Obtain Gram Panchayat / Local Body NOC for commercial electricity and water connection.',
        'Finalize land title deeds or 5-year registered lease agreement for project site.',
        'Collect formal proforma invoices / quotations with GST from verified machinery vendors.'
      ]
    },
    {
      phase: 'Phase 2: Scheme Application & Bank Loan Sanction',
      duration: 'Days 16 - 45',
      status: 'Documentation',
      tasks: [
        `Submit online application on the ${schemeName} official portal with DPR generated here.`,
        'Interview with District Level Task Force Committee (DLTFC) chaired by District Collector / GM DIC.',
        'Bank branch appraisal and sanction letter issuance for Term Loan + Cash Credit.',
        `Deposit Margin Money (Own Equity); Bank applies for ₹${subsidyAmount.toLocaleString('en-IN')} subsidy reserve fund.`
      ]
    },
    {
      phase: 'Phase 3: Civil Setup, Machinery Installation & EDP Training',
      duration: 'Days 46 - 75',
      status: 'Setup',
      tasks: [
        'Complete mandatory 10-day Entrepreneurship Development Programme (EDP) training (online/RSETI).',
        'Civil works completion (shed construction, bio-secure perimeter, flooring).',
        'Machinery delivery, electrical load commissioning (3-phase connection), and test trial run.',
        'Obtain FSSAI / Trade license / Pollution clearance (if applicable for manufacturing).'
      ]
    },
    {
      phase: 'Phase 4: Commercial Launch & Market Linkage',
      duration: 'Days 76 - 90',
      status: 'Go Live',
      tasks: [
        'Begin commercial production with inaugural batch.',
        'Execute off-take agreement with local dairy cooperative / FMCG distributors / Mandi buyers.',
        'Setup digital UPI payment soundbox and register on ONDC rural sellers network.',
        'First loan disbursement release and commencement of regular monthly EMI schedule.'
      ]
    }
  ];
}

// AI Chat handler: tries Gemini API if process.env.GEMINI_API_KEY is present; otherwise gracefully uses the heuristic engine
async function getChatResponse(userMessage, language = 'en') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
      const prompt = `You are RuralBiz AI, an empathetic, highly knowledgeable business and financial advisor for rural micro-entrepreneurs in India (SIH 2026).
Communicate simply, practically, and concisely. Use Indian Rupee (₹) formatting and mention specific schemes like PMEGP, Mudra, PMFME, or AHIDF when relevant.
Entrepreneur says: "${userMessage}"
Respond in a friendly, encouraging tone. Format response with clear markdown bullet points and suggest 3-4 quick follow up options.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            text,
            quickReplies: ['PMEGP Subsidy', 'Generate DPR', 'Calculate EMI', 'Find Nearest Mandi'],
            source: 'Gemini AI'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to heuristic engine:', err.message);
    }
  }

  // Fallback to high quality offline heuristic engine
  const fallback = getHeuristicChatResponse(userMessage, language);
  return {
    ...fallback,
    source: 'Heuristic Knowledge Engine (Offline Ready)'
  };
}

module.exports = {
  getChatResponse,
  generateMilestoneRoadmap
};
