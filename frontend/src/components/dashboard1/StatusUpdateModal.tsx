import React, { useState } from 'react';
import { PersonnelSummary, WelfareStatus } from '../../types';
import { api } from '../../services/api';
import { X, UserCheck, AlertTriangle, ShieldCheck } from 'lucide-react';

interface StatusUpdateModalProps {
  personnel: PersonnelSummary | null;
  onClose: () => void;
  onSuccess: () => void;
  currentUserRole: string;
}

const statusOptions: WelfareStatus[] = ['Normal', 'Moderate', 'Critical', 'Suspected', 'Unspecified'];

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  personnel,
  onClose,
  onSuccess,
  currentUserRole,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<WelfareStatus>(
    personnel?.observed_status || 'Normal'
  );
  const [reason, setReason] = useState('');
  const [statusType, setStatusType] = useState<'observed' | 'assessed'>(
    currentUserRole === 'welfare_officer' || currentUserRole === 'counsellor' ? 'assessed' : 'observed'
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!personnel) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A written justification reason is mandatory for any status modification.');
      return;
    }
    if (selectedStatus === 'Critical' && reason.trim().length < 8) {
      setError('A detailed operational/clinical justification is required when marking status as Critical.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await api.updateStatus(personnel.id, {
        new_status: selectedStatus,
        reason: reason.trim(),
        status_type: statusType,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Update Personnel Welfare Status</h3>
            <p className="text-xs text-slate-500">
              {personnel.display_name} ({personnel.service_id_display})
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Type Selector (Observed vs Assessed) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status Category (Observed vs Assessed)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatusType('observed')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                  statusType === 'observed'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">Observed Status</div>
                <div className="text-[10px] text-slate-500 font-normal">By Commander/Admin</div>
              </button>

              <button
                type="button"
                onClick={() => setStatusType('assessed')}
                disabled={currentUserRole === 'commander'}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                  statusType === 'assessed'
                    ? 'bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                } ${currentUserRole === 'commander' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-bold">Assessed Status</div>
                <div className="text-[10px] text-slate-500 font-normal">By Counsellor Only</div>
              </button>
            </div>
          </div>

          {/* Status Value Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Welfare Status Value
            </label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedStatus === st
                      ? st === 'Critical'
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-500/20'
                        : st === 'Moderate'
                        ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-500/20'
                        : 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Mandatory Reason Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between">
              <span>Mandatory Justification Reason</span>
              {selectedStatus === 'Critical' && (
                <span className="text-rose-600 text-[10px] font-bold">Required for Critical Status</span>
              )}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Soldier showed high distress during debrief following consecutive glacier rotation..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Every status change is permanently audited with your name, role, timestamp, and justification.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Auditing & Saving...' : 'Commit Status Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
