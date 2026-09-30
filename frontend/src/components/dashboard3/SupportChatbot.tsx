import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Send, Bot, User, Mic, MicOff, AlertOctagon, Heart,
  ShieldAlert, Phone, Sparkles, CheckCircle2, Lock
} from 'lucide-react';

interface SupportChatbotProps {
  language: 'en' | 'hi';
  onOpenHelpline: () => void;
  onOpenBooking: () => void;
}

interface Message {
  sender: 'user' | 'buddy';
  text: string;
  tier?: 'Green' | 'Amber' | 'Red';
  timestamp: string;
}

export const SupportChatbot: React.FC<SupportChatbotProps> = ({
  language,
  onOpenHelpline,
  onOpenBooking,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'buddy',
      text:
        language === 'hi'
          ? 'जय हिंद! मैं आपका मनोबल साथी (Manobal Buddy) हूँ। यह स्थान पूरी तरह निजी और एन्क्रिप्टेड है। आप कैसा महसूस कर रहे हैं?'
          : 'Jai Hind! I am your private Manobal Buddy. This conversation is completely confidential, encrypted, and safe. What is on your mind today?',
      tier: 'Green',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(`CHAT-P001-${Date.now().toString(36)}`);
  const [isRedCrisis, setIsRedCrisis] = useState(false);
  const [pendingAmberConsent, setPendingAmberConsent] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isHi = language === 'hi';

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isRedCrisis || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage({
        message: text.trim(),
        language: language,
        session_id: sessionId,
      });

      const buddyMsg: Message = {
        sender: 'buddy',
        text: res.reply,
        tier: res.tier,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, buddyMsg]);

      if (res.tier === 'Red') {
        setIsRedCrisis(true);
      } else if (res.tier === 'Amber') {
        setPendingAmberConsent(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantConsent = async () => {
    try {
      await api.consentAmberEscalation(sessionId, 'Confidential Counsellor Desk');
      setPendingAmberConsent(false);
      setConsentGranted(true);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'buddy',
          text: isHi
            ? 'धन्यवाद। आपकी सहमति से यूनिट कल्याण अधिकारी को एक गोपनीय संदेश भेज दिया गया है। वे जल्द ही आपसे संपर्क करेंगे।'
            : 'Thank you. With your explicit consent, a minimal notification has been routed to the Welfare Officer. They will follow up confidentially.',
          tier: 'Amber',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVoiceInputSimulate = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setInputText(
          isHi
            ? 'आज बहुत अधिक थकान और तनाव महसूस हो रहा है'
            : 'Feeling heavy operational fatigue and trouble sleeping lately'
        );
        setIsRecording(false);
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[560px] overflow-hidden">
      {/* Header with Privacy Indicator */}
      <div className="bg-slate-50/80 px-3.5 sm:px-5 py-2.5 sm:py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 p-1 shadow-xs">
            <img src="/sign.png" alt="Manobal Buddy" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 truncate">
              <span>Manobal Support Buddy</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </h3>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium truncate">
              <Lock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              <span>{isHi ? 'एन्क्रिप्टेड और निजी' : 'Encrypted & Confidential'}</span>
            </p>
          </div>
        </div>

        {/* Talk to Counsellor Direct Link */}
        <button
          onClick={onOpenBooking}
          className="text-xs font-bold px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-100 text-sky-700 rounded-xl border border-slate-200 shadow-xs transition-colors shrink-0"
        >
          <span className="inline sm:hidden">{isHi ? 'काउंसलर' : 'Counsellor'}</span>
          <span className="hidden sm:inline">{isHi ? 'काउंसलर से बात करें' : 'Talk to Counsellor'}</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.sender === 'user';
          const isRed = m.tier === 'Red';
          const isAmber = m.tier === 'Amber';

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs overflow-hidden ${
                  isUser
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isRed
                    ? 'bg-rose-50 border border-rose-300 p-1 shadow-xs'
                    : isAmber
                    ? 'bg-amber-50 border border-amber-300 p-1 shadow-xs'
                    : 'bg-white border border-slate-200 p-1 shadow-xs'
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : (
                  <img src="/sign.png" alt="Buddy" className="w-full h-full object-contain" />
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-xs shadow-xs space-y-1.5 break-words ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : isRed
                    ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-tl-none'
                    : isAmber
                    ? 'bg-amber-50 border border-amber-200 text-amber-950 rounded-tl-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                <div
                  className={`text-[9px] font-mono text-right ${
                    isUser ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Feature 7 & 3: Amber Consent Modal inline */}
        {pendingAmberConsent && !consentGranted && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2.5 text-xs text-amber-950 animate-in fade-in shadow-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isHi ? 'क्या आप काउंसलर से संपर्क चाहते हैं?' : 'Confidential Counsellor Check-in?'}</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed break-words">
              {isHi
                ? 'हमारे यूनिट काउंसलर केवल तभी संपर्क करेंगे जब आप सहमति देंगे। आपकी चैट सामग्री साझा नहीं की जाएगी।'
                : 'A welfare officer can provide gentle, confidential support. They will only be notified if you choose to give consent below. Chat transcripts remain private.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleGrantConsent}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-sm"
              >
                {isHi ? 'हाँ, गोपनीय सूचना भेजें' : 'Yes, Notify Counsellor'}
              </button>
              <button
                onClick={() => setPendingAmberConsent(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                {isHi ? 'नहीं, निजी रखें' : 'No, Keep Private'}
              </button>
            </div>
          </div>
        )}

        {/* Feature 8 & 3: Red Crisis Escalation Screen */}
        {isRedCrisis && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 space-y-3.5 text-rose-950 shadow-md animate-in zoom-in-95">
            <div className="flex items-center gap-2.5 font-black text-rose-700">
              <AlertOctagon className="w-6 h-6 animate-bounce shrink-0" />
              <span className="text-sm sm:text-base uppercase tracking-wider break-words">
                {isHi ? 'आपातकालीन सहायता सक्रिय' : 'Emergency Crisis Support Screen'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-rose-800 break-words">
              {isHi
                ? 'आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है। हमने आपातकालीन प्रोटोकॉल सक्रिय कर दिया है। कृपया अकेले न रहें और तुरंत इन सत्यापित हेल्पलाइन से संपर्क करें:'
                : 'Your life and well-being matter deeply. Normal chat has paused to connect you immediately to verified emergency support:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href="tel:14416"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200 text-rose-900 hover:bg-rose-100/60 font-bold text-xs shadow-xs transition-colors flex-wrap gap-1"
              >
                <span className="truncate">Tele-MANAS (24x7)</span>
                <span className="flex items-center gap-1 font-mono text-emerald-700 font-black shrink-0">
                  <Phone className="w-3.5 h-3.5" /> 14416
                </span>
              </a>

              <a
                href="tel:18005990019"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200 text-rose-900 hover:bg-rose-100/60 font-bold text-xs shadow-xs transition-colors flex-wrap gap-1"
              >
                <span className="truncate">KIRAN (Govt Helpline)</span>
                <span className="flex items-center gap-1 font-mono text-sky-700 font-black shrink-0">
                  <Phone className="w-3.5 h-3.5" /> 1800-599-0019
                </span>
              </a>
            </div>

            <p className="text-[10px] text-rose-700 italic pt-1 break-words">
              * Per upfront safety disclosure, an immediate minimal-disclosure alert has been dispatched to the welfare officer with zero chat transcript shared.
            </p>
          </div>
        )}
      </div>

      {/* Input Toolbar */}
      {!isRedCrisis ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2"
        >
          {/* Voice Input Button (Feature 16) */}
          <button
            type="button"
            onClick={handleVoiceInputSimulate}
            className={`p-2.5 rounded-xl transition-colors ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
            }`}
            title="Voice Input"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isRecording
                ? isHi ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now'
                : isHi ? 'यहाँ अपना संदेश लिखें...' : 'Type what is on your mind...'
            }
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="p-3 bg-rose-50 border-t border-rose-200 text-center text-xs text-rose-700 font-bold">
          {isHi ? 'आपातकालीन मोड सक्रिय है' : 'Emergency Safe Mode Active · Tap helplines above'}
        </div>
      )}
    </div>
  );
};
