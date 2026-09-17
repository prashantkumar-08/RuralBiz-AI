/**
 * Financial Structuring Engine for Rural Micro-Enterprises
 * Strictly adheres to PMEGP, Mudra, PMFME, AHIDF, and Indian Banking norms.
 */

function calculateFinancials({
  projectCost,
  userCapital,
  schemeId = 'pmegp',
  isRural = true,
  category = 'General', // General, OBC, SC, ST, Women, Minorities
  tenureYears = 5,
  interestRate = 9.0, // Annual %
  moratoriumMonths = 6,
  businessType = 'dairy-farming'
}) {
  const isSpecialCategory = ['OBC', 'SC', 'ST', 'Women', 'Minorities', 'Differently Abled'].includes(category) || isRural;

  let marginPct = 10;
  let subsidyPct = 0;
  let maxSubsidyCap = Infinity;
  let interestSubvention = 0;

  switch (schemeId) {
    case 'pmegp':
      // PMEGP Norms:
      // General: 10% own contribution. Subsidy: 15% (Urban), 25% (Rural)
      // Special: 5% own contribution. Subsidy: 25% (Urban), 35% (Rural)
      marginPct = isSpecialCategory ? 5 : 10;
      if (isSpecialCategory) {
        subsidyPct = isRural ? 35 : 25;
      } else {
        subsidyPct = isRural ? 25 : 15;
      }
      break;

    case 'pmfme':
      marginPct = 10;
      subsidyPct = 35;
      maxSubsidyCap = 1000000; // Cap at ₹10 Lakhs
      break;

    case 'ahidf':
      marginPct = isSpecialCategory ? 10 : 15;
      interestSubvention = 3.0; // 3% interest discount
      subsidyPct = 0;
      break;

    case 'pmmsy':
      marginPct = isSpecialCategory ? 15 : 20;
      subsidyPct = ['Women', 'SC', 'ST'].includes(category) ? 60 : 40;
      break;

    case 'midh':
      marginPct = 15;
      subsidyPct = isRural ? 50 : 35;
      break;

    case 'mudra':
      if (projectCost <= 50000) {
        marginPct = 0;
      } else if (projectCost <= 500000) {
        marginPct = 10;
      } else {
        marginPct = 15;
      }
      subsidyPct = 0;
      break;

    case 'standup_india':
      marginPct = 15;
      subsidyPct = 0;
      break;

    default:
      marginPct = isSpecialCategory ? 10 : 15;
      subsidyPct = isRural ? 25 : 15;
      break;
  }

  // Margin Required
  const calculatedMargin = Math.round((marginPct / 100) * projectCost);
  // User equity contribution is max of required margin or available user capital, capped at project cost
  const entrepreneurEquity = Math.min(projectCost, Math.max(calculatedMargin, userCapital || calculatedMargin));

  // Government Subsidy Calculation
  let rawSubsidy = Math.round((subsidyPct / 100) * projectCost);
  if (rawSubsidy > maxSubsidyCap) {
    rawSubsidy = maxSubsidyCap;
  }
  const governmentSubsidy = rawSubsidy;

  // Effective interest rate after subvention
  const effectiveInterestRate = Math.max(4.0, interestRate - interestSubvention);

  // Bank Loan Sanctioned: In Indian bank schemes like PMEGP, the bank finances Project Cost - Own Contribution.
  // The government subsidy is held in a Subsidy Reserve Fund (TDR) without interest, reducing debt burden.
  const sanctionedBankLoan = Math.max(0, projectCost - entrepreneurEquity);
  
  // Net effective loan repayment principal (taking credit of subsidy after lock-in or term adjustment)
  const netLoanPrincipal = Math.max(0, sanctionedBankLoan - governmentSubsidy);

  // Reducing Balance Monthly EMI calculation
  const monthlyRate = effectiveInterestRate / (12 * 100);
  const totalMonths = tenureYears * 12;
  const repaymentMonths = Math.max(12, totalMonths - moratoriumMonths);

  let monthlyEMI = 0;
  if (monthlyRate > 0 && sanctionedBankLoan > 0) {
    // Standard EMI on sanctioned loan (or net loan after subsidy credit)
    const factor = Math.pow(1 + monthlyRate, repaymentMonths);
    monthlyEMI = Math.round((sanctionedBankLoan * monthlyRate * factor) / (factor - 1));
  }

  // Moratorium simple monthly interest
  const moratoriumMonthlyInterest = Math.round(sanctionedBankLoan * monthlyRate);

  // Estimated Operational Economics
  // Based on Indian MSME rural benchmarks: typical gross revenue is 1.4x to 1.8x annual project cost for manufacturing/allied
  const estimatedAnnualTurnover = Math.round(projectCost * 1.5);
  const estimatedOperatingExpenses = Math.round(estimatedAnnualTurnover * 0.65);
  const annualOperatingProfit = estimatedAnnualTurnover - estimatedOperatingExpenses; // EBIDTA
  const annualDebtService = monthlyEMI * 12;
  
  // DSCR (Debt Service Coverage Ratio)
  const dscr = annualDebtService > 0 ? Number((annualOperatingProfit / annualDebtService).toFixed(2)) : 2.5;

  // Payback Period (in years)
  const paybackYears = Number((projectCost / (annualOperatingProfit || 1)).toFixed(1));

  // Break-even revenue percentage
  const breakEvenPercentage = Math.round((estimatedOperatingExpenses / estimatedAnnualTurnover) * 100);

  // 5-Year Financial Projection Table
  const projections = [];
  let currentPrincipal = sanctionedBankLoan;
  for (let year = 1; year <= 5; year++) {
    const growth = Math.pow(1.08, year - 1); // 8% annual growth
    const yearRevenue = Math.round(estimatedAnnualTurnover * growth);
    const yearOpex = Math.round(estimatedOperatingExpenses * growth);
    const yearEBIDTA = yearRevenue - yearOpex;
    
    // Annual interest and principal repayment
    const annualInterest = Math.round(currentPrincipal * (effectiveInterestRate / 100));
    const annualPrincipalRepaid = Math.min(currentPrincipal, Math.round(monthlyEMI * 12 - annualInterest));
    currentPrincipal = Math.max(0, currentPrincipal - annualPrincipalRepaid);
    
    const yearPAT = Math.round(yearEBIDTA - annualInterest - (yearEBIDTA * 0.1)); // 10% tax/depr

    projections.push({
      year,
      revenue: yearRevenue,
      opex: yearOpex,
      ebidta: yearEBIDTA,
      interest: annualInterest,
      principalRepaid: annualPrincipalRepaid,
      pat: yearPAT,
      closingLoan: currentPrincipal
    });
  }

  return {
    projectCost,
    entrepreneurEquity,
    marginPercentage: marginPct,
    governmentSubsidy,
    subsidyPercentage: subsidyPct,
    sanctionedBankLoan,
    netLoanPrincipal,
    interestRate: effectiveInterestRate,
    interestSubvention,
    tenureYears,
    moratoriumMonths,
    monthlyEMI,
    moratoriumMonthlyInterest,
    viability: {
      dscr,
      dscrRating: dscr >= 1.75 ? 'Excellent (High Bank Approval)' : dscr >= 1.25 ? 'Viable (Standard)' : 'Caution (Low Coverage)',
      paybackYears,
      breakEvenPercentage,
      annualTurnover: estimatedAnnualTurnover,
      annualNetProfit: projections[0]?.pat || 0
    },
    projections
  };
}

module.exports = {
  calculateFinancials
};
