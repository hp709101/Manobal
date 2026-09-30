import React, { useState } from 'react';
import { PersonnelSummary } from '../../types';
import { api } from '../../services/api';
import { X, MessageSquarePlus, Tag, Shield, Sparkles, AlertCircle } from 'lucide-react';

interface AddRemarkModalProps {
  personnel: PersonnelSummary | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_TAGS = [
  { id: 'bereavement', label: 'Bereavement / Family Loss', color: 'text-rose-800 bg-rose-50 border-rose-200' },
  { id: 'family_illness', label: 'Family Illness / Hospitalization', color: 'text-amber-800 bg-amber-50 border-amber-200' },
  { id: 'financial_strain', label: 'Financial Strain / Debt', color: 'text-purple-800 bg-purple-50 border-purple-200' },
  { id: 'conflict', label: 'Domestic / Legal Dispute', color: 'text-orange-800 bg-orange-50 border-orange-200' },
  { id: 'injury', label: 'Physical Injury / Rehab', color: 'text-sky-800 bg-sky-50 border-sky-200' },
  { id: 'deployment_strain', label: 'High-Altitude / Border Strain', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' },
];

export const AddRemarkModal: React.FC<AddRemarkModalProps> = ({
  personnel,
  onClose,
  onSuccess,
}) => {
  const [freeText, setFreeText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'commander_only' | 'shared_with_welfare'>('shared_with_welfare');
  const [expiryDays, setExpiryDays] = useState('90');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!personnel) return null;

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeText.trim()) {
      setError('Please provide remark text describing the life event or observation.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + parseInt(expiryDays));

      await api.addRemark(personnel.id, {
        free_text: freeText.trim(),
        tags: selectedTags,
        visibility_level: visibility,
        expiry_date: expDate.toISOString().split('T')[0],
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record remark');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Record Personnel Remark</h3>
            <p className="text-xs text-slate-500">
              {personnel.display_name} ({personnel.service_id_display})
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Structured Remark Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-sky-600" />
              <span>Structured Life-Event Tags</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? `${tag.color} ring-2 ring-sky-500/20 shadow-xs font-bold`
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Structured tags assist NLP life-event severity scoring far more reliably than unstructured free text alone.
            </p>
          </div>

          {/* Free Text Input (Encrypted at rest) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Observation / Life Event Notes (AES-256-GCM Encrypted at Rest)
            </label>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="e.g. Soldier lost younger brother in highway accident. Appears withdrawn during morning muster; advised to check in..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Visibility Level Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Visibility Level
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="shared_with_welfare">Shared with Welfare Officer</option>
                <option value="commander_only">Commander Only (Chain of Command)</option>
              </select>
            </div>

            {/* Expiry and Review Cycle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Expiry & Review Cycle
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="30">30 Days (Transient / Urgent)</option>
                <option value="90">90 Days (Standard Life Event)</option>
                <option value="180">180 Days (Long-term Medical)</option>
              </select>
            </div>
          </div>

          {/* Safeguard Notice */}
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-2.5 text-[11px] text-sky-900">
            <Sparkles className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
            <div className="min-w-0">
              <span className="font-bold">Automated Life-Event Analysis Notice:</span>
              <p className="mt-0.5 text-slate-600 break-words leading-relaxed">
                The NLP engine will propose a life-event impact level (Low/Moderate/High) for officer confirmation. It will NEVER auto-label or diagnose any personnel as clinically depressed.
              </p>
            </div>
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
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Encrypting & Recording...' : 'Encrypt & Record Remark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
