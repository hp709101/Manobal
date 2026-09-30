import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { WelfareCase } from '../../types';
import { AlertInbox } from './AlertInbox';
import { ExplainableCaseModal } from './ExplainableCaseModal';
import { AddConfidentialNoteModal } from './AddConfidentialNoteModal';
import { ReferralModal } from './ReferralModal';
import { DismissAlertModal } from './DismissAlertModal';
import { HandoverModal } from './HandoverModal';
import { CounsellingScheduleView } from './CounsellingScheduleView';
import { SafeMessagingModal } from './SafeMessagingModal';
import { AnonymisedAnalyticsModal } from './AnonymisedAnalyticsModal';
import {
  Stethoscope, AlertCircle, Calendar, MessageSquare,
  BarChart3, RefreshCw, CheckCircle, ShieldCheck
} from 'lucide-react';
import { scrollToTop } from '../../utils/scroll';

interface Dashboard2ViewProps {
  activeMobileTab?: string;
  setActiveMobileTab?: (tab: string) => void;
  isMobileFrame?: boolean;
}

export const Dashboard2View: React.FC<Dashboard2ViewProps> = ({ activeMobileTab, setActiveMobileTab, isMobileFrame }) => {
  const [alerts, setAlerts] = useState<WelfareCase[]>([]);
  const [loading, setLoading] = useState(false);

  // Active sub-views & modals
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'schedule'>('inbox');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Modals
  const [noteModalCaseId, setNoteModalCaseId] = useState<string | null>(null);
  const [referralModalCaseId, setReferralModalCaseId] = useState<string | null>(null);
  const [dismissModalCaseId, setDismissModalCaseId] = useState<string | null>(null);
  const [handoverModalCaseId, setHandoverModalCaseId] = useState<string | null>(null);
  const [isSafeMessagingOpen, setIsSafeMessagingOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    scrollToTop();
  }, [activeSubTab]);

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    if (activeMobileTab === 'schedule') setActiveSubTab('schedule');
    else if (activeMobileTab === 'alerts') setActiveSubTab('inbox');
    else if (activeMobileTab === 'anonymised') setIsAnalyticsOpen(true);
    else if (activeMobileTab === 'templates') setIsSafeMessagingOpen(true);
  }, [activeMobileTab]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getWelfareAlerts();
      setAlerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Welfare Controls */}
      <div className={`bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col ${isMobileFrame ? 'gap-3' : 'md:flex-row md:items-center md:justify-between gap-3'}`}>
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-col gap-1">
            <span className="self-start text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 shrink-0">
              Dashboard 2 · Clinical Enclave
            </span>
            <h1 className="text-base sm:text-xl font-black text-slate-900 leading-snug break-words">
              Welfare Officer & Counsellor Operations
            </h1>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed break-words">
            Manage confidential clinical interventions, explainable AI risk factors, SLA alerts, and encrypted notes.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsSafeMessagingOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm text-center"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">
              <span className="inline sm:hidden">Outreach</span>
              <span className="hidden sm:inline">Outreach Templates</span>
            </span>
          </button>

          <button
            onClick={() => setIsAnalyticsOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm text-center"
          >
            <BarChart3 className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="truncate">
              <span className="inline sm:hidden">Caseload</span>
              <span className="hidden sm:inline">Caseload Analytics</span>
            </span>
          </button>

          <button
            onClick={loadAlerts}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl transition-colors shadow-sm shrink-0"
            title="Refresh Alert Inbox"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sub Tabs: Alert Inbox vs Counselling Schedule */}
      <div className="grid grid-cols-2 sm:flex bg-white/80 p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1.5 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('inbox')}
          className={`py-2 px-2.5 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
            activeSubTab === 'inbox'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">Alerts ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`py-2 px-2.5 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
            activeSubTab === 'schedule'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="truncate">
            <span className="inline sm:hidden">Schedule</span>
            <span className="hidden sm:inline">Counselling Schedule & Bookings</span>
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'inbox' ? (
        <AlertInbox
          alerts={alerts}
          onSelectCase={(id) => setSelectedCaseId(id)}
          loading={loading}
          isMobileFrame={isMobileFrame}
        />
      ) : (
        <CounsellingScheduleView />
      )}

      {/* Modals */}
      <ExplainableCaseModal
        caseId={selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
        onRefresh={loadAlerts}
        onOpenAddNote={(id) => setNoteModalCaseId(id)}
        onOpenReferral={(id) => setReferralModalCaseId(id)}
        onOpenDismiss={(id) => setDismissModalCaseId(id)}
        onOpenHandover={(id) => setHandoverModalCaseId(id)}
      />

      <AddConfidentialNoteModal
        caseId={noteModalCaseId}
        onClose={() => setNoteModalCaseId(null)}
        onSuccess={() => {
          showNotification('Confidential note encrypted with AES-256-GCM and saved.');
          if (selectedCaseId) loadAlerts();
        }}
      />

      <ReferralModal
        caseId={referralModalCaseId}
        onClose={() => setReferralModalCaseId(null)}
        onSuccess={() => {
          showNotification('Medical referral dispatched to Medical Officer registry.');
          loadAlerts();
        }}
      />

      <DismissAlertModal
        caseId={dismissModalCaseId}
        onClose={() => setDismissModalCaseId(null)}
        onSuccess={() => {
          showNotification('Alert closed as false positive with model calibration feedback.');
          setSelectedCaseId(null);
          loadAlerts();
        }}
      />

      <HandoverModal
        caseId={handoverModalCaseId}
        onClose={() => setHandoverModalCaseId(null)}
        onSuccess={() => {
          showNotification('Case transferred to peer counsellor.');
          setSelectedCaseId(null);
          loadAlerts();
        }}
      />

      <SafeMessagingModal
        isOpen={isSafeMessagingOpen}
        onClose={() => setIsSafeMessagingOpen(false)}
      />

      <AnonymisedAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  );
};
