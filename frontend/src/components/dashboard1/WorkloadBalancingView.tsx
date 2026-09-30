import React, { useEffect, useState } from 'react';
import { Scale, Clock, Calendar, CheckCircle2, AlertTriangle, Shield, RefreshCw, ArrowRight, UserCheck, HeartHandshake } from 'lucide-react';
import { api } from '../../services/api';
import { WorkloadOverview, WorkloadItem } from '../../types';

interface WorkloadBalancingViewProps {
  unitId?: string;
  forceCategory?: string;
  isMobileFrame?: boolean;
}

export const WorkloadBalancingView: React.FC<WorkloadBalancingViewProps> = ({ unitId, forceCategory, isMobileFrame }) => {
  const [data, setData] = useState<WorkloadOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getWorkloadOverview({ unit_id: unitId, force_category: forceCategory });
      setData(res);
    } catch (e) {
      console.error('Failed to load workload overview:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [unitId, forceCategory]);

  const handleApprove = async (item: WorkloadItem) => {
    setProcessingId(item.id);
    try {
      const res = await api.approveWorkloadAction({
        personnel_id: item.personnel_id,
        action_type: item.type,
        action_id: item.id
      });
      setActionSuccess(res.message || 'Intervention authorized and applied.');
      setTimeout(() => setActionSuccess(null), 5000);
      loadData();
    } catch (e) {
      console.error('Failed to approve workload action:', e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold max-w-full">
            <Scale className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">AI Automated Workload Balancing & Fatigue Mitigation</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black tracking-tight break-words">
            Force Fatigue & Duty Cycle Optimization
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed break-words">
            Statutory fatigue thresholds prevent operational burnout. Review policy-compliant duty rotations, overtime caps, and expedited leave clearances with 1-click command authorization.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-sm animate-fade-in break-words">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Stats Row */}
      {data && (
        <div className={`grid gap-3 ${isMobileFrame ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 break-words">Personnel Monitored</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{data.summary.total_monitored}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">Across active rosters</div>
          </div>

          <div className="bg-white border border-rose-200 rounded-2xl p-3 sm:p-4 shadow-sm bg-rose-50/20 min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-rose-700 flex items-center gap-1 min-w-0 flex-wrap">
              <Clock className="w-3 h-3 shrink-0" />
              <span className="break-words leading-tight">Consecutive Duty (&gt;45d)</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">{data.summary.high_fatigue_cases}</div>
            <div className="text-[10px] text-rose-500 mt-0.5 break-words">Requiring R&R Rotation</div>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl p-3 sm:p-4 shadow-sm bg-amber-50/20 min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-amber-700 flex items-center gap-1 min-w-0 flex-wrap">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span className="break-words leading-tight">Heavy Overtime (&gt;25h)</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{data.summary.severe_overtime_cases}</div>
            <div className="text-[10px] text-amber-500 mt-0.5 break-words">Circadian shift strain</div>
          </div>

          <div className="bg-white border border-teal-200 rounded-2xl p-3 sm:p-4 shadow-sm bg-teal-50/20 min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-teal-700 flex items-center gap-1 min-w-0 flex-wrap">
              <Calendar className="w-3 h-3 shrink-0" />
              <span className="break-words leading-tight">Leave Backlog (&gt;40d)</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-teal-600 mt-1">{data.summary.leave_backlog_cases}</div>
            <div className="text-[10px] text-teal-500 mt-0.5 break-words">Family separation stress</div>
          </div>
        </div>
      )}

      {/* Actionable Recommendations List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
            <span>Actionable Balancing Recommendations</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
              {data?.actionable_recommendations.length || 0} Pending
            </span>
          </h3>

          <button
            onClick={loadData}
            className="self-end sm:self-auto p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            title="Refresh Recommendations"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Computing optimal rotation cycles...</div>
        ) : !data || data.actionable_recommendations.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">All Duty Cycles Balanced</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No personnel currently exceed operational duty thresholds. Workload, shift rotation, and leave cycles are operating within defensive welfare safety standards.
            </p>
          </div>
        ) : (
          <div className={`grid gap-4 ${isMobileFrame ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {data.actionable_recommendations.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 hover:border-emerald-500/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.urgency === 'Immediate'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.urgency} Priority
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{item.force_name || 'Armed Forces'}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h4>

                  <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1 text-slate-700">
                    <div className="flex justify-between items-center font-semibold gap-2">
                      <span className="shrink-0 text-slate-500">Personnel:</span>
                      <span className="text-slate-900 font-bold truncate text-right">{item.personnel_name}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 text-[11px] gap-2">
                      <span className="shrink-0">Unit Post:</span>
                      <span className="truncate text-right">{item.unit_name}</span>
                    </div>
                    <div className="flex justify-between items-center text-rose-600 font-semibold text-[11px] gap-2">
                      <span className="shrink-0">Trigger:</span>
                      <span className="truncate text-right">{item.metric_trigger}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed break-words">{item.mitigation_plan}</p>
                  <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 flex-wrap">
                    <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="break-words">Expected Benefit: {item.expected_reduction}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">Statutory Purpose Limitation</span>
                  <button
                    onClick={() => handleApprove(item)}
                    disabled={processingId === item.id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{processingId === item.id ? 'Authorizing...' : 'Authorize Action'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
