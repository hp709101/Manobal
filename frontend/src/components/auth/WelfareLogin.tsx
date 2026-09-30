import React, { useState } from 'react';
import { Stethoscope, Lock, ArrowLeft, HeartHandshake, KeyRound, ShieldCheck } from 'lucide-react';

interface WelfareLoginProps {
  onLogin: (roleKey: string) => void;
  onBack: () => void;
}

export const WelfareLogin: React.FC<WelfareLoginProps> = ({ onLogin, onBack }) => {
  const [medicalId, setMedicalId] = useState('AMC-92841-MED');
  const [passcode, setPasscode] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin('welfare');
    }, 400);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 space-y-6 overflow-hidden">
      {/* Indian Tricolor top accent rim */}
      <div className="h-1.5 w-[calc(100%+4rem)] -mt-8 -mx-8 mb-5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Gateway Portal</span>
      </button>

      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs inline-block">
            <img src="/long_logo.png" alt="ManoBal" className="h-12 w-auto object-contain rounded-xl" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
          <span>🇮🇳</span>
          <span>Welfare & Counsellor Portal</span>
        </h2>
        <p className="text-xs text-slate-500">
          Medical & Psychological Care Enclave · Confidential Clinical Case Notes
        </p>
      </div>

      <div className="bg-sky-50/70 border border-sky-200/70 rounded-2xl p-3.5 text-xs text-sky-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          High-privacy clearance: Access to confidential AES-256-GCM decrypted clinical case notes, SLA alert inbox, and consented sleep trends.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Army Medical Corps (AMC) / Welfare Officer ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={medicalId}
              onChange={(e) => setMedicalId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
            <HeartHandshake className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Clinical Enclave Passcode / Security Key
          </label>
          <div className="relative">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Demo Persona Card */}
        <div className="p-3.5 bg-sky-50/50 border border-sky-200 rounded-2xl">
          <div className="text-[10px] uppercase font-bold text-sky-700 tracking-wider mb-0.5">
            Active Clinical Persona
          </div>
          <div className="font-bold text-slate-900 text-sm">
            Capt. S. Sengupta (RMO / Unit Welfare Officer)
          </div>
          <div className="text-[11px] text-slate-500">
            Regimental Medical Aid Post & Mental Health Rehabilitation
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition-all text-xs flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          <span>{loading ? 'Verifying Medical Clearance...' : 'Authenticate & Enter Welfare Portal'}</span>
        </button>
      </form>
    </div>
  );
};
