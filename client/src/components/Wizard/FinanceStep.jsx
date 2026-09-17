import React, { useState } from 'react';
import { getTranslation } from '../../i18n/translations';
import { IndianRupee, Landmark, Percent, Calendar, CheckCircle2, ArrowRight, ArrowLeft, Layers, ShieldCheck, ChevronDown } from 'lucide-react';

export default function FinanceStep({
  analysisData,
  onRecalculateFinances,
  onContinue,
  onBack,
  currentLang
}) {
  const t = (key) => getTranslation(currentLang, key);

  if (!analysisData || !analysisData.finances) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <div className="animate-spin w-8 h-8 border-4 border-rural border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600">Structuring bankable financial models...</p>
      </div>
    );
  }

  const { finances, schemes, profile } = analysisData;
  const bestScheme = schemes.bestScheme;

  const [tenureYears, setTenureYears] = useState(finances.tenureYears || 5);
  const [interestRate, setInterestRate] = useState(finances.interestRate || 9.0);
  const [moratoriumMonths, setMoratoriumMonths] = useState(finances.moratoriumMonths || 6);
  const [showProjections, setShowProjections] = useState(false);

  // Trigger recalculation when slider values change
  const handleSliderChange = (newTenure, newRate, newMoratorium) => {
    setTenureYears(newTenure);
    setInterestRate(newRate);
    setMoratoriumMonths(newMoratorium);
    onRecalculateFinances({
      projectCost: finances.projectCost,
      userCapital: finances.entrepreneurEquity,
      schemeId: bestScheme.id,
      tenureYears: newTenure,
      interestRate: newRate,
      moratoriumMonths: newMoratorium
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Recommended Scheme Banner */}
      <div className="bg-gradient-to-r from-rural-dark via-rural to-emerald-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-rural-dark text-[10px] font-black px-2 py-0.5 rounded tracking-wide uppercase">
              Best Matched Scheme
            </span>
            <span className="text-emerald-200 text-xs font-medium">
              Score: {bestScheme.matchScore}/100 Match
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight">{bestScheme.name}</h3>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            {bestScheme.description}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-right flex-shrink-0">
          <span className="text-[10px] text-emerald-200 block font-medium">Govt Subsidy Assistance</span>
          <span className="text-2xl font-black text-amber-300">
            {finances.subsidyPercentage}% ({`₹${finances.governmentSubsidy.toLocaleString('en-IN')}`})
          </span>
        </div>
      </div>

      {/* 4 Core Financial Structuring Cards (Exact Slide 2 Model) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Project Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100 rounded-bl-full pointer-events-none -z-0" />
          <span className="text-xs font-bold text-slate-500 block mb-1">Total Project Cost</span>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{finances.projectCost.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Capex machinery + 30-day working capital reserve
          </p>
        </div>

        {/* Your Margin Equity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full pointer-events-none -z-0" />
          <span className="text-xs font-bold text-khadi block mb-1">
            Your Capital (Margin {finances.marginPercentage}%)
          </span>
          <div className="text-2xl font-black text-khadi-dark tracking-tight">
            ₹{finances.entrepreneurEquity.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Entrepreneur's own equity contribution
          </p>
        </div>

        {/* Government Subsidy */}
        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-300 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200/40 rounded-bl-full pointer-events-none -z-0" />
          <span className="text-xs font-bold text-emerald-800 block mb-1">
            Govt Subsidy ({finances.subsidyPercentage}%)
          </span>
          <div className="text-2xl font-black text-emerald-900 tracking-tight">
            ₹{finances.governmentSubsidy.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 mt-2">
            Back-ended margin money (No repayment needed)
          </p>
        </div>

        {/* Sanctioned Bank Loan */}
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-300 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200/40 rounded-bl-full pointer-events-none -z-0" />
          <span className="text-xs font-bold text-amber-900 block mb-1">Sanctioned Bank Loan</span>
          <div className="text-2xl font-black text-amber-950 tracking-tight">
            ₹{finances.sanctionedBankLoan.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-amber-800 mt-2">
            Financed by Commercial Bank / RRB
          </p>
        </div>
      </div>

      {/* EMI Repayment & Viability Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900">Interactive Loan Repayment & EMI Simulator</h4>
            <p className="text-xs text-slate-500">Standard reducing balance amortization with rural moratorium</p>
          </div>

          <div className="bg-rural-pale px-4 py-2.5 rounded-xl border border-rural-border flex items-center gap-3">
            <div>
              <span className="text-[10px] font-bold text-rural-dark block uppercase">Monthly Bank EMI</span>
              <span className="text-2xl font-black text-rural font-sans">
                ₹{finances.monthlyEMI.toLocaleString('en-IN')}
                <span className="text-xs text-slate-500 font-normal"> / month</span>
              </span>
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tenure Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Loan Tenure:</span>
              <span className="text-rural font-bold">{tenureYears} Years ({tenureYears * 12} Mos)</span>
            </div>
            <input
              type="range"
              min="3"
              max="7"
              step="1"
              value={tenureYears}
              onChange={(e) => handleSliderChange(Number(e.target.value), interestRate, moratoriumMonths)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rural"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>3 Years</span>
              <span>5 Years (Standard)</span>
              <span>7 Years</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Annual Interest Rate:</span>
              <span className="text-rural font-bold">{interestRate}% p.a.</span>
            </div>
            <input
              type="range"
              min="6.5"
              max="12.0"
              step="0.25"
              value={interestRate}
              onChange={(e) => handleSliderChange(tenureYears, Number(e.target.value), moratoriumMonths)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rural"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>6.5% (Subsidized)</span>
              <span>9.0% (Mudra/PMEGP)</span>
              <span>12.0%</span>
            </div>
          </div>

          {/* Moratorium Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Moratorium Grace Period:</span>
              <span className="text-rural font-bold">{moratoriumMonths} Months</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="3"
              value={moratoriumMonths}
              onChange={(e) => handleSliderChange(tenureYears, interestRate, Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rural"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 (Immediate)</span>
              <span>6 Months (Standard)</span>
              <span>12 Months</span>
            </div>
          </div>
        </div>

        {/* Banking Viability Key Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block">DSCR Coverage</span>
            <span className="text-lg font-black text-emerald-700">{finances.viability.dscr}x</span>
            <span className="text-[10px] text-emerald-800 block font-medium">{finances.viability.dscrRating}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block">Capital Payback</span>
            <span className="text-lg font-black text-slate-900">{finances.viability.paybackYears} Years</span>
            <span className="text-[10px] text-slate-400 block">Capital Recovery</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block">Break-Even Point</span>
            <span className="text-lg font-black text-slate-900">{finances.viability.breakEvenPercentage}%</span>
            <span className="text-[10px] text-slate-400 block">Of Operating Capacity</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block">Est. Year 1 Net Profit</span>
            <span className="text-lg font-black text-rural font-sans">
              ₹{finances.viability.annualNetProfit.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block">After Interest & Tax</span>
          </div>
        </div>

        {/* Toggle 5-Year Projection Statement */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowProjections(!showProjections)}
            className="flex items-center gap-2 text-xs font-bold text-rural hover:text-rural-dark"
          >
            <span>{showProjections ? 'Hide' : 'View'} 5-Year Projected Profitability & Cashflow Statement</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showProjections ? 'rotate-180' : ''}`} />
          </button>

          {showProjections && (
            <div className="mt-4 overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3">Projected Revenue</th>
                    <th className="py-2.5 px-3">Operating Exp (Opex)</th>
                    <th className="py-2.5 px-3">Operating Profit (EBIDTA)</th>
                    <th className="py-2.5 px-3">Interest Paid</th>
                    <th className="py-2.5 px-3">Principal Repaid</th>
                    <th className="py-2.5 px-3">Net Profit (PAT)</th>
                    <th className="py-2.5 px-3">Closing Loan Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {finances.projections.map((p) => (
                    <tr key={p.year} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-bold">Year {p.year}</td>
                      <td className="py-2.5 px-3">₹{p.revenue.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-slate-500">₹{p.opex.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-700">₹{p.ebidta.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-red-600">₹{p.interest.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-blue-600">₹{p.principalRepaid.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">₹{p.pat.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">₹{p.closingLoan.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Machinery Capex Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-khadi flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Machinery & Fixed Capital Cost Breakdown</h4>
            <p className="text-[11px] text-slate-500">Pre-vetted vendor price estimates for project loan appraisal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {profile.equipment.map((eq, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-800">{eq.name}</span>
              <span className="font-bold text-slate-900 font-sans">₹{eq.cost.toLocaleString('en-IN')}</span>
            </div>
          ))}
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
          <span>Continue to Action Roadmap & DPR</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
