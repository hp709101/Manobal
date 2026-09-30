import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { X, BarChart3, ShieldCheck, ShieldAlert, Users, TrendingUp, Clock } from 'lucide-react';

interface UnitAnalyticsModalProps {
  unitId: string | null;
  onClose: () => void;
}

export const UnitAnalyticsModal: React.FC<UnitAnalyticsModalProps> = ({
  unitId,
  onClose,
}) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (unitId && unitId !== 'ALL') {
      loadAnalytics(unitId);
    }
  }, [unitId]);

  const loadAnalytics = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getUnitAnalytics(id);
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!unitId || unitId === 'ALL') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Battalion Welfare & Operational Readiness Analytics</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Workload Distributions & Guardrails</p>
          </div>
        </div>

        {loading || !analytics ? (
          <div className="py-20 text-center text-slate-400 animate-pulse text-xs">
            Aggregating cohort statistics and verifying k-anonymity compliance...
          </div>
        ) : analytics.suppressed ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-amber-900 text-sm">Cohort Statistics Suppressed</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{analytics.reason}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* K-Anonymity Verification Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="flex items-center gap-2 text-emerald-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="break-words">K-Anonymity Verified (Cohort n = {analytics.total_personnel})</span>
              </span>
              <span className="text-[10px] text-emerald-700 break-words">Individual re-identification mathematically suppressed</span>
            </div>

            {/* Status Distribution Bars */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Observed Welfare Status Distribution
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                {['Normal', 'Moderate', 'Critical', 'Suspected', 'Unspecified'].map((st) => {
                  const count = analytics.status_distribution?.[st] || 0;
                  return (
                    <div key={st} className="bg-white border border-slate-200 p-2 sm:p-2.5 rounded-xl shadow-xs min-w-0">
                      <div className="text-[11px] text-slate-500 mb-1 truncate">{st}</div>
                      <div className="text-base sm:text-lg font-black text-slate-900">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operational Workload Averages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-3 sm:p-3.5 rounded-2xl">
                <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mb-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Avg Duty Streak</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {Math.round(analytics.operational_metrics?.avg_duty_streak || 0)} <span className="text-xs text-slate-400 font-normal">days</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 sm:p-3.5 rounded-2xl">
                <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mb-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Avg Leave Backlog</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {Math.round(analytics.operational_metrics?.avg_leave_backlog || 0)} <span className="text-xs text-slate-400 font-normal">days</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 sm:p-3.5 rounded-2xl">
                <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mb-1 font-semibold">
                  <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Avg Overtime</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {Math.round(analytics.operational_metrics?.avg_overtime || 0)} <span className="text-xs text-slate-400 font-normal">hrs/wk</span>
                </div>
              </div>
            </div>

            {/* Coarse Health Trend Aggregation (Feature 17) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Coarse Health Trend Chip Aggregates (Consented Troops Only)
              </h4>
              <div className="flex flex-wrap gap-2.5 sm:gap-4 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-700">Stable: {analytics.health_trend_chips?.stable || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-slate-700">Declining: {analytics.health_trend_chips?.declining || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="text-slate-500">Unavailable / Unlinked: {analytics.health_trend_chips?.unavailable || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors text-center"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
