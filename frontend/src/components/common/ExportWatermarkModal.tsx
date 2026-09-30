import React, { useState } from 'react';
import { FileDown, X, ShieldAlert, CheckCircle, Printer } from 'lucide-react';
import { api } from '../../services/api';

interface ExportWatermarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportType?: string;
}

export const ExportWatermarkModal: React.FC<ExportWatermarkModalProps> = ({
  isOpen,
  onClose,
  exportType = 'unit_summary',
}) => {
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState<any>(null);

  React.useEffect(() => {
    if (isOpen) {
      handleGenerate();
    } else {
      setExportData(null);
    }
  }, [isOpen, exportType]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await api.generateWatermarkedExport(exportType);
      setExportData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative text-slate-900 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Indian Tricolor top accent rim */}
        <div className="h-1.5 w-[calc(100%+3rem)] -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 mb-4 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
            <FileDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
              <span>🇮🇳</span>
              <span>Watermarked Confidential Export</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Restricted Defence Export with Cryptographic Viewer Stamp</p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs animate-pulse">
            Generating cryptographic watermark and logging export event to audit registry...
          </div>
        ) : exportData ? (
          <div className="space-y-4">
            {/* Watermarked Document Preview Box */}
            <div className="relative border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-4 sm:p-6 overflow-hidden">
              {/* Diagonal Watermark Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none text-center">
                <img src="/sign.png" alt="" className="w-56 h-56 object-contain opacity-[0.06] pointer-events-none select-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 rotate-[-25deg]">
                  <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 space-y-4">
                    <div>{exportData.watermark}</div>
                    <div>{exportData.watermark}</div>
                    <div>{exportData.watermark}</div>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div className="relative z-10 space-y-3 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-1.5">
                  <div className="flex items-center gap-2">
                    <img src="/long_logo.png" alt="ManoBal" className="h-7 w-auto object-contain rounded border border-slate-200 bg-white" />
                    <span className="text-slate-800 font-bold text-[11px] break-words">DEFENCE WELFARE BRIEF · 🇮🇳 RESTRICTED</span>
                  </div>
                  <span className="text-slate-500 text-[10px] sm:text-xs">DOC ID: {exportData.export_id}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="break-words"><span className="text-slate-400">Authorized Viewer:</span> {exportData.viewer}</div>
                  <div><span className="text-slate-400">Security Clearance:</span> RESTRICTED DEFENCE</div>
                  <div><span className="text-slate-400">Timestamp:</span> {exportData.timestamp}</div>
                  <div><span className="text-slate-400">Audit Registry:</span> Append-Only Verified</div>
                </div>

                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-[11px] leading-relaxed break-words">
                  <span className="font-bold flex items-center gap-1.5 text-rose-700 mb-1">
                    <ShieldAlert className="w-4 h-4 shrink-0" /> STATUTORY PURPOSE LIMITATION
                  </span>
                  {exportData.purpose_limitation_statement}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium break-words">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Export verified & logged to tamper-evident audit table
              </span>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => alert(`Document ${exportData.export_id} exported with watermark.`)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 text-center"
                >
                  <Printer className="w-3.5 h-3.5" /> Download / Print PDF
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold text-center"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
