import React, { useState } from 'react';
import { getTranslation } from '../../i18n/translations';
import { Search, Filter, ShieldCheck, IndianRupee, ExternalLink, FileCheck, CheckCircle2, ChevronRight } from 'lucide-react';

export default function SchemeExplorer({ schemes, currentLang, onSelectScheme }) {
  const t = (key) => getTranslation(currentLang, key);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minSubsidy, setMinSubsidy] = useState(0);

  const categories = ['All', 'Manufacturing', 'Food Processing', 'Dairy', 'Services', 'Fisheries', 'Retail'];

  const filteredSchemes = (schemes || []).filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.categories.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase()));
    const subsidyRate = s.subsidy?.specialRural || s.subsidy?.generalRural || 0;
    const matchesSubsidy = subsidyRate >= minSubsidy;
    return matchesSearch && matchesCat && matchesSubsidy;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Title & Filter Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-rural bg-rural-pale px-3 py-1 rounded-full uppercase tracking-wider">
            Government Scheme Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Central & State Micro-Enterprise Credit Schemes
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Official credit-linked subsidies, interest subvention programs, and collateral-free loan facilities verified under MSME, KVIC, NABARD, and SIDBI guidelines.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search scheme name, dairy, food processing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-rural/20 focus:border-rural outline-none transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-rural/20 focus:border-rural outline-none transition-all cursor-pointer"
            >
              {categories.map(c => (
                <option key={c} value={c}>Sector: {c}</option>
              ))}
            </select>
          </div>

          {/* Min Subsidy Filter */}
          <div>
            <select
              value={minSubsidy}
              onChange={(e) => setMinSubsidy(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-rural/20 focus:border-rural outline-none transition-all cursor-pointer"
            >
              <option value={0}>All Subsidy Slabs (0% - 60%)</option>
              <option value={25}>At Least 25% Subsidy</option>
              <option value={35}>At Least 35% Subsidy (PMEGP / PMFME)</option>
              <option value={50}>High Grant (50%+ MIDH / PMMSY)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => {
          const maxSubsidy = scheme.subsidy?.specialRural || scheme.subsidy?.generalRural || 0;
          return (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-rural/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Nodal: {scheme.nodalAgency}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {scheme.name}
                    </h3>
                  </div>

                  {maxSubsidy > 0 ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-300 flex-shrink-0">
                      {maxSubsidy}% Subsidy
                    </span>
                  ) : scheme.interestSubvention ? (
                    <span className="bg-blue-100 text-khadi text-xs font-black px-2.5 py-1 rounded-full border border-blue-300 flex-shrink-0">
                      {scheme.interestSubvention}% Subvention
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                      Collateral Free
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {scheme.description}
                </p>

                {/* Scheme Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Own Equity</span>
                    <span className="font-bold text-slate-800">{scheme.ownContribution?.special || 10}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Max Project</span>
                    <span className="font-bold text-slate-800">
                      {scheme.maxProjectCost ? `₹${(scheme.maxProjectCost / 100000).toFixed(0)}L` : 'Flexible'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Repayment</span>
                    <span className="font-bold text-slate-800">{scheme.tenureYears || 5} Years</span>
                  </div>
                </div>

                {/* Required Documents Pill List */}
                <div className="pt-3">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Key Documents:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(scheme.requiredDocs || []).slice(0, 4).map((doc, dIdx) => (
                      <span key={dIdx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {doc}
                      </span>
                    ))}
                    {(scheme.requiredDocs || []).length > 4 && (
                      <span className="text-[10px] text-slate-400 px-1 py-0.5">
                        +{scheme.requiredDocs.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <a
                  href={scheme.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-rural hover:text-rural-dark"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {onSelectScheme && (
                  <button
                    type="button"
                    onClick={() => onSelectScheme(scheme.id)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-rural text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    <span>Use in Advisory</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
