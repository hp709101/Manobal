import React, { useState } from 'react';
import { Smartphone, Lock, ArrowLeft, Heart, KeyRound, ShieldCheck, UserCheck } from 'lucide-react';

interface SoldierLoginProps {
  onLogin: (roleKey: string) => void;
  onBack: () => void;
}

export const SoldierLogin: React.FC<SoldierLoginProps> = ({ onLogin, onBack }) => {
  const [serviceId, setServiceId] = useState('SRV-10294');
  const [pin, setPin] = useState('••••');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin('personnel');
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
          <span>Uniformed Personnel Portal</span>
        </h2>
        <p className="text-xs text-slate-500">
          Personal Stress & Welfare Space · PWA Self-Service for Soldiers & Officers
        </p>
      </div>

      <div className="bg-teal-50/70 border border-teal-200/70 rounded-2xl p-3.5 text-xs text-teal-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          Your space is private. Your self-assessments, support chats, and personal journal are client-encrypted and never visible to the chain of command.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Anonymous Check-in Toggle */}
        <div
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            isAnonymous
              ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>🔒 Anonymous Fast Check-In Mode</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Enter without service number for private breathing and confidential support.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isAnonymous}
            readOnly
            className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
          />
        </div>

        {!isAnonymous ? (
          <>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Army Service Number / Token ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Personal Security PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Demo Persona Card */}
            <div className="p-3.5 bg-teal-50/50 border border-teal-200 rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-teal-700 tracking-wider mb-0.5">
                Evaluation Soldier Profile
              </div>
              <div className="font-bold text-slate-900 text-sm">
                Sepoy Rajesh Kumar Singh (P-001)
              </div>
              <div className="text-[11px] text-slate-500">
                14 Rajputana Rifles · Siachen Sector · Token: TOK-9F4D28A1
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-600">
            <p className="font-bold text-slate-800 text-xs">Anonymous Session Mode</p>
            <p className="text-[11px] mt-1 text-slate-500">
              Zero login credentials logged. You can book anonymous counselling or take private grounding tests.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all text-xs flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          <span>{loading ? 'Entering Portal...' : 'Access My Wellness Portal'}</span>
        </button>
      </form>
    </div>
  );
};
