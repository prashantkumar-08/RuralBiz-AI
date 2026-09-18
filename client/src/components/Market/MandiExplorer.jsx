import React, { useState, useMemo } from 'react';
import { getTranslation } from '../../i18n/translations';
import {
  TrendingUp, TrendingDown, MapPin, PhoneCall, Mail,
  Search, Building2, Minus
} from 'lucide-react';

const CATEGORY_COLORS = {
  'Cereals':              { bg: 'bg-amber-100',   text: 'text-amber-800',   dot: 'bg-amber-500'   },
  'Pulses':               { bg: 'bg-orange-100',  text: 'text-orange-800',  dot: 'bg-orange-500'  },
  'Oilseeds':             { bg: 'bg-yellow-100',  text: 'text-yellow-800',  dot: 'bg-yellow-600'  },
  'Spices':               { bg: 'bg-red-100',     text: 'text-red-800',     dot: 'bg-red-500'     },
  'Vegetables':           { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  'Fruits':               { bg: 'bg-pink-100',    text: 'text-pink-800',    dot: 'bg-pink-500'    },
  'Cash Crops':           { bg: 'bg-lime-100',    text: 'text-lime-800',    dot: 'bg-lime-600'    },
  'Fibre Crops':          { bg: 'bg-teal-100',    text: 'text-teal-800',    dot: 'bg-teal-600'    },
  'Livestock & Dairy':    { bg: 'bg-blue-100',    text: 'text-blue-800',    dot: 'bg-blue-500'    },
  'Poultry':              { bg: 'bg-sky-100',     text: 'text-sky-800',     dot: 'bg-sky-500'     },
  'Minor Forest Produce': { bg: 'bg-purple-100',  text: 'text-purple-800',  dot: 'bg-purple-500'  },
  'Horticulture / MFP':  { bg: 'bg-violet-100',  text: 'text-violet-800',  dot: 'bg-violet-500'  },
};

function TrendBadge({ trend }) {
  if (!trend) return null;
  const isUp   = trend.includes('+');
  const isDown = trend.includes('-');
  const isFlat = !isUp && !isDown;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
      isUp   ? 'bg-emerald-100 text-emerald-800' :
      isDown ? 'bg-red-100 text-red-800' :
               'bg-slate-100 text-slate-600'
    }`}>
      {isUp   && <TrendingUp   className="w-3 h-3" />}
      {isDown && <TrendingDown className="w-3 h-3" />}
      {isFlat && <Minus        className="w-3 h-3" />}
      {trend}
    </span>
  );
}

export default function MandiExplorer({ mandiData, currentLang }) {
  const t = (key) => getTranslation(currentLang, key);

  const [activeView, setActiveView]         = useState('mandi');   // 'mandi' | 'dic'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery]       = useState('');

  const mandiPrices  = mandiData?.mandiPrices  || [];
  const dicDirectory = mandiData?.dicDirectory || [];
  const nationalStats = mandiData?.nationalStats || {};

  // Derive sorted unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(mandiPrices.map(m => m.category).filter(Boolean))].sort();
    return ['All', ...cats];
  }, [mandiPrices]);

  // Filter list
  const filtered = useMemo(() => {
    return mandiPrices.filter(m => {
      const matchCat    = selectedCategory === 'All' || m.category === selectedCategory;
      const q           = searchQuery.toLowerCase();
      const matchSearch = !q ||
        m.commodity?.toLowerCase().includes(q) ||
        m.mandi?.toLowerCase().includes(q)     ||
        m.state?.toLowerCase().includes(q)     ||
        m.variety?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [mandiPrices, selectedCategory, searchQuery]);

  const formatPrice = (v) =>
    `₹${Number(v).toLocaleString('en-IN')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Agmarknet Live Feed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Mandi Commodity Prices &amp; DIC Directory
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {mandiPrices.length} commodities across 12 categories sourced from APMC mandis nationwide.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveView('mandi')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeView === 'mandi'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mandi Prices
            </button>
            <button
              onClick={() => setActiveView('dic')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeView === 'dic'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DIC Directory
            </button>
          </div>
        </div>

        {/* National MSME stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {[
            { label: 'Total MSMEs in India',   value: nationalStats.totalMicroEnterprises || '63.3M',     color: 'text-slate-900' },
            { label: 'Rural MSME Share',        value: nationalStats.ruralShare            || '51.25%',    color: 'text-emerald-700' },
            { label: 'Avg Starting Capital',    value: nationalStats.averageStartingCapital|| '₹1,15,000', color: 'text-slate-900' },
            { label: 'PMEGP Units Assisted',    value: nationalStats.pmegpUnitsAssisted    || '9,25,000+', color: 'text-amber-700' },
          ].map(s => (
            <div key={s.label} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">{s.label}</span>
              <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mandi Prices View ──────────────────────────────────── */}
      {activeView === 'mandi' && (
        <div className="space-y-5">

          {/* Search + Category filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search commodity, mandi or state…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
              />
            </div>

            {/* Result count */}
            <span className="text-xs font-semibold text-slate-500 shrink-0">
              {filtered.length} / {mandiPrices.length} commodities
            </span>
          </div>

          {/* Category pill filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              const style    = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                    isActive
                      ? style
                        ? `${style.bg} ${style.text} border-transparent shadow-xs`
                        : 'bg-slate-900 text-white border-transparent'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {cat === 'All' ? `All (${mandiPrices.length})` : cat}
                </button>
              );
            })}
          </div>

          {/* Cards grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((item, idx) => {
                const style = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Cereals'];
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-5 space-y-4"
                  >
                    {/* Top row: category + trend */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${style.bg} ${style.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {item.category || 'Other'}
                      </span>
                      <TrendBadge trend={item.trend} />
                    </div>

                    {/* Commodity name + mandi */}
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{item.commodity}</h3>
                      {item.variety && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.variety}</p>
                      )}
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {item.mandi}
                      </p>
                    </div>

                    {/* Price block */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] text-slate-500">Modal Price</span>
                        <span className="text-lg font-black text-slate-900">
                          {formatPrice(item.modalPricePerQuintal)}
                          <span className="text-[10px] text-slate-400 font-normal"> /qtl</span>
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <span>{formatPrice(item.minPrice)} – {formatPrice(item.maxPrice)}</span>
                        <span>{item.arrivalQuantity}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Sentiment</span>
                      <span className="font-bold text-emerald-700">{item.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── DIC Directory View ─────────────────────────────────── */}
      {activeView === 'dic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dicDirectory.map((dic, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {dic.state} State
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{dic.officeName}</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 shrink-0">
                  {dic.leadBank}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{dic.address}</span>
                </div>
                <a href={`tel:${dic.gmContact}`} className="flex items-center gap-2 text-emerald-800 font-bold hover:underline">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  {dic.gmContact}
                </a>
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {dic.helpdeskEmail}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cluster Focus</span>
                <span className="text-xs font-semibold text-slate-800">{dic.clusterFocus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
