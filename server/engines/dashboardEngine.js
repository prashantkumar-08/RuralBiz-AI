/**
 * RuralBiz AI - Executive & Entrepreneur Dashboard Analytics Engine
 * SIH 2026 - PS 26091
 */

const { calculateFinancials } = require('./financeEngine');
const { analyzeMarket } = require('./marketEngine');
const { matchSchemes, getAllSchemes } = require('./schemeEngine');
const { generateMilestoneRoadmap, generateExecutiveAdvice } = require('./aiEngine');
const businessProfiles = require('../data/businessProfiles.json');
const msmeStats = require('../data/msmeStats.json');

/**
 * Calculate comprehensive Bank Sanction Readiness Index (0 - 100)
 */
function computeBankReadiness({ financials, market, capital, projectCost, category, isRural }) {
  // 1. Equity Margin Score (Weight: 25%)
  const marginPct = (capital / projectCost) * 100;
  let equityScore = 60;
  if (marginPct >= 15) equityScore = 95;
  else if (marginPct >= 10) equityScore = 90;
  else if (marginPct >= 5) equityScore = 80;

  // 2. DSCR Health Score (Weight: 25%)
  const dscr = financials.viability?.dscr || 1.8;
  let dscrScore = 60;
  if (dscr >= 2.0) dscrScore = 98;
  else if (dscr >= 1.75) dscrScore = 94;
  else if (dscr >= 1.5) dscrScore = 85;
  else if (dscr >= 1.25) dscrScore = 72;

  // 3. Scheme Subsidy Coverage (Weight: 20%)
  const subsidyPct = financials.subsidyPercentage || 35;
  let subsidyScore = 70;
  if (subsidyPct >= 35) subsidyScore = 98;
  else if (subsidyPct >= 25) subsidyScore = 90;
  else if (subsidyPct >= 15) subsidyScore = 82;

  // 4. Market & Demand Score (Weight: 15%)
  const marketScore = market.score || 88;

  // 5. Documentation & Compliance Readiness (Weight: 15%)
  const docScore = 90; // Standard baseline for structured DPR generation

  const weightedTotal = Math.round(
    equityScore * 0.25 +
    dscrScore * 0.25 +
    subsidyScore * 0.20 +
    marketScore * 0.15 +
    docScore * 0.15
  );

  let grade = 'A+';
  let verdict = 'Prime Candidate: Bankable & Sanction-Ready';
  if (weightedTotal < 75) {
    grade = 'B';
    verdict = 'Eligible: Supplementary Collateral or Guarantor Recommended';
  } else if (weightedTotal < 88) {
    grade = 'A';
    verdict = 'Strong Profile: Meets Lead Bank Guidelines';
  }

  return {
    overallScore: weightedTotal,
    grade,
    verdict,
    criteria: [
      {
        name: 'Equity Margin Adequacy',
        weight: '25%',
        score: equityScore,
        status: equityScore >= 80 ? 'Optimal' : 'Needs Capital Buffer',
        note: `Current contribution is ${marginPct.toFixed(1)}% of ₹${(projectCost / 100000).toFixed(1)}L cost.`
      },
      {
        name: 'Debt Service Coverage (DSCR)',
        weight: '25%',
        score: dscrScore,
        status: dscrScore >= 85 ? 'Strong Safety Margin' : 'Moderate',
        note: `Average DSCR is ${dscr.toFixed(2)} vs minimum bank benchmark of 1.50.`
      },
      {
        name: 'Government Subsidy Alignment',
        weight: '20%',
        score: subsidyScore,
        status: 'Maximum Entitlement',
        note: `Qualifies for ${subsidyPct}% back-ended capital grant (KVIC/PMEGP).`
      },
      {
        name: 'Hyper-Local Market Demand',
        weight: '15%',
        score: marketScore,
        status: marketScore >= 80 ? 'High Off-Take Potential' : 'Moderate Competition',
        note: `${market.demandLevel || 'High'} demand in 10-15 km radius with strong mandi integration.`
      },
      {
        name: 'Compliance & DPR Accuracy',
        weight: '15%',
        score: docScore,
        status: 'Bankable DPR Formatted',
        note: 'Complete means of finance and 5-year cash flow projections prepared.'
      }
    ]
  };
}

/**
 * Build 5-Year Financial Projection Timeline
 */
function generateMultiYearProjections(financials) {
  const baseRevenue = financials.viability?.annualTurnover || 1800000;
  const baseOpex = financials.viability?.annualOperatingCost || 1100000;
  const annualEMI = (financials.monthlyEMI || 13500) * 12;

  const capacityRamps = [0.70, 0.80, 0.88, 0.94, 0.98];
  let cumulativeCash = 0;

  return capacityRamps.map((ramp, index) => {
    const year = index + 1;
    const revenue = Math.round(baseRevenue * ramp);
    const opex = Math.round(baseOpex * (0.85 + ramp * 0.15));
    const grossMargin = revenue - opex;
    const debtService = annualEMI;
    const netCashFlow = Math.max(0, grossMargin - debtService);
    cumulativeCash += netCashFlow;

    return {
      year: `Year ${year}`,
      capacityPct: Math.round(ramp * 100),
      revenue,
      operatingExpense: opex,
      debtService,
      netCashFlow,
      cumulativeProfit: cumulativeCash,
      dscr: parseFloat((grossMargin / (debtService || 1)).toFixed(2))
    };
  });
}

/**
 * Generate scheme comparison matrix
 */
function generateSchemeComparison(projectCost, category, isRural) {
  return [
    {
      id: 'pmegp',
      name: "Prime Minister's Employment Generation Programme (PMEGP)",
      agency: 'KVIC / DIC',
      subsidyPct: isRural ? (category === 'General' ? 25 : 35) : (category === 'General' ? 15 : 25),
      maxSubsidy: 1750000,
      ownEquityPct: category === 'General' ? 10 : 5,
      collateralRequired: false,
      interestSubvention: 'Back-ended Margin Subsidy',
      tenure: '5 to 7 Years',
      recommended: true,
      tag: 'Best Match for Rural Subsidy'
    },
    {
      id: 'mudra-tarun',
      name: 'Pradhan Mantri MUDRA Yojana (Tarun)',
      agency: 'Scheduled Commercial Banks',
      subsidyPct: 0,
      maxSubsidy: 0,
      ownEquityPct: 15,
      collateralRequired: false,
      interestSubvention: 'Competitive Commercial Rates (8.5% - 10.5%)',
      tenure: '3 to 5 Years',
      recommended: false,
      tag: 'Fast Processing'
    },
    {
      id: 'pmfme',
      name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
      agency: 'Ministry of Food Processing',
      subsidyPct: 35,
      maxSubsidy: 1000000,
      ownEquityPct: 10,
      collateralRequired: false,
      interestSubvention: 'ODOP Credit-Linked Capital Subsidy',
      tenure: '5 Years',
      recommended: false,
      tag: 'Ideal for Agro & Food Processing'
    },
    {
      id: 'standup-india',
      name: 'Stand-Up India Scheme',
      agency: 'SIDBI / Commercial Banks',
      subsidyPct: 0,
      maxSubsidy: 0,
      ownEquityPct: 15,
      collateralRequired: false,
      interestSubvention: 'Lowest Applicable Bank MCLR',
      tenure: 'Up to 7 Years',
      recommended: false,
      tag: 'For SC/ST & Women Entrepreneurs (Up to ₹1 Cr)'
    }
  ];
}

/**
 * Build Dashboard Analytics Data
 */
function getDashboardData({
  businessId = 'dairy-farming',
  capital = 100000,
  district = 'Anand',
  state = 'Gujarat',
  category = 'OBC',
  gender = 'Female',
  isRural = true
}) {
  const profile = businessProfiles.find(b => b.id === businessId) || businessProfiles[0];
  const projectCost = profile.typicalProjectCost || (capital * 10);

  // 1. Run Market Engine
  const market = analyzeMarket({
    district,
    state,
    businessId: profile.id,
    capital,
    isRural
  });

  // 2. Run Scheme Engine
  const schemeMatch = matchSchemes({
    projectCost,
    category,
    gender,
    isRural,
    businessSector: profile.category
  });
  const bestScheme = schemeMatch.bestScheme;

  // 3. Run Finance Engine
  const financials = calculateFinancials({
    projectCost,
    userCapital: capital,
    schemeId: bestScheme.id,
    isRural,
    category,
    tenureYears: bestScheme.tenureYears || 5,
    interestRate: 9.0,
    moratoriumMonths: bestScheme.moratoriumMonths || 6,
    businessType: profile.id
  });

  // 4. Compute Bank Sanction Readiness
  const bankReadiness = computeBankReadiness({
    financials,
    market,
    capital,
    projectCost,
    category,
    isRural
  });

  // 5. Build 5-Year Projections
  const multiYearProjections = generateMultiYearProjections(financials);

  // 6. Build Scheme Comparison
  const schemeComparison = generateSchemeComparison(projectCost, category, isRural);

  // 7. Extract Mandi Insights (all commodities)
  const mandiPrices = msmeStats.mandiPrices || [];
  const relevantMandi = mandiPrices;

  // 8. Generate Milestone Checklist
  const rawRoadmap = generateMilestoneRoadmap({
    businessName: profile.name,
    schemeName: bestScheme.name,
    projectCost,
    subsidyAmount: financials.governmentSubsidy
  });

  const milestoneTasks = [
    { id: 'm1', title: 'Register Udyam MSME Portal (Aadhaar Linked)', category: 'Regulatory', phase: 'Pre-Sanction', done: true, duration: 'Day 1-3' },
    { id: 'm2', title: 'Obtain Gram Panchayat / Local Body NOC', category: 'Approvals', phase: 'Pre-Sanction', done: true, duration: 'Day 4-7' },
    { id: 'm3', title: 'Collect Formal Machinery Quotations with GST', category: 'Procurement', phase: 'Pre-Sanction', done: false, duration: 'Day 8-12' },
    { id: 'm4', title: 'Submit DPR to DIC / Lead Bank Branch', category: 'Banking', phase: 'Sanction', done: false, duration: 'Day 15-25' },
    { id: 'm5', title: 'Complete RSETI/EDP Entrepreneurship Training', category: 'Training', phase: 'Sanction', done: false, duration: 'Day 26-35' },
    { id: 'm6', title: 'Bank Loan Sanction & 1st Tranche Release', category: 'Banking', phase: 'Disbursal', done: false, duration: 'Day 36-45' },
    { id: 'm7', title: 'Machinery Installation & Commissioning', category: 'Setup', phase: 'Execution', done: false, duration: 'Day 46-60' },
    { id: 'm8', title: 'Commence Commercial Production & KVIC Subsidy Lock-in', category: 'Operations', phase: 'Commercial', done: false, duration: 'Day 60+' }
  ];

  // 9. AI Executive Advice
  const aiAdvice = generateExecutiveAdvice({
    businessName: profile.name,
    district,
    state,
    projectCost,
    subsidyAmount: financials.governmentSubsidy,
    dscr: financials.viability?.dscr || 1.95,
    breakEvenYears: financials.viability?.paybackYears || 1.8
  });

  // Calculate monthly net revenue
  const monthlyRevenue = Math.round((financials.viability?.annualTurnover || 1800000) / 12);
  const monthlyOpex = Math.round((financials.viability?.annualOperatingCost || 1100000) / 12);
  const monthlyEMI = financials.monthlyEMI || 13500;
  const monthlyNetProfit = Math.max(0, monthlyRevenue - monthlyOpex - monthlyEMI);

  return {
    success: true,
    timestamp: new Date().toISOString(),
    profile: {
      id: profile.id,
      name: profile.name,
      category: profile.category,
      sector: profile.sector,
      summary: profile.summary,
      typicalProjectCost: projectCost,
      userCapital: capital,
      location: { district, state, isRural },
      demographics: { category, gender }
    },
    kpiMetrics: {
      projectCost,
      promoterEquity: financials.entrepreneurEquity,
      promoterEquityPct: financials.marginPercentage,
      governmentSubsidy: financials.governmentSubsidy,
      subsidyPercentage: financials.subsidyPercentage,
      sanctionedBankLoan: financials.sanctionedBankLoan,
      netLoanPrincipal: financials.netLoanPrincipal,
      monthlyEMI,
      monthlyGrossRevenue: monthlyRevenue,
      monthlyOperatingExpense: monthlyOpex,
      monthlyNetProfit,
      netProfitMargin: parseFloat(((monthlyNetProfit / monthlyRevenue) * 100).toFixed(1)),
      dscr: financials.viability?.dscr || 1.95,
      paybackYears: financials.viability?.paybackYears || 1.8,
      breakEvenCapacityPct: financials.viability?.breakEvenPercentage || 42,
      bestSchemeName: bestScheme.name,
      bestSchemeId: bestScheme.id
    },
    bankReadiness,
    multiYearProjections,
    schemeComparison,
    mandiInsights: relevantMandi,
    milestoneTasks,
    aiAdvice,
    nationalBenchmarks: msmeStats.nationalStats,
    dicContact: msmeStats.dicDirectory.find(d => d.district.toLowerCase() === district.toLowerCase()) || msmeStats.dicDirectory[0]
  };
}

module.exports = {
  getDashboardData,
  computeBankReadiness,
  generateMultiYearProjections,
  generateSchemeComparison
};
