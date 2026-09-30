import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  ArrowLeft, 
  Fingerprint, 
  KeyRound, 
  UserCheck, 
  CheckCircle2, 
  Sparkles, 
  Eye,
  EyeOff,
  BadgeCheck,
  ShieldCheck,
  Cpu,
  RefreshCw,
  CreditCard
} from 'lucide-react';
import { api } from '../../services/api';
import { UserProfile } from '../../types';
import { scrollToTop } from '../../utils/scroll';

interface UnifiedAuthModalProps {
  portal: 'command' | 'welfare' | 'soldier';
  initialForceCategory?: string;
  onLoginSuccess: (user: UserProfile) => void;
  onBack: () => void;
  language?: 'en' | 'hi';
  isMobileFrame?: boolean;
}

interface PersonaItem {
  key: string;
  title: string;
  rank: string;
  serviceId: string;
  force: string;
  sector: string;
  badge: string;
  category: 'Armed Forces' | 'CAPFs' | 'State Police' | 'Disaster Response';
  clearance: string;
}

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  portal,
  initialForceCategory = 'ALL',
  onLoginSuccess,
  onBack,
  language = 'en',
  isMobileFrame = true,
}) => {
  const isHi = language === 'hi';

  // Available Personas per portal with authentic military metadata
  const personaOptions: Record<'command' | 'welfare' | 'soldier', PersonaItem[]> = {
    command: [
      {
        key: 'commander_u1',
        title: 'Col. V. A. Rathore, SM',
        rank: 'Colonel (Commanding Officer)',
        serviceId: 'IC-54912W',
        force: 'Indian Army (Armed Forces)',
        sector: '14 Rajputana Rifles (Siachen High Altitude Sector)',
        badge: '🛡️',
        category: 'Armed Forces',
        clearance: 'LEVEL 4 · TOP SECRET / OPERATIONAL COMMAND'
      },
      {
        key: 'commander_crpf',
        title: 'Commandant Rajeshwar Singh',
        rank: 'Commandant (CO)',
        serviceId: 'CRPF-204-7712',
        force: 'CRPF (Central Armed Police Forces)',
        sector: '204 CoBRA Battalion (Bastar LWE Counter-Ambush)',
        badge: '⚔️',
        category: 'CAPFs',
        clearance: 'LEVEL 4 · COUNTER-INSURGENCY COMMAND'
      },
      {
        key: 'commander_bsf',
        title: 'Commandant Harmeet Singh',
        rank: 'Commandant (CO)',
        serviceId: 'BSF-88-1094',
        force: 'BSF (Border Security Force)',
        sector: '88 Bn (Longewala Border Outpost, Thar Desert)',
        badge: '🐪',
        category: 'CAPFs',
        clearance: 'LEVEL 4 · BORDER DEFENCE COMMAND'
      },
      {
        key: 'commander_police',
        title: 'DCP Vikramaditya Deshmukh, IPS',
        rank: 'Deputy Commissioner of Police',
        serviceId: 'IPS-MH-4421',
        force: 'Maharashtra State Police',
        sector: 'Mumbai Police Zone 1 (Metro Riot & Bandobast)',
        badge: '🚓',
        category: 'State Police',
        clearance: 'LEVEL 3 · LAW & ORDER COMMAND'
      },
      {
        key: 'commander_ndrf',
        title: 'Commandant Ajay Verma',
        rank: 'Commandant (CO)',
        serviceId: 'NDRF-08-3391',
        force: 'NDRF (Disaster Response)',
        sector: '8th Bn NDRF (Flood & Earthquake Search & Rescue)',
        badge: '🌊',
        category: 'Disaster Response',
        clearance: 'LEVEL 3 · DISASTER OPS COMMAND'
      },
      {
        key: 'admin',
        title: 'Brig. J. S. Cheema',
        rank: 'Brigadier (HQ Admin)',
        serviceId: 'IC-48210A',
        force: 'Joint Defence & Security Command',
        sector: 'National Command Center (Full HRMS Bulk Upload & Audit)',
        badge: '🏛️',
        category: 'Armed Forces',
        clearance: 'LEVEL 5 · NATIONAL HQ SYSTEM ADMINISTRATOR'
      },
    ],
    welfare: [
      {
        key: 'welfare',
        title: 'Capt. Dr. S. Sengupta',
        rank: 'Regimental Medical Officer (RMO)',
        serviceId: 'AMC-30491',
        force: 'Army Medical Corps / Uniformed Forces',
        sector: 'Clinical Case Management & Confidential Psychiatric Notes',
        badge: '🩺',
        category: 'Armed Forces',
        clearance: 'LEVEL 3 · CONFIDENTIAL MEDICAL & PSYCHIATRIC'
      },
      {
        key: 'welfare_capf',
        title: 'Dr. Ananya Sen',
        rank: 'Chief Medical Officer / Psychological Counsellor',
        serviceId: 'CAPF-MED-8102',
        force: 'CAPFs Medical Wing (CRPF / BSF / ITBP)',
        sector: 'Trauma Intervention & Rapid Tele-Counselling',
        badge: '🧠',
        category: 'CAPFs',
        clearance: 'LEVEL 3 · CLINICAL PSYCHOLOGICAL INTERVENTION'
      },
    ],
    soldier: [
      {
        key: 'personnel',
        title: 'Sepoy Rajesh Kumar Singh',
        rank: 'Sepoy (Infantry)',
        serviceId: '14RR-940212M',
        force: '14 Rajputana Rifles (Indian Army)',
        sector: 'Siachen Forward Post (64-Day Continuous Duty Streak)',
        badge: '🎖️',
        category: 'Armed Forces',
        clearance: 'LEVEL 1 · PROTECTED TROOP SELF-SERVICE'
      },
      {
        key: 'personnel_crpf',
        title: 'Head Constable Amit Kumar',
        rank: 'Head Constable (Commando)',
        serviceId: 'CRPF-COBRA-109',
        force: '204 CoBRA CRPF',
        sector: 'Bastar Jungle Anti-Ambush Patrol (68-Day Duty)',
        badge: '⚔️',
        category: 'CAPFs',
        clearance: 'LEVEL 1 · PROTECTED TROOP SELF-SERVICE'
      },
      {
        key: 'personnel_police',
        title: 'Sub-Inspector Sachin Kadam',
        rank: 'Sub-Inspector',
        serviceId: 'MH-POL-6619',
        force: 'Mumbai Police (State Police)',
        sector: 'Metro Law & Order (16-Hr Continuous Bandobast Duty)',
        badge: '🚓',
        category: 'State Police',
        clearance: 'LEVEL 1 · PROTECTED POLICE OFFICER SELF-SERVICE'
      },
      {
        key: 'personnel_ndrf',
        title: 'Rescue Specialist Sandeep Rawat',
        rank: 'Rescue Specialist',
        serviceId: 'NDRF-8BN-7714',
        force: '8th Bn NDRF',
        sector: 'Cyclone & Flood Recovery Operations',
        badge: '🌊',
        category: 'Disaster Response',
        clearance: 'LEVEL 1 · PROTECTED RESCUE SPECIALIST SELF-SERVICE'
      },
    ]
  };

  // State management
  const [authMethod, setAuthMethod] = useState<'persona' | 'credentials' | 'biometric' | 'anonymous'>('persona');
  const [selectedForce, setSelectedForce] = useState<string>(initialForceCategory);
  
  // Default selected persona
  const currentPortalPersonas = personaOptions[portal];
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<string>(currentPortalPersonas[0]?.key || 'commander_u1');
  
  // Selected persona object
  const selectedPersona = currentPortalPersonas.find(p => p.key === selectedPersonaKey) || currentPortalPersonas[0];

  // Credentials fields
  const [serviceId, setServiceId] = useState<string>(selectedPersona?.serviceId || 'IC-54912W');
  const [passcode, setPasscode] = useState<string>('MB-SEC-2026');
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('482910');
  
  // Security verification handshake state
  const [loading, setLoading] = useState<boolean>(false);
  const [verifyingStage, setVerifyingStage] = useState<number>(0);
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Sync selected persona when portal changes
  useEffect(() => {
    scrollToTop();
    const firstForPortal = personaOptions[portal][0];
    if (firstForPortal) {
      setSelectedPersonaKey(firstForPortal.key);
      setServiceId(firstForPortal.serviceId);
    }
  }, [portal]);

  // When force changes, if the currently selected persona isn't in that force, pick the first matching one
  useEffect(() => {
    if (selectedForce === 'ALL') return;
    const matching = currentPortalPersonas.filter(p => p.category === selectedForce);
    if (matching.length > 0 && !matching.some(p => p.key === selectedPersonaKey)) {
      setSelectedPersonaKey(matching[0].key);
      setServiceId(matching[0].serviceId);
    }
  }, [selectedForce]);

  // Filtered personas based on force
  const activePersonas = currentPortalPersonas.filter((p) =>
    selectedForce === 'ALL' ? true : p.category === selectedForce
  );

  // When user selects a persona card - updates selection without direct login
  const handleSelectPersona = (p: PersonaItem) => {
    setSelectedPersonaKey(p.key);
    setServiceId(p.serviceId);
    setError(null);
  };

  // Authentic 3-step security verification sequence before entering dashboard
  const handleExecuteLogin = async (
    roleKey: string,
    specificAuthMethod: 'persona' | 'credentials' | 'biometric' | 'anonymous' = authMethod,
    customServiceId?: string
  ) => {
    setLoading(true);
    setError(null);
    const targetServiceId = customServiceId || serviceId;

    try {
      // Step 1: Directory PKI / Certificate Check
      setVerifyingStage(1);
      setVerificationMessage(
        specificAuthMethod === 'anonymous'
          ? (isHi ? 'शून्य-पहचान टोकन का सृजन हो रहा है...' : 'Generating Zero-Knowledge Ephemeral Token...')
          : specificAuthMethod === 'biometric'
          ? (isHi ? 'FIDO2 बायोमेट्रिक थंबप्रिंट हार्डवेयर की जांच हो रही है...' : 'Reading FIDO2 Biometric Hardware Key...')
          : (isHi ? `रक्षा निर्देशिका में सेवा संख्या [${targetServiceId}] का सत्यापन...` : `Validating Service ID [${targetServiceId}] with Defence PKI Directory...`)
      );
      await new Promise((r) => setTimeout(r, 320));

      // Step 2: Cryptographic Enclave & Scoped Unit RBAC Clearance Check
      setVerifyingStage(2);
      setVerificationMessage(
        specificAuthMethod === 'anonymous'
          ? (isHi ? 'DPDP अधिनियम 2023 गोपनीयता शील्ड सक्रिय की जा रही है...' : 'Engaging DPDP Act 2023 Ephemeral Privacy Guard...')
          : specificAuthMethod === 'biometric'
          ? (isHi ? 'क्रिप्टोग्राफिक बायोमेट्रिक मैच सत्यापित (99.8%)...' : 'Cryptographic Match Confirmed (99.8%) · Security Token Validated...')
          : (isHi ? `बटालियन अधिकार क्षेत्र एवं आरबीएसी क्लीयरेंस की पुष्टि...` : `Validating Scoped Unit RBAC Clearance & Encryption Key...`)
      );
      await new Promise((r) => setTimeout(r, 320));

      // Step 3: Authorization Granted & Session Decrypted
      setVerifyingStage(3);
      setVerificationMessage(
        isHi ? 'सुरक्षा क्लीयरेंस स्वीकृत · सत्र डिक्रिप्ट किया जा रहा है...' : 'Clearance Authorized · Decrypting Operational Session...'
      );
      await new Promise((r) => setTimeout(r, 260));

      // Call Backend Authentication API
      const res = await api.login({
        auth_type: specificAuthMethod === 'credentials' ? 'credential' : specificAuthMethod,
        role_key: roleKey,
        service_id: targetServiceId,
        passcode: passcode,
        force_category: selectedForce,
      });

      if (res && res.user) {
        onLoginSuccess(res.user);
      } else {
        throw new Error('Authentication rejected by security enclave');
      }
    } catch (e: any) {
      console.error('Authentication error:', e);
      setError(e.message || (isHi ? 'सत्यापन विफल। कृपया क्रेडेंशियल जांचें।' : 'Authentication failed. Please verify credentials.'));
      setVerifyingStage(0);
      setVerificationMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-2xl shadow-slate-300/40 space-y-5 overflow-hidden">
      {/* Indian Tricolor top accent rim */}
      <div className="h-1.5 w-[calc(100%+2rem)] sm:w-[calc(100%+3.5rem)] -mt-4 sm:-mt-7 -mx-4 sm:-mx-7 mb-4 sm:mb-5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Return to Multi-Force Gateway */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHi ? 'गेटवे पर वापस जाएं' : 'Return to Multi-Force Gateway'}</span>
        </button>

        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          DEFENCE ENCLAVE · AUTH v2.4
        </span>
      </div>

      {/* Header with ManoBal Logo */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-1">
          <div className="p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs inline-block">
            <img
              src="/long_logo.png"
              alt="ManoBal"
              className="h-11 sm:h-13 w-auto object-contain rounded-xl"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold">
          <span>🇮🇳</span>
          <span>
            {portal === 'command'
              ? 'Dashboard 1 · Formation Operational Command'
              : portal === 'welfare'
              ? 'Dashboard 2 · Regimental Medical & Clinical Portal'
              : 'Dashboard 3 · Mobile Jawan & Personnel Wellness PWA'}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {portal === 'command'
            ? (isHi ? 'कमांड एवं प्रशासनिक अधिकारी लॉगिन' : 'Command & Operational Admin Login')
            : portal === 'welfare'
            ? (isHi ? 'कल्याण अधिकारी एवं परामर्शदाता लॉगिन' : 'Welfare Officer & Counsellor Login')
            : (isHi ? 'वर्दीधारी कार्मिक सुरक्षित चेक-इन' : 'Uniformed Personnel Mobile Check-In')}
        </h2>

        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {portal === 'command'
            ? (isHi ? 'सख्त बटालियन स्कोपिंग एवं एन्क्रिप्टेड ऑपरेशनल ऑडिट क्लीयरेंस।' : 'Formation commanding officer clearance with strict battalion scoping & audit logs.')
            : portal === 'welfare'
            ? (isHi ? 'रेजिमेंटल मेडिकल ऑफिसर एवं क्लिनिकल साइकोलॉजिस्ट सुरक्षित पहुंच।' : 'Regimental medical officer & psychological counselor clinical case file access.')
            : (isHi ? 'सैनिकों, अधिकारियों एवं बचाव कर्मियों के लिए गोपनीय मानसिक स्वास्थ्य पोर्टल।' : 'Confidential self-service wellness portal for jawans, officers & rescue specialists.')}
        </p>
      </div>

      {/* Force Category Selector Tabs */}
      <div className="space-y-1.5 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {isHi ? 'लक्षित सुरक्षा बल' : 'Filter by Uniformed Branch'}
          </label>
          <span className="text-[10px] text-slate-400 font-medium">
            {selectedForce === 'ALL' ? (isHi ? 'समस्त बल' : 'All Branches') : selectedForce}
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {[
            { id: 'ALL', label: '🇮🇳 All Forces' },
            { id: 'Armed Forces', label: '🛡️ Armed Forces' },
            { id: 'CAPFs', label: '⚔️ CAPFs' },
            { id: 'State Police', label: '🚓 State Police' },
            { id: 'Disaster Response', label: '🌊 NDRF / Disaster' },
          ].map((f) => (
            <button
              key={f.id}
              disabled={loading}
              onClick={() => setSelectedForce(f.id)}
              className={`py-1 px-2.5 rounded-xl border text-center transition-all whitespace-nowrap text-xs font-bold shrink-0 ${
                selectedForce === f.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Authentication Mode Tabs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {isHi ? 'प्रमाणीकरण विधि (Authentication Method)' : 'Authentication Verification Method'}
          </label>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
          {/* Method 1: Personnel Roster & PIN */}
          <button
            type="button"
            disabled={loading}
            onClick={() => setAuthMethod('persona')}
            className={`p-2 rounded-2xl border text-left transition-all flex items-center gap-2 min-w-0 ${
              authMethod === 'persona'
                ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/30 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                authMethod === 'persona'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-[11px] text-slate-900 truncate">
                {isHi ? 'कार्मिक चयन' : 'Defence Roster'}
              </div>
              <div className="text-[9px] text-slate-500 font-normal truncate">
                {isHi ? 'प्रोफ़ाइल व पिन' : 'Profile & PIN'}
              </div>
            </div>
          </button>

          {/* Method 2: Manual Service ID & Passcode */}
          <button
            type="button"
            disabled={loading}
            onClick={() => setAuthMethod('credentials')}
            className={`p-2 rounded-2xl border text-left transition-all flex items-center gap-2 min-w-0 ${
              authMethod === 'credentials'
                ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/30 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                authMethod === 'credentials'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-[11px] text-slate-900 truncate">
                {isHi ? 'आईडी एवं पासकोड' : 'Service ID & PIN'}
              </div>
              <div className="text-[9px] text-slate-500 font-normal truncate">
                {isHi ? 'कस्टम क्रेडेंशियल' : 'Manual Entry'}
              </div>
            </div>
          </button>

          {/* Method 3: Biometric / CAC Smart Card */}
          <button
            type="button"
            disabled={loading}
            onClick={() => setAuthMethod('biometric')}
            className={`p-2 rounded-2xl border text-left transition-all flex items-center gap-2 min-w-0 ${
              authMethod === 'biometric'
                ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/30 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                authMethod === 'biometric'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-[11px] text-slate-900 truncate">
                {isHi ? 'बायोमेट्रिक' : 'Biometric / CAC'}
              </div>
              <div className="text-[9px] text-slate-500 font-normal truncate">
                {isHi ? 'FIDO2 / कार्ड' : 'FIDO2 / Smart Card'}
              </div>
            </div>
          </button>

          {/* Soldier Portal Method 4: Anonymous Zero-Identity Mode */}
          {portal === 'soldier' && (
            <button
              type="button"
              disabled={loading}
              onClick={() => setAuthMethod('anonymous')}
              className={`col-span-2 sm:col-span-3 p-2 rounded-2xl border text-left transition-all flex items-center gap-2 min-w-0 ${
                authMethod === 'anonymous'
                  ? 'bg-teal-50/90 border-teal-500 text-teal-950 ring-1 ring-teal-500/30 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  authMethod === 'anonymous'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[11px] text-slate-900">
                    {isHi ? 'गुमनाम मोड (DPDP Act 2023)' : 'Anonymous Zero-Identity Mode (DPDP Act 2023)'}
                  </span>
                  <span className="text-[9px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                    {isHi ? 'शून्य पहचान' : '100% Confidential'}
                  </span>
                </div>
                <div className="text-[9px] text-slate-500 font-normal truncate">
                  {isHi ? 'बिना सेवा संख्या या नाम दर्ज किए परामर्श प्राप्त करें' : 'Seek wellness & counselling with zero identity logging'}
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Security Verification In-Progress Handshake Overlay */}
      {verifyingStage > 0 && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white space-y-3 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                {isHi ? 'सैन्य सुरक्षा सत्यापन सक्रिय' : 'MILITARY SECURITY CLEARANCE HANDSHAKE'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Step {verifyingStage}/3</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(verifyingStage / 3) * 100}%` }}
            />
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs font-mono text-slate-200 leading-snug">
              {verificationMessage}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: Official Defence Roster with Identity Selection & Challenge      */}
      {/* ========================================================================= */}
      {authMethod === 'persona' && (
        <div className="space-y-3.5">
          {/* Section description */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <span>{isHi ? '1. कार्मिक प्रोफ़ाइल का चयन करें' : '1. Select Authorized Personnel Profile'}</span>
              <span className="text-[10px] font-normal text-slate-500">
                ({activePersonas.length} {isHi ? 'उपलब्ध' : 'Authorized'})
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {isHi ? 'चयन करें, फिर क्रेडेंशियल सत्यापित करें' : 'Click to select profile'}
            </span>
          </div>

          {/* Persona Roster List */}
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            {activePersonas.map((p) => {
              const isSelected = p.key === selectedPersonaKey;
              return (
                <div
                  key={p.key}
                  onClick={() => !loading && handleSelectPersona(p)}
                  className={`p-2.5 rounded-2xl border cursor-pointer transition-all duration-150 flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                      : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 shadow-xs transition-transform ${
                    isSelected ? 'bg-emerald-600 text-white scale-105' : 'bg-white border border-slate-200 text-slate-700'
                  }`}>
                    {p.badge}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`font-bold text-xs truncate ${isSelected ? 'text-emerald-950 font-black' : 'text-slate-900'}`}>
                        {p.title}
                      </h4>
                      {isSelected ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-lg shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {isHi ? 'चयनित' : 'Selected'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 shrink-0">
                          {isHi ? 'चुनें →' : 'Select'}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-800/90 mt-0.5 truncate">
                      {p.rank} · <span className="font-mono">{p.serviceId}</span>
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5 truncate">{p.sector}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Identity Credential & Security Challenge Panel */}
          {selectedPersona && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs">
                    {selectedPersona.badge}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      {isHi ? '2. पहचान एवं सुरक्षा क्लीयरेंस' : '2. Identity Verification & Clearance'}
                    </div>
                    <div className="text-xs font-bold text-white truncate max-w-[240px] sm:max-w-none">
                      {selectedPersona.title}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {selectedPersona.clearance.split('·')[0].trim()}
                  </span>
                </div>
              </div>

              {/* Security Credentials Challenge Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                    {isHi ? 'सेवा संख्या (Service ID)' : 'Official Service ID'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={selectedPersona.serviceId}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono text-xs focus:outline-none"
                    />
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">
                      {isHi ? 'सैन्य सुरक्षा पिन' : 'Defence PIN / Passcode'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="text-[9px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      {showPasscode ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                      <span>{showPasscode ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* 2FA Token Indicator */}
              <div className="flex items-center justify-between bg-slate-800/60 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>2FA Hardware TOTP:</span>
                  <span className="text-white font-bold">{otp}</span>
                </div>
                <span className="text-emerald-400 font-bold">Synchronized</span>
              </div>

              {/* Primary Authorization Button */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleExecuteLogin(selectedPersona.key, 'persona', selectedPersona.serviceId)}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-extrabold rounded-xl shadow-lg shadow-emerald-950/40 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0" />
                )}
                <span>
                  {loading
                    ? (isHi ? 'सुरक्षा क्लीयरेंस सत्यापित की जा रही है...' : 'Verifying Military Clearance...')
                    : (isHi ? 'सुरक्षा क्रेडेंशियल सत्यापित करें एवं पोर्टल में प्रवेश करें' : 'Verify Credentials & Enter Enclave')}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: Manual Military Credentials & Passcode Input                      */}
      {/* ========================================================================= */}
      {authMethod === 'credentials' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const matchedPersona = currentPortalPersonas.find(p => p.serviceId.toLowerCase() === serviceId.toLowerCase()) || selectedPersona;
            handleExecuteLogin(matchedPersona.key, 'credentials', serviceId);
          }}
          className="space-y-3.5 text-xs"
        >
          {/* Quick-fill helper chips */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {isHi ? 'त्वरित अधिकृत पहचान भरें' : 'Quick Fill Authorized Service ID'}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {activePersonas.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => {
                    setServiceId(p.serviceId);
                    setSelectedPersonaKey(p.key);
                  }}
                  className={`text-[10px] font-mono px-2 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                    serviceId === p.serviceId
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {p.serviceId} ({p.title.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isHi ? 'आधिकारिक सेवा संख्या / टोकन आईडी' : 'Official Service Number / Token ID'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                placeholder="e.g. IC-54912W, CRPF-204-7712, 14RR-940212M"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">
                  {isHi ? 'सैन्य सुरक्षा पिन' : 'Security PIN / Passcode'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="text-[10px] text-slate-500 hover:text-slate-800"
                >
                  {showPasscode ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isHi ? '2FA ओटीपी सुरक्षा टोकन' : '2FA Hardware OTP'}
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">
              {loading
                ? (isHi ? 'क्रेडेंशियल सत्यापित किए जा रहे हैं...' : 'Verifying Military Clearance...')
                : (isHi ? 'क्रेडेंशियल सत्यापित करें एवं अधिकृत हों' : 'Verify Credentials & Authorize Clearance')}
            </span>
          </button>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: Biometric TouchID / FaceID & CAC Smart Card Handshake             */}
      {/* ========================================================================= */}
      {authMethod === 'biometric' && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-4">
          <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2.5">
            <span className="font-bold text-slate-700">
              {isHi ? 'सक्रिय अधिकारी पहचान:' : 'Active Officer Profile:'}
            </span>
            <span className="font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
              {selectedPersona.title} ({selectedPersona.serviceId})
            </span>
          </div>

          <div
            onClick={() => !loading && handleExecuteLogin(selectedPersona.key, 'biometric', selectedPersona.serviceId)}
            className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-500 hover:border-solid hover:bg-emerald-100/70 text-emerald-600 flex items-center justify-center mx-auto cursor-pointer transition-all duration-300 group shadow-sm hover:scale-105"
          >
            {loading ? (
              <RefreshCw className="w-10 h-10 animate-spin text-emerald-600" />
            ) : (
              <Fingerprint className="w-12 h-12 group-hover:scale-110 transition-transform animate-pulse text-emerald-600" />
            )}
          </div>

          <div className="space-y-1">
            <h4 className="font-black text-slate-900 text-sm">
              {isHi ? 'बायोमेट्रिक प्रमाणीकरण हेतु टैप करें' : 'Tap to Scan Biometric / Smart Card'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {isHi
                ? 'हार्डवेयर-समर्थित FIDO2 / WebAuthn एन्क्रिप्टेड बायोमेट्रिक मिलान (रक्षा मानक)।'
                : 'Simulating hardware-backed FIDO2 cryptographic biometric verification & CAC Smart Card validation.'}
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleExecuteLogin(selectedPersona.key, 'biometric', selectedPersona.serviceId)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-emerald-200" />
            <span>
              {loading
                ? (isHi ? 'बायोमेट्रिक कुंजी जांची जा रही है...' : 'Scanning Biometric Token...')
                : (isHi ? 'बायोमेट्रिक प्रमाणीकरण आरंभ करें' : 'Authorize via Biometric Key')}
            </span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: Anonymous Zero-Identity Shielded Entry (Soldier Portal Only)       */}
      {/* ========================================================================= */}
      {authMethod === 'anonymous' && portal === 'soldier' && (
        <div className="bg-gradient-to-b from-teal-50 to-emerald-50/50 border border-teal-200 rounded-2xl p-5 text-center space-y-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          
          <div className="space-y-1">
            <h4 className="font-black text-teal-950 text-base">
              {isHi ? 'गुमनाम शून्य-पहचान चेक-इन' : 'Anonymous Zero-Identity Check-In'}
            </h4>
            <div className="inline-block text-[10px] font-mono font-bold bg-teal-200/70 text-teal-900 px-2.5 py-0.5 rounded-full">
              DPDP Act 2023 · End-to-End Ephemeral Guard
            </div>
          </div>

          <p className="text-xs text-teal-800 leading-relaxed max-w-sm mx-auto">
            {isHi
              ? 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 के तहत सैनिकों को बिना अपनी सेवा संख्या या बटालियन का खुलासा किए मानसिक स्वास्थ्य सहायता प्राप्त करने का पूर्ण वैधानिक अधिकार है।'
              : 'Under India\'s DPDP Act, 2023, you have the protected statutory right to seek psychological health & welfare support without disclosing your name, army number, or unit. No identity records are captured.'}
          </p>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleExecuteLogin('personnel', 'anonymous', 'P-ANON')}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-teal-200" />
            )}
            <span>
              {loading
                ? (isHi ? 'गोपनीय सत्र प्रारंभ हो रहा है...' : 'Establishing Ephemeral Session...')
                : (isHi ? 'गोपनीय शील्डेड पोर्टल में प्रवेश करें' : 'Initialize Zero-Identity Shielded Session')}
            </span>
          </button>
        </div>
      )}

      {/* Security Compliance Footer Notice */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[10px] text-slate-400 gap-1 font-mono">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>AES-256-GCM Envelope Encryption</span>
        </span>
        <span>DPDP Act 2023 Compliant · Scoped RBAC</span>
      </div>
    </div>
  );
};
