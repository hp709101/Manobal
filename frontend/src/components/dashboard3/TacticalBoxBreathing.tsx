import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, Award, Sparkles } from 'lucide-react';

interface TacticalBoxBreathingProps {
  language: 'en' | 'hi';
}

type Phase = 'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)';

const PHASES: Phase[] = ['Inhale', 'Hold (Full)', 'Exhale', 'Hold (Empty)'];

export const TacticalBoxBreathing: React.FC<TacticalBoxBreathingProps> = ({ language }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  const isHi = language === 'hi';

  const phaseLabels: Record<Phase, { en: string; hi: string; hint: string }> = {
    'Inhale': { en: 'Breathe In Slowly', hi: 'धीरे-धीरे गहरी सांस लें', hint: 'Through your nose · नाक से' },
    'Hold (Full)': { en: 'Hold Breath (Lungs Full)', hi: 'सांस रोकें (फेफड़े भरे हुए)', hint: 'Stay steady · स्थिर रहें' },
    'Exhale': { en: 'Slow Steady Exhale', hi: 'धीरे-धीरे सांस छोड़ें', hint: 'Through your mouth · मुंह से' },
    'Hold (Empty)': { en: 'Rest & Reset (Lungs Empty)', hi: 'सांस रोकें और विश्राम करें', hint: 'Feel the calm · शांति महसूस करें' },
  };

  useEffect(() => {
    let timer: any;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setCurrentPhaseIndex((phaseIdx) => {
              const nextIdx = (phaseIdx + 1) % 4;
              if (nextIdx === 0) {
                setCompletedCycles((c) => c + 1);
              }
              return nextIdx;
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setSecondsLeft(4);
  };

  const currentPhase = PHASES[currentPhaseIndex];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 shadow-sm text-center space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Tactical Box Breathing (4×4 Protocol)
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2.5 break-words">
          {isHi ? 'सामरिक बॉक्स ब्रीदिंग (Box Breathing)' : 'Operational Tactical Reset'}
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed break-words">
          {isHi
            ? 'तनाव कम करने, हृदय गति को धीमा करने और ध्यान केंद्रित करने के लिए विशेष बलों द्वारा प्रयुक्त 4-4-4-4 श्वास तकनीक।'
            : 'Clinically proven 4-second box breathing protocol used by defence forces to rapidly regulate autonomic nervous system and lower cortisol.'}
        </p>
      </div>

      {/* Visual Animated Breathing Ring */}
      <div className="relative w-52 h-52 sm:w-60 sm:h-60 mx-auto flex items-center justify-center">
        {/* Pulsing halo */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-1000 ease-in-out border-4 ${
            currentPhase === 'Inhale'
              ? 'scale-110 border-emerald-500 bg-emerald-500/10 shadow-xl shadow-emerald-500/20'
              : currentPhase === 'Hold (Full)'
              ? 'scale-110 border-teal-500 bg-teal-500/15 shadow-xl shadow-teal-500/20'
              : currentPhase === 'Exhale'
              ? 'scale-90 border-sky-400 bg-sky-500/10'
              : 'scale-90 border-slate-200 bg-slate-50'
          }`}
        />

        {/* Center Countdown & Instructions */}
        <div className="relative z-10 space-y-1">
          <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">{secondsLeft}s</div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 px-2 break-words">
            {isHi ? phaseLabels[currentPhase].hi : phaseLabels[currentPhase].en}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {phaseLabels[currentPhase].hint}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" /> <span>{isHi ? 'रोकें' : 'Pause'}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> <span>{isHi ? 'शुरू करें' : 'Start Pacer'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Gentle Gamification: Effort Streak (Feature 11) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between text-xs text-slate-700 gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {isHi ? 'पूर्ण किए गए चक्र (Effort Streak):' : 'Completed Breathing Cycles:'}{' '}
            <strong className="text-slate-900">{completedCycles}</strong>
          </span>
        </div>
        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto break-words">
          {isHi ? 'प्रयास को सम्मान · कोई सार्वजनिक लीडरबोर्ड नहीं' : 'Personal Effort Reward · No Leaderboard'}
        </span>
      </div>
    </div>
  );
};
