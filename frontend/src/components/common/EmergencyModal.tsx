import React from 'react';
import { Phone, ShieldAlert, X, HeartHandshake, AlertTriangle } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white border border-rose-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto scrollbar-thin overflow-hidden">
        {/* Indian Tricolor top accent rim */}
        <div className="h-1.5 w-[calc(100%+2.5rem)] sm:w-[calc(100%+3rem)] -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-4 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <button
          onClick={onClose}
          className="absolute top-5 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start sm:items-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>🇮🇳</span>
              <span>Emergency Helplines & Immediate Care</span>
            </h3>
            <p className="text-xs text-rose-600 font-semibold break-words">24x7 Government of India Crisis Support for Uniformed Personnel</p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5 text-xs text-rose-900">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <span className="leading-relaxed break-words">
            You are never alone. Reaching out is a sign of strength and tactical resilience. These verified helplines are completely confidential, free, and available 24 hours a day.
          </span>
        </div>

        <div className="space-y-3">
          {/* Tele-MANAS */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 hover:border-emerald-400 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
              <div className="min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  National Govt 24x7 Care
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 break-words">Tele-MANAS (Mental Health Assistance)</h4>
                <p className="text-xs text-slate-600 break-words">Govt of India free psychological counselling in all Indian languages</p>
              </div>
              <a
                href="tel:14416"
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/20 shrink-0"
              >
                <Phone className="w-3.5 h-3.5" /> 14416
              </a>
            </div>
            <div className="mt-1.5 text-[11px] text-slate-500 font-mono">Toll-free alternate: 1800-891-4416</div>
          </div>

          {/* KIRAN */}
          <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-3.5 sm:p-4 hover:border-sky-400 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
              <div className="min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">
                  Rehabilitation Helpline
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 break-words">KIRAN Helpline (MSJE)</h4>
                <p className="text-xs text-slate-600 break-words">Ministry of Social Justice & Empowerment rehabilitation care</p>
              </div>
              <a
                href="tel:18005990019"
                className="flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-md shadow-sky-600/20 shrink-0"
              >
                <Phone className="w-3.5 h-3.5" /> 1800-599-0019
              </a>
            </div>
          </div>

          {/* Military Unit Medical Inspection Room */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3.5 sm:p-4 hover:border-amber-400 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
              <div className="min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  On-Station Defence Care
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 break-words">Unit Medical Aid Post (MI Room)</h4>
                <p className="text-xs text-slate-600 break-words">Regimental Medical Officer (RMO) & 24x7 Ambulance Dispatch</p>
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-amber-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-amber-600/20 shrink-0">
                <HeartHandshake className="w-3.5 h-3.5" /> 112 / Ext 3333
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Close Helplines
          </button>
        </div>
      </div>
    </div>
  );
};
