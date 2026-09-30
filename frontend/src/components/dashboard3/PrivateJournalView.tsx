import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { BookOpen, Lock, Plus, CheckCircle, ShieldCheck } from 'lucide-react';

interface PrivateJournalViewProps {
  language: 'en' | 'hi';
}

export const PrivateJournalView: React.FC<PrivateJournalViewProps> = ({ language }) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [newContent, setNewContent] = useState('');
  const [mood, setMood] = useState('Steady');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const isHi = language === 'hi';

  useEffect(() => {
    loadJournal();
  }, []);

  const loadJournal = async () => {
    setLoading(true);
    try {
      const data = await api.getJournal();
      setEntries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setSubmitting(true);
    try {
      await api.addJournal({ mood, content: newContent.trim() });
      setNewContent('');
      loadJournal();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
        <div className="min-w-0">
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Private Journal
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 break-words">
            {isHi ? 'प्राइवेट जर्नल (व्यक्तिगत डायरी)' : 'Private Confidential Journal'}
          </h3>
          <p className="text-xs text-slate-500 break-words">
            {isHi
              ? 'आपकी डिवाइस पर सुरक्षित और एन्क्रिप्टेड। यह कभी भी किसी अधिकारी को नहीं दिखाया जाता।'
              : 'Client-side encrypted. Never accessible to chain of command or welfare officers.'}
          </p>
        </div>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 self-start sm:self-auto">
          <Lock className="w-4 h-4" />
        </div>
      </div>

      {/* New Entry Form */}
      <form onSubmit={handleAddEntry} className="space-y-3.5 bg-slate-50 p-3.5 sm:p-5 rounded-2xl border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {isHi ? 'मनोदशा (Mood)' : 'Current State of Mind'}
          </label>
          <div className="grid grid-cols-2 sm:flex flex-wrap gap-2">
            {['Steady / शांत', 'Fatigued / थकावट', 'Determined / संकल्पित', 'Heavy / भारीपन'].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMood(m.split(' / ')[0])}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all min-w-0 ${
                  mood === m.split(' / ')[0]
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="truncate w-full text-center block">{m}</span>
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder={
            isHi
              ? 'आज की भावनाएं या विचार यहाँ लिखें (पूर्णतः निजी)...'
              : 'Write your private thoughts, reflections, or venting here (strictly confidential)...'
          }
          rows={3}
          className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newContent.trim() || submitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{submitting ? 'Encrypting...' : isHi ? 'एन्क्रिप्ट करके सेव करें' : 'Encrypt & Save Entry'}</span>
          </button>
        </div>
      </form>

      {/* Entry History */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {loading ? (
          <div className="text-center text-xs text-slate-400 py-4">Decrypting entries...</div>
        ) : entries.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-4">
            {isHi ? 'कोई पिछली प्रविष्टि नहीं मिली।' : 'No journal entries recorded yet.'}
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs shadow-xs">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">[{entry.mood}]</span>
                <span className="font-mono text-slate-400">{new Date(entry.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-800 leading-relaxed font-sans">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
