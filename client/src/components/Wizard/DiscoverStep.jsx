import React from 'react';
import { getTranslation } from '../../i18n/translations';
import { IndianRupee, MapPin, Sparkles, User, Briefcase, Check, ArrowRight, Info } from 'lucide-react';

export default function DiscoverStep({
  formData,
  setFormData,
  businessProfiles,
  onContinue,
  currentLang
}) {
  const t = (key) => getTranslation(currentLang, key);

  const capitalPresets = [
    { label: '₹25,000', value: 25000 },
    { label: '₹50,000', value: 50000 },
    { label: '₹1,00,000', value: 100000, recommended: true },
    { label: '₹2,00,000', value: 200000 },
    { label: '₹5,00,000', value: 500000 },
    { label: '₹10,00,000', value: 1000000 }
  ];

  const statesAndDistricts = {
    'Gujarat': ['Anand', 'Mehsana', 'Rajkot', 'Banaskantha', 'Surat'],
    'Uttar Pradesh': ['Varanasi', 'Gorakhpur', 'Lucknow', 'Prayagraj', 'Bareilly'],
    'Maharashtra': ['Nashik', 'Pune', 'Kolhapur', 'Ahmednagar', 'Nagpur'],
    'Rajasthan': ['Alwar', 'Jaipur', 'Jodhpur', 'Kota', 'Udaipur'],
    'Madhya Pradesh': ['Indore', 'Ujjain', 'Bhopal', 'Jabalpur', 'Sagar'],
    'Bihar': ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga'],
    'Karnataka': ['Gulbarga', 'Dharwad', 'Mysuru', 'Belagavi', 'Tumakuru'],
    'Tamil Nadu': ['Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Erode'],
    'Punjab': ['Khanna', 'Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar']
  };

  const selectedBusiness = businessProfiles.find(b => b.id === formData.businessId) || businessProfiles[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Location & Demographic Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-rural-pale text-rural-dark flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">1. Geographical & Demographic Profile</h3>
            <p className="text-xs text-slate-500">Determines local mandi proximity and maximum government subsidy slabs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* State */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">State</label>
            <select
              value={formData.state}
              onChange={(e) => {
                const newState = e.target.value;
                const newDistricts = statesAndDistricts[newState] || ['General District'];
                setFormData({ ...formData, state: newState, district: newDistricts[0] });
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-rural/20 focus:border-rural outline-none transition-all"
            >
              {Object.keys(statesAndDistricts).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">District / Taluk</label>
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-rural/20 focus:border-rural outline-none transition-all"
            >
              {(statesAndDistricts[formData.state] || []).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Social Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Social Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-rural/20 focus:border-rural outline-none transition-all"
            >
              <option value="OBC">OBC (Other Backward Classes) - Special</option>
              <option value="SC">SC (Scheduled Caste) - Special</option>
              <option value="ST">ST (Scheduled Tribe) - Special</option>
              <option value="Women">Women Entrepreneur - Special</option>
              <option value="Minorities">Minorities - Special</option>
              <option value="General">General Category</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'Male' })}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  formData.gender === 'Male'
                    ? 'bg-rural text-white border-rural shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'Female' })}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  formData.gender === 'Female'
                    ? 'bg-rural text-white border-rural shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Female (35% Subsidy)
              </button>
            </div>
          </div>
        </div>

        {/* Rural vs Urban Toggle Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="ruralToggle"
              checked={formData.isRural}
              onChange={(e) => setFormData({ ...formData, isRural: e.target.checked })}
              className="w-5 h-5 text-rural rounded accent-rural cursor-pointer"
            />
            <label htmlFor="ruralToggle" className="cursor-pointer text-xs font-bold text-slate-900">
              <span className="text-rural-dark font-extrabold">Rural Village Location</span> (Gram Panchayat Area)
              <span className="block text-[11px] font-normal text-emerald-800">
                Qualifies for maximum 35% PMEGP subsidy with only 5% own margin contribution.
              </span>
            </label>
          </div>
          <span className="text-[11px] font-bold bg-white text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300 shadow-2xs">
            {formData.isRural ? '✨ 35% Special Rural Subsidy Active' : 'ℹ️ Standard 15-25% Urban Slabs'}
          </span>
        </div>
      </div>

      {/* Capital Equity Input Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-solar-pale text-solar-dark flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('capitalLabel')}</h3>
              <p className="text-xs text-slate-500">{t('capitalHelp')}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Your Equity:</span>
            <div className="text-2xl font-black text-slate-900 font-sans tracking-tight">
              ₹{Number(formData.capital).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-3">
          <input
            type="range"
            min="10000"
            max="2500000"
            step="10000"
            value={formData.capital}
            onChange={(e) => setFormData({ ...formData, capital: Number(e.target.value) })}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rural"
          />
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span>₹10,000 (Micro Mudra)</span>
            <span className="text-rural font-bold">₹1,00,000 (Optimal Rural Ratio)</span>
            <span>₹25,00,000 (Full PMEGP Scale)</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 pt-2">
          {capitalPresets.map((preset) => {
            const isSelected = formData.capital === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => setFormData({ ...formData, capital: preset.value })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-solar text-white border-solar shadow-xs scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                }`}
              >
                {preset.label}
                {preset.recommended && (
                  <span className={`ml-1.5 text-[9px] px-1 py-0.2 rounded font-extrabold uppercase ${
                    isSelected ? 'bg-white text-solar' : 'bg-solar-pale text-solar'
                  }`}>
                    Best
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Leverage Insight Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-rural flex-shrink-0 mt-0.5" />
          <span>
            With <strong>₹{Number(formData.capital).toLocaleString('en-IN')}</strong> own margin, you can unlock up to{' '}
            <strong className="text-rural-dark">
              ₹{Math.min(5000000, Number(formData.capital) * (formData.isRural ? 20 : 10)).toLocaleString('en-IN')}
            </strong>{' '}
            total project investment with credit-linked government subsidy under PMEGP or MUDRA.
          </span>
        </div>
      </div>

      {/* Select Micro-Enterprise Type */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-khadi flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('businessCategoryLabel')}</h3>
              <p className="text-xs text-slate-500">Tailored unit economics, machinery quotes, and raw material feasibility</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            {businessProfiles.length} Viable Profiles Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessProfiles.map((biz) => {
            const isSelected = formData.businessId === biz.id;
            return (
              <div
                key={biz.id}
                onClick={() => setFormData({ ...formData, businessId: biz.id })}
                className={`p-4 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-rural bg-emerald-50/60 ring-2 ring-rural/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rural text-white flex items-center justify-center text-xs shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {biz.category}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                      Demand: {biz.localDemandFactor}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1 leading-snug">
                    {biz.name}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {biz.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Typical Cost</span>
                    <span className="font-bold text-slate-900">₹{(biz.typicalProjectCost / 100000).toFixed(1)} Lakhs</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Est. Profit</span>
                    <span className="font-bold text-rural">~₹{(biz.monthlyMetrics.netProfitBeforeEMI).toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-xs text-slate-500">
          Selected: <strong className="text-slate-900">{selectedBusiness?.name}</strong> in{' '}
          <strong className="text-slate-900">{formData.district}, {formData.state}</strong>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-2 bg-gradient-to-r from-rural to-emerald-700 hover:from-rural-dark hover:to-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-102"
        >
          <span>{t('nextButton')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
