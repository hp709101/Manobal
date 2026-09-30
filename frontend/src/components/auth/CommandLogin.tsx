import React, { useState } from 'react';
import { Shield, Lock, ArrowLeft, UserCheck, KeyRound, CheckCircle2 } from 'lucide-react';

interface CommandLoginProps {
  onLogin: (roleKey: string) => void;
  onBack: () => void;
}

export const CommandLogin: React.FC<CommandLoginProps> = ({ onLogin, onBack }) => {
  const [serviceId, setServiceId] = useState('IC-54912W');
  const [passcode, setPasscode] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<'commander_u1' | 'commander_u2' | 'admin'>('commander_u1');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(selectedRole);
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
          <span>Command & Admin Portal</span>
        </h2>
        <p className="text-xs text-slate-500">
          Formation Command Clearance · Scoped Battalion Duty & Wellness Oversight
        </p>
      </div>

      <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          Zero-Trust access: Unit commanders are strictly scoped to their assigned battalion. Raw biometrics remain shielded.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Officer Service Credential / Token ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Defence Security PIN / CAC Token
          </label>
          <div className="relative">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Quick Demo Persona Selection */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Select Evaluation Clearance
          </label>
          <div className="space-y-2">
            {[
              {
                id: 'commander_u1',
                title: 'Col. V. A. Rathore, SM',
                sub: 'CO, 14 Rajputana Rifles (Siachen Sector)',
              },
              {
                id: 'commander_u2',
                title: 'Col. H. S. Brar',
                sub: 'CO, 7th Sikh Light Infantry (Tawang Sector)',
              },
              {
                id: 'admin',
                title: 'Brig. J. S. Cheema',
                sub: 'HQ Division Administrator (Full HRMS Bulk Import)',
              },
            ].map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedRole(p.id as any)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRole === p.id
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="font-bold text-slate-900">{p.title}</div>
                <div className="text-[11px] text-slate-500">{p.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-xs flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          <span>{loading ? 'Authenticating Clearance...' : 'Authenticate & Enter Command Portal'}</span>
        </button>
      </form>
    </div>
  );
};
