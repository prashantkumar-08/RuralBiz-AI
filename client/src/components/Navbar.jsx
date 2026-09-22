import React from 'react';
import { languages, getTranslation } from '../i18n/translations';
import {
  LayoutDashboard,
  Compass,
  MessageSquare,
  BookOpen,
  TrendingUp,
  FileText,
  Globe,
  Sparkles
} from 'lucide-react';

export default function Navbar({ currentLang, onLangChange, activeTab, onTabChange }) {
  const t = (key) => getTranslation(currentLang, key);

  // Clean, focused navigation tabs (5 views)
  const navItems = [
    { id: 'dashboard', label: t('navDashboard') || 'Dashboard', icon: LayoutDashboard },
    { id: 'wizard', label: t('navWizard') || 'Advisory', icon: Compass },
    { id: 'whatsapp', label: t('navWhatsApp') || 'AI Bot', icon: MessageSquare },
    { id: 'schemes', label: t('navSchemes') || 'Schemes', icon: BookOpen },
    { id: 'mandi', label: t('navMandi') || 'Mandi Prices', icon: TrendingUp }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo - Minimalist & Crisp */}
          <div 
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
            title="RuralBiz AI"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-rural-dark flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-base leading-none">🌾</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                RuralBiz <span className="text-emerald-600">AI</span>
              </span>
            </div>
          </div>

          {/* Center Navigation - Minimalist Clean Pills */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Language & DPR CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Minimal Language Selector */}
            <div className="relative flex items-center bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-2.5 py-1.5 transition-colors">
              <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
              <select
                value={currentLang}
                onChange={(e) => onLangChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer pr-1"
                aria-label="Select Language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Standout Primary Action: Bank DPR */}
            <button
              onClick={() => onTabChange('dpr')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-rural-dark hover:from-emerald-700 hover:to-slate-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow-sm transition-all"
              title="Generate Bankable Project Report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bank DPR</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto no-scrollbar gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
