import React from 'react';
import { languages, getTranslation } from '../i18n/translations';
import { Compass, MessageSquare, BookOpen, TrendingUp, FileText, Globe, PhoneCall, Sparkles } from 'lucide-react';

export default function Navbar({ currentLang, onLangChange, activeTab, onTabChange }) {
  const t = (key) => getTranslation(currentLang, key);

  const navItems = [
    { id: 'wizard', label: t('navWizard'), icon: Compass },
    { id: 'whatsapp', label: t('navWhatsApp'), icon: MessageSquare, badge: 'AI Voice' },
    { id: 'schemes', label: t('navSchemes'), icon: BookOpen },
    { id: 'mandi', label: t('navMandi'), icon: TrendingUp },
    { id: 'dpr', label: t('navDPR'), icon: FileText, badge: 'Bank-Ready' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Notification / SIH 2026 Bar */}
      <div className="bg-gradient-to-r from-rural-dark via-rural to-emerald-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-amber-400 text-rural-dark font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase shadow-xs">
              SIH 2026 • PS 26091
            </span>
            <span className="hidden sm:inline opacity-95">Team Forgers Solution</span>
            <span className="opacity-75">•</span>
            <span className="opacity-90">Hyper-Local Micro-Enterprise Advisory & Financial Structuring</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] opacity-90">
            <a href="tel:18001806763" className="flex items-center gap-1 hover:text-amber-300 transition-colors">
              <PhoneCall className="w-3 h-3" />
              <span>KVIC Rural Helpline: 1800-180-6763</span>
            </a>
            <span className="hidden md:inline bg-white/10 px-2 py-0.5 rounded text-amber-200">
              Udyam MSME Ready
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => onTabChange('wizard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rural to-emerald-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl">🌾</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-rural transition-colors">
                  Rural<span className="text-rural">Biz</span> <span className="text-solar text-lg font-bold">AI</span>
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-white text-rural-dark shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rural' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isActive ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Language Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 hover:border-rural transition-colors shadow-xs">
              <Globe className="w-4 h-4 text-slate-500 mr-2" />
              <select
                value={currentLang}
                onChange={(e) => onLangChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer pr-2"
                aria-label="Language selector"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onTabChange('dpr')}
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-solar to-amber-600 hover:from-solar-dark hover:to-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>DPR Studio</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap ${
                  isActive ? 'text-rural font-bold bg-rural-pale' : 'text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
