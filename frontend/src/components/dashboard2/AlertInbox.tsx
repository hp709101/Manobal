import React from 'react';
import { WelfareCase } from '../../types';
import {
  AlertCircle, Clock, ShieldAlert, Sparkles, User,
  ChevronRight, CheckCircle, ArrowUpRight
} from 'lucide-react';

interface AlertInboxProps {
  alerts: WelfareCase[];
  onSelectCase: (caseId: string) => void;
  loading: boolean;
  isMobileFrame?: boolean;
}

export const AlertInbox: React.FC<AlertInboxProps> = ({
  alerts,
  onSelectCase,
  loading,
  isMobileFrame = true,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-wrap">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Prioritized Alert Inbox & Escalation Queue</span>
          </h2>
          <p className="text-xs text-slate-500 break-words">
            Escalations from Chatbot & Self-Assessments with Response-Time (SLA) Timers
          </p>
        </div>
        <span className="self-start sm:self-auto text-xs font-mono font-bold px-3 py-1 rounded-xl bg-white text-slate-700 border border-slate-200 shadow-sm shrink-0">
          Active Alerts: {alerts.length}
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 animate-pulse text-xs">
          Loading prioritized welfare queue...
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 shadow-sm">
          No pending welfare escalations. All cases currently within healthy parameters.
        </div>
      ) : (
        <div className={`grid gap-4 ${isMobileFrame ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {alerts.map((al) => {
            const isRed = al.priority === 'Critical';
            const isAmber = al.priority === 'Moderate';
            const remainingMins = al.sla_remaining_minutes ?? 120;
            const hours = Math.floor(remainingMins / 60);
            const mins = remainingMins % 60;

            return (
              <div
                key={al.id}
                onClick={() => onSelectCase(al.id)}
                className={`group cursor-pointer rounded-3xl p-5 transition-all duration-200 border bg-white shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isRed
                    ? 'border-rose-300 ring-2 ring-rose-500/10 hover:border-rose-400'
                    : isAmber
                    ? 'border-amber-300 ring-2 ring-amber-500/10 hover:border-amber-400'
                    : 'border-slate-200 hover:border-sky-400'
                }`}
              >
                <div>
                  {/* Top Bar: Priority Badge & SLA Countdown Timer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${
                        isRed
                          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                          : isAmber
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {al.priority} Priority
                    </span>

                    {/* SLA Countdown Timer (Feature 3) */}
                    <div
                      className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        al.is_overdue
                          ? 'bg-rose-100 text-rose-700 border-rose-300 animate-bounce'
                          : isRed
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>
                        {al.is_overdue
                          ? 'SLA OVERDUE'
                          : `SLA: ${hours > 0 ? `${hours}h ` : ''}${mins}m`}
                      </span>
                    </div>
                  </div>

                  {/* Soldier Details & Unit */}
                  <div className="mb-2">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center justify-between gap-2">
                      <span className="truncate">{al.display_name}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0">{al.id}</span>
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{al.unit_name}</p>
                  </div>

                  {/* Minimal Alert Summary (Privacy Safeguard) */}
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3 leading-relaxed break-words">
                    {al.summary_minimal}
                  </p>

                  {/* Top Explainable Factors Snippet */}
                  {al.factors?.length > 0 && (
                    <div className="space-y-1 mb-3">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Key Driver:</span>
                      </div>
                      <div className="text-[11px] text-slate-700 break-words bg-emerald-50/50 px-2.5 py-1 rounded-xl border border-emerald-100 font-medium">
                        {al.factors[0].factor}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Trigger source and open link */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                  <span className="capitalize text-slate-400">
                    Source: {al.trigger_source.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sky-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>Manage Case</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
