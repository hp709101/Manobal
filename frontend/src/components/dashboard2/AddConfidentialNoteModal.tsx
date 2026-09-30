import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface AddConfidentialNoteModalProps {
  caseId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddConfidentialNoteModal: React.FC<AddConfidentialNoteModalProps> = ({
  caseId,
  onClose,
  onSuccess,
}) => {
  const [noteText, setNoteText] = useState('');
  const [outcome, setOutcome] = useState('Ongoing Welfare Follow-up');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!caseId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) {
      setError('Please enter the clinical evaluation / session note.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await api.addCounsellorNote(caseId, {
        note_text: noteText.trim(),
        clinical_outcome: outcome,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative text-slate-900 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Record Confidential Counsellor Note</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Confidential · AES-256-GCM Encrypted · Inaccessible to Chain of Command</p>
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
              Clinical Session Notes & Welfare Observations
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Conducted 40-minute confidential debrief. Soldier expressed difficulty sleeping due to family bereavement. Introduced box breathing techniques and recommended 10 days compassionate rest..."
              rows={5}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Recommended Clinical Outcome (Follow-up & Outcomes)
            </label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Ongoing Welfare Follow-up">Ongoing Welfare Follow-up</option>
              <option value="Recommended Compassionate Leave">Recommended Compassionate Leave</option>
              <option value="Referred to Military Hospital Specialist">Referred to Military Hospital Specialist</option>
              <option value="Issue Resolved - Close Case">Issue Resolved - Close Case</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span className="break-words">
              Cryptographic envelope encryption guarantees this note cannot be decrypted by any database admin or unit commander.
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
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 text-center"
            >
              {submitting ? 'Encrypting Note...' : 'Encrypt & Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
