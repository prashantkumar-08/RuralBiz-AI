/**
 * Hyper-Local Market Feasibility Engine (5-10 km Radius)
 * Evaluates local demand, competition density, and supply chain viability.
 */

const businessProfiles = require('../data/businessProfiles.json');
const msmeStats = require('../data/msmeStats.json');

function analyzeMarket({
  district = 'Anand',
  state = 'Gujarat',
  businessId = 'dairy-farming',
  capital = 100000,
  isRural = true
}) {
  const profile = businessProfiles.find(b => b.id === businessId) || businessProfiles[0];

  // Derive hyper-local cluster metrics based on district and business category
  const radiusKm = profile.targetRadiusKm || 8;
  
  // Calculate component scores out of 100
  // 1. Raw Material Availability (Max 25 pts)
  let rawMaterialScore = 22;
  if (profile.category === 'Dairy' || profile.category === 'Livestock') {
    rawMaterialScore = isRural ? 24 : 16;
  } else if (profile.category === 'Agro-Processing') {
    rawMaterialScore = isRural ? 23 : 18;
  }

  // 2. Local Market Demand (Max 30 pts)
  let demandScore = 26;
  if (profile.localDemandFactor === 'Very High') demandScore = 28;
  else if (profile.localDemandFactor === 'High') demandScore = 25;
  else demandScore = 21;

  // 3. Competition Density (Max 25 pts) - Inverse of competition
  let competitionScore = 20;
  let competitorDensity = 'Moderate';
  let competitorsInRadius = 3;
  if (profile.competitionLevel === 'Low' || profile.competitionLevel === 'Very Low') {
    competitionScore = 23;
    competitorDensity = 'Low (High Market Opportunity)';
    competitorsInRadius = 1;
  } else if (profile.competitionLevel === 'High') {
    competitionScore = 15;
    competitorDensity = 'High (Requires Quality Differentiation)';
    competitorsInRadius = 6;
  }

  // 4. Logistics & Infrastructure / Mandi Proximity (Max 20 pts)
  let logisticsScore = 15;
  const mandiItem = msmeStats.mandiPrices.find(m => 
    m.commodity.toLowerCase().includes(profile.category.toLowerCase()) || 
    m.commodity.toLowerCase().includes(profile.name.split(' ')[0].toLowerCase())
  ) || msmeStats.mandiPrices[0];

  const totalFeasibilityScore = Math.min(96, Math.max(45, rawMaterialScore + demandScore + competitionScore + logisticsScore));

  let scoreTier = 'High Viability';
  let badgeColor = 'emerald';
  if (totalFeasibilityScore >= 80) {
    scoreTier = 'High Feasibility (Bank Recommended)';
    badgeColor = 'emerald';
  } else if (totalFeasibilityScore >= 65) {
    scoreTier = 'Moderate Feasibility (Good Potential)';
    badgeColor = 'amber';
  } else {
    scoreTier = 'Challenging (Requires Strategic Pivot)';
    badgeColor = 'rose';
  }

  return {
    district,
    state,
    businessId: profile.id,
    businessName: profile.name,
    radiusKm,
    feasibilityScore: totalFeasibilityScore,
    scoreTier,
    badgeColor,
    breakdown: {
      rawMaterial: { score: rawMaterialScore, max: 25, label: 'Raw Material Proximity' },
      demand: { score: demandScore, max: 30, label: 'Local Market Demand' },
      competition: { score: competitionScore, max: 25, label: 'Low Competition Advantage' },
      logistics: { score: logisticsScore, max: 20, label: 'Mandi & Transport Proximity' }
    },
    localInsight: {
      competitorDensity,
      competitorsInRadius,
      estimatedConsumerHouseholds: isRural ? '4,500 - 6,000 households' : '15,000+ households',
      targetCustomerSegments: ['Local Village Retailers', 'Weekly Haats / Bazaars', 'Dairy/Agri Cooperatives', 'Direct Farm Gate Buyers'],
      nearestMandi: mandiItem.mandi,
      benchmarkCommodityRate: `${mandiItem.commodity}: ₹${mandiItem.modalPricePerQuintal} / quintal (${mandiItem.trend})`,
      keyStrengths: [
        'Local raw materials available within walking distance',
        'Direct consumption demand with daily cash liquidity',
        'Eligible for priority sector rural micro-lending'
      ],
      riskMitigations: profile.mitigation || ['Maintain tie-ups with district cooperatives', 'Avoid single-buyer dependency']
    }
  };
}

module.exports = {
  analyzeMarket
};
