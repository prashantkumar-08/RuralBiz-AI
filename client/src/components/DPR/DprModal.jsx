import React, { useState, useEffect } from 'react';
import { Printer, Download, X, CheckCircle2, Building2, User, IndianRupee, ShieldCheck } from 'lucide-react';

export default function DprModal({
  isOpen,
  onClose,
  analysisData,
  formData
}) {
  const [dprData, setDprData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDpr();
    }
  }, [isOpen, analysisData]);

  const fetchDpr = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dpr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entrepreneurName: 'Ramesh Patel',
          fatherOrSpouseName: 'Somabhai Patel',
          aadhaarLast4: '4821',
          mobile: '9876543210',
          address: `Gram Panchayat Area, ${formData.district} Taluk`,
          district: formData.district,
          state: formData.state,
          pin: '388001',
          category: formData.category,
          gender: formData.gender,
          qualification: 'Higher Secondary (12th Pass)',
          businessId: formData.businessId,
          userCapital: formData.capital,
          schemeId: analysisData?.schemes?.bestScheme?.id || 'pmegp'
        })
      });
      const data = await res.json();
      setDprData(data);
    } catch (err) {
      console.error('Failed to fetch DPR data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar (Excluded from Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rural flex items-center justify-center text-white font-bold">
              <span>🌾</span>
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">Bankable Detailed Project Report (DPR) Studio</div>
              <div className="text-[11px] text-slate-400">Ready for direct submission to DIC / Branch Manager</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-rural hover:bg-rural-dark text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable DPR Body */}
        <div className="overflow-y-auto p-6 sm:p-10 text-slate-900 font-sans space-y-8 print:p-0 print:space-y-6">
          {loading || !dprData ? (
            <div className="p-16 text-center">
              <div className="w-10 h-10 border-4 border-rural border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-700">Formatting Bankable Project Report...</p>
            </div>
          ) : (
            <div className="dpr-page space-y-8 text-xs leading-relaxed">
              {/* Formal Header */}
              <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
                <div className="text-xs font-black tracking-widest text-slate-500 uppercase">
                  Government of India • Ministry of MSME / KVIC / Lead Bank
                </div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  Detailed Project Appraisal Report (DPR)
                </h1>
                <p className="text-xs font-semibold text-rural-dark">
                  Application Under: {dprData.schemeName}
                </p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>DPR Ref No: <strong>{dprData.referenceNumber}</strong></span>
                  <span>Date: <strong>{dprData.generatedDate}</strong></span>
                  <span>Target Nodal: <strong>{dprData.implementingAgency}</strong></span>
                </div>
              </div>

              {/* 1. Borrower Profile Table */}
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 bg-slate-100 p-2 rounded border border-slate-200 mb-3">
                  1. Profile of the Promoter / Entrepreneur
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Full Name:</span>
                    <span className="font-bold">{dprData.borrowerProfile.fullName}</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Father / Spouse:</span>
                    <span className="font-bold">{dprData.borrowerProfile.guardianName}</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Social Category:</span>
                    <span className="font-bold">{dprData.borrowerProfile.socialCategory} ({dprData.borrowerProfile.gender})</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Aadhaar Card:</span>
                    <span className="font-bold">{dprData.borrowerProfile.aadhaarMasked}</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Location / District:</span>
                    <span className="font-bold">{dprData.borrowerProfile.district}, {dprData.borrowerProfile.state}</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Recommended Bank:</span>
                    <span className="font-bold text-rural-dark">{dprData.borrowerProfile.bankBranchRecommended}</span>
                  </div>
                </div>
              </div>

              {/* 2. Project Summary */}
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 bg-slate-100 p-2 rounded border border-slate-200 mb-3">
                  2. Project Summary & Capacity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Project Title:</span>
                    <span className="font-bold">{dprData.projectProfile.projectName}</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Sector / Category:</span>
                    <span className="font-bold">{dprData.projectProfile.sector} ({dprData.projectProfile.category})</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Employment Potential:</span>
                    <span className="font-bold">{dprData.projectProfile.proposedEmployment}</span>
                  </div>
                </div>
              </div>

              {/* 3. Means of Finance (Exact Bank Structuring) */}
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 bg-slate-100 p-2 rounded border border-slate-200 mb-3">
                  3. Project Cost & Means of Finance
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="p-2.5 text-left">Particulars</th>
                        <th className="p-2.5 text-center">Percentage (%)</th>
                        <th className="p-2.5 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="p-2.5 font-bold">Total Capital Cost of Project</td>
                        <td className="p-2.5 text-center">100%</td>
                        <td className="p-2.5 text-right font-black">₹{dprData.meansOfFinance.totalProjectCost.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="bg-blue-50/50">
                        <td className="p-2.5 font-semibold text-khadi">Promoter's Own Contribution (Margin Money)</td>
                        <td className="p-2.5 text-center font-bold text-khadi">{dprData.meansOfFinance.promoterEquityPct}%</td>
                        <td className="p-2.5 text-right font-bold text-khadi">₹{dprData.meansOfFinance.promotersContribution.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="bg-emerald-50/60">
                        <td className="p-2.5 font-semibold text-emerald-800">Govt Subsidy Entitlement (Back-ended TDR)</td>
                        <td className="p-2.5 text-center font-bold text-emerald-800">{dprData.meansOfFinance.subsidyPct}%</td>
                        <td className="p-2.5 text-right font-bold text-emerald-800">₹{dprData.meansOfFinance.marginMoneySubsidyEntitlement.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="bg-amber-50/50">
                        <td className="p-2.5 font-semibold text-amber-900">Term Loan Sanctioned by Bank</td>
                        <td className="p-2.5 text-center font-bold text-amber-900">{100 - dprData.meansOfFinance.promoterEquityPct}%</td>
                        <td className="p-2.5 text-right font-bold text-amber-900">₹{dprData.meansOfFinance.termLoanSanctioned.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-slate-600">Net Repayment Obligation (after subsidy credit)</td>
                        <td className="p-2.5 text-center text-slate-500">-</td>
                        <td className="p-2.5 text-right font-bold text-slate-700">₹{dprData.meansOfFinance.netDebtBurden.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-slate-600">Monthly EMI Repayment</td>
                        <td className="p-2.5 text-center text-slate-500">Tenure: {dprData.meansOfFinance.loanTenureMonths} Mos</td>
                        <td className="p-2.5 text-right font-bold text-rural">₹{dprData.meansOfFinance.monthlyEMI.toLocaleString('en-IN')} / mo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Capital Cost Breakdown */}
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 bg-slate-100 p-2 rounded border border-slate-200 mb-3">
                  4. Machinery & Capital Expenditure Schedule
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="p-2 text-left">Item Description</th>
                        <th className="p-2 text-right">Quotation Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dprData.capitalExpenditureBreakdown.map((eq, i) => (
                        <tr key={i}>
                          <td className="p-2 font-medium">{eq.name}</td>
                          <td className="p-2 text-right font-bold">₹{eq.cost.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Viability Metrics & DSCR */}
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 bg-slate-100 p-2 rounded border border-slate-200 mb-3">
                  5. Bank Appraisal Viability Indicators
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Average DSCR</span>
                    <span className="text-base font-black text-emerald-700">{dprData.financialViabilityIndicators.dscrAverage}x</span>
                  </div>
                  <div className="p-2.5 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Payback Period</span>
                    <span className="text-base font-black text-slate-900">{dprData.financialViabilityIndicators.paybackPeriodYears} Yrs</span>
                  </div>
                  <div className="p-2.5 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Break-Even Point</span>
                    <span className="text-base font-black text-slate-900">{dprData.financialViabilityIndicators.breakEvenCapacity}</span>
                  </div>
                  <div className="p-2.5 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Yr 1 Net PAT</span>
                    <span className="text-base font-black text-rural">₹{dprData.financialViabilityIndicators.firstYearNetPAT.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* 6. Legal Undertaking & Signature Blocks */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div className="font-bold text-slate-900">Declaration by Borrower:</div>
                  <ol className="list-decimal pl-4 space-y-1 text-[10px]">
                    {dprData.declarations.map((dec, i) => (
                      <li key={i}>{dec}</li>
                    ))}
                  </ol>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                  <div className="border-t border-slate-400 pt-2">
                    <span className="font-bold block">{dprData.borrowerProfile.fullName}</span>
                    <span className="text-[10px] text-slate-500">Signature of Applicant / Entrepreneur</span>
                  </div>
                  <div className="border-t border-slate-400 pt-2">
                    <span className="font-bold block">Authorized Signatory</span>
                    <span className="text-[10px] text-slate-500">Lead Bank Manager / DIC General Manager</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
