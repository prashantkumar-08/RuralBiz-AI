const express = require('express');
const router = express.Router();

const { calculateFinancials } = require('../engines/financeEngine');
const { analyzeMarket } = require('../engines/marketEngine');
const { matchSchemes, getAllSchemes } = require('../engines/schemeEngine');
const { getChatResponse, generateMilestoneRoadmap } = require('../engines/aiEngine');

const businessProfiles = require('../data/businessProfiles.json');
const msmeStats = require('../data/msmeStats.json');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'RuralBiz AI' });
});

// Get business profiles
router.get('/businesses', (req, res) => {
  res.json(businessProfiles);
});

// Get all schemes
router.get('/schemes', (req, res) => {
  const { sector, minSubsidy } = req.query;
  let list = getAllSchemes();
  if (sector) {
    list = list.filter(s => s.categories.some(c => c.toLowerCase().includes(sector.toLowerCase())));
  }
  if (minSubsidy) {
    list = list.filter(s => (s.subsidy?.generalRural || 0) >= Number(minSubsidy));
  }
  res.json(list);
});

// Mandi rates & stats
router.get('/mandi', (req, res) => {
  res.json(msmeStats);
});

// Comprehensive 4-Step Analysis Endpoint
router.post('/analyze', (req, res) => {
  try {
    const {
      state = 'Gujarat',
      district = 'Anand',
      capital = 100000,
      businessId = 'dairy-farming',
      category = 'OBC',
      gender = 'Female',
      isRural = true
    } = req.body;

    const profile = businessProfiles.find(b => b.id === businessId) || businessProfiles[0];
    const projectCost = profile.typicalProjectCost || (capital * 10);

    // Step 2: Market Engine
    const marketAnalysis = analyzeMarket({
      district,
      state,
      businessId: profile.id,
      capital,
      isRural
    });

    // Step 3: Scheme Matching
    const schemeAnalysis = matchSchemes({
      projectCost,
      category,
      gender,
      isRural,
      businessSector: profile.category
    });

    const chosenScheme = schemeAnalysis.bestScheme;

    // Step 3: Financial Structuring
    const financialAnalysis = calculateFinancials({
      projectCost,
      userCapital: capital,
      schemeId: chosenScheme.id,
      isRural,
      category,
      tenureYears: chosenScheme.tenureYears || 5,
      interestRate: 9.0,
      moratoriumMonths: chosenScheme.moratoriumMonths || 6,
      businessType: profile.id
    });

    // Step 4: Milestone Action Roadmap
    const roadmap = generateMilestoneRoadmap({
      businessName: profile.name,
      schemeName: chosenScheme.name,
      projectCost,
      subsidyAmount: financialAnalysis.governmentSubsidy
    });

    res.json({
      success: true,
      profile: {
        businessId: profile.id,
        businessName: profile.name,
        category: profile.category,
        sector: profile.sector,
        summary: profile.summary,
        equipment: profile.equipment,
        rawMaterials: profile.rawMaterials,
        state,
        district,
        capital,
        demographics: { category, gender, isRural }
      },
      market: marketAnalysis,
      schemes: schemeAnalysis,
      finances: financialAnalysis,
      roadmap
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Standalone Financial Calculator
router.post('/financial-calculator', (req, res) => {
  try {
    const {
      projectCost = 1000000,
      userCapital = 100000,
      schemeId = 'pmegp',
      isRural = true,
      category = 'OBC',
      tenureYears = 5,
      interestRate = 9.0,
      moratoriumMonths = 6
    } = req.body;

    const result = calculateFinancials({
      projectCost,
      userCapital,
      schemeId,
      isRural,
      category,
      tenureYears,
      interestRate,
      moratoriumMonths
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bankable DPR Generator
router.post('/dpr', (req, res) => {
  try {
    const {
      entrepreneurName = 'Ramesh Patel',
      fatherOrSpouseName = 'Somabhai Patel',
      aadhaarLast4 = '4821',
      mobile = '9876543210',
      address = 'Village Mogar, Anand Taluk',
      district = 'Anand',
      state = 'Gujarat',
      pin = '388340',
      category = 'OBC',
      gender = 'Male',
      qualification = 'Higher Secondary (12th Pass)',
      businessId = 'dairy-farming',
      userCapital = 100000,
      schemeId = 'pmegp'
    } = req.body;

    const profile = businessProfiles.find(b => b.id === businessId) || businessProfiles[0];
    const projectCost = profile.typicalProjectCost;

    const financials = calculateFinancials({
      projectCost,
      userCapital,
      schemeId,
      isRural: true,
      category,
      tenureYears: 5,
      interestRate: 9.0,
      moratoriumMonths: 6,
      businessType: profile.id
    });

    const dicInfo = msmeStats.dicDirectory.find(d => d.district.toLowerCase() === district.toLowerCase()) || msmeStats.dicDirectory[0];

    const dprDocument = {
      referenceNumber: `RURALBIZ-DPR-${Date.now().toString().slice(-6)}`,
      generatedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      schemeName: schemeId === 'pmegp' ? "Prime Minister's Employment Generation Programme (PMEGP)" : "PM MUDRA Yojana",
      implementingAgency: dicInfo.officeName,
      leadBank: dicInfo.leadBank,
      
      borrowerProfile: {
        fullName: entrepreneurName,
        guardianName: fatherOrSpouseName,
        aadhaarMasked: `XXXX-XXXX-${aadhaarLast4}`,
        mobileNumber: mobile,
        address,
        district,
        state,
        pinCode: pin,
        socialCategory: category,
        gender,
        educationalQualification: qualification,
        bankBranchRecommended: `${dicInfo.leadBank}, ${district} Main Branch`
      },

      projectProfile: {
        projectName: profile.name,
        sector: profile.sector,
        category: profile.category,
        projectLocation: `${address}, Dist: ${district} (${state})`,
        proposedCapacity: profile.monthlyMetrics?.productionVolume || 'Commercial Scale',
        proposedEmployment: '4 - 6 Rural Persons (Direct & Indirect)'
      },

      meansOfFinance: {
        totalProjectCost: financials.projectCost,
        promotersContribution: financials.entrepreneurEquity,
        promoterEquityPct: financials.marginPercentage,
        termLoanSanctioned: financials.sanctionedBankLoan,
        marginMoneySubsidyEntitlement: financials.governmentSubsidy,
        subsidyPct: financials.subsidyPercentage,
        netDebtBurden: financials.netLoanPrincipal,
        effectiveInterestRate: financials.interestRate,
        loanTenureMonths: financials.tenureYears * 12,
        moratoriumMonths: financials.moratoriumMonths,
        monthlyEMI: financials.monthlyEMI
      },

      capitalExpenditureBreakdown: profile.equipment,

      workingCapitalRequirement: {
        rawMaterials30Days: profile.monthlyMetrics?.operatingCost || 50000,
        contingenciesAndUtilities: 25000,
        totalWorkingCapital: (profile.monthlyMetrics?.operatingCost || 50000) + 25000
      },

      profitabilityAndCashFlow: financials.projections,

      financialViabilityIndicators: {
        dscrAverage: financials.viability.dscr,
        paybackPeriodYears: financials.viability.paybackYears,
        breakEvenCapacity: `${financials.viability.breakEvenPercentage}% of Installed Capacity`,
        firstYearGrossRevenue: financials.viability.annualTurnover,
        firstYearNetPAT: financials.viability.annualNetProfit
      },

      declarations: [
        'I hereby declare that all particulars stated above are true to the best of my knowledge and belief.',
        'I have not availed any subsidy under any other Central or State Government scheme for this enterprise.',
        'I agree to undergo the mandatory EDP training conducted by RSETI/KVIC prior to the release of second loan tranche.',
        'I undertake to strictly utilize the loan proceeds solely for the purchase of verified machinery and project setup.'
      ]
    };

    res.json(dprDocument);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WhatsApp AI Chat Endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message = '', language = 'en' } = req.body;
    const response = await getChatResponse(message, language);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
