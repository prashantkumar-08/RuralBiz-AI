import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Circle,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Building2,
  MapPin,
  RefreshCw,
  Award,
  Clock,
  Layers,
  BarChart3,
  SlidersHorizontal,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function DashboardView({
  formData,
  setFormData,
  businessProfiles,
  analysisData,
  onOpenDPR,
  onNavigateTab,
  currentLang
}) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('overview'); // overview, projections, milestones, schemes
  const [completedMilestones, setCompletedMilestones] = useState({
    m1: true,
    m2: true
  });
  const [chartMetric, setChartMetric] = useState('revenue'); // revenue, netCashFlow

  // Fetch dashboard metrics whenever formData changes
  useEffect(() => {
    fetchDashboardMetrics();
  }, [formData.businessId, formData.capital, formData.district, formData.state, formData.category]);

  const fetchDashboardMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = (id) => {
    setCompletedMilestones(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatINR = (val) => {
    if (!val && val !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const kpis = dashboardData?.kpiMetrics;
  const bankReadiness = dashboardData?.bankReadiness;
  const projections = dashboardData?.multiYearProjections || [];
  const schemes = dashboardData?.schemeComparison || [];
  const mandiPrices = dashboardData?.mandiInsights || [];
  const aiAdvice = dashboardData?.aiAdvice || [];
  const milestones = dashboardData?.milestoneTasks || [];
  const dicContact = dashboardData?.dicContact;

  // Milestone completion percentage
  const totalMilestones = milestones.length || 8;
  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const milestoneProgressPct = Math.round((completedCount / totalMilestones) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner / Executive Ribbon */}
      <div className="bg-gradient-to-br from-slate-900 via-rural-dark to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rural/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-solar/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Executive Cockpit
              </span>
              <span className="bg-white/10 text-slate-200 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-solar" />
                {formData.district}, {formData.state}
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium px-2.5 py-1 rounded-full">
                {formData.category} • {formData.isRural ? 'Rural Area' : 'Urban Area'}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>Enterprise Performance & Loan Feasibility</span>
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Bank sanction readiness, government capital subsidies, 5-year cash flows, and milestone execution for your rural venture.
              </p>
            </div>

            {/* Quick Profile Switcher */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400 font-medium">Selected Enterprise:</span>
              <select
                value={formData.businessId}
                onChange={(e) => setFormData(prev => ({ ...prev, businessId: e.target.value }))}
                className="bg-slate-800/90 border border-slate-700 text-xs font-bold text-emerald-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rural transition-all cursor-pointer shadow-xs"
              >
                {businessProfiles.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Actions Action Bar */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={onOpenDPR}
              className="flex items-center gap-2 bg-gradient-to-r from-solar to-amber-600 hover:from-solar-dark hover:to-amber-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-amber-600/30 transition-all group"
            >
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Generate Bank DPR</span>
            </button>

            <button
              onClick={() => onNavigateTab('whatsapp')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-xl border border-white/20 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>AI Rural Bot</span>
            </button>

            <button
              onClick={fetchDashboardMetrics}
              disabled={loading}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              title="Refresh Metrics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
            { id: 'projections', label: '5-Year Cash Flow Projections', icon: BarChart3 },
            { id: 'milestones', label: `Milestones (${milestoneProgressPct}%)`, icon: CheckCircle2 },
            { id: 'schemes', label: 'Government Scheme Comparison', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isTabActive
                    ? 'bg-rural text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* KPI 1: Project Outlay */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Outlay</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(kpis?.projectCost || 1000000)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Own Margin:</span>
            <span className="font-bold text-slate-800">{formatINR(kpis?.promoterEquity || 100000)}</span>
          </div>
        </div>

        {/* KPI 2: Subsidy Grant */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Govt Subsidy</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-emerald-700 tracking-tight">
            {formatINR(kpis?.governmentSubsidy || 350000)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Rate / Scheme:</span>
            <span className="font-bold text-emerald-800">{kpis?.subsidyPercentage || 35}% (PMEGP)</span>
          </div>
        </div>

        {/* KPI 3: Monthly Net Profit */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Net Profit / Mo</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(kpis?.monthlyNetProfit || 25000)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Margin:</span>
            <span className="font-bold text-amber-700">~{kpis?.netProfitMargin || 14}%</span>
          </div>
        </div>

        {/* KPI 4: Bank Readiness */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bank Readiness</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-purple-700 tracking-tight flex items-center gap-2">
            <span>{bankReadiness?.overallScore || 93}</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
              Grade {bankReadiness?.grade || 'A+'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Status:</span>
            <span className="font-bold text-emerald-600">Sanction Ready</span>
          </div>
        </div>

        {/* KPI 5: DSCR Viability */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">DSCR Ratio</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-teal-700 tracking-tight">
            {kpis?.dscr?.toFixed(2) || '2.15'}x
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Bank Minimum:</span>
            <span className="font-bold text-slate-700">1.50x (Healthy)</span>
          </div>
        </div>

        {/* KPI 6: Break-Even Horizon */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Payback Period</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 tracking-tight">
            {kpis?.paybackYears || '1.8'} Years
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Break-Even:</span>
            <span className="font-bold text-indigo-700">{kpis?.breakEvenCapacityPct || 55}% Util.</span>
          </div>
        </div>
      </div>

      {/* Main Content Areas based on Active View */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Bank Sanction Readiness & 5-Year Snapshot */}
          <div className="lg:col-span-8 space-y-8">
            {/* Bank Sanction Readiness Cockpit */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Credit Appraisal Assessment
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-500">KVIC & Commercial Bank Norms</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    Bank Sanction Readiness Scorecard
                  </h2>
                </div>

                <div className="flex items-center gap-3 bg-purple-50/60 border border-purple-200 px-4 py-2.5 rounded-2xl">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-purple-700">Appraisal Grade</div>
                    <div className="text-xs font-extrabold text-purple-900">
                      {bankReadiness?.verdict || 'Prime Candidate: Bankable & Sanction-Ready'}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-700 text-white font-black text-xl flex items-center justify-center shadow-md">
                    {bankReadiness?.grade || 'A+'}
                  </div>
                </div>
              </div>

              {/* 5 Assessment Criteria Progress Bars */}
              <div className="mt-6 space-y-4">
                {bankReadiness?.criteria?.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span>{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({item.weight} wt)</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {item.status}
                        </span>
                        <span className="text-purple-700 font-bold">{item.score}/100</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.score >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                          item.score >= 80 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                          'bg-amber-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>

              {/* Local DIC & Lead Bank Branch Box */}
              {dicContact && (
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-emerald-50/50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rural text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{dicContact.officeName}</div>
                      <div className="text-[11px] text-slate-600">Lead Bank: <span className="font-bold text-rural-dark">{dicContact.leadBank}</span> • {dicContact.address}</div>
                    </div>
                  </div>
                  <a
                    href={`tel:${dicContact.gmContact}`}
                    className="inline-flex items-center justify-center gap-1 text-xs font-bold text-rural hover:text-rural-dark bg-white border border-rural/30 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-rural-pale transition-colors whitespace-nowrap"
                  >
                    Contact GM DIC
                  </a>
                </div>
              )}
            </div>

            {/* 5-Year Cash Flow Projection Chart Snapshot */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    5-Year Financial & Repayment Trajectory
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Capacity expansion from 70% to 98% with steady bank loan amortization
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('projections')}
                  className="text-xs font-bold text-rural hover:underline flex items-center gap-1"
                >
                  <span>Detailed View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Graphical representation */}
              <div className="mt-6 space-y-4">
                {projections.map((p, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800 font-bold w-16">{p.year}</span>
                      <span className="text-slate-500 text-[11px]">Capacity: {p.capacityPct}%</span>
                      <span className="text-slate-900 font-extrabold">Rev: {formatINR(p.revenue)}</span>
                      <span className="text-emerald-700 font-bold">Surplus: {formatINR(p.netCashFlow)}</span>
                    </div>
                    {/* Visual Multi-Segment Bar */}
                    <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all"
                        style={{ width: `${Math.min(100, (p.revenue / (projections[projections.length - 1]?.revenue || 1)) * 100)}%` }}
                        title={`Gross Revenue: ${formatINR(p.revenue)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): AI Strategic Advice & Live Mandi Trends */}
          <div className="lg:col-span-4 space-y-8">
            {/* AI Strategic Advisory Bulletin */}
            <div className="bg-gradient-to-br from-emerald-900 via-rural-dark to-slate-900 text-white rounded-3xl p-6 shadow-lg border border-emerald-800 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">AI Advisory Feed</h3>
                    <p className="text-[10px] text-emerald-200">Hyper-local strategic intelligence</p>
                  </div>
                </div>
                <span className="bg-white/10 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  Live
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {aiAdvice.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-amber-300">{item.category}</span>
                      <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-semibold">
                        {item.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mb-1">{item.title}</div>
                    <p className="text-[11px] text-slate-200 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Regional Mandi Price Ticker */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-solar" />
                  <h3 className="text-sm font-extrabold text-slate-900">Regional Mandi Prices</h3>
                </div>
                <button
                  onClick={() => onNavigateTab('mandi')}
                  className="text-[11px] font-bold text-rural hover:underline"
                >
                  All Markets
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {mandiPrices.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{m.commodity}</span>
                      <span className="text-emerald-700 font-extrabold">{formatINR(m.modalPricePerQuintal)}/Qtl</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{m.mandi}</span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {m.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick DPR Action Promo */}
            <div className="bg-gradient-to-br from-solar-pale via-amber-50 to-white rounded-3xl p-6 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-solar text-white flex items-center justify-center font-bold shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Download Bankable DPR</h4>
                  <p className="text-[11px] text-slate-600">Ready for KVIC PMEGP & Bank submission</p>
                </div>
              </div>
              <button
                onClick={onOpenDPR}
                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all"
              >
                Open DPR Generator Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projections View */}
      {activeView === 'projections' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                5-Year Financial & Amortization Schedule
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Projected cash flows, operating overheads, loan EMI service, and cumulative equity generation.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Show:</span>
              <button
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartMetric === 'revenue' ? 'bg-rural text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Revenue & Costs
              </button>
              <button
                onClick={() => setChartMetric('netCashFlow')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartMetric === 'netCashFlow' ? 'bg-rural text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Net Cash Flow
              </button>
            </div>
          </div>

          {/* Table of 5 Years */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Capacity Util.</th>
                  <th className="py-3.5 px-4">Gross Revenue</th>
                  <th className="py-3.5 px-4">Operating Expense</th>
                  <th className="py-3.5 px-4">Annual EMI (Debt)</th>
                  <th className="py-3.5 px-4 text-emerald-700">Net Cash Surplus</th>
                  <th className="py-3.5 px-4 text-indigo-700">Cumulative Surplus</th>
                  <th className="py-3.5 px-4">DSCR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projections.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors font-medium text-slate-800">
                    <td className="py-4 px-4 font-bold">{row.year}</td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
                        {row.capacityPct}%
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{formatINR(row.revenue)}</td>
                    <td className="py-4 px-4 text-slate-600">{formatINR(row.operatingExpense)}</td>
                    <td className="py-4 px-4 text-amber-700">{formatINR(row.debtService)}</td>
                    <td className="py-4 px-4 font-extrabold text-emerald-700">{formatINR(row.netCashFlow)}</td>
                    <td className="py-4 px-4 font-bold text-indigo-700">{formatINR(row.cumulativeProfit)}</td>
                    <td className="py-4 px-4 font-bold">
                      <span className={`px-2 py-0.5 rounded ${row.dscr >= 1.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {row.dscr}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rural shrink-0" />
            <span>
              <strong>Note for Bank Branch:</strong> All projections incorporate standard KVIC depreciation on machinery (10% WDV) and a 6-month loan moratorium before primary debt amortization begins.
            </span>
          </div>
        </div>
      )}

      {/* Milestones View */}
      {activeView === 'milestones' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Enterprise Execution Roadmap
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Interactive tracker from Udyam registration through bank sanction and commercial production.
              </p>
            </div>
            {/* Progress Badge */}
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl">
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-700">Milestone Progress</div>
                <div className="text-xs font-extrabold text-emerald-900">
                  {completedCount} of {totalMilestones} Completed
                </div>
              </div>
              <div className="text-lg font-black text-emerald-700">{milestoneProgressPct}%</div>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div className="space-y-3">
            {milestones.map((task) => {
              const isChecked = !!completedMilestones[task.id];
              return (
                <div
                  key={task.id}
                  onClick={() => toggleMilestone(task.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <button type="button" className="mt-0.5 text-emerald-600 focus:outline-none">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                        {task.category}
                      </span>
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-medium">
                        {task.phase}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Timeline: {task.duration}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schemes View */}
      {activeView === 'schemes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="pb-6 border-b border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-900">
              Government Scheme Subsidy Comparison
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cross-scheme financial comparison tailored to your location ({formData.district}) and social category ({formData.category}).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((s) => (
              <div
                key={s.id}
                className={`p-6 rounded-3xl border transition-all ${
                  s.recommended
                    ? 'bg-gradient-to-br from-emerald-50/60 to-white border-emerald-300 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      s.recommended ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {s.tag}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-2">{s.name}</h3>
                    <p className="text-xs text-slate-500">Nodal: {s.agency}</p>
                  </div>
                </div>

                <div className="space-y-2.5 mt-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subsidy Entitlement:</span>
                    <span className="font-extrabold text-emerald-700">{s.subsidyPct}% Capital Grant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Promoter Equity Required:</span>
                    <span className="font-bold text-slate-800">{s.ownEquityPct}% Margin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Collateral Requirement:</span>
                    <span className="font-bold text-emerald-600">Zero (Collateral Free)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Loan Tenure:</span>
                    <span className="font-bold text-slate-800">{s.tenure}</span>
                  </div>
                </div>

                {s.recommended && (
                  <button
                    onClick={onOpenDPR}
                    className="w-full mt-5 bg-rural hover:bg-rural-dark text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    Apply with Pre-filled DPR
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
