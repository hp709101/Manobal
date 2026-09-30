import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Monitor, Shield, PhoneCall, Wifi, Battery, Signal, Home, Activity, Heart, Bot, Lock, Users, AlertTriangle, Scale, Calendar, FileText } from 'lucide-react';
import { UserProfile } from '../../types';
import { scrollToTop } from '../../utils/scroll';

interface MobileShellProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  currentUser: UserProfile | null;
  currentPortal: 'command' | 'welfare' | 'soldier' | 'security';
  onOpenEmergency: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  showBottomNav?: boolean;
  viewState?: string;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  children,
  isMobileFrame,
  setIsMobileFrame,
  currentUser,
  currentPortal,
  onOpenEmergency,
  activeTab,
  setActiveTab,
  showBottomNav = true,
  viewState,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Automatically reset scroll to top on ANY navigation / view transition
  useEffect(() => {
    scrollToTop();
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  }, [viewState, currentPortal, activeTab, isMobileFrame]);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Detect if viewport is real mobile/small screen (< 768px)
  useEffect(() => {
    const checkScreen = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Bottom Navigation Bar Items renderer (shared between native mobile and desktop simulator)
  const renderBottomNav = () => {
    if (!currentUser) return null;

    return (
      <div className="w-full flex items-center justify-around text-[10px] font-bold text-slate-500 py-1">
        {currentPortal === 'soldier' && (
          <>
            <button
              onClick={() => setActiveTab && setActiveTab('chat')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'chat' || !activeTab ? 'text-teal-600 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Mitr</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('breathing')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'breathing' ? 'text-teal-600 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Breathing</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('assessment')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'assessment' ? 'text-teal-600 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>PHQ-9</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('health')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'health' ? 'text-teal-600 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Health</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('privacy')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'privacy' ? 'text-teal-600 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Privacy</span>
            </button>
          </>
        )}

        {currentPortal === 'command' && (
          <>
            <button
              onClick={() => setActiveTab && setActiveTab('roster')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'roster' || !activeTab ? 'text-emerald-700 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Roster</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('workload')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'workload' ? 'text-emerald-700 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Workload</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('analytics')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'analytics' ? 'text-emerald-700 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('security')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'security' ? 'text-emerald-700 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Audit</span>
            </button>
          </>
        )}

        {currentPortal === 'welfare' && (
          <>
            <button
              onClick={() => setActiveTab && setActiveTab('alerts')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'alerts' || !activeTab ? 'text-sky-700 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SLA Alerts</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('schedule')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'schedule' ? 'text-sky-700 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('anonymised')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'anonymised' ? 'text-sky-700 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Caseload</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('templates')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
                activeTab === 'templates' ? 'text-sky-700 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Outreach</span>
            </button>
          </>
        )}
      </div>
    );
  };

  // 1. REAL MOBILE VIEWPORT (< 768px):
  // Render clean, edge-to-edge native mobile application (No bezel, no fake notch, no squeezed container)
  if (isMobileScreen) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col relative text-slate-900 overflow-x-hidden selection:bg-emerald-500 selection:text-white">
        {/* Main Content Area with bottom padding for fixed mobile nav bar */}
        <main className={`flex-1 w-full ${showBottomNav && currentUser ? 'pb-20' : 'pb-4'}`}>
          {children}
        </main>

        {/* Fixed Mobile Bottom Touch Bar */}
        {showBottomNav && currentUser && (
          <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-lg shadow-slate-900/10">
            {renderBottomNav()}
          </nav>
        )}
      </div>
    );
  }

  // 2. DESKTOP / TABLET FULL-WIDTH MODE (!isMobileFrame on screens >= 768px)
  if (!isMobileFrame) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col relative text-slate-900 selection:bg-emerald-500 selection:text-white">
        {/* Desktop Top Control Banner (In document flow, NOT floating over headers) */}
        <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <img src="/sign.png" alt="ManoBal" className="w-4 h-4 object-contain" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <span>🇮🇳</span>
              <span>Republic of India · Joint Defence & Welfare Monitoring Command Enclave</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileFrame(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold text-xs border border-slate-700 transition-colors shadow-sm"
              title="Switch to Mobile Smartphone Frame Mode"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Mobile View</span>
            </button>

            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              title="24x7 Defence Emergency Helplines (Tele-MANAS & KIRAN)"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS 14416</span>
            </button>
          </div>
        </div>
        {/* Tricolor subtle top stripe */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    );
  }

  // 3. DESKTOP SMARTPHONE SIMULATOR MODE (isMobileFrame on screens >= 768px)
  return (
    <div className="min-h-screen bg-slate-950 py-6 px-4 flex flex-col items-center justify-center relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Top Tactical Control Bar placed cleanly ABOVE the smartphone chassis (never floating over phone contents) */}
      <div className="w-full max-w-[420px] mb-3 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-[11px] shadow-sm">
          <img src="/sign.png" alt="ManoBal" className="w-4 h-4 object-contain" />
          <span>🇮🇳</span>
          <span>Forces Mobile Simulator</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-900 border border-slate-700 p-0.5 rounded-xl shadow-md">
            <button
              onClick={() => setIsMobileFrame(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold shadow-sm transition-all"
              title="Mobile Smartphone Simulator"
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setIsMobileFrame(false)}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-white rounded-lg text-[11px] font-bold transition-all"
              title="Switch to Full Screen Desktop"
            >
              <Monitor className="w-3 h-3" />
              <span>Desktop</span>
            </button>
          </div>

          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm"
            title="Emergency Helplines"
          >
            <PhoneCall className="w-3 h-3" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Realistic Smartphone Chassis */}
      <div className="relative w-full max-w-[420px] bg-slate-900 rounded-[44px] p-2.5 shadow-2xl shadow-emerald-950/40 border-4 border-slate-700 ring-1 ring-slate-600/50 flex flex-col h-[860px] max-h-[90vh] overflow-hidden">
        {/* Sleek Device Status Bar (Clean, flat, NO intrusive notch blocking headers!) */}
        <div className="h-7 px-5 flex items-center justify-between text-slate-700 text-[11px] font-semibold select-none z-20 bg-white border-b border-slate-100 rounded-t-[32px] shrink-0">
          <span className="font-bold">{currentTime || '09:41'}</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3 h-3 text-slate-600" />
            <Wifi className="w-3 h-3 text-slate-600" />
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono text-slate-600">98%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            </div>
          </div>
        </div>

        {/* Smartphone Screen Viewport */}
        <div 
          ref={viewportRef}
          data-scroll-container
          className={`mobile-screen-viewport flex-1 overflow-y-auto overflow-x-hidden w-full bg-slate-50 relative flex flex-col text-slate-900 ${showBottomNav && currentUser ? 'pb-16' : 'pb-4'} scrollbar-thin scrollbar-thumb-slate-300`}
        >
          {children}
        </div>

        {/* Docked Mobile Touch Bottom Navigation Bar */}
        {showBottomNav && currentUser && (
          <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 z-30 flex items-center justify-around text-[10px] font-bold text-slate-500 shrink-0">
            {renderBottomNav()}
          </div>
        )}

        {/* Home Indicator Gesture Bar */}
        <div className="w-28 h-1 bg-slate-400 rounded-full mx-auto my-1.5 shrink-0 pointer-events-none" />
      </div>
    </div>
  );
};

export default MobileShell;
