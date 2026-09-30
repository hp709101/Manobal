import React, { useEffect, useState } from 'react';
import { api, setClientActiveRole } from './services/api';
import { UserProfile } from './types';
import { Navbar } from './components/common/Navbar';
import { MobileShell } from './components/common/MobileShell';
import { EmergencyModal } from './components/common/EmergencyModal';
import { ExportWatermarkModal } from './components/common/ExportWatermarkModal';
import { PortalGateway } from './components/auth/PortalGateway';
import { UnifiedAuthModal } from './components/auth/UnifiedAuthModal';
import { Dashboard1View } from './components/dashboard1/Dashboard1View';
import { Dashboard2View } from './components/dashboard2/Dashboard2View';
import { Dashboard3View } from './components/dashboard3/Dashboard3View';
import { SecurityInspectorView } from './components/security/SecurityInspectorView';
import { Shield, Sparkles } from 'lucide-react';
import { scrollToTop } from './utils/scroll';

type ViewState =
  | 'gateway'
  | 'auth_modal'
  | 'dashboard'
  | 'security';

export function App() {
  const [viewState, setViewState] = useState<ViewState>('gateway');
  const [currentPortal, setCurrentPortal] = useState<'command' | 'welfare' | 'soldier' | 'security'>('command');
  const [selectedForce, setSelectedForce] = useState<string>('ALL');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true); // Mobile Application First!
  const [activeMobileTab, setActiveMobileTab] = useState<string>('');

  // Global Modals
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    // Check if a role was already saved or initialize
    api.getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    }).catch(() => {
      // not logged in yet
    });
  }, []);

  // Guarantee instant scroll-to-top whenever viewState or currentPortal changes
  useEffect(() => {
    scrollToTop();
  }, [viewState, currentPortal]);

  const handlePortalSelect = (portal: 'command' | 'welfare' | 'soldier', forceCategory: string) => {
    setCurrentPortal(portal);
    setSelectedForce(forceCategory);
    setViewState('auth_modal');
    setActiveMobileTab(portal === 'soldier' ? 'chat' : portal === 'command' ? 'roster' : 'alerts');
    scrollToTop();
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'commander' || user.role === 'admin') {
      setCurrentPortal('command');
      setActiveMobileTab('roster');
    } else if (user.role === 'welfare_officer') {
      setCurrentPortal('welfare');
      setActiveMobileTab('alerts');
    } else {
      setCurrentPortal('soldier');
      setActiveMobileTab('chat');
    }
    setViewState('dashboard');
    scrollToTop();
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setViewState('gateway');
    setActiveMobileTab('');
    scrollToTop();
  };

  return (
    <MobileShell
      isMobileFrame={isMobileFrame}
      setIsMobileFrame={setIsMobileFrame}
      currentUser={currentUser}
      currentPortal={currentPortal}
      onOpenEmergency={() => setIsEmergencyOpen(true)}
      activeTab={activeMobileTab}
      setActiveTab={setActiveMobileTab}
      showBottomNav={viewState === 'dashboard'}
      viewState={viewState}
    >
      <div className="min-h-full flex flex-col font-sans antialiased text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
        {/* Navigation Bar when inside a dashboard or security enclave */}
        {(viewState === 'dashboard' || viewState === 'security') && (
          <Navbar
            currentPortal={viewState === 'security' ? 'security' : currentPortal}
            currentUser={currentUser}
            onSignOut={handleSignOut}
            onOpenExport={() => setIsExportOpen(true)}
            language={language}
            setLanguage={setLanguage}
            onOpenSecurity={() => setViewState(viewState === 'security' ? 'dashboard' : 'security')}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            isMobileFrame={isMobileFrame}
            setIsMobileFrame={setIsMobileFrame}
          />
        )}

        {/* Viewport Content */}
        <div className={`flex-1 w-full max-w-7xl mx-auto ${isMobileFrame ? 'px-2.5 py-3' : 'px-3 sm:px-6 lg:px-8 py-4 sm:py-6'}`}>
          {/* Multi-Force Gateway Landing */}
          {viewState === 'gateway' && (
            <PortalGateway
              onSelectPortal={handlePortalSelect}
              onOpenSecurityInspector={() => setViewState('security')}
              language={language}
              setLanguage={setLanguage}
              isMobileFrame={isMobileFrame}
            />
          )}

          {/* Unified Multi-Force Authentication Modal */}
          {viewState === 'auth_modal' && (
            <div className="py-4">
              <UnifiedAuthModal
                portal={currentPortal as any}
                initialForceCategory={selectedForce}
                onLoginSuccess={handleLoginSuccess}
                onBack={() => setViewState('gateway')}
                language={language}
                isMobileFrame={isMobileFrame}
              />
            </div>
          )}

          {/* Dashboard 1: Operational Command & Administration */}
          {viewState === 'dashboard' && currentPortal === 'command' && (
            <Dashboard1View
              currentUserRole={currentUser?.role || 'commander'}
              activeMobileTab={activeMobileTab}
              setActiveMobileTab={setActiveMobileTab}
              isMobileFrame={isMobileFrame}
            />
          )}

          {/* Dashboard 2: Welfare Officer & Clinical Counsellor */}
          {viewState === 'dashboard' && currentPortal === 'welfare' && (
            <Dashboard2View
              activeMobileTab={activeMobileTab}
              setActiveMobileTab={setActiveMobileTab}
              isMobileFrame={isMobileFrame}
            />
          )}

          {/* Dashboard 3: Uniformed Personnel Mobile PWA */}
          {viewState === 'dashboard' && currentPortal === 'soldier' && (
            <Dashboard3View
              language={language}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              activeMobileTab={activeMobileTab}
              setActiveMobileTab={setActiveMobileTab}
              isMobileFrame={isMobileFrame}
            />
          )}

          {/* Security & Audit Inspector Enclave */}
          {viewState === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Zero-Trust Cryptographic Inspector & Tamper-Evident Audit Trail</span>
                </div>
                <button
                  onClick={() => setViewState(currentUser ? 'dashboard' : 'gateway')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  ← Return to {currentUser ? 'Dashboard' : 'Portal Gateway'}
                </button>
              </div>
              <SecurityInspectorView />
            </div>
          )}
        </div>

        {/* Dignified National Defence & Welfare Footer */}
        <footer className="mt-auto border-t border-slate-200/80 bg-white/70 backdrop-blur-xs py-3 px-4 text-center">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div className="flex items-center justify-center gap-1.5 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#FF9933] via-white to-[#138808] border border-slate-300 shadow-xs" />
              <span>Dedicated to the Guardians of the Republic · Indian Armed Forces, CAPFs & Police</span>
            </div>
            <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-slate-400">
              <span className="font-bold text-emerald-700">सत्यमेव जयते</span>
              <span>·</span>
              <span>DPDP Act 2023 Compliant</span>
              <span>·</span>
              <span>ISO 27001 & ABHA Aligned</span>
            </div>
          </div>
        </footer>

        {/* Global Emergency Modal */}
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
        />

        {/* Restricted Export Watermark Modal */}
        <ExportWatermarkModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      </div>
    </MobileShell>
  );
}

export default App;
