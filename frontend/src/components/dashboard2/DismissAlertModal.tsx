import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, CheckCircle, Sparkles } from 'lucide-react';

interface DismissAlertModalProps {
  caseId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const DismissAlertModal: React.FC<DismissAlertModalProps> = ({
  caseId,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!caseId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 5) {
      setError('A clinical justification is required to calibrate model precision.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await api.dismissCase(caseId, reason.trim());
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to dismiss alert');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl relative text-slate-900 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Dismiss Alert as False Positive</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Feedback Loop for Predictive Model Calibration</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Clinical Reason for Alert Dismissal (Required)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. In-person debrief confirmed soldier is in high spirits; elevated heart rate was attributable to strenuous PT drill rather than anxiety..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span className="break-words">
              Your feedback is audited and fed back into the explainable risk engine to reduce future false-positive alarms for this unit profile.
            </span>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition-all disabled:opacity-50 text-center"
            >
              {submitting ? 'Closing Alert...' : 'Dismiss & Calibrate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
