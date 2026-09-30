import React, { useState } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, Download, Trash2, CheckCircle2, Lock, Eye, ArrowDownToLine } from 'lucide-react';

interface DataControlCenterProps {
  language: 'en' | 'hi';
}

export const DataControlCenter: React.FC<DataControlCenterProps> = ({ language }) => {
  const [downloading, setDownloading] = useState(false);
  const [purged, setPurged] = useState(false);

  const isHi = language === 'hi';

  const handleDownloadPersonalArchive = () => {
    setDownloading(true);
    setTimeout(() => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
        JSON.stringify({
          archive_type: 'MANOBAL_PERSONAL_DATA_EXPORT',
          compliance: 'DPDP_ACT_2023_SECTION_12',
          timestamp: new Date().toISOString(),
          record_holder: 'Sepoy Rajesh Kumar Singh',
          tokenized_id: 'TOK-9F4D28A1',
          data_categories: [
            'Private Support Chat Sessions (Client-Encrypted)',
            'Self-Assessment Results (PHQ-9)',
            'Daily Health Summaries (Consented Only)'
          ],
          notice: 'This export contains personal welfare self-records. Strictly prohibited from military ACR or promotion evaluation.'
        }, null, 2)
      );
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `manobal_personal_archive_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setDownloading(false);
    }, 1000);
  };

  const handlePurgeAllData = async () => {
    if (!confirm(isHi ? 'क्या आप अपने सभी डेटा को स्थायी रूप से मिटाना चाहते हैं?' : 'Are you sure you want to permanently erase your stored wellness data?')) {
      return;
    }
    try {
      await api.purgeHealthData();
      setPurged(true);
      setTimeout(() => setPurged(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
        <div className="min-w-0">
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Personal Data Control Centre
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 break-words">
            {isHi ? 'डेटा नियंत्रण केंद्र (Data Privacy Dashboard)' : 'Personal Data Control Centre'}
          </h3>
          <p className="text-xs text-slate-500 break-words">
            {isHi
              ? 'देखें क्या साझा है, अनुमति वापस लें, या अपना डेटा डाउनलोड और मिटाएं।'
              : 'Audit active permissions, export your encrypted archive, or execute right-to-erasure.'}
          </p>
        </div>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {purged && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-semibold break-words">
          {isHi
            ? 'स्वास्थ्य डेटा सफलतापूर्वक स्थायी रूप से मिटा दिया गया है।'
            : 'Personal wellness metrics successfully purged from servers.'}
        </div>
      )}

      {/* Permissions Audit Grid */}
      <div className="space-y-2 text-xs">
        <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
          {isHi ? 'सक्रिय अनुमतियाँ और दृश्यता स्थिति' : 'Active Permissions & Visibility Matrix'}
        </h4>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-200/60 overflow-hidden">
          <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 break-words">
                {isHi ? 'निजी चैटबॉट संवाद (Support Chatbot)' : 'Support Chatbot Transcripts'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 break-words">
                {isHi ? 'गोपनीयता: केवल आपकी डिवाइस और एंड-टू-एंड एन्क्रिप्शन' : 'Visibility: Self-only (AES-256-GCM envelope encrypted)'}
              </div>
            </div>
            <span className="self-start sm:self-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              {isHi ? 'निजी' : 'Private'}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 break-words">
                {isHi ? 'हेल्थ-ट्रैकर मेट्रिक्स (Wearable Biometrics)' : 'Health Tracker Biometrics'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 break-words">
                {isHi ? 'कमांड केवल कोर्स चिप (Stable/Declining) देख सकता है' : 'Visibility: Consented summaries to counsellor; Coarse chip only to commander'}
              </div>
            </div>
            <span className="self-start sm:self-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 shrink-0">
              {isHi ? 'उपयोगकर्ता नियंत्रित' : 'User-Controlled'}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 break-words">
                {isHi ? 'प्राइवेट जर्नल (Private Journal)' : 'Private Journal Reflections'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 break-words">
                {isHi ? 'स्थानीय संग्रहण: किसी भी अधिकारी के लिए अदृश्य' : 'Visibility: Client-side only; Never accessible to command'}
              </div>
            </div>
            <span className="self-start sm:self-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              {isHi ? '100% ऑन-डिवाइस' : '100% On-Device'}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons: Download & Erase */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleDownloadPersonalArchive}
          disabled={downloading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <ArrowDownToLine className="w-4 h-4 text-sky-600" />
          <span>{downloading ? 'Compiling Archive...' : isHi ? 'व्यक्तिगत डेटा संग्रह डाउनलोड करें' : 'Download My Data Archive'}</span>
        </button>

        <button
          onClick={handlePurgeAllData}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Trash2 className="w-4 h-4" />
          <span>{isHi ? 'डेटा मिटाएं (Right to Forget)' : 'Purge All Health Data'}</span>
        </button>
      </div>
    </div>
  );
};
