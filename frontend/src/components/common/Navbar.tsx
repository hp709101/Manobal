import React, { useState, useRef, useEffect } from 'react';
import { Shield, LogOut, UserCheck, FileDown, Lock, Menu, X, ChevronDown, Globe, PhoneCall, ArrowRight, Building2, CheckCircle2, Smartphone, Monitor } from 'lucide-react';
import { UserProfile } from '../../types';

interface NavbarProps {
  currentPortal: 'command' | 'welfare' | 'soldier' | 'security';
  currentUser: UserProfile | null;
  onSignOut: () => void;
  onOpenExport: () => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  onOpenSecurity: () => void;
  onOpenEmergency?: () => void;
  isMobileFrame?: boolean;
  setIsMobileFrame?: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal,
  currentUser,
  onSignOut,
  onOpenExport,
  language,
  setLanguage,
  onOpenSecurity,
  onOpenEmergency,
  isMobileFrame,
  setIsMobileFrame,
}) => {
  const isHi = language === 'hi';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  const portalNames = {
    command: isHi ? 'कमांड एवं प्रशासन पोर्टल (D1)' : 'Command & Admin Portal (D1)',
    welfare: isHi ? 'कल्याण अधिकारी एवं काउंसलर पोर्टल (D2)' : 'Welfare & Counsellor Portal (D2)',
    soldier: isHi ? 'जवान कल्याण पोर्टल (D3)' : 'Uniformed Personnel Portal (D3)',
    security: isHi ? 'सुरक्षा एवं ऑडिट इंस्पेक्टर' : 'Security & DPDP Audit Enclave',
  };

  const portalShortNames = {
    command: isHi ? 'D1 कमान' : 'D1 Command',
    welfare: isHi ? 'D2 कल्याण' : 'D2 Welfare',
    soldier: isHi ? 'D3 जवान' : 'D3 Jawan',
    security: isHi ? 'सुरक्षा' : 'Audit',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm relative">
      {/* Indian Tricolor patriotic ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-xs" />
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-2">
          {/* Brand Logo & Portal Title - Logo already has ManoBal name in it so no need to write ManoBal beside it */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="shrink-0 flex items-center">
              <img
                src="/long_logo.png"
                alt="ManoBal"
                className="h-7 sm:h-9 w-auto max-w-[115px] sm:max-w-[165px] object-contain rounded-md border border-slate-200/80 bg-white p-0.5 shadow-xs"
              />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1">
                <span className="text-emerald-800 font-bold text-[9px] sm:text-xs bg-emerald-50 px-1.5 sm:px-2.5 py-0.5 rounded-lg border border-emerald-200 truncate flex items-center gap-1 shrink-0">
                  <span>🇮🇳</span>
                  {isMobileFrame ? (
                    <span>{portalShortNames[currentPortal]}</span>
                  ) : (
                    <>
                      <span className="inline sm:hidden">{portalShortNames[currentPortal]}</span>
                      <span className="hidden sm:inline">{portalNames[currentPortal]}</span>
                    </>
                  )}
                </span>
              </div>
              {!isMobileFrame && (
                <p className="text-[10px] text-slate-500 font-medium hidden md:block truncate mt-0.5">
                  Republic of India · Predictive Stress & Welfare Monitoring for Uniformed Forces
                </p>
              )}
            </div>
          </div>

          {/* Desktop Direct Action Tools (hidden on mobile to prevent cramming) */}
          {!isMobileFrame && (
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1"
                title="Toggle English / Hindi"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>

              {/* Watermark Export */}
              {currentPortal !== 'soldier' && (
                <button
                  onClick={onOpenExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
                  title="Restricted Watermarked Export"
                >
                  <FileDown className="w-3.5 h-3.5 text-sky-600" />
                  <span>Export</span>
                </button>
              )}

              {/* Security Inspector Button */}
              <button
                onClick={onOpenSecurity}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
                title="Audit Logs & Cryptographic Verification"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Security</span>
              </button>

              {/* Active User Badge */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div className="leading-tight text-left min-w-0">
                  <div className="font-bold text-slate-800 text-xs truncate max-w-[140px]">
                    {currentUser?.name || 'Authorized Officer'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {currentUser?.role?.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                title="Sign out and return to Gateway"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isHi ? 'लॉगआउट' : 'Sign Out'}</span>
              </button>
            </div>
          )}

          {/* MAIN MENU BUTTON */}
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isMenuOpen
                ? 'bg-slate-900 text-white border border-slate-900 shadow-md ring-2 ring-emerald-500/50'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
            }`}
            aria-label="Toggle Main Menu"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-[11px] shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0) : 'M'}
            </div>
            <span className="font-extrabold">{isHi ? 'मेन्यू' : 'Menu'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-emerald-400' : 'text-slate-500'}`} />
          </button>
        </div>
      </div>

      {/* SMOOTH NON-OVERLAPPING DROPDOWN MENU */}
      {/* On Mobile / Simulator: Expands seamlessly in-flow below the navbar, naturally pushing dashboard content down with zero overlap */}
      {/* On Full Desktop: Displays as an aligned, elegant dropdown popover */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className={`${
            isMobileFrame
              ? 'w-full border-t border-slate-200 bg-white/98 shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[75vh] overflow-y-auto'
              : 'w-full sm:w-88 sm:absolute sm:right-6 sm:top-[calc(100%+0.5rem)] border-t sm:border border-slate-200 bg-white sm:rounded-3xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[82vh] overflow-y-auto'
          } p-3.5 sm:p-4 space-y-3.5 scrollbar-thin`}
        >
          {/* 1. User Profile & Credential Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-600/20 shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-slate-900 text-sm truncate">
                  {currentUser?.name || 'Authorized Officer'}
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5 truncate mt-0.5">
                  <span className="font-mono uppercase tracking-wider">{currentUser?.role || 'COMMANDER'}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-600 truncate">{currentUser?.force_category || 'Armed Forces'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[10px]">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>DPDP 2023 Verified · 🇮🇳 Bharat</span>
              </span>
              <span className="font-mono text-slate-500 font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                ID: {currentUser?.id || 'SRV-10294'}
              </span>
            </div>
          </div>

          {/* 2. Security & Operational Tools (Logical Order) */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1 pb-0.5">
              {isHi ? 'सुरक्षा एवं कल्याण सेवाएं' : 'Security & Welfare Tools'}
            </div>

            {/* Security Inspector */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenSecurity();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0 group-hover:scale-105 transition-transform">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{isHi ? 'सुरक्षा एवं ऑडिट इंस्पेक्टर' : 'Zero-Trust Security & Audit Trail'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
            </button>

            {/* Watermark Export (For Commanders & Welfare) */}
            {currentPortal !== 'soldier' && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenExport();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-105 transition-transform">
                    <FileDown className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{isHi ? 'सुरक्षित रिपोर्ट निर्यात' : 'Restricted Watermarked Export'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
              </button>
            )}

            {/* 24x7 Emergency Helplines */}
            {onOpenEmergency && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenEmergency();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70 hover:bg-rose-100/70 text-xs font-semibold text-rose-800 transition-colors group border border-rose-100"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{isHi ? '24x7 रक्षा आपातकालीन हेल्पलाइन' : 'Emergency Helplines (SOS 14416)'}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-200/80 text-rose-800 shrink-0 ml-2">
                  24x7
                </span>
              </button>
            )}
          </div>

          {/* 3. System & Interface Preferences */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1 pb-0.5">
              {isHi ? 'सिस्टम एवं प्राथमिकताएं' : 'Preferences & View'}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{isHi ? 'भाषा बदलें (Language)' : 'Language / भाषा'}</span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 ml-2">
                {language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
              </span>
            </button>

            {/* View Mode Switcher (Mobile Simulator vs Desktop) */}
            {setIsMobileFrame && (
              <button
                onClick={() => {
                  setIsMobileFrame(!isMobileFrame);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                    {isMobileFrame ? (
                      <Monitor className="w-3.5 h-3.5" />
                    ) : (
                      <Smartphone className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="truncate">
                    {isMobileFrame
                      ? (isHi ? 'डेस्कटॉप व्यू में बदलें' : 'Switch to Desktop View')
                      : (isHi ? 'मोबाइल व्यू में बदलें' : 'Switch to Mobile View')}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0 ml-2">
                  {isMobileFrame ? 'Desktop' : 'Mobile'}
                </span>
              </button>
            )}
          </div>

          {/* 4. Session Action & Gateway Navigation */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{isHi ? 'सुरक्षा बल गेटवे पर वापस जाएं' : 'Return to Multi-Force Gateway'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/20 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-white" />
              <span>{isHi ? 'सत्र समाप्त करें (लॉगआउट)' : 'Sign Out & End Session'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
