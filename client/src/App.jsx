import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WizardContainer from './components/Wizard/WizardContainer';
import DprModal from './components/DPR/DprModal';
import WhatsAppChat from './components/WhatsAppSimulator/WhatsAppChat';
import SchemeExplorer from './components/Schemes/SchemeExplorer';
import MandiExplorer from './components/Market/MandiExplorer';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [activeTab, setActiveTab] = useState('wizard');
  const [dprModalOpen, setDprModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    state: 'Gujarat',
    district: 'Anand',
    capital: 100000,
    businessId: 'dairy-farming',
    category: 'OBC',
    gender: 'Female',
    isRural: true
  });

  // Data State
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [schemesList, setSchemesList] = useState([]);
  const [mandiData, setMandiData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initial Load: Fetch business profiles, schemes, and mandi data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [bizRes, schemesRes, mandiRes] = await Promise.all([
        fetch('/api/businesses'),
        fetch('/api/schemes'),
        fetch('/api/mandi')
      ]);

      const [bizData, schemesData, mandiDataJson] = await Promise.all([
        bizRes.json(),
        schemesRes.json(),
        mandiRes.json()
      ]);

      setBusinessProfiles(bizData);
      setSchemesList(schemesData);
      setMandiData(mandiDataJson);

      // Perform initial baseline analysis for smooth initial display
      triggerAnalysis(formData, bizData);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const triggerAnalysis = async (data = formData, profiles = businessProfiles) => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      setAnalysisData(result);
    } catch (err) {
      console.error('Analysis API failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateFinances = async (calcPayload) => {
    try {
      const res = await fetch('/api/financial-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calcPayload)
      });
      const updatedFinances = await res.json();
      setAnalysisData((prev) => ({
        ...prev,
        finances: updatedFinances
      }));
    } catch (err) {
      console.error('Recalculate failed:', err);
    }
  };

  // Quick Preset Selection from Hero Section
  const handleQuickSelect = (pick) => {
    const updated = {
      ...formData,
      capital: pick.capital,
      businessId: pick.businessId
    };
    setFormData(updated);
    setActiveTab('wizard');
    triggerAnalysis(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-rural-pale">
      {/* Top Navigation */}
      <Navbar
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'dpr') {
            setDprModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Hero Section displayed primarily in wizard mode */}
      {activeTab === 'wizard' && (
        <HeroSection
          currentLang={currentLang}
          onQuickSelect={handleQuickSelect}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'wizard' && (
          <WizardContainer
            formData={formData}
            setFormData={setFormData}
            businessProfiles={businessProfiles}
            analysisData={analysisData}
            loading={loading}
            onAnalyze={() => triggerAnalysis(formData)}
            onRecalculateFinances={handleRecalculateFinances}
            onOpenDPR={() => setDprModalOpen(true)}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppChat currentLang={currentLang} />
        )}

        {activeTab === 'schemes' && (
          <SchemeExplorer
            schemes={schemesList}
            currentLang={currentLang}
            onSelectScheme={(schemeId) => {
              setActiveTab('wizard');
            }}
          />
        )}

        {activeTab === 'mandi' && (
          <MandiExplorer
            mandiData={mandiData}
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Detailed Project Report Modal */}
      <DprModal
        isOpen={dprModalOpen}
        onClose={() => setDprModalOpen(false)}
        analysisData={analysisData}
        formData={formData}
      />

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">RuralBiz AI</span>
            <span>•</span>
            <span>Smart India Hackathon 2026 (PS 26091)</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Team Forgers</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.kviconline.gov.in" target="_blank" rel="noreferrer" className="hover:text-rural">
              KVIC Guidelines
            </a>
            <a href="https://www.mudra.org.in" target="_blank" rel="noreferrer" className="hover:text-rural">
              MUDRA Portal
            </a>
            <a href="https://agmarknet.gov.in" target="_blank" rel="noreferrer" className="hover:text-rural">
              Agmarknet Mandi
            </a>
            <span className="text-slate-400">|</span>
            <span className="font-medium text-slate-700">Bankable DPR V2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
