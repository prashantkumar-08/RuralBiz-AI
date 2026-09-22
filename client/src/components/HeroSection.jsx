import React from 'react';
import { getTranslation } from '../i18n/translations';
import { ShieldCheck, TrendingUp, Award, IndianRupee, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ currentLang, onQuickSelect }) {
  const t = (key) => getTranslation(currentLang, key);

  const quickPicks = [
    { label: '🐄 Dairy Farming (₹1 Lakh Capital)', capital: 100000, businessId: 'dairy-farming' },
    { label: '🌶️ Spices & Mustard Grinding (₹50,000)', capital: 50000, businessId: 'mustard-spices-grinding' },
    { label: '🚜 Custom Hiring Centre (₹1.5 Lakhs)', capital: 150000, businessId: 'custom-hiring-center' },
    { label: '🍄 Mushroom Cultivation (₹35,000)', capital: 35000, businessId: 'mushroom-cultivation' }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-slate-200">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rural-pale/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 right-1/4 w-80 h-80 bg-solar-pale/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* SIH 2026 Pill */}
          

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Turn Your Capital into a{' '}
            <span className="bg-gradient-to-r from-rural-dark via-rural to-emerald-600 bg-clip-text text-transparent">
              Bankable Rural Enterprise
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t('heroSubheading')}
          </p>

          {/* Quick Filter Presets */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Quick Start Presets:
            </span>
            {quickPicks.map((pick, i) => (
              <button
                key={i}
                onClick={() => onQuickSelect(pick)}
                className="text-xs bg-white hover:bg-rural-pale text-slate-700 hover:text-rural-dark font-semibold px-3 py-1.5 rounded-full border border-slate-200 hover:border-rural/40 shadow-2xs transition-all hover:scale-102 flex items-center gap-1"
              >
                <span>{pick.label}</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* 4 Pillars Stat Bar */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-rural-soft hover:border-rural/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900">Up to 35%</div>
                <div className="text-xs text-slate-500 font-medium">PMEGP Capital Subsidy</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-rural-soft hover:border-rural/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900">5-10 km</div>
                <div className="text-xs text-slate-500 font-medium">Hyper-Local Radius Demand</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-rural-soft hover:border-rural/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900">1:10 Ratio</div>
                <div className="text-xs text-slate-500 font-medium">Equity to Loan Leverage</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-rural-soft hover:border-rural/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900">Bank-Ready</div>
                <div className="text-xs text-slate-500 font-medium">Detailed Project Report (DPR)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
