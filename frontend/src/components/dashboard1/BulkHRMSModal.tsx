import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface BulkHRMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SAMPLE_CSV = `service_id,leave_balance_days,consecutive_duty_days,shift_overtime_hours,transfer_count_last_2yr,last_leave_date,fitness_grade
SRV-10294,45,68,36.0,3,2025-08-14,SHAPE-1
SRV-10832,20,40,22.5,2,2025-11-20,SHAPE-1
SRV-20481,40,55,20.0,1,2025-09-18,SHAPE-1
SRV-99999,30,10,0.0,0,2026-01-01,SHAPE-1`;

export const BulkHRMSModal: React.FC<BulkHRMSModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [submitting, setSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim());

    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim());
      if (cols.length >= headers.length) {
        records.push({
          service_id: cols[0],
          leave_balance_days: parseInt(cols[1]) || 30,
          consecutive_duty_days: parseInt(cols[2]) || 0,
          shift_overtime_hours: parseFloat(cols[3]) || 0.0,
          transfer_count_last_2yr: parseInt(cols[4]) || 0,
          last_leave_date: cols[5],
          fitness_grade: cols[6] || 'SHAPE-1',
        });
      }
    }
    return records;
  };

  const handlePreview = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const records = parseCSV(csvText);
      if (records.length === 0) {
        setError('No valid CSV rows parsed. Check header and delimiter format.');
        return;
      }
      const res = await api.bulkUploadHRMS(records, false); // Commit = False for preview
      setValidationResult(res);
    } catch (err: any) {
      setError(err.message || 'Validation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const records = parseCSV(csvText);
      const res = await api.bulkUploadHRMS(records, true); // Commit = True
      setValidationResult(res);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Commit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative text-slate-900 max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Bulk HRMS Report Import & Schema Verification</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Features 5 & 11 · Tokenized Service ID Matching, Schema Checks, and Rollback
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 break-words">
            {error}
          </div>
        )}

        <div className="space-y-4 overflow-y-auto pr-1">
          <div>
            <div className="flex justify-between items-center mb-1.5 flex-wrap gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Paste HRMS Data (CSV Format)
              </label>
              <button
                type="button"
                onClick={() => setCsvText(SAMPLE_CSV)}
                className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold"
              >
                Reset to Sample
              </button>
            </div>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={6}
              className="w-full font-mono bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Validation Result Box */}
          {validationResult && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Validation Summary ({validationResult.status.toUpperCase()})
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 self-start sm:self-auto">
                  Total Records: {validationResult.total_records}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-emerald-900 truncate">{validationResult.matched_count} Matched</div>
                    <div className="text-[10px] text-emerald-700">Tokenized Service IDs validated</div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-amber-900 truncate">{validationResult.unmatched_count} Unmatched</div>
                    <div className="text-[10px] text-amber-700">Rejected / Not found in battalion</div>
                  </div>
                </div>
              </div>

              {validationResult.unmatched_records?.length > 0 && (
                <div className="text-[11px] text-amber-900 bg-amber-50/80 p-3 rounded-xl border border-amber-200 break-words">
                  <span className="font-bold">Mismatch Report: </span>
                  {validationResult.unmatched_records.map((u: any, i: number) => (
                    <span key={i} className="break-all">[{u.service_id}: {u.error}] </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-3">
          <span className="text-[11px] text-slate-500 break-words">
            * Automatic join key: tokenised SHA256 service ID hash.
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handlePreview}
              disabled={submitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors text-center"
            >
              {submitting ? 'Checking...' : 'Run Preview & Validation'}
            </button>
            <button
              type="button"
              onClick={handleCommit}
              disabled={submitting || !validationResult}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all disabled:opacity-40 text-center"
            >
              Commit HRMS Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
