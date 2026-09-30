import React, { useState } from 'react';
import { api } from '../../services/api';
import { ClipboardList, CheckCircle2, AlertCircle, Sparkles, Heart } from 'lucide-react';

interface SelfAssessmentViewProps {
  language: 'en' | 'hi';
}

const PHQ9_QUESTIONS_EN = [
  { id: 'q1', text: 'Little interest or pleasure in doing things' },
  { id: 'q2', text: 'Feeling down, depressed, or hopeless' },
  { id: 'q3', text: 'Trouble falling or staying asleep, or sleeping too much' },
  { id: 'q4', text: 'Feeling tired or having little energy during operational duties' },
  { id: 'q5', text: 'Poor appetite or overeating' },
  { id: 'q6', text: 'Feeling bad about yourself or that you have let family down' },
  { id: 'q7', text: 'Trouble concentrating on tasks, reading, or weapon maintenance' },
  { id: 'q8', text: 'Moving or speaking noticeably slower or restlessly' },
  { id: 'q9', text: 'Thoughts that you would be better off dead or of hurting yourself' },
];

const PHQ9_QUESTIONS_HI = [
  { id: 'q1', text: 'कामों में बहुत कम रुचि या आनंद का अनुभव होना' },
  { id: 'q2', text: 'उदास, निराश या भारीपन महसूस करना' },
  { id: 'q3', text: 'सोने में परेशानी, बार-बार नींद टूटना या अत्यधिक नींद आना' },
  { id: 'q4', text: 'ड्यूटी के दौरान अत्यधिक थकान या ऊर्जा की कमी महसूस होना' },
  { id: 'q5', text: 'भूख में कमी या असामान्य रूप से अधिक खाना' },
  { id: 'q6', text: 'स्वयं को लेकर हीन भावना या परिवार को निराश करने का विचार' },
  { id: 'q7', text: 'दैनिक कार्यों या ड्रिल पर ध्यान केंद्रित करने में कठिनाई' },
  { id: 'q8', text: 'बहुत धीमा चलना-बोलना या अत्यधिक बेचैनी महसूस होना' },
  { id: 'q9', text: 'स्वयं को नुकसान पहुंचाने या नकारात्मक विचार आना' },
];

const OPTIONS = [
  { val: 0, label_en: 'Not at all', label_hi: 'बिल्कुल नहीं' },
  { val: 1, label_en: 'Several days', label_hi: 'कुछ दिन' },
  { val: 2, label_en: 'More than half days', label_hi: 'आधे से अधिक दिन' },
  { val: 3, label_en: 'Nearly every day', label_hi: 'लगभग हर दिन' },
];

export const SelfAssessmentView: React.FC<SelfAssessmentViewProps> = ({ language }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const isHi = language === 'hi';
  const questions = isHi ? PHQ9_QUESTIONS_HI : PHQ9_QUESTIONS_EN;

  const handleSelect = (qId: string, val: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const isComplete = questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!isComplete) return;
    setSubmitting(true);
    try {
      const res = await api.submitAssessment({
        assessment_type: 'PHQ-9',
        answers: answers,
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
        <div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Routine Self-Assessment
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 break-words">
            {isHi ? 'मानक तनाव एवं मनोदशा स्व-मूल्यांकन (PHQ-9)' : 'Standard Routine Welfare Check (PHQ-9)'}
          </h3>
          <p className="text-xs text-slate-500 break-words">
            {isHi ? 'यह परिणाम पूर्णतः निजी है और आपके व्यक्तिगत रिकॉर्ड में रहता है।' : 'Private self-check for operational readiness and psychological recovery.'}
          </p>
        </div>
      </div>

      {!result ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="font-bold text-slate-900 break-words leading-snug">
                  {idx + 1}. {q.text}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {OPTIONS.map((opt) => {
                    const isSelected = answers[q.id] === opt.val;
                    return (
                      <button
                        type="button"
                        key={opt.val}
                        onClick={() => handleSelect(q.id, opt.val)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all text-left flex items-center gap-2 min-h-[44px] ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm font-bold ring-2 ring-teal-500/20'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 border ${
                            isSelected
                              ? 'bg-white text-teal-700 border-white'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          {opt.val}
                        </span>
                        <span className="leading-tight text-[11px] sm:text-xs break-words">
                          {isHi ? opt.label_hi : opt.label_en}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-2 gap-3">
            <span className="text-xs text-slate-500 text-center sm:text-left">
              {Object.keys(answers).length} of {questions.length} {isHi ? 'प्रश्नों के उत्तर दिए' : 'completed'}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!isComplete || submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all text-center"
            >
              {submitting ? 'Analyzing...' : isHi ? 'परिणाम देखें' : 'View Private Score'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 text-center animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <Sparkles className="w-6 h-6" />
          </div>

          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              {isHi ? 'आपका स्व-मूल्यांकन स्कोर' : 'Your Assessment Score'}
            </div>
            <div className="text-4xl font-black text-slate-900 mt-1">
              {result.score} <span className="text-base text-slate-400 font-normal">/ {result.max_score}</span>
            </div>
            <div className="text-xs font-bold text-emerald-700 mt-1 uppercase">
              {isHi ? 'श्रेणी:' : 'Category:'} {result.risk_level}
            </div>
          </div>

          <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
            {result.feedback}
          </p>

          <button
            onClick={() => {
              setResult(null);
              setAnswers({});
            }}
            className="px-5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs"
          >
            {isHi ? 'पुनः परीक्षण करें' : 'Retake Self-Assessment'}
          </button>
        </div>
      )}
    </div>
  );
};
