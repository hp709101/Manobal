import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  X, Sparkles, Lock, FileText, Send, UserCheck, AlertTriangle,
  Heart, Activity, CheckCircle, ArrowRightLeft, ShieldAlert
} from 'lucide-react';

interface ExplainableCaseModalProps {
  caseId: string | null;
  onClose: () => void;
  onRefresh: () => void;
  onOpenAddNote: (caseId: string) => void;
  onOpenReferral: (caseId: string) => void;
  onOpenDismiss: (caseId: string) => void;
  onOpenHandover: (caseId: string) => void;
}

export const ExplainableCaseModal: React.FC<ExplainableCaseModalProps> = ({
  caseId,
  onClose,
  onRefresh,
  onOpenAddNote,
  onOpenReferral,
  onOpenDismiss,
  onOpenHandover,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (caseId) {
      loadCase(caseId);
    }
  }, [caseId]);

  const loadCase = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.getCaseDetail(id);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!caseId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-4 sm:p-7 shadow-2xl relative text-slate-900 max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {loading || !data ? (
          <div className="py-24 text-center text-slate-400 animate-pulse text-xs">
            Decrypting clinical dossier and compiling explainability factors...
          </div>
        ) : (
          <div className="space-y-5 overflow-y-auto pr-1">
            {/* Header: Soldier and Case Status */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {data.case.priority} Urgency
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    CASE REF: {data.case.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 break-words">
                  {data.case.rank} {data.case.full_name}
                </h2>
                <p className="text-xs text-slate-500 break-words">{data.case.unit_name}</p>
              </div>

              {/* Action Buttons for Counsellor */}
              <div className="grid grid-cols-2 sm:flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onOpenAddNote(caseId)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all min-w-0"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">+ Note</span>
                </button>

                <button
                  onClick={() => onOpenReferral(caseId)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all min-w-0"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Referral</span>
                </button>

                <button
                  onClick={() => onOpenHandover(caseId)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm min-w-0"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Handover</span>
                </button>

                <button
                  onClick={() => onOpenDismiss(caseId)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all min-w-0"
                >
                  <span className="truncate">Dismiss</span>
                </button>
              </div>
            </div>

            {/* Feature 4: Explainable Contributing Factors (SHAP Breakdown) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 break-words">
                    Explainable Risk Analysis (Plain Language Factors)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Interpretable XGBoost/SHAP</span>
              </div>

              <div className="space-y-2">
                {data.case.factors?.map((f: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-200 shadow-sm gap-1.5"
                  >
                    <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
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
            </div>

            {/* Consented Sleep and Activity Trends */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 flex-wrap">
                  <Activity className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Consented Health Tracker Trends</span>
                </h3>
                <span className="self-start sm:self-auto text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">User Consent Active</span>
              </div>

              {data.health_trends?.sync_enabled ? (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-slate-500 text-[10px] font-semibold">Sleep Architecture</div>
                      <div className="font-extrabold text-slate-900 text-base mt-0.5">{data.health_trends.avg_sleep_hours} hrs</div>
                      <div className="text-[10px] text-rose-600 font-medium">Deficit: -{(7.0 - data.health_trends.avg_sleep_hours).toFixed(1)}h</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-slate-500 text-[10px] font-semibold">Circadian Regularity</div>
                      <div className="font-extrabold text-slate-900 text-base mt-0.5">{data.health_trends.sleep_consistency_pct}%</div>
                      <div className="text-[10px] text-slate-400">Sleep timing lock</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-slate-500 text-[10px] font-semibold">Resting HR (Autonomic)</div>
                      <div className="font-extrabold text-slate-900 text-base mt-0.5">{data.health_trends.resting_heart_rate} bpm</div>
                      <div className="text-[10px] text-amber-600 font-medium">Sympathetic tone</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-slate-500 text-[10px] font-semibold">Patrol Exertion Load</div>
                      <div className="font-extrabold text-slate-900 text-base mt-0.5">{data.health_trends.daily_steps.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Movement Index</div>
                    </div>
                  </div>

                  {/* Operational Exertion-to-Recovery Clinical Alert */}
                  {data.health_trends.avg_sleep_hours < 5.0 && data.health_trends.daily_steps >= 13000 && (
                    <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Clinical Over-Exertion Warning:</span> High physical patrol exertion ({data.health_trends.daily_steps.toLocaleString()} load) compounded by chronic sleep deficit ({data.health_trends.avg_sleep_hours}h) triggers severe autonomic strain. Recommend initiating mandatory R&R decompression rotation.
                      </div>
                    </div>
                  )}

                  {/* 7-Day Trend Mini Visualizer */}
                  {data.health_trends.historical_days?.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-500 mb-1">7-Day Sleep Duration vs 7.0h Baseline:</div>
                      <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[10px]">
                        {data.health_trends.historical_days.map((d: any, idx: number) => {
                          const isLow = d.sleep_hours < 5.5;
                          return (
                            <div key={idx} className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                              <div className="text-slate-400 mb-0.5">{d.day}</div>
                              <div className={`font-bold ${isLow ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {d.sleep_hours}h
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <p className="text-[11px] text-sky-800 mt-2.5 italic bg-sky-50 p-2.5 rounded-xl border border-sky-200">
                    💡 Clinical Insight: {data.health_trends.plain_language_insight}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 text-center shadow-sm">
                  Personnel has not connected a wearable health tracker or has paused sync. Health biometrics remain sealed in compliance with privacy directives.
                </div>
              )}
            </div>

            {/* Feature 5: Confidential Counsellor Notes (AES-256-GCM Encrypted) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Confidential Counsellor Notes (AES-256-GCM Encrypted)
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Commanders Blocked
                </span>
              </div>

              <div className="space-y-2.5">
                {data.confidential_notes?.length === 0 ? (
                  <div className="text-xs text-slate-500 py-4 text-center bg-white rounded-xl border border-slate-200">
                    No clinical case notes recorded yet. Use '+ Confidential Note' to record evaluation.
                  </div>
                ) : (
                  data.confidential_notes.map((n: any) => (
                    <div key={n.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-900">
                          {n.author_name} · <span className="text-emerald-700 font-semibold">{n.clinical_outcome}</span>
                        </span>
                        <span className="font-mono text-slate-400">
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {n.decrypted_note}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Referrals Registry */}
            {data.referrals?.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Active Specialist / Medical Referrals
                </h4>
                {data.referrals.map((rf: any) => (
                  <div key={rf.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{rf.referral_target}</span>
                      <span className="text-slate-500 text-[11px] ml-2">({rf.priority} Priority)</span>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      STATUS: {rf.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
