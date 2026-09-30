import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Calendar, UserCheck, ShieldCheck, HeartHandshake } from 'lucide-react';

interface TalkToCounsellorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
}

export const TalkToCounsellorModal: React.FC<TalkToCounsellorModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [mode, setMode] = useState('in_person');
  const [slot, setSlot] = useState('Tomorrow Morning (1000h)');
  const [urgency, setUrgency] = useState('routine');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isHi = language === 'hi';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.bookCounsellor({
        is_anonymous: isAnonymous,
        preferred_mode: mode,
        preferred_slot: slot,
        urgency: urgency,
        notes: notes.trim(),
      });
      setSuccessMsg(
        isHi
          ? 'आपका अनुरोध सफलता से दर्ज कर लिया गया है। काउंसलर द्वारा जल्द पुष्टि की जाएगी।'
          : 'Your consultation request has been booked confidentially.'
      );
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2000);
    } catch (e: any) {
      alert(e.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {isHi ? 'काउंसलर से परामर्श का अनुरोध' : 'Schedule Confidential Counselling'}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {isHi
                ? 'फीचर 4 और 18 · स्वैच्छिक परामर्श एवं अज्ञात मोड (Anonymous-First)'
                : 'Features 4 & 18 · Voluntary Consultation & Anonymous-First Option'}
            </p>
          </div>
        </div>

        {successMsg ? (
          <div className="py-8 text-center text-emerald-700 font-bold text-xs space-y-2">
            <ShieldCheck className="w-10 h-10 mx-auto text-emerald-600" />
            <p className="text-sm">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Anonymous-First Mode Toggle (Feature 18) */}
            <div
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                isAnonymous
                  ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/20'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="min-w-0">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="break-words">🔒 {isHi ? 'अज्ञात-प्रथम मोड (Anonymous-First Mode)' : 'Anonymous-First Mode'}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 break-words">
                  {isHi
                    ? 'आपकी वास्तविक पहचान गोपनीय रखी जाएगी जब तक आप स्वयं साझा न करना चाहें।'
                    : 'Request a session without sharing your identity until you choose to.'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                readOnly
                className="rounded accent-purple-600 w-4 h-4 cursor-pointer shrink-0"
              />
            </div>

            {/* Mode of Consultation */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                {isHi ? 'परामर्श का माध्यम' : 'Consultation Mode'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'in_person', en: 'In-Person', hi: 'आमने-सामने' },
                  { id: 'voice_call', en: 'Secure Call', hi: 'सुरक्षित कॉल' },
                  { id: 'confidential_chat', en: 'Private Chat', hi: 'गोपनीय चैट' },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`py-2 px-2 rounded-xl font-bold border transition-all text-center ${
                      mode === m.id
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isHi ? m.hi : m.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Time Slot */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                {isHi ? 'पसंदीदा समय' : 'Preferred Slot'}
              </label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Today Evening (1800h - 1900h)">Today Evening (1800h - 1900h)</option>
                <option value="Tomorrow Morning (1000h - 1100h)">Tomorrow Morning (1000h - 1100h)</option>
                <option value="Tomorrow Afternoon (1400h - 1500h)">Tomorrow Afternoon (1400h - 1500h)</option>
                <option value="Weekend Stand-down Window">Weekend Stand-down Window</option>
              </select>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                {isHi ? 'काउंसलर के लिए संदेश (वैकल्पिक)' : 'Optional Note for Counsellor'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isHi
                    ? 'यदि आप पहले से कुछ साझा करना चाहें...'
                    : 'Optional brief message or topic you wish to discuss...'
                }
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-3 flex flex-col sm:flex-row justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors text-center"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-md shadow-sky-600/20 disabled:opacity-50 transition-all text-center"
              >
                {submitting ? 'Booking...' : isHi ? 'सत्र बुक करें' : 'Book Session'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
