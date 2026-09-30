import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { CounsellingRequest } from '../../types';
import { Calendar, UserCheck, Clock, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

export const CounsellingScheduleView: React.FC = () => {
  const [requests, setRequests] = useState<CounsellingRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getCounsellingRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="break-words">Counselling Session Requests & Scheduling Queue</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Voluntary Requests & Confidential Protection
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto shrink-0">
          {requests.length} Active Requests
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
          Loading appointment schedule...
        </div>
      ) : requests.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          No pending appointment requests in queue.
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-slate-900 text-sm">{r.display_identity}</span>
                  {r.is_anonymous ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                      🔒 Anonymous-First
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-medium truncate">{r.unit_name}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Slot: <strong className="text-slate-800">{r.preferred_slot}</strong>
                  </span>
                  <span className="capitalize">
                    Mode: <strong className="text-slate-800">{r.preferred_mode.replace('_', ' ')}</strong>
                  </span>
                </div>

                {r.notes && (
                  <p className="text-slate-700 italic text-[11px] bg-white p-2.5 rounded-xl border border-slate-200 break-words">
                    "{r.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {r.status}
                </span>
                <button
                  onClick={() => alert(`Appointment confirmed for ${r.preferred_slot}`)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                >
                  Confirm Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
