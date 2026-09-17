import React from 'react';
import { getTranslation } from '../../i18n/translations';
import { ShieldCheck, TrendingUp, Users, Truck, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, Compass } from 'lucide-react';

export default function AnalyzeStep({
  analysisData,
  onContinue,
  onBack,
  currentLang
}) {
  const t = (key) => getTranslation(currentLang, key);

  if (!analysisData || !analysisData.market) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <div className="animate-spin w-8 h-8 border-4 border-rural border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600">Calculating hyper-local market feasibility...</p>
      </div>
    );
  }

  const { market, profile } = analysisData;
  const score = market.feasibilityScore;
  const breakdown = market.breakdown;

  // Circular gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner with Score Gauge */}
      <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left: Animated Circular Gauge */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="14"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#2e7d32"
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 font-sans tracking-tight">
                  {score}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Out of 100
                </span>
              </div>
            </div>

            <div className="mt-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                {market.scoreTier}
              </span>
            </div>
          </div>

          {/* Right: High Level Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rural-pale text-rural-dark border border-rural-border">
                {profile.businessName}
              </span>
              <span className="text-xs font-medium text-slate-500">
                in {profile.district}, {profile.state}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Strong Viability for Rural Micro-Enterprise
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Based on agro-climatic availability, local consumption patterns, and low competitor saturation within a{' '}
              <strong className="text-slate-900">{market.radiusKm} km radius</strong>, this project qualifies for Tier-1 priority sector micro-lending under government subsidy schemes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-400 block font-medium">Radius Coverage</span>
                <span className="text-sm font-bold text-slate-900">{market.radiusKm} km Cluster</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-400 block font-medium">Competitor Density</span>
                <span className="text-sm font-bold text-emerald-700">{market.localInsight.competitorDensity}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block font-medium">Target Population</span>
                <span className="text-sm font-bold text-slate-900">{market.localInsight.estimatedConsumerHouseholds}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Score Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(breakdown).map(([key, item]) => {
          const pct = Math.round((item.score / item.max) * 100);
          return (
            <div key={key} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
                <span className="text-xs font-black text-rural">
                  {item.score} / {item.max}
                </span>
              </div>

              {/* Mini Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rural rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <span className="text-[11px] text-slate-500 block">
                {pct >= 85 ? '🌟 Exceptional Strength' : pct >= 70 ? '✅ Healthy Benchmark' : '⚠️ Requires Attention'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Local Market & Mandi Grounding (Slide 6 Open Data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Mandi & Supply Chain */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Agmarknet Mandi Price Grounding</h4>
              <p className="text-[11px] text-slate-500">Official APMC modal benchmark rate</p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
            <div className="text-xs font-bold text-amber-950">Nearest APMC Hub: {market.localInsight.nearestMandi}</div>
            <div className="text-xs text-amber-900 font-medium">
              Current Benchmark: <span className="font-bold">{market.localInsight.benchmarkCommodityRate}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="font-bold text-slate-800">Target Buyer Segments in Radius:</div>
            <ul className="space-y-1.5">
              {market.localInsight.targetCustomerSegments.map((seg, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rural" />
                  <span>{seg}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Risk Mitigation Strategy */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Risk Assessment & Mitigation</h4>
              <p className="text-[11px] text-slate-500">Domain safeguards to protect cashflow</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {market.localInsight.riskMitigations.map((mit, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-rural flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium leading-relaxed">{mit}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
            <strong>Bank Mitra Tip:</strong> High feasibility score ({score}/100) fast-tracks DIC loan recommendation under PMEGP Task Force clearance.
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backButton')}</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-2 bg-gradient-to-r from-rural to-emerald-700 hover:from-rural-dark hover:to-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-102"
        >
          <span>Continue to Financial Structuring</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
