import React, { useState, useEffect } from 'react';
import { Shield, Users, Stethoscope, Smartphone, Lock, ArrowRight, Sparkles, Award, Scale, CheckCircle2, ChevronRight } from 'lucide-react';
import { scrollToTop } from '../../utils/scroll';

interface PortalGatewayProps {
  onSelectPortal: (portal: 'command' | 'welfare' | 'soldier', forceCategory: string) => void;
  onOpenSecurityInspector: () => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  isMobileFrame?: boolean;
}

export const PortalGateway: React.FC<PortalGatewayProps> = ({
  onSelectPortal,
  onOpenSecurityInspector,
  language,
  setLanguage,
  isMobileFrame = true,
}) => {
  const isHi = language === 'hi';
  const [selectedForce, setSelectedForce] = useState<string>('ALL');

  useEffect(() => {
    scrollToTop();
  }, []);

  const forceBranches = [
    {
      id: 'ALL',
      name: isHi ? 'समस्त वर्दीधारी बल' : 'All Uniformed Forces',
      sub: isHi ? 'राष्ट्रीय कमान दृष्टिकोण' : 'National Command & Joint Readiness',
      icon: '🇮🇳',
      motto: 'Seva Paramo Dharma (सेवा परमो धर्म:)',
      highlight: 'National Tri-Services & Security Command',
    },
    {
      id: 'Armed Forces',
      name: isHi ? 'भारतीय सशस्त्र बल' : 'Indian Armed Forces',
      sub: isHi ? 'थलसेना · नौसेना · वायुसेना' : 'Army · Navy · Air Force',
      icon: '🛡️',
      motto: 'Service Before Self',
      highlight: 'High Altitude, Desert & Maritime Frontlines',
    },
    {
      id: 'CAPFs',
      name: isHi ? 'केंद्रीय सशस्त्र पुलिस बल' : 'Central Armed Police (CAPFs)',
      sub: isHi ? 'सीआरपीएफ · बीएसएफ · सीआईएसएफ · आईटीबीपी · एसएसबी' : 'CRPF · BSF · CISF · ITBP · SSB',
      icon: '⚔️',
      motto: 'Duty Unto Death (जीवन पर्यन्त कर्तव्य)',
      highlight: 'Counter-Insurgency, Border Outposts & Internal Security',
    },
    {
      id: 'State Police',
      name: isHi ? 'राज्य पुलिस संगठन' : 'State Police Organizations',
      sub: isHi ? 'कानून व्यवस्था · दंगा नियंत्रण · बंदोबस्त' : 'Metro Police · Riot & Law Enforcement',
      icon: '🚓',
      motto: 'Protect the Righteous (सद्रक्षणाय खलनिग्रहणाय)',
      highlight: 'Continuous Law & Order, Bandobast & Urban Stress',
    },
    {
      id: 'Disaster Response',
      name: isHi ? 'आपदा मोचन बल' : 'Disaster Response (NDRF)',
      sub: isHi ? 'बाढ़ · चक्रवात · भूकंप बचाव दल' : 'Rapid Rescue & Post-Incident Trauma',
      icon: '🌊',
      motto: 'Saving Lives & Beyond (आपदा सेवा सदैव सर्वत्र)',
      highlight: 'Post-Trauma Incident Stress & Rapid Deployment',
    }
  ];

  const activeBranch = forceBranches.find((b) => b.id === selectedForce) || forceBranches[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2 sm:py-4 px-1">
      {/* Brand Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-50 via-white to-emerald-50 border border-slate-200/90 text-slate-800 text-[11px] font-bold shadow-xs max-w-full">
          <span>🇮🇳</span>
          <span className="truncate">सत्यमेव जयते · Government of India · Joint Defence & Security Command</span>
        </div>

        {/* ManoBal Brand Logo - The logo itself contains 'Man o बल' so no text needed beside it */}
        <div className="py-1 flex justify-center">
          <div className="relative p-2 sm:p-2.5 bg-white rounded-2xl sm:rounded-3xl shadow-md border border-slate-200/80 inline-block hover:shadow-lg transition-shadow">
            <img 
              src="/long_logo.png" 
              alt="ManoBal - Strong Minds, Safer Forces, Better Tomorrow" 
              className="h-20 sm:h-28 w-auto object-contain rounded-xl"
            />
            {/* Indian National Tricolor hairline ribbon below logo */}
            <div className="h-1 w-full mt-2 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-xs" />
          </div>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-2 font-medium">
          {isHi
            ? 'सशस्त्र बलों, सीएपीएफ, राज्य पुलिस और एनडीआरएफ के लिए प्रेडिक्टिव स्ट्रेस डिटेक्शन एवं कार्यभार संतुलन प्रणाली'
            : 'AI-Powered Stress, Burnout & Welfare Monitoring Architecture for Indian Armed Forces, CAPFs, State Police & Disaster Response Forces'}
        </p>

        {/* National Motto & Language switch */}
        <div className="pt-0.5 flex flex-wrap items-center justify-center gap-2">
          <div className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 flex items-center gap-1.5 shadow-xs">
            <span className="text-emerald-700 font-extrabold">सत्यमेव जयते</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">सेवा परमो धर्म:</span>
          </div>

          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-3.5 py-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>🇮🇳</span>
            <span>{language === 'en' ? 'हिन्दी में देखें' : 'Switch to English'}</span>
          </button>
        </div>
      </div>

      {/* Target Organization Selector Bar (Sleek Horizontal Chips, Never Squashed) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs px-0.5">
          <span className="font-extrabold uppercase tracking-wider text-slate-500 text-[11px]">
            {isHi ? 'लक्षित सुरक्षा बल शाखा' : 'Target Uniformed Force & Operational Domain'}
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {isHi ? '5 सुरक्षा शाखाएं' : '5 Branches Supported'}
          </span>
        </div>

        {/* Horizontal Chips Carousel */}
        <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar gap-2 pb-1 pt-0.5 -mx-1 px-1">
          {forceBranches.map((b) => {
            const isSelected = selectedForce === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedForce(b.id)}
                className={`shrink-0 snap-start flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-500/60 shadow-md scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-base leading-none">{b.icon}</span>
                <span className="whitespace-nowrap">{b.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Branch Active Detail Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="text-lg shrink-0">{activeBranch.icon}</span>
            <h3 className="font-black text-xs sm:text-sm text-white truncate flex-1 min-w-0">{activeBranch.name}</h3>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold shrink-0">
              ACTIVE
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed break-words">
            {activeBranch.sub} · <span className="text-emerald-400 font-semibold">{activeBranch.highlight}</span>
          </p>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400">Motto:</span>
            <span className="italic break-words">{activeBranch.motto}</span>
          </div>
        </div>
      </div>

      {/* 3 Distinct Portal Cards (Full-Width Responsive Cards, Never Squashed) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs px-0.5">
          <span className="font-extrabold uppercase tracking-wider text-slate-500 text-[10px] sm:text-[11px]">
            {isHi ? 'पोर्टल डैशबोर्ड का चयन करें' : 'Select Dashboard Portal to Access'}
          </span>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
            Role Clearance
          </span>
        </div>

        <div className={`grid gap-3.5 ${isMobileFrame ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          {/* Portal 3: Soldier / Uniformed Personnel Mobile PWA (FEATURED PRIMARY) */}
          <div
            onClick={() => onSelectPortal('soldier', selectedForce)}
            className="group cursor-pointer bg-gradient-to-br from-white via-white to-teal-50/40 border-2 border-teal-500/80 hover:border-teal-600 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 flex flex-col justify-between ring-2 ring-teal-500/20"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100/80 border border-teal-200 text-teal-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 bg-teal-600 text-white rounded-full font-black text-[9px] uppercase tracking-wider shadow-xs">
                    ⭐ Recommended · Mobile
                  </span>
                  <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                    D3
                  </span>
                </div>
              </div>

              <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                {isHi ? 'जवान कल्याण पोर्टल (Mobile PWA)' : 'Uniformed Personnel Mobile App'}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed break-words">
                {isHi
                  ? 'निजी AI मित्र चैटबॉट, 4×4 बॉक्स ब्रीदिंग, पीएचक्यू-9 स्व-मूल्यांकन, निजी जर्नल और अज्ञात परामर्श बुकिंग।'
                  : 'Private AI companion (AI Mitr), 4×4 tactical box breathing, routine self-assessments, client-side encrypted journal, and anonymous support.'}
              </p>

              <div className="mt-3 pt-2.5 border-t border-teal-100 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-teal-800 leading-tight">
                <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="break-words">100% Private · 1-Tap Data Purge · Zero Identity Trace</span>
              </div>
            </div>

            <div className="pt-3 border-t border-teal-100 flex items-center justify-between text-xs font-black text-teal-800 mt-3 bg-teal-50/70 p-2.5 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all gap-2">
              <span className="break-words">{isHi ? 'सैनिक मोबाइल पोर्टल में प्रवेश करें' : 'Open Soldier Mobile App (PWA)'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>

          {/* Portal 1: Command & Operational Administration */}
          <div
            onClick={() => onSelectPortal('command', selectedForce)}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-emerald-500 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 shrink-0">
                  D1 · Command
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                {isHi ? 'कमांड एवं प्रशासन पोर्टल' : 'Command & Admin Portal'}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed break-words">
                {isHi
                  ? 'बटालियन गठन, सैनिक सूची, अवलोकित कल्याण स्तर, कार्यभार संतुलन, और स्वचालित ड्युटी रोटेशन।'
                  : 'Battalion formations, masked roster oversight, observed welfare levels, encrypted remarks, and automated workload balancing rotations.'}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-emerald-700 leading-tight">
                <Scale className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="break-words">Fatigue mitigation & automated R&R rotations</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 mt-3 gap-2">
              <span className="break-words">{isHi ? 'कमांड लॉगिन करें' : 'Login as Commander'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>

          {/* Portal 2: Welfare & Medical Counsellor */}
          <div
            onClick={() => onSelectPortal('welfare', selectedForce)}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-sky-500 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200 shrink-0">
                  D2 · Clinical
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 group-hover:text-sky-700 transition-colors">
                {isHi ? 'कल्याण अधिकारी एवं काउंसलर' : 'Welfare & Counsellor Portal'}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed break-words">
                {isHi
                  ? 'गोपनीय क्लिनिकल केस नोट्स, एसएलए अलर्ट इनबॉक्स, स्पष्टीकरण योग्य एआई जोखिम कारक और मेडिकल रेफरल।'
                  : 'Confidential AES-encrypted case notes, real-time SLA countdown timers, explainable SHAP risk factors, and hospital referrals.'}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-sky-700 leading-tight">
                <Award className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="break-words">Strictly shielded from Chain of Command</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700 mt-3 gap-2">
              <span className="break-words">{isHi ? 'काउंसलर लॉगिन करें' : 'Login as Counsellor'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Security & DPDP Compliance Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              {isHi ? 'डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP Act, 2023) अनुपालन' : 'Zero-Trust Security & DPDP Act 2023 Compliance'}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              AES-256-GCM Envelope Encryption · HMAC-SHA256 Tokenization
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSecurityInspector}
          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isHi ? 'सुरक्षा ऑडिट' : 'Security Audit'}</span>
        </button>
      </div>

      {/* Patriotic Dedication Seal */}
      <div className="text-center py-2 px-2">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-slate-600 bg-white/80 border border-slate-200/80 px-3 sm:px-4 py-1.5 rounded-2xl sm:rounded-full shadow-xs max-w-full">
          <span className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
            <span className="w-2 h-2 rounded-full bg-slate-300 border border-slate-400" />
            <span className="w-2 h-2 rounded-full bg-[#138808]" />
          </span>
          <span className="break-words text-center">{isHi ? 'राष्ट्र के वीर रक्षकों को समर्पित · जय हिंद 🇮🇳' : 'Dedicated to the Brave Guardians of the Republic · Jai Hind 🇮🇳'}</span>
          <span className="hidden sm:flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
            <span className="w-2 h-2 rounded-full bg-slate-300 border border-slate-400" />
            <span className="w-2 h-2 rounded-full bg-[#138808]" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortalGateway;
