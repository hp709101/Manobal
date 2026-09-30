import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { X, MessageSquare, Copy, Check, ShieldCheck } from 'lucide-react';

interface SafeMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafeMessagingModal: React.FC<SafeMessagingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      const data = await api.getWelfareTemplates();
      setTemplates(data);
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Safe-Messaging Outreach Library</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Professionally Reviewed Templates for Respectful Contact</p>
          </div>
        </div>

        <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-2 hover:border-slate-300 transition-colors shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                    {tpl.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 break-words">{tpl.title}</h4>
                </div>
                <button
                  onClick={() => copyToClipboard(tpl.id, tpl.content)}
                  className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
                >
                  {copiedId === tpl.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed font-sans break-words">
                "{tpl.content}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors text-center"
          >
            Close Library
          </button>
        </div>
      </div>
    </div>
  );
};
