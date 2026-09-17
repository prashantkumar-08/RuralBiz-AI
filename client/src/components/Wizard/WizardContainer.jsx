import React, { useState } from 'react';
import { getTranslation } from '../../i18n/translations';
import DiscoverStep from './DiscoverStep';
import AnalyzeStep from './AnalyzeStep';
import FinanceStep from './FinanceStep';
import ActStep from './ActStep';
import { Compass, TrendingUp, IndianRupee, CheckSquare, Sparkles } from 'lucide-react';

export default function WizardContainer({
  formData,
  setFormData,
  businessProfiles,
  analysisData,
  loading,
  onAnalyze,
  onRecalculateFinances,
  onOpenDPR,
  currentLang
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const t = (key) => getTranslation(currentLang, key);

  const steps = [
    { number: 1, title: t('step1Title'), desc: t('step1Desc'), icon: Compass },
    { number: 2, title: t('step2Title'), desc: t('step2Desc'), icon: TrendingUp },
    { number: 3, title: t('step3Title'), desc: t('step3Desc'), icon: IndianRupee },
    { number: 4, title: t('step4Title'), desc: t('step4Desc'), icon: CheckSquare }
  ];

  const handleNextFromDiscover = async () => {
    await onAnalyze();
    setCurrentStep(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 4-Step Stepper Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => {
                  if (step.number === 1 || analysisData) {
                    setCurrentStep(step.number);
                  }
                }}
                disabled={step.number > 1 && !analysisData && !loading}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-rural-pale/80 border-rural text-rural-dark shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 text-slate-800 hover:bg-emerald-50'
                    : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-rural text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-xs truncate">
                    {step.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {step.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-rural border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-base font-bold text-slate-800">
            Running RuralBiz AI Engines...
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Analyzing 5-10 km radius APMC mandi rates, computing PMEGP & Mudra subsidy slabs, and generating debt service coverage ratios.
          </p>
        </div>
      )}

      {/* Active Step Content */}
      {!loading && (
        <>
          {currentStep === 1 && (
            <DiscoverStep
              formData={formData}
              setFormData={setFormData}
              businessProfiles={businessProfiles}
              onContinue={handleNextFromDiscover}
              currentLang={currentLang}
            />
          )}

          {currentStep === 2 && (
            <AnalyzeStep
              analysisData={analysisData}
              onContinue={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
              currentLang={currentLang}
            />
          )}

          {currentStep === 3 && (
            <FinanceStep
              analysisData={analysisData}
              onRecalculateFinances={onRecalculateFinances}
              onContinue={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
              currentLang={currentLang}
            />
          )}

          {currentStep === 4 && (
            <ActStep
              analysisData={analysisData}
              onOpenDPR={onOpenDPR}
              onBack={() => setCurrentStep(3)}
              currentLang={currentLang}
            />
          )}
        </>
      )}
    </div>
  );
}
