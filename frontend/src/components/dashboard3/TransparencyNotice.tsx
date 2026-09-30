import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, EyeOff, CheckCircle } from 'lucide-react';

interface TransparencyNoticeProps {
  language: 'en' | 'hi';
}

export const TransparencyNotice: React.FC<TransparencyNoticeProps> = ({ language }) => {
  const isHi = language === 'hi';

  return (
    <div className="bg-white border border-emerald-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3.5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight break-words">
            {isHi ? 'आपकी गोपनीयता और डेटा सुरक्षा की गारंटी' : 'Upfront Transparency & Privacy Guarantee'}
          </h3>
          <p className="text-[11px] sm:text-xs text-emerald-800 font-bold break-words mt-0.5">
            {isHi ? 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Act, 2023) के अनुरूप' : 'Conforming to Digital Personal Data Protection Act, 2023'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHi ? 'पूरी तरह गोपनीय' : 'Strictly Private to You'}</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            {isHi
              ? 'आपकी निजी चैट, सेल्फ-असेसमेंट और जर्नल आपकी डिवाइस पर सुरक्षित हैं। यह कभी भी आपके कमांडिंग ऑफिसर को नहीं दिखाई देते।'
              : 'Your chats, journal entries, and self-screenings remain confidential. Commanders have zero access to raw transcripts.'}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHi ? 'अलर्ट कब भेजा जाता है?' : 'When is an Alert Sent?'}</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            {isHi
              ? 'अलर्ट केवल तभी भेजा जाता है जब आत्म-नुकसान का गंभीर संकेत मिले, या जब आप स्वयं काउंसलर से संपर्क की अनुमति दें।'
              : 'Alerts trigger strictly upon detection of acute self-harm signals or when you explicitly opt-in during chat.'}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <EyeOff className="w-3.5 h-3.5 text-sky-600" />
            <span>{isHi ? 'न्यूनतम प्रकटीकरण' : 'Minimal Disclosure Rule'}</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            {isHi
              ? 'कल्याण अधिकारी को केवल टियर (Tier) और समय भेजा जाता है, आपकी पूरी बातचीत कभी साझा नहीं की जाती।'
              : 'Welfare officers receive only the risk tier, category, and timestamp. Transcripts are never shared without consent.'}
          </p>
        </div>
      </div>
    </div>
  );
};
