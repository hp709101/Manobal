import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { TransparencyNotice } from './TransparencyNotice';
import { TacticalBoxBreathing } from './TacticalBoxBreathing';
import { SupportChatbot } from './SupportChatbot';
import { SelfAssessmentView } from './SelfAssessmentView';
import { HealthSyncControls } from './HealthSyncControls';
import { PrivateJournalView } from './PrivateJournalView';
import { DataControlCenter } from './DataControlCenter';
import { TalkToCounsellorModal } from './TalkToCounsellorModal';
import {
  Smartphone, Bot, ClipboardList, Wind, Moon, BookOpen,
  ShieldCheck, HeartHandshake, Bell, BellOff, Award, Sparkles,
  PhoneCall, ShieldAlert, HeartPulse
} from 'lucide-react';
import { scrollToTop } from '../../utils/scroll';

interface Dashboard3ViewProps {
  language: 'en' | 'hi';
  onOpenEmergency: () => void;
  activeMobileTab?: string;
  setActiveMobileTab?: (tab: string) => void;
  isMobileFrame?: boolean;
}

export const Dashboard3View: React.FC<Dashboard3ViewProps> = ({
  language,
  onOpenEmergency,
  activeMobileTab,
  setActiveMobileTab,
  isMobileFrame = true,
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'assessment' | 'breathing' | 'health' | 'journal' | 'datacontrol'>('chat');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [dutyRemindersPaused, setDutyRemindersPaused] = useState(false);
  const [loading, setLoading] = useState(false);

  const isHi = language === 'hi';

  useEffect(() => {
    scrollToTop();
  }, [activeTab]);

  useEffect(() => {
    loadProfile();
  }, []);

  // Two-way synchronization with MobileShell bottom navigation bar
  useEffect(() => {
    if (!activeMobileTab) return;
    if (activeMobileTab === 'breathing') setActiveTab('breathing');
    else if (activeMobileTab === 'assessment') setActiveTab('assessment');
    else if (activeMobileTab === 'chat' || activeMobileTab === 'home') setActiveTab('chat');
    else if (activeMobileTab === 'health') setActiveTab('health');
    else if (activeMobileTab === 'privacy') setActiveTab('datacontrol');
    else if (activeMobileTab === 'journal') setActiveTab('journal');
  }, [activeMobileTab]);

  const handleTabChange = (newTab: 'chat' | 'assessment' | 'breathing' | 'health' | 'journal' | 'datacontrol') => {
    setActiveTab(newTab);
    if (setActiveMobileTab) {
      if (newTab === 'datacontrol') setActiveMobileTab('privacy');
      else setActiveMobileTab(newTab);
    }
    scrollToTop();
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getPortalProfile();
      setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const subTabs = [
    { id: 'chat', label_en: 'AI Mitr', label_hi: 'AI मित्र', icon: Bot },
    { id: 'breathing', label_en: 'Breathing', label_hi: 'बॉक्स ब्रीदिंग', icon: Wind },
    { id: 'assessment', label_en: 'PHQ-9', label_hi: 'पीएचक्यू-9', icon: ClipboardList },
    { id: 'health', label_en: 'Health Sync', label_hi: 'हेल्थ सिंक', icon: Moon },
    { id: 'journal', label_en: 'Journal', label_hi: 'प्राइवेट जर्नल', icon: BookOpen },
    { id: 'datacontrol', label_en: 'Privacy', label_hi: 'डेटा नियंत्रण', icon: ShieldCheck },
  ] as const;

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Navigation Sub-Tabs (Always accessible at top of Dashboard 3) */}
      <div className="flex overflow-x-auto scroll-smooth snap-x no-scrollbar bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1.5 text-xs font-bold sticky top-0 z-10">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`shrink-0 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all snap-start ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{isHi ? tab.label_hi : tab.label_en}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: AI Mitr / Home Dashboard Overview */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Top Soldier Persona Card & Duty-Aware Reminders (Feature 20) */}
          <div className={`bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col ${isMobileFrame ? 'gap-3' : 'md:flex-row md:items-center md:justify-between gap-3'}`}>
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-col gap-1">
                <span className="self-start text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 shrink-0">
                  Dashboard 3 · Soldier Welfare PWA
                </span>
                <h1 className="text-base sm:text-xl font-black text-slate-900 leading-snug break-words">
                  {profile?.personnel?.full_name || 'Sepoy Rajesh Kumar Singh'}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span>{profile?.personnel?.rank || 'Sepoy'}</span>
                <span>·</span>
                <span className="font-semibold text-slate-700">{profile?.personnel?.unit_name || '14 Rajputana Rifles'}</span>
                <span>·</span>
                <span className="font-mono text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 font-bold shrink-0">
                  {profile?.personnel?.tokenized_id || 'TOK-9F4D28A1'}
                </span>
              </div>
            </div>

            <div className={`grid grid-cols-2 gap-2 ${isMobileFrame ? 'w-full' : 'sm:flex sm:items-center'} shrink-0`}>
              {/* Duty-Aware Reminders Toggle */}
              <button
                onClick={() => setDutyRemindersPaused(!dutyRemindersPaused)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  dutyRemindersPaused
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Operational pause: Nudges pause during operations or duty windows"
              >
                {dutyRemindersPaused ? (
                  <>
                    <BellOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{isHi ? 'ड्यूटी मोड' : 'Duty Mode'}</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{isHi ? 'सक्रिय' : 'Active'}</span>
                  </>
                )}
              </button>

              {/* Quick Talk to Counsellor Button */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all text-center"
              >
                <HeartHandshake className="w-4 h-4 shrink-0" />
                <span className="truncate">{isHi ? 'काउंसलर' : 'Counsellor'}</span>
              </button>
            </div>
          </div>

          {/* EXCLUSIVE 24x7 EMERGENCY CARE BANNER (Located ONLY in Soldier Dashboard) */}
          <div className={`bg-gradient-to-r from-rose-50 via-rose-50/60 to-amber-50/50 border border-rose-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col ${isMobileFrame ? 'gap-3' : 'md:flex-row md:items-center md:justify-between gap-3'}`}>
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <PhoneCall className="w-5 h-5 animate-bounce" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-extrabold text-rose-900 leading-tight">
                    {isHi ? '24x7 आपातकालीन सहायता' : '24x7 Emergency Helplines'}
                  </h2>
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-800 shrink-0">
                    Confidential
                  </span>
                </div>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed break-words">
                  {isHi
                    ? 'टेली-मानस (14416), किरण हेल्पलाइन (1800-599-0019) और रेजिमेंटल एमआई रूम।'
                    : 'Direct access to Tele-MANAS (14416), KIRAN (1800-599-0019), and MI Room.'}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenEmergency}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md shadow-rose-600/20 transition-all active:scale-95 shrink-0 ${isMobileFrame ? 'w-full' : 'w-full md:w-auto'}`}
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span className="truncate">{isHi ? 'हेल्पलाइन कॉल करें (14416)' : 'Emergency Call (14416)'}</span>
            </button>
          </div>

          {/* Feature 6: Upfront Transparency Notice */}
          <TransparencyNotice language={language} />

          {/* Feature 10: Personal Wellbeing Snapshot (Smooth Horizontal Swipe Carousel on Mobile) */}
          <div className={`flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar gap-2.5 pb-2 pt-0.5 -mx-1 px-1 text-xs ${
            isMobileFrame ? '' : 'sm:grid sm:grid-cols-4 sm:overflow-visible sm:mx-0 sm:px-0'
          }`}>
            <div className={`shrink-0 w-[145px] ${isMobileFrame ? '' : 'sm:w-auto sm:snap-align-none'} snap-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm`}>
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                {isHi ? 'दैनिक नींद' : '7-Day Sleep Avg'}
              </div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {profile?.health_sync?.avg_sleep_hours ? `${profile.health_sync.avg_sleep_hours}h` : '4.8h'}
              </div>
              <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
                {isHi ? 'पुनर्प्राप्ति की आवश्यकता' : 'Recovery needed'}
              </div>
            </div>

            <div className={`shrink-0 w-[145px] ${isMobileFrame ? '' : 'sm:w-auto sm:snap-align-none'} snap-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm`}>
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                {isHi ? 'स्थिर हृदय गति' : 'Resting Heart Rate'}
              </div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {profile?.health_sync?.resting_heart_rate ? `${profile.health_sync.resting_heart_rate} bpm` : '73 bpm'}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                {isHi ? 'सामान्य सीमा' : 'Within normal band'}
              </div>
            </div>

            <div className={`shrink-0 w-[145px] ${isMobileFrame ? '' : 'sm:w-auto sm:snap-align-none'} snap-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm`}>
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                {isHi ? 'चेक-इन स्ट्रीक' : 'Mindful Check-in'}
              </div>
              <div className="text-xl font-black text-emerald-700 mt-1">
                5 Days
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                {isHi ? 'प्रयास सराहनीय' : 'Streak reward active'}
              </div>
            </div>

            <div className={`shrink-0 w-[145px] ${isMobileFrame ? '' : 'sm:w-auto sm:snap-align-none'} snap-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm`}>
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                {isHi ? 'डेटा सुरक्षा' : 'Data Privacy'}
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DPDP 2023</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {isHi ? 'पूर्णतः एन्क्रिप्टेड' : 'Client Encrypted'}
              </div>
            </div>
          </div>

          {/* AI Mitr Chatbot */}
          <SupportChatbot
            language={language}
            onOpenHelpline={onOpenEmergency}
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        </div>
      )}

      {/* Tab 2: Tactical Box Breathing */}
      {activeTab === 'breathing' && (
        <div className="space-y-4">
          <TacticalBoxBreathing language={language} />
        </div>
      )}

      {/* Tab 3: PHQ-9 Assessment */}
      {activeTab === 'assessment' && (
        <div className="space-y-4">
          <SelfAssessmentView language={language} />
        </div>
      )}

      {/* Tab 4: Health Sync */}
      {activeTab === 'health' && profile && (
        <div className="space-y-4">
          <HealthSyncControls
            health={profile.health_sync}
            onRefresh={loadProfile}
            language={language}
          />
        </div>
      )}

      {/* Tab 5: Private Journal */}
      {activeTab === 'journal' && (
        <div className="space-y-4">
          <PrivateJournalView language={language} />
        </div>
      )}

      {/* Tab 6: Data Privacy & Control Center */}
      {activeTab === 'datacontrol' && (
        <div className="space-y-4">
          <DataControlCenter language={language} />
        </div>
      )}

      {/* Talk to Counsellor Modal */}
      <TalkToCounsellorModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        language={language}
      />
    </div>
  );
};
