import React, { useState } from 'react';
import { getTranslation } from '../../i18n/translations';
import { TrendingUp, Building2, MapPin, PhoneCall, Mail, ArrowUpRight, BarChart3, ShieldCheck } from 'lucide-react';

export default function MandiExplorer({ mandiData, currentLang }) {
  const t = (key) => getTranslation(currentLang, key);

  const [selectedMandiTab, setSelectedMandiTab] = useState('mandi'); // 'mandi' or 'dic'

  const mandiPrices = mandiData?.mandiPrices || [];
  const dicDirectory = mandiData?.dicDirectory || [];
  const nationalStats = mandiData?.nationalStats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Open Data & Cluster Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Agmarknet Mandi Rates & DIC Directory
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Grounded with real-time APMC commodity price feeds and District Industries Centre support contacts.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedMandiTab('mandi')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedMandiTab === 'mandi'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mandi Prices (APMC)
            </button>
            <button
              onClick={() => setSelectedMandiTab('dic')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedMandiTab === 'dic'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DIC District Directory
            </button>
          </div>
        </div>

        {/* National MSME Benchmark Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Total MSMEs in India</span>
            <span className="text-xl font-black text-slate-900">{nationalStats.totalMicroEnterprises || '63.3 Million'}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Rural MSME Share</span>
            <span className="text-xl font-black text-rural">{nationalStats.ruralShare || '51.25%'}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Avg. Starting Capital</span>
            <span className="text-xl font-black text-slate-900">{nationalStats.averageStartingCapital || '₹1,15,000'}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Units Assisted (PMEGP)</span>
            <span className="text-xl font-black text-amber-700">{nationalStats.pmegpUnitsAssisted || '9,25,000+'}</span>
          </div>
        </div>
      </div>

      {/* Tab 1: Mandi Price Explorer */}
      {selectedMandiTab === 'mandi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mandiPrices.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                      {item.variety}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {item.trend}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    {item.commodity}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.mandi}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500 font-medium">Modal Price:</span>
                    <span className="text-xl font-black text-slate-900 font-sans">
                      ₹{item.modalPricePerQuintal.toLocaleString('en-IN')}
                      <span className="text-[10px] text-slate-400 font-normal"> / quintal</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Range: ₹{item.minPrice} - ₹{item.maxPrice}</span>
                    <span>Arrival: {item.arrivalQuantity}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                  <span>Market Sentiment:</span>
                  <span className="font-bold text-emerald-700">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: DIC Directory */}
      {selectedMandiTab === 'dic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dicDirectory.map((dic, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {dic.state} State
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {dic.officeName}
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-khadi">
                  Lead Bank: {dic.leadBank}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{dic.address}</span>
                </div>
                <div className="flex items-center gap-2 text-rural-dark font-bold">
                  <PhoneCall className="w-4 h-4 text-rural" />
                  <span>{dic.gmContact}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{dic.helpdeskEmail}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Cluster Focus:</span>
                <span className="font-semibold text-slate-800">{dic.clusterFocus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
