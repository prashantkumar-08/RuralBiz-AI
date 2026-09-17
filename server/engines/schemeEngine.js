/**
 * Government Scheme Recommendation & Eligibility Engine
 */

const schemes = require('../data/schemes.json');

function matchSchemes({
  projectCost = 1000000,
  category = 'General',
  gender = 'Male',
  isRural = true,
  businessSector = 'Dairy'
}) {
  const isSpecial = ['OBC', 'SC', 'ST', 'Women', 'Minorities'].includes(category) || gender === 'Female' || isRural;

  const matched = schemes.map(scheme => {
    let eligible = true;
    let matchScore = 70;
    const matchReasons = [];

    // Category eligibility
    if (scheme.id === 'standup_india') {
      if (gender === 'Female' || ['SC', 'ST'].includes(category)) {
        eligible = true;
        matchScore += 20;
        matchReasons.push('Priority greenfield funding reserved for Women & SC/ST');
      } else {
        eligible = false;
      }
    }

    // Cost limits
    if (scheme.maxProjectCost && projectCost > scheme.maxProjectCost) {
      eligible = false;
    }
    if (scheme.minProjectCost && projectCost < scheme.minProjectCost) {
      eligible = false;
    }

    // Subsidy calculation for comparison
    let subsidyPercentage = 0;
    if (scheme.subsidy) {
      if (isSpecial) {
        subsidyPercentage = isRural ? scheme.subsidy.specialRural : scheme.subsidy.specialUrban;
      } else {
        subsidyPercentage = isRural ? scheme.subsidy.generalRural : scheme.subsidy.generalUrban;
      }
    }

    if (subsidyPercentage >= 35) {
      matchScore += 25;
      matchReasons.push(`High government subsidy of ${subsidyPercentage}% available`);
    } else if (subsidyPercentage > 0) {
      matchScore += 15;
      matchReasons.push(`${subsidyPercentage}% capital subsidy support`);
    }

    if (scheme.interestSubvention) {
      matchScore += 20;
      matchReasons.push(`${scheme.interestSubvention}% annual interest subvention rebate`);
    }

    // Sector matching
    const sectorMatch = scheme.categories.some(cat => 
      businessSector.toLowerCase().includes(cat.toLowerCase()) || 
      cat.toLowerCase().includes(businessSector.toLowerCase())
    );
    if (sectorMatch) {
      matchScore += 20;
      matchReasons.push(`Specifically targeted for ${businessSector} sector`);
    }

    let calculatedSubsidyAmount = Math.round((subsidyPercentage / 100) * projectCost);
    if (scheme.subsidy?.maxCap && calculatedSubsidyAmount > scheme.subsidy.maxCap) {
      calculatedSubsidyAmount = scheme.subsidy.maxCap;
    }

    return {
      ...scheme,
      eligible,
      matchScore: eligible ? Math.min(99, matchScore) : 0,
      subsidyPercentage,
      calculatedSubsidyAmount,
      matchReasons
    };
  });

  const eligibleSchemes = matched.filter(s => s.eligible).sort((a, b) => b.matchScore - a.matchScore);
  const bestScheme = eligibleSchemes[0] || schemes[0];

  return {
    bestScheme,
    allEligibleSchemes: eligibleSchemes,
    totalSchemesCount: schemes.length
  };
}

module.exports = {
  matchSchemes,
  getAllSchemes: () => schemes
};
