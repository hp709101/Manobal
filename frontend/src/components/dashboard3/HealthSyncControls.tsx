import React, { useState } from 'react';
import { api } from '../../services/api';
import { HealthSummary } from '../../types';
import {
  Activity, Moon, Heart, Footprints, ShieldCheck,
  Trash2, RefreshCw, CheckCircle, AlertTriangle
} from 'lucide-react';

interface HealthSyncControlsProps {
  health: HealthSummary;
  onRefresh: () => void;
  language: 'en' | 'hi';
}

export const HealthSyncControls: React.FC<HealthSyncControlsProps> = ({
  health,
  onRefresh,
  language,
}) => {
  const [syncEnabled, setSyncEnabled] = useState(health.sync_enabled);
  const [shareSleep, setShareSleep] = useState(health.share_sleep);
  const [shareHR, setShareHR] = useState(health.share_heart_rate);
  const [shareActivity, setShareActivity] = useState(health.share_activity);
  const [submitting, setSubmitting] = useState(false);
  const [purging, setPurging] = useState(false);

  const isHi = language === 'hi';

  const handleToggleSync = async (newSync: boolean) => {
    setSyncEnabled(newSync);
    try {
      await api.updateHealthSync({
        sync_enabled: newSync,
        share_sleep: newSync ? shareSleep : false,
        share_heart_rate: newSync ? shareHR : false,
        share_activity: newSync ? shareActivity : false,
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateGranular = async (sleep: boolean, hr: boolean, act: boolean) => {
    setShareSleep(sleep);
    setShareHR(hr);
    setShareActivity(act);
    try {
      await api.updateHealthSync({
        sync_enabled: syncEnabled,
        share_sleep: sleep,
        share_heart_rate: hr,
        share_activity: act,
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePurge = async () => {
    if (!confirm(isHi ? 'क्या आप सभी संग्रहीत स्वास्थ्य डेटा को स्थायी रूप से हटाना चाहते हैं?' : 'Permanently disconnect and delete all recorded health metrics?')) {
      return;
    }
    setPurging(true);
    try {
      await api.purgeHealthData();
      setSyncEnabled(false);
      setShareSleep(false);
      setShareHR(false);
      setShareActivity(false);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
            Health Tracker Sync & Consent
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1.5">
            {isHi ? 'हेल्थ-ट्रैकर इंटीग्रेशन और डेटा नियंत्रण' : 'Health Tracker Integration & Privacy Controls'}
          </h3>
          <p className="text-xs text-slate-500">
            {isHi
              ? 'हेल्थ कनेक्ट (Android) और ऐप्पल हेल्थकिट (iOS) के माध्यम से सुरक्षित सिंक'
              : 'Direct integration with Health Connect (Android) and Apple HealthKit (iOS). Daily summaries only.'}
          </p>
        </div>

        {/* Master Connect Toggle */}
        <button
          onClick={() => handleToggleSync(!syncEnabled)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 flex items-center justify-center ${
            syncEnabled
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {syncEnabled ? (isHi ? '✓ कनेक्टेड (Connected)' : '✓ Connected') : (isHi ? '+ ट्रैकर कनेक्ट करें' : '+ Connect Tracker')}
        </button>
      </div>

      {/* Granular Toggles */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {isHi ? 'डेटा साझाकरण विकल्प (Granular Consent Toggles)' : 'Granular Data Sharing Toggles'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Sleep Toggle */}
          <div
            onClick={() => syncEnabled && handleUpdateGranular(!shareSleep, shareHR, shareActivity)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              shareSleep && syncEnabled
                ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/10'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Moon className="w-4 h-4 text-sky-600" />
              <input
                type="checkbox"
                checked={shareSleep && syncEnabled}
                readOnly
                className="rounded accent-emerald-600 cursor-pointer"
              />
            </div>
            <div className="font-bold text-slate-900 text-xs">{isHi ? 'नींद की अवधि एवं गुणवत्ता' : 'Sleep Architecture & Deficit'}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {isHi ? 'दैनिक नींद के घंटे और स्थिरता' : '7-day average & circadian debt'}
            </p>
          </div>

          {/* Heart Rate Toggle */}
          <div
            onClick={() => syncEnabled && handleUpdateGranular(shareSleep, !shareHR, shareActivity)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              shareHR && syncEnabled
                ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/10'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-4 h-4 text-rose-600" />
              <input
                type="checkbox"
                checked={shareHR && syncEnabled}
                readOnly
                className="rounded accent-emerald-600 cursor-pointer"
              />
            </div>
            <div className="font-bold text-slate-900 text-xs">{isHi ? 'विश्राम हृदय गति (RHR)' : 'Resting Heart Rate (Autonomic)'}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {isHi ? 'स्वायत्त तंत्रिका तंत्र तनाव' : 'Sympathetic recovery marker (bpm)'}
            </p>
          </div>

          {/* Operational Physical Load (Steps/Movement) Toggle */}
          <div
            onClick={() => syncEnabled && handleUpdateGranular(shareSleep, shareHR, !shareActivity)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              shareActivity && syncEnabled
                ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/10'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Footprints className="w-4 h-4 text-amber-600" />
              <input
                type="checkbox"
                checked={shareActivity && syncEnabled}
                readOnly
                className="rounded accent-emerald-600 cursor-pointer"
              />
            </div>
            <div className="font-bold text-slate-900 text-xs">{isHi ? 'कार्यभार और गश्त भार' : 'Operational Physical Load'}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {isHi ? 'गश्त एवं सामरिक संचलन' : 'Patrol movement & exertion volume'}
            </p>
          </div>
        </div>
      </div>

      {/* Feature 15: Operational Exertion-to-Recovery Clinical Ratio */}
      {syncEnabled && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5">
            <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 flex-wrap">
              <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="break-words">{isHi ? 'शारीरिक कार्यभार एवं स्वास्थ्य संतुलन अनुपात' : 'Physical Exertion vs. Sleep Recovery Index'}</span>
            </span>
            <span className="self-start sm:self-auto text-[10px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              {isHi ? 'गोपनीय विश्लेषण' : 'Confidential Welfare Ratio'}
            </span>
          </div>

          {/* Live Exertion Balance Assessment */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between text-xs gap-2">
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[11px]">7-Day Physical Patrol Load:</span>
                <div className="font-bold text-slate-900 text-sm">{health.daily_steps ? `${health.daily_steps.toLocaleString()} Movement Index` : '13,880 Movement Index'}</div>
              </div>
              <div className="text-left sm:text-right space-y-0.5">
                <span className="text-slate-500 text-[11px]">Rest Recovery Sleep:</span>
                <div className="font-bold text-slate-900 text-sm">{health.avg_sleep_hours ? `${health.avg_sleep_hours} hrs/night` : '4.8 hrs/night'}</div>
              </div>
            </div>

            {/* Over-Exertion Warning Banner */}
            {(health.avg_sleep_hours || 4.8) < 5.0 ? (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start sm:items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-tight font-medium break-words">
                  <strong>Acute Physical Over-Exertion Risk:</strong> High patrol movement volume combined with &lt;5.0h sleep recovery creates progressive operational exhaustion.
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start sm:items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-tight font-medium break-words">
                  <strong>Balanced Recovery:</strong> Current rest intervals adequately compensate for tactical movement load.
                </span>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 break-words leading-relaxed">
            * <strong>Command Purpose Limitation:</strong> Your raw movement steps, resting heart rate, and sleep times are encrypted and never visible to the chain of command. Commanders only see an aggregated coarse chip (Stable/Declining).
          </div>
        </div>
      )}

      {/* One-Tap Disconnect and Purge Button (Document Rule) */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <span className="text-xs text-slate-500 font-medium">
          {isHi ? 'डेटा हटाने का अधिकार (Right to be Forgotten)' : 'Right to Erasure (DPDP Act, 2023)'}
        </span>
        <button
          onClick={handlePurge}
          disabled={purging}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5 shrink-0" />
          <span>{purging ? 'Purging...' : isHi ? 'डिस्कनेक्ट और डेटा मिटाएं' : 'Disconnect & Delete Data'}</span>
        </button>
      </div>
    </div>
  );
};
