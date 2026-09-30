import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { X, PieChart, ShieldCheck, TrendingUp, CheckCircle } from 'lucide-react';

interface AnonymisedAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnonymisedAnalyticsModal: React.FC<AnonymisedAnalyticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await api.getWelfareAnalytics();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Anonymised Welfare Caseload Analytics</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Resource Planning & Trends with Zero PII Exposure</p>
          </div>
        </div>

        {loading || !data ? (
          <div className="py-16 text-center text-slate-400 text-xs animate-pulse">
            Computing anonymised caseload distribution...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-emerald-900">
              <span className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-PII Compliance Verified</span>
              </span>
              <span className="text-[10px] text-slate-500">Protected under Defence DPDP Directives</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 leading-tight">Active Welfare Caseload</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{data.total_active_caseload}</div>
              </div>
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 leading-tight">SLA Adherence Rate</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{data.average_sla_adherence_pct}%</div>
              </div>
            </div>

            {/* Priority Breakdown */}
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Caseload Distribution by Urgency Tier
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                {Object.entries(data.priority_breakdown || {}).map(([priority, count]) => (
                  <div key={priority} className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-xs flex sm:block items-center justify-between">
                    <div className="text-[11px] text-slate-500 sm:mb-0.5 uppercase font-medium">{priority}</div>
                    <div className="font-extrabold text-base text-slate-900">{count as any}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Triggers Breakdown */}
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Escalation Sources
              </h4>
              <div className="space-y-1.5 text-xs">
                {Object.entries(data.trigger_breakdown || {}).map(([src, count]) => (
                  <div key={src} className="flex justify-between items-center py-1.5 border-b border-slate-200/60 gap-2">
                    <span className="capitalize text-slate-700 font-medium truncate">{src.replace(/_/g, ' ')}</span>
                    <span className="font-mono font-bold text-slate-900 shrink-0">{count as any} cases</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
