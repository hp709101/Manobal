# MANOBAL (मनोबल)
### AI-Based Predictive Personnel Stress and Welfare Monitoring System for Uniformed Forces
**Smart India Hackathon (SIH26186) · Defensive Privacy-First Architecture**

---

## 🎖️ Executive Summary

**Manobal (मनोबल)** is an AI-driven, privacy-preserving welfare and operational stress monitoring system designed specifically for the Indian Armed Forces and uniformed security personnel. Built strictly according to the defensive specifications defined in `Manobal_Dashboards_Features_and_Secure_Stack (1).docx`, Manobal balances operational readiness with deep clinical privacy safeguards.

The platform provides a **Three-Dashboard Architecture** with strict server-side Role-Based Access Control (RBAC), **AES-256-GCM envelope encryption**, **HMAC-SHA256 tokenization**, **statutory purpose-limitation firewalls**, and full alignment with India's **Digital Personal Data Protection (DPDP) Act, 2023**.

---

## 🏛️ System Architecture & Portals

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    MANOBAL SYSTEM ARCHITECTURE                                  │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
             │                                     │                                    │
             ▼                                     ▼                                    ▼
┌─────────────────────────┐          ┌─────────────────────────┐          ┌─────────────────────────┐
│       DASHBOARD 1       │          │       DASHBOARD 2       │          │       DASHBOARD 3       │
│    Admin / Commander    │          │  Welfare / Counsellor   │          │ Uniformed Personnel PWA │
├─────────────────────────┤          ├─────────────────────────┤          ├─────────────────────────┤
│ • Unit Groups & Strength│          │ • Priority Alert Inbox  │          │ • Support Chatbot       │
│ • Masked Personnel List │          │ • SLA Countdown Timers  │          │   (Green/Amber/Red)     │
│ • Observed vs Assessed  │          │ • Explainable SHAP View │          │ • Box Breathing (4×4)   │
│ • Encrypted Remarks     │          │ • Encrypted Case Notes  │          │ • Routine PHQ-9 Check   │
│ • Tag Severity Analysis │          │ • Consented Health Graph│          │ • Wearable Health Sync  │
│ • Bulk HRMS & Rollback  │          │ • Medical Referrals     │          │ • 1-Tap Data Purge      │
│ • Coarse Trend Chip     │          │ • Case Handovers        │          │ • Anonymous Booking     │
│ • K-Anonymity Analytics │          │ • False-Positive Calib. │          │ • Client-Side Journal   │
│ • Watermarked Exports   │          │ • Safe-Message Outbox   │          │ • Duty-Aware Reminders  │
└─────────────────────────┘          └─────────────────────────┘          └─────────────────────────┘
             │                                     │                                    │
             └─────────────────────────────────────┼────────────────────────────────────┘
                                                   │
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DEFENSIVE SECURITY & PRIVACY CORE                               │
├────────────────────────────────────────────────────────────────────────────────────────────────┤
│  • AES-256-GCM Envelope Encryption (Remarks, Case Notes, Chat History, Private Journal)       │
│  • HMAC-SHA256 Tokenization for Unique Service IDs & Identity Masking (R*** S***)             │
│  • Hard-Enforced Purpose Limitation: Statutorily blocked from ACR, promotions & postings       │
│  • Append-Only Tamper-Evident Audit Trail (Every view, export, status revision logged)         │
│  • DPDP Act 2023 Compliance: Daily summaries only, granular toggles, right-to-be-forgotten     │
│  • 24x7 Emergency Integration: Tele-MANAS (14416) & KIRAN (1800-599-0019)                      │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Comprehensive Feature Checklist

### Dashboard 1: Admin & Commander (All 20 Features Implemented)
| # | Feature | Marker | Implementation Details |
|---|---|---|---|
| **1** | **Unit groups** | YOUR FEATURE | Army battalions (14 Raj Rif, 7th Sikh LI, 21 Para SF) with location, strength, CO. |
| **2** | **Personnel list per unit** | YOUR FEATURE | Filterable personnel roster with stats, ranks, and masked display names. |
| **3** | **Remarks on a person** | YOUR FEATURE | Commander records observations (e.g. bereavement, road accident) with encrypted storage. |
| **4** | **Stress/depression status field** | YOUR FEATURE | 5 controlled welfare statuses: `Normal`, `Moderate`, `Critical`, `Suspected`, `Unspecified`. |
| **5** | **HRMS report upload** | YOUR FEATURE | Admin joins duty and leave records via tokenized service ID. |
| **6** | **Individual stats dashboard** | YOUR FEATURE | Modal dossier: duty streak, leave backlog, overtime hours, remarks, status timeline. |
| **7** | **Structured tags + free text** | SUGGESTED | Tags: `#bereavement`, `#family_illness`, `#financial_strain`, `#conflict`, `#injury`, `#deployment_strain`. |
| **8** | **Remark analysis with confirmation** | SUGGESTED | NLP proposes life-event severity (`Low`/`Moderate`/`High`). Human confirmation required; never auto-labels depression. |
| **9** | **Observed vs Assessed status** | SUGGESTED | Observed status (set by commander) and Assessed status (set by counsellor) displayed side-by-side. |
| **10** | **Status history with reason** | SUGGESTED | Immutable timeline recording who, when, and mandatory justification when moving someone to Critical. |
| **11** | **Bulk HRMS import with validation** | SUGGESTED | CSV upload with schema checks, duplicate/mismatch report, preview before commit, rollback. |
| **12** | **Protected unique ID** | SUGGESTED | Service ID stored as deterministic HMAC-SHA256 token and displayed masked (`SRV-***-0294`). |
| **13** | **Unit analytics** | SUGGESTED | Workload distributions, leave backlog averages, and **K-Anonymity suppression** (< 3 troops). |
| **14** | **Request welfare review** | SUGGESTED | One-click button by Commander to route soldier into Welfare Officer queue with notes. |
| **15** | **Remark visibility levels** | SUGGESTED | Remarks categorized as `commander_only` or `shared_with_welfare`. |
| **16** | **Remark expiry and review** | SUGGESTED | 30/90/180-day review cycles so transient issues do not linger permanently. |
| **17** | **Coarse health trend indicator** | SUGGESTED · HEALTH | Consented personnel display a simple chip (`Stable` / `Declining` / `Unavailable`). Raw biometrics never shown. |
| **18** | **Admin vs Commander split** | SUGGESTED | Admin manages users and bulk uploads; Commanders scoped strictly to their own battalion. |
| **19** | **Watermarked restricted exports** | SUGGESTED | Dynamic diagonal security watermark with viewer name, role, timestamp, IP, and DPDP notice. |
| **20** | **Audit trail viewer** | SUGGESTED | Searchable append-only audit registry recording every access, view, and modification. |

---

### Dashboard 2: Welfare Officer & Counsellor (All 13 Features Implemented)
| # | Feature | Marker | Implementation Details |
|---|---|---|---|
| **1** | **Stress & anxiety level view** | YOUR FEATURE | Clinical status monitor displaying Observed vs Assessed status side-by-side. |
| **2** | **Extra soldier/officer details** | YOUR FEATURE | Full operational context: posting, leave history, shared remarks, and fitness grade. |
| **3** | **Alert inbox with SLA timers** | SUGGESTED | Prioritized queue with real-time SLA countdowns (Red: 2-hour SLA, Amber: 24-hour SLA). |
| **4** | **Explainable case view** | SUGGESTED | Interpretable XGBoost/SHAP factor breakdown in plain language with impact percentages. |
| **5** | **Confidential case notes** | SUGGESTED | AES-256-GCM encrypted clinical notes strictly blocked from commanders and admins. |
| **6** | **Counselling requests & scheduling** | SUGGESTED | Incoming appointment booking queue with support for Anonymous-First requests. |
| **7** | **Follow-up tracker & outcomes** | SUGGESTED | Status tracking (`Ongoing`, `Escalated`, `Resolved`) with recorded clinical outcomes. |
| **8** | **Sleep and activity trends** | SUGGESTED · HEALTH | 7-day interactive clinical trend graphs (sleep hours, consistency %, resting HR, steps). |
| **9** | **Referral workflow** | SUGGESTED | Formal logged referrals to Regimental Medical Officer (RMO) or Military Hospital (MH). |
| **10** | **Dismiss false positive** | SUGGESTED | Close alert with mandatory justification, feeding back into model precision calibration. |
| **11** | **Case handover** | SUGGESTED | Transfer active cases between counsellors with clinical notes preserved. |
| **12** | **Safe-messaging templates** | SUGGESTED | Pre-approved respectful outreach message library with one-click clipboard copy. |
| **13** | **Anonymised caseload analytics** | SUGGESTED | Caseload distribution, recovery rates, and resource trends with zero PII exposure. |

---

### Dashboard 3: Uniformed Personnel Portal (All 20 Features Implemented)
| # | Feature | Marker | Implementation Details |
|---|---|---|---|
| **1** | **Routine self-assessment** | YOUR FEATURE | Standardized PHQ-9 (Depression) & GAD-7 (Anxiety) screening with instant private scoring. |
| **2** | **Private support chatbot** | YOUR FEATURE | Manobal Buddy: confidential active listening with zero sharing to welfare unless escalated. |
| **3** | **Automatic escalation on serious risk** | YOUR FEATURE | Immediate crisis intervention on self-harm triggers with minimal welfare notification. |
| **4** | **Talk to a counsellor** | YOUR FEATURE | Clear one-tap appointment request with time slot and mode selection. |
| **5** | **Connect health trackers** | YOUR FEATURE · HEALTH | Health Connect (Android), HealthKit (iOS), and Google Health API integration. |
| **6** | **Upfront transparency notice** | SUGGESTED | Plain-language screen explaining privacy safeguards and disclosure rules under DPDP Act. |
| **7** | **Three-level chatbot response** | SUGGESTED | **Green**: supportive exercises; **Amber**: counsellor consent modal; **Red**: emergency screen. |
| **8** | **Crisis screen with helplines** | SUGGESTED | Direct dialing to **Tele-MANAS (14416)** and **KIRAN (1800-599-0019)**. |
| **9** | **Minimal-disclosure alerts** | SUGGESTED | Alerts transmit only tier, reason category, and timestamp. Transcripts remain confidential. |
| **10** | **Personal wellbeing snapshot** | SUGGESTED | Daily mood, 7-day sleep averages, resting heart rate, and mindful check-in streaks. |
| **11** | **Tactical Box Breathing & gamification**| SUGGESTED | Interactive animated 4×4 Box Breathing pacer (4s Inhale, Hold, Exhale, Hold) with effort streaks. |
| **12** | **Private journal** | SUGGESTED | Client-side encrypted reflections kept strictly on-device; never accessible to officers. |
| **13** | **Data control centre** | SUGGESTED | Full permission audit, downloadable personal JSON archive, and one-tap erasure. |
| **14** | **Granular health-sync toggles** | SUGGESTED · HEALTH | Individual opt-in toggles for sleep duration, resting heart rate, and daily steps. |
| **15** | **Plain-language health insights** | SUGGESTED · HEALTH | Non-diagnostic insights (e.g. "Sleep average is 2.1h below baseline"). |
| **16** | **Multilingual and voice input** | SUGGESTED | Complete Hindi (`हिन्दी`) & English localization toggle, with simulated voice input. |
| **17** | **Offline-first web app (PWA)** | SUGGESTED | Installable PWA manifest (`manifest.json`) for field use in low-connectivity areas. |
| **18** | **Anonymous-first booking** | SUGGESTED | Book a counsellor without sharing identity until the soldier chooses to reveal it. |
| **19** | **Emergency floating button** | SUGGESTED | Persistent 24x7 crisis button for immediate access to verified national care. |
| **20** | **Duty-aware reminders** | SUGGESTED | One-tap toggle to pause welfare nudges during combat patrols or tactical duty windows. |

---

## 🔒 Defensive Security & Privacy Directives

1. **AES-256-GCM Envelope Encryption**:
   - Remarks, confidential clinical notes, journal reflections, and chat logs are encrypted with AES-GCM using unique 96-bit nonces.
   - Even in the event of a raw database dump, all sensitive text remains ciphertext.
2. **Statutory Purpose Limitation**:
   - Manobal is strictly firewalled from Annual Confidential Reports (ACR), promotion rosters, postings, or disciplinary proceedings.
   - Enforced technically by the absence of any export endpoints or integration paths to personnel evaluation databases.
3. **Data Minimization & Aggregation**:
   - Continuous raw biometric streaming is rejected; only daily summaries are pulled.
   - Unit commanders only see a coarse chip (`Stable` / `Declining` / `Unavailable`), never raw sleep hours or heart rate charts.
4. **K-Anonymity Guardrails**:
   - Sub-cohort statistics are suppressed if group size $n < 3$ to prevent deductive re-identification of individual soldiers in small teams.
5. **Tamper-Evident Append-Only Audit Trail**:
   - Every single view of a soldier's profile, status change, remark creation, and report export is immutably logged with actor, role, IP address, and timestamp.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v22)
- **Python**: v3.10+ (tested on Python 3.14)

### Running Manobal with the Unified Script
To start both the FastAPI backend and the React frontend concurrently:
```bash
./start.sh
```

### Or Starting Services Individually:

#### 1. Backend API (FastAPI)
```bash
# Activate virtual environment
./backend/venv/bin/uvicorn app.main:app --app-dir ./backend --host 127.0.0.1 --port 8001
```
- API Base URL: `http://localhost:8001`
- Interactive Swagger API Documentation: `http://localhost:8001/docs`

#### 2. Frontend Application (React + Vite + Tailwind CSS)
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5174
```
- Web Application URL: `http://localhost:5174`

---

## 👥 Demo Personas for Evaluation

Use the **Role Switcher dropdown** in the top navigation bar to switch personas instantly:

1. **Admin (`admin`)**:
   - Persona: `Brig. J. S. Cheema (HQ Admin)`
   - Capabilities: Global battalion oversight, bulk HRMS import with schema validation and preview, tamper-evident audit log inspection.
2. **Unit Commander (`commander_u1`)**:
   - Persona: `Col. V. A. Rathore, SM (14 Rajputana Rifles)`
   - Capabilities: Scoped strictly to 14 Raj Rif; sets Observed Status with mandatory justifications; adds encrypted remarks with structured tags; inspects coarse health chips; requests welfare reviews.
3. **Unit Commander (`commander_u2`)**:
   - Persona: `Col. H. S. Brar (7th Sikh Light Infantry)`
   - Capabilities: Scoped strictly to 7th Sikh LI.
4. **Welfare Officer / Counsellor (`welfare`)**:
   - Persona: `Capt. S. Sengupta (RMO / Welfare Officer)`
   - Capabilities: Priority Alert Inbox with live SLA timers; explainable SHAP risk view; confidential AES-256-GCM encrypted notes; consented sleep and step charts; medical referrals; alert dismissals with feedback; case handovers; anonymous-first booking inbox.
5. **Uniformed Personnel (`personnel`)**:
   - Persona: `Sepoy Rajesh Kumar Singh (P-001)`
   - Capabilities: Upfront DPDP transparency declaration; 4x4 Tactical Box Breathing pacer; routine PHQ-9 self-assessment; support chatbot (Green/Amber/Red tiers); health tracker sync controls; private on-device journal; anonymous counsellor booking; duty-aware reminder toggle.

---

## 📞 Emergency Contacts (Integrated Nationwide)

- **Tele-MANAS**: `14416` / `1800-891-4416` (24x7 National Tele-Mental Health Programme, Ministry of Health and Family Welfare, Govt. of India)
- **KIRAN Helpline**: `1800-599-0019` (24x7 Mental Health Rehabilitation, Ministry of Social Justice & Empowerment)
- **Unit Medical Inspection Room (MI Room)**: `112 / Ext 3333` (Immediate Military Medical Officer Dispatch)

---
*Manobal is developed under defensive privacy principles for uniformed forces. Synthetic demonstration data only is used during testing.*
