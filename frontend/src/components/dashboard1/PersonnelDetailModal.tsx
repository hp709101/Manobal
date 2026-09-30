import React, { useEffect, useState } from 'react';
import { PersonnelDetail } from '../../types';
import { api } from '../../services/api';
import {
  X, Clock, CheckCircle,
  Sparkles, UserCheck, Tag
} from 'lucide-react';

interface PersonnelDetailModalProps {
  personnelId: string | null;
  onClose: () => void;
  onRefresh: () => void;
  currentUserRole: string;
}

export const PersonnelDetailModal: React.FC<PersonnelDetailModalProps> = ({
  personnelId,
  onClose,
  onRefresh,
  currentUserRole,
}) => {
  const [detail, setDetail] = useState<PersonnelDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (personnelId) {
      loadDetail(personnelId);
    }
  }, [personnelId]);

  const loadDetail = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getPersonnelDetail(id);
      setDetail(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSeverity = async (remarkId: string, severity: string) => {
    try {
      await api.confirmRemarkSeverity(remarkId, severity);
      if (personnelId) loadDetail(personnelId);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  if (!personnelId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative text-slate-900 max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {loading || !detail ? (
          <div className="py-24 text-center text-slate-400 animate-pulse text-xs">
            Loading individual stats dossier with cryptographic verification...
          </div>
        ) : (
          <div className="space-y-5 overflow-y-auto pr-1">
            {/* Header: Identity & Status Overview */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                    {detail.personnel.service_id_display}
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    {detail.personnel.fitness_grade || 'SHAPE-1'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 break-words">
                  {detail.personnel.display_name}
                </h2>
                <p className="text-xs text-slate-500 break-words">
                  {detail.personnel.unit_name}
                </p>
              </div>

              {/* Side-by-side Observed vs Assessed Status */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center sm:text-left">
                <div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Observed</div>
                  <div className="font-bold text-xs sm:text-sm text-emerald-700 mt-0.5 truncate">{detail.personnel.observed_status}</div>
                </div>
                <div className="border-x border-slate-200 px-2">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Assessed</div>
                  <div className="font-bold text-xs sm:text-sm text-sky-700 mt-0.5 truncate">{detail.personnel.assessed_status}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Health Chip</div>
                  <div className="font-bold text-[11px] sm:text-xs text-amber-700 mt-0.5 uppercase truncate">
                    {detail.health.coarse_chip || 'unavailable'}
                  </div>
                </div>
              </div>
            </div>

            {/* Explainable AI Risk Factor Card */}
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 break-words">
                    Explainable Welfare Stress Markers (XGBoost/SHAP)
                  </h3>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-xs text-slate-500">Composite Score:</span>
                  <span className="text-sm font-black text-slate-900 px-2 py-0.5 rounded-lg bg-white border border-emerald-300 shadow-sm">
                    {detail.risk_model.overall_risk_score} / 100
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {detail.risk_model.contributing_factors.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-emerald-200/60 shadow-xs gap-1.5"
                  >
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {f.category}
                      </span>
                      <span className="text-slate-800 font-medium break-words">{f.factor}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 shrink-0 self-end sm:self-auto">
                      {f.impact}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-2 italic">
                * Note: Model scores operational fatigue and life event strain. It strictly does NOT diagnose medical depression.
              </p>
            </div>

            {/* 3-Column Stats Grid: HRMS, Remarks, Status History */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* HRMS Metrics */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>HRMS Operational Stats</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Duty Streak:</span>
                    <span className="font-bold text-slate-900">{detail.hrms.consecutive_duty_days ?? 0} continuous days</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Leave Balance:</span>
                    <span className="font-bold text-slate-900">{detail.hrms.leave_balance_days ?? 30} days</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Weekly Overtime:</span>
                    <span className="font-bold text-slate-900">{detail.hrms.shift_overtime_hours ?? 0} hrs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Transfers (2yr):</span>
                    <span className="font-bold text-slate-900">{detail.hrms.transfer_count_last_2yr ?? 0} postings</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Last Leave Date:</span>
                    <span className="font-mono text-slate-700">{detail.hrms.last_leave_date || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Status History Timeline */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 md:col-span-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Status History Timeline (Audit of Reasons)</span>
                </h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {detail.status_history.length === 0 ? (
                    <div className="text-xs text-slate-400 py-3">No status revisions logged yet.</div>
                  ) : (
                    detail.status_history.map((sh) => (
                      <div key={sh.id} className="text-xs bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span className="font-bold text-slate-800">
                            {sh.old_value} → <span className="text-emerald-700">{sh.new_value}</span> ({sh.status_type})
                          </span>
                          <span className="font-mono">{new Date(sh.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-700 italic mb-1">"{sh.reason}"</p>
                        <div className="text-[10px] text-slate-400">By: {sh.changed_by} ({sh.changed_by_role})</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Remarks Section with Structured Tags & Human Confirmation */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-sky-600" />
                  <span>Recorded Remarks (AES-256-GCM Encrypted at Rest)</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  Structured tags · Controlled visibility · Officer confirmation
                </span>
              </div>

              <div className="space-y-3">
                {detail.remarks.length === 0 ? (
                  <div className="text-xs text-slate-400 py-4 text-center">No remarks recorded for this soldier.</div>
                ) : (
                  detail.remarks.map((r) => (
                    <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {r.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200"
                            >
                              #{t}
                            </span>
                          ))}
                          <span className="text-[10px] text-slate-600 font-mono px-2 py-0.5 rounded-lg bg-slate-100">
                            Visibility: {r.visibility_level}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Expires: {r.expiry_date || '90 days'}
                        </div>
                      </div>

                      <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        {r.decrypted_text || '(Encrypted text not accessible under current role)'}
                      </p>

                      {/* Human confirmation */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 border-t border-slate-100 gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-slate-500">Proposed Severity:</span>
                          <span className="font-bold text-amber-700 text-xs">{r.severity_proposed}</span>
                          {r.is_reviewed ? (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                              <CheckCircle className="w-3 h-3 text-emerald-600" /> Confirmed: {r.severity_confirmed}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                              Pending Confirmation
                            </span>
                          )}
                        </div>

                        {!r.is_reviewed && currentUserRole !== 'personnel' && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleConfirmSeverity(r.id, r.severity_proposed)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold shadow-xs"
                            >
                              Confirm {r.severity_proposed}
                            </button>
                            <button
                              onClick={() => handleConfirmSeverity(r.id, 'Moderate')}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px]"
                            >
                              Set Moderate
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
