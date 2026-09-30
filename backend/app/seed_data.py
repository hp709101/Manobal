import json
import secrets
from datetime import datetime, timedelta
from app.database import get_db, init_db, log_audit
from app.security import tokenize_service_id, mask_service_id, mask_personnel_name, encrypt_field

def secrets_id():
    return secrets.token_hex(4)

def seed_database(force_reseed: bool = False):
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    if not force_reseed:
        cursor.execute("SELECT COUNT(*) FROM units WHERE id = 'UNIT-04';")
        if cursor.fetchone()[0] > 0:
            conn.close()
            return

    now = datetime.utcnow()
    now_iso = now.isoformat() + "Z"

    # 1. Units spanning Armed Forces, CAPFs, State Police, Disaster Response
    units = [
        # Indian Armed Forces
        ("UNIT-01", "14 Rajputana Rifles", "12 Infantry Division", "Siachen Sector (Northern Command)", 720, "Col. V. A. Rathore, SM", "Armed Forces", "Indian Army", "Shield", "Ever Brave (वीरता और बलिदान)", now_iso),
        ("UNIT-02", "7th Sikh Light Infantry", "3 Corps Eastern Command", "Tawang Sector (Eastern Command)", 680, "Col. H. S. Brar", "Armed Forces", "Indian Army", "Shield", "Deg Tegh Fateh", now_iso),
        ("UNIT-03", "21 Para (Special Forces)", "Special Forces Airborne Wing", "Udhampur Sector (HQ Northern)", 340, "Col. Samarjit Rana, SC", "Armed Forces", "Indian Army", "Award", "Men Apart, Every Man An Emperor", now_iso),

        # Central Armed Police Forces (CAPFs)
        ("UNIT-04", "204 CoBRA Battalion (CRPF)", "Commando Battalion for Resolute Action", "Bastar Sector (Chhattisgarh LWE Ops)", 580, "Commandant Rajeshwar Singh", "CAPFs", "CRPF", "Swords", "Victory or Death (संग्राम पराक्रम)", now_iso),
        ("UNIT-05", "88 Bn Border Security Force (BSF)", "Rajasthan Frontier", "Longewala Border Outpost (Thar Desert)", 640, "Commandant Harmeet Singh", "CAPFs", "BSF", "Eye", "Duty Unto Death (जीवन पर्यन्त कर्तव्य)", now_iso),
        ("UNIT-06", "Airport Security Group IGI (CISF)", "Aviation Security Wing", "IGI Airport New Delhi", 920, "Sr. Commandant Alok Mathur", "CAPFs", "CISF", "ShieldCheck", "Protection and Security (संरक्षण एवं सुरक्षा)", now_iso),
        ("UNIT-07", "1st Bn Indo-Tibetan Border Police (ITBP)", "North-West Frontier", "Pangong Tso Mountain Patrol (14,000 ft)", 490, "Commandant Tenzing Dorjee", "CAPFs", "ITBP", "Mountain", "Valour, Steadfastness, Commitment (शौर्य, दृढ़ता, कर्मनिष्ठा)", now_iso),

        # State Police Organizations
        ("UNIT-08", "Mumbai Police Zone 1 (Metro Force)", "South Region Law & Order", "Mumbai Police HQ / Bandobast Command", 850, "DCP Vikramaditya Deshmukh, IPS", "State Police", "Maharashtra Police", "BadgeCheck", "Sadrakshanaaya Khalanigrahanaaya (सद्रक्षणाय खलनिग्रहणाय)", now_iso),

        # Disaster Response & Emergency Services
        ("UNIT-09", "8th Bn NDRF (Disaster Response)", "National Disaster Response Force", "Ghaziabad Rapid Rescue Base (Flood & Quake Ops)", 420, "Commandant Ajay Verma", "Disaster Response", "NDRF", "LifeBuoy", "Saving Lives & Beyond (आपदा सेवा सदैव सर्वत्र)", now_iso),
    ]

    for u in units:
        cursor.execute("""
            INSERT OR REPLACE INTO units (id, name, parent_unit, location, strength, commanding_officer, force_category, force_name, badge_icon, motto, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, u)

    # 2. Personnel (Diverse ranks, forces, operational conditions)
    personnel_raw = [
        # Unit 1: Army Siachen
        ("P-001", "SRV-10294", "Sepoy Rajesh Kumar Singh", "Sepoy", "UNIT-01", "personnel", "Critical", "Moderate", "Prolonged duty streak (64 days) and bereavement in native village", "Col. V. A. Rathore", (now - timedelta(days=2)).isoformat() + "Z"),
        ("P-002", "SRV-10832", "Havildar Gurvinder Singh", "Havildar", "UNIT-01", "personnel", "Moderate", "Moderate", "Reported sleep disturbance following Siachen glacier patrol", "Maj. Alok Nath", (now - timedelta(days=5)).isoformat() + "Z"),
        ("P-003", "SRV-11045", "Naik Surender Pal", "Naik", "UNIT-01", "personnel", "Normal", "Normal", "Routine bi-annual review; strong morale", "Capt. K. Mehta", (now - timedelta(days=12)).isoformat() + "Z"),
        ("P-004", "SRV-11589", "Subedar Major Ram Chander", "Subedar Major", "UNIT-01", "personnel", "Normal", "Normal", "Satisfactory operational standing", "Col. V. A. Rathore", (now - timedelta(days=20)).isoformat() + "Z"),
        ("P-005", "SRV-12011", "Lance Naik Amit Dogra", "Lance Naik", "UNIT-01", "personnel", "Suspected", "Unspecified", "Noticeable withdrawal during morning muster", "Capt. K. Mehta", (now - timedelta(days=1)).isoformat() + "Z"),

        # Unit 2: Army Tawang
        ("P-006", "SRV-20481", "Sepoy Baljit Singh", "Sepoy", "UNIT-02", "personnel", "Moderate", "Unspecified", "Pending family land litigation causing distress", "Col. H. S. Brar", (now - timedelta(days=4)).isoformat() + "Z"),
        ("P-007", "SRV-20912", "Naib Subedar Devendra Rawat", "Naib Subedar", "UNIT-02", "personnel", "Normal", "Normal", "Active operational fitness", "Col. H. S. Brar", (now - timedelta(days=15)).isoformat() + "Z"),
        ("P-008", "SRV-21344", "Havildar Manpreet Sandhu", "Havildar", "UNIT-02", "personnel", "Critical", "Critical", "Chatbot Red trigger received & severe sleep debt (3.9 hrs)", "Col. H. S. Brar", (now - timedelta(hours=3)).isoformat() + "Z"),

        # Unit 3: Para SF
        ("P-011", "SRV-30112", "Major Tarun Varma", "Major", "UNIT-03", "personnel", "Normal", "Normal", "High tempo airborne readiness certified", "Col. Samarjit Rana", (now - timedelta(days=30)).isoformat() + "Z"),
        ("P-012", "SRV-30554", "Havildar Jiten Barua", "Havildar", "UNIT-03", "personnel", "Moderate", "Moderate", "Rehab post jump knee strain; mild anxiety", "Capt. R. Deshmukh", (now - timedelta(days=6)).isoformat() + "Z"),

        # Unit 4: CRPF CoBRA (Bastar LWE)
        ("P-016", "CRPF-40101", "Head Constable Amit Kumar", "Head Constable", "UNIT-04", "personnel", "Critical", "Moderate", "Continuous 68 days jungle anti-ambush patrol in Sukma forest", "Commandant Rajeshwar Singh", (now - timedelta(days=1)).isoformat() + "Z"),
        ("P-017", "CRPF-40242", "Constable Manoj Tirkey", "Constable", "UNIT-04", "personnel", "Moderate", "Normal", "Fatigue following prolonged counter-IED clearance ops", "Asst. Comdt. R. K. Mishra", (now - timedelta(days=4)).isoformat() + "Z"),
        ("P-018", "CRPF-40590", "Inspector Sunil Baghel", "Inspector", "UNIT-04", "personnel", "Normal", "Normal", "Commended in tactical intelligence extraction", "Commandant Rajeshwar Singh", (now - timedelta(days=18)).isoformat() + "Z"),

        # Unit 5: BSF Longewala Border Outpost
        ("P-019", "BSF-50119", "Constable Gurmeet Singh", "Constable", "UNIT-05", "personnel", "Critical", "Moderate", "Extreme heat exhaustion (48°C) & high night vigilance strain", "Commandant Harmeet Singh", (now - timedelta(days=2)).isoformat() + "Z"),
        ("P-020", "BSF-50341", "Head Constable Mohan Lal Bishnoi", "Head Constable", "UNIT-05", "personnel", "Normal", "Normal", "Desert tracking specialist; stable health sync", "Commandant Harmeet Singh", (now - timedelta(days=22)).isoformat() + "Z"),

        # Unit 6: CISF Airport Security Group
        ("P-021", "CISF-60205", "Sub-Inspector Priya Sharma", "Sub-Inspector", "UNIT-06", "personnel", "Moderate", "Moderate", "Continuous rotational night shifts at Terminal 3 screening", "Sr. Comdt. Alok Mathur", (now - timedelta(days=3)).isoformat() + "Z"),
        ("P-022", "CISF-60488", "Constable Ravi Prakash", "Constable", "UNIT-06", "personnel", "Normal", "Normal", "Standard screening shift roster completed", "Sr. Comdt. Alok Mathur", (now - timedelta(days=14)).isoformat() + "Z"),

        # Unit 7: ITBP Pangong High Altitude
        ("P-023", "ITBP-70190", "Constable Tashi Namgyal", "Constable", "UNIT-07", "personnel", "Moderate", "Moderate", "Altitude acclimation strain and extreme cold winds", "Commandant Tenzing Dorjee", (now - timedelta(days=5)).isoformat() + "Z"),
        ("P-024", "ITBP-70321", "Head Constable Lobzang Angdus", "Head Constable", "UNIT-07", "personnel", "Normal", "Normal", "High-altitude mountain terrain certified", "Commandant Tenzing Dorjee", (now - timedelta(days=19)).isoformat() + "Z"),

        # Unit 8: Mumbai Police (State Police)
        ("P-025", "POL-80145", "Sub-Inspector Sachin Kadam", "Sub-Inspector", "UNIT-08", "personnel", "Critical", "Moderate", "16-hour continuous bandobast & riot control duty; severe sleep deprivation", "DCP V. Deshmukh", (now - timedelta(hours=14)).isoformat() + "Z"),
        ("P-026", "POL-80412", "Police Constable Ramesh Patil", "Police Constable", "UNIT-08", "personnel", "Moderate", "Normal", "VIP security convoy backlog; pending leave 38 days", "DCP V. Deshmukh", (now - timedelta(days=3)).isoformat() + "Z"),

        # Unit 9: NDRF Disaster Response
        ("P-027", "NDRF-90118", "Rescue Specialist Sandeep Rawat", "Rescue Specialist", "UNIT-09", "personnel", "Critical", "Critical", "Psychological trauma & physical exhaustion post-cyclone flood recovery operations", "Commandant Ajay Verma", (now - timedelta(hours=6)).isoformat() + "Z"),
        ("P-028", "NDRF-90455", "Inspector Alok Tripathy", "Inspector", "UNIT-09", "personnel", "Normal", "Normal", "Deep-diving & earthquake collapsed structure certified", "Commandant Ajay Verma", (now - timedelta(days=25)).isoformat() + "Z"),
    ]

    for pid, raw_srv, fname, rank, uid, role, obs_st, ass_st, rsn, upd_by, st_at in personnel_raw:
        tok_id = tokenize_service_id(raw_srv)
        masked_srv = mask_service_id(raw_srv)
        masked_nm = mask_personnel_name(fname)

        cursor.execute("""
            INSERT OR REPLACE INTO personnel (id, tokenised_service_id, raw_service_id_masked, full_name, masked_name, rank, unit_id, role, observed_status, assessed_status, last_status_reason, last_status_updated_by, last_status_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (pid, tok_id, masked_srv, fname, masked_nm, rank, uid, role, obs_st, ass_st, rsn, upd_by, st_at, now_iso))

        # Status History entry
        cursor.execute("""
            INSERT OR REPLACE INTO status_history (id, personnel_id, status_type, old_value, new_value, reason, changed_by, changed_by_role, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (f"SH-{pid}-1", pid, "observed", "Normal", obs_st, rsn, upd_by, "commander", st_at))

    # 3. HRMS Records (with transfer frequency, training commitments, hazardous exposure)
    hrms_data = [
        # pid, leave_bal, consecutive_days, overtime, transfer_count, training_days, hazard, fitness
        ("P-001", 48, 64, 38.5, 3, 24, "Siachen Hypoxia & Extreme Cold", "SHAPE-1"),
        ("P-002", 22, 42, 24.0, 2, 14, "Siachen Hypoxia & Extreme Cold", "SHAPE-1"),
        ("P-003", 28, 14, 8.0, 1, 10, "High Altitude Mountain Patrol", "SHAPE-1"),
        ("P-004", 15, 21, 12.0, 4, 30, "Standard", "SHAPE-1"),
        ("P-005", 35, 49, 29.0, 2, 12, "Siachen Hypoxia & Extreme Cold", "SHAPE-1"),

        ("P-006", 42, 52, 22.0, 1, 15, "High Altitude Mountain Patrol", "SHAPE-1"),
        ("P-007", 20, 18, 10.0, 2, 8, "Standard", "SHAPE-1"),
        ("P-008", 55, 78, 44.0, 2, 36, "Line of Control Forward Outpost", "SHAPE-2"),

        ("P-011", 18, 25, 15.0, 2, 42, "Standard Airborne", "SHAPE-1"),
        ("P-012", 26, 30, 16.0, 1, 20, "Combat Jump Exercise", "SHAPE-2 (Knee Rehab)"),

        # CRPF CoBRA
        ("P-016", 52, 68, 41.0, 3, 40, "Bastar LWE Counter-Ambush Ops", "SHAPE-1"),
        ("P-017", 34, 45, 26.0, 2, 25, "Bastar LWE Counter-Ambush Ops", "SHAPE-1"),
        ("P-018", 16, 20, 12.0, 1, 10, "Jungle Tactics", "SHAPE-1"),

        # BSF Desert
        ("P-019", 45, 58, 36.0, 3, 22, "Line of Control Forward Outpost", "SHAPE-1"),
        ("P-020", 20, 15, 8.0, 1, 12, "Border Surveillance", "SHAPE-1"),

        # CISF Airport
        ("P-021", 38, 40, 32.0, 2, 18, "Rotational 24x7 Night Shift Strain", "SHAPE-1"),
        ("P-022", 15, 12, 6.0, 1, 5, "Standard", "SHAPE-1"),

        # ITBP Pangong
        ("P-023", 44, 54, 28.0, 2, 28, "High Altitude Mountain Patrol", "SHAPE-1"),
        ("P-024", 18, 16, 10.0, 1, 14, "Extreme Cold Acclimatization", "SHAPE-1"),

        # State Police (Mumbai)
        ("P-025", 56, 72, 48.0, 4, 15, "Metropolitan Riot & 16-hr Bandobast", "SHAPE-1"),
        ("P-026", 38, 38, 25.0, 2, 10, "Metropolitan Riot & 16-hr Bandobast", "SHAPE-1"),

        # NDRF Disaster Response
        ("P-027", 49, 62, 42.0, 3, 45, "Flood / Cyclone Rapid Rescue Ops", "SHAPE-1"),
        ("P-028", 22, 18, 8.0, 1, 15, "Search & Rescue Drills", "SHAPE-1"),
    ]

    for pid, l_bal, c_days, ot, trf, trn, haz, fit in hrms_data:
        tok_id = tokenize_service_id(f"SRV-{pid}")
        cursor.execute("""
            INSERT OR REPLACE INTO hrms_records (id, personnel_id, tokenised_service_id, leave_balance_days, consecutive_duty_days, shift_overtime_hours, transfer_count_last_2yr, training_commitments_days, hazardous_duty_exposure, last_leave_date, fitness_grade, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (f"HRMS-{pid}", pid, tok_id, l_bal, c_days, ot, trf, trn, haz, (now - timedelta(days=c_days + 10)).strftime("%Y-%m-%d"), fit, now_iso))

    # 4. Remarks (with tags, AES-256-GCM encrypted text, visibility levels)
    remarks_data = [
        ("P-001", "Col. V. A. Rathore", "commander", ["bereavement", "deployment_strain"], 
         "Lost brother in highway road accident near Alwar. Subedar reports soldier has been quiet and skipping evening messes.", 
         "shared_with_welfare", "High", "High", 1, (now + timedelta(days=45)).strftime("%Y-%m-%d")),
        
        ("P-006", "Col. H. S. Brar", "commander", ["financial_strain", "conflict"], 
         "Ongoing ancestral farmland dispute in civil court. Relative threatening legal notice.", 
         "shared_with_welfare", "Moderate", "Moderate", 1, (now + timedelta(days=60)).strftime("%Y-%m-%d")),

        ("P-008", "Capt. S. Sengupta", "welfare_officer", ["deployment_strain"], 
         "Soldier showing symptoms of acute fatigue after back-to-back night observation duty rotations.", 
         "shared_with_welfare", "High", "High", 1, (now + timedelta(days=30)).strftime("%Y-%m-%d")),

        ("P-016", "Commandant Rajeshwar Singh", "commander", ["deployment_strain", "conflict"],
         "68 days anti-Naxalite operation in dense forest. Encountered IED blast on patrol route; team member injured.",
         "shared_with_welfare", "High", "High", 1, (now + timedelta(days=45)).strftime("%Y-%m-%d")),

        ("P-019", "Commandant Harmeet Singh", "commander", ["deployment_strain", "injury"],
         "Heat stroke during 48-degree sandstorm patrol; required IV fluid resuscitation at post dispensary.",
         "shared_with_welfare", "High", "High", 1, (now + timedelta(days=30)).strftime("%Y-%m-%d")),

        ("P-025", "DCP V. Deshmukh", "commander", ["deployment_strain", "financial_strain"],
         "Continuous 16-hour security bandobast for 4 weeks straight. Severe fatigue and domestic pressure.",
         "shared_with_welfare", "High", "High", 1, (now + timedelta(days=30)).strftime("%Y-%m-%d")),

        ("P-027", "Commandant Ajay Verma", "commander", ["bereavement", "deployment_strain"],
         "Recovered 14 casualties during coastal cyclone deluge. Soldier displaying signs of emotional exhaustion and hyper-vigilance.",
         "shared_with_welfare", "High", "High", 1, (now + timedelta(days=30)).strftime("%Y-%m-%d")),
    ]

    for pid, auth_nm, auth_rl, tags, txt, vis, p_sev, c_sev, rev, exp in remarks_data:
        enc_txt = encrypt_field(txt)
        cursor.execute("""
            INSERT OR REPLACE INTO remarks (id, personnel_id, added_by_name, added_by_role, tags, encrypted_text, visibility_level, severity_proposed, severity_confirmed, is_reviewed, expiry_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (f"REM-{pid}-01", pid, auth_nm, auth_rl, json.dumps(tags), enc_txt, vis, p_sev, c_sev, rev, exp, now_iso))

    # 5. Health Summaries
    health_samples = [
        ("P-001", 1, 1, 1, 1, "declining", 4.8, 58, 73, 13880, "Sleep average of 4.8h is 2.1h below baseline. RHR elevated by +6 bpm."),
        ("P-003", 1, 1, 1, 1, "stable", 7.4, 91, 60, 11270, "Sleep schedule and recovery markers are well-balanced and consistent."),
        ("P-008", 1, 1, 1, 1, "declining", 3.9, 45, 83, 17540, "Critical sleep restriction: 3.9h/day average over past week. High tachycardia markers."),
        ("P-016", 1, 1, 1, 1, "declining", 4.4, 52, 79, 18900, "Jungle terrain exertion; extreme sleep deficit and erratic rest intervals in tactical bivouac."),
        ("P-019", 1, 1, 1, 1, "declining", 4.7, 54, 76, 16200, "Desert temperature strain; high resting heart rate during nocturnal patrol hours."),
        ("P-025", 1, 1, 1, 1, "declining", 4.2, 48, 81, 19400, "Severe circadian disruption from rotating night shifts & continuous VIP bandobast."),
        ("P-027", 1, 1, 1, 1, "declining", 4.1, 46, 84, 18200, "High adrenaline spikes and acute post-rescue sleep fragmentation."),
    ]

    for pid, syn, slp, hr, act, chip, a_slp, c_pct, rhr, stp, ins in health_samples:
        trends = [
            {"day": "Mon", "sleep_hours": round(a_slp + 0.4, 1), "steps": stp - 500, "rhr": rhr - 2},
            {"day": "Tue", "sleep_hours": round(a_slp - 0.2, 1), "steps": stp, "rhr": rhr},
            {"day": "Wed", "sleep_hours": round(a_slp + 0.1, 1), "steps": stp + 600, "rhr": rhr + 1},
            {"day": "Thu", "sleep_hours": round(a_slp - 0.5, 1), "steps": stp - 800, "rhr": rhr + 3},
            {"day": "Fri", "sleep_hours": round(a_slp - 0.3, 1), "steps": stp + 1200, "rhr": rhr + 2},
            {"day": "Sat", "sleep_hours": round(a_slp + 0.2, 1), "steps": stp - 200, "rhr": rhr},
            {"day": "Sun", "sleep_hours": round(a_slp - 0.1, 1), "steps": stp + 100, "rhr": rhr + 1}
        ]
        cursor.execute("""
            INSERT OR REPLACE INTO health_summaries (id, personnel_id, sync_enabled, share_sleep, share_heart_rate, share_activity, coarse_chip, avg_sleep_hours, sleep_consistency_pct, resting_heart_rate, daily_steps, historical_days_json, plain_language_insight, last_sync_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (f"HS-{pid}", pid, syn, slp, hr, act, chip, a_slp, c_pct, rhr, stp, json.dumps(trends), ins, now_iso))

    # 6. Cases with SLA Timers (Welfare Inbox)
    case_entries = [
        ("CASE-001", "P-001", "ongoing", "Critical", "commander_review_request",
         "Severe bereavement & prolonged 64-day active duty streak in Siachen",
         (now + timedelta(hours=1, minutes=45)).isoformat() + "Z"),

        ("CASE-002", "P-008", "ongoing", "Critical", "chatbot_escalation",
         "Chatbot trigger detected acute distress words; 78 consecutive days on active duty",
         (now + timedelta(hours=0, minutes=42)).isoformat() + "Z"),

        ("CASE-003", "P-016", "ongoing", "Critical", "commander_review_request",
         "CRPF CoBRA LWE operational stress & counter-ambush blast fatigue (68 days)",
         (now + timedelta(hours=1, minutes=20)).isoformat() + "Z"),

        ("CASE-004", "P-025", "ongoing", "Critical", "routine_screen",
         "State Police 16-hr riot bandobast fatigue; 72 continuous days & 48h weekly overtime",
         (now + timedelta(hours=2, minutes=0)).isoformat() + "Z"),

        ("CASE-005", "P-027", "ongoing", "Critical", "self_assessment_alert",
         "NDRF Disaster Rescue post-incident trauma following cyclone casualties",
         (now + timedelta(hours=1, minutes=10)).isoformat() + "Z"),

        ("CASE-006", "P-006", "ongoing", "Moderate", "routine_screen",
         "Civil court dispute concerning ancestral farmland causing sleep disturbance",
         (now + timedelta(hours=18)).isoformat() + "Z"),
    ]

    for cid, pid, st, pri, trig, summ, sla in case_entries:
        factors = [
            {"factor": "Operational deployment fatigue breached defensive tolerance threshold", "impact": "+26%", "category": "Operational Fatigue"},
            {"factor": "Chronic sleep deficit (<5.0 hrs/night over 7 days)", "impact": "+18%", "category": "Physiological Stress"},
            {"factor": "Critical life event / operational trauma recorded in verified remarks", "impact": "+24%", "category": "Life Event"}
        ]
        cursor.execute("""
            INSERT OR REPLACE INTO cases (id, personnel_id, status, priority, trigger_source, summary_minimal, explainable_factors_json, assigned_to, sla_deadline, is_dismissed_false_positive, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
        """, (cid, pid, st, pri, trig, summ, json.dumps(factors), "Capt. S. Sengupta (RMO)", sla, now_iso, now_iso))

    # 7. Counselling requests
    counselling_requests = [
        ("CR-001", "P-001", 0, "in_person", "Tomorrow 10:00 AM", "scheduled", "urgent", "Requested guidance regarding family affairs and bereavement coping.", "Capt. S. Sengupta"),
        ("CR-002", "P-016", 1, "voice_call", "Today 18:30 PM", "pending", "urgent", "Anonymous soldier check-in: experiencing intense flash recollections after jungle operation.", "Dr. Ananya Sen"),
        ("CR-003", "P-027", 1, "confidential_chat", "Tomorrow 14:00 PM", "pending", "urgent", "Anonymous rescue specialist: sleep fragmentation and hyper-arousal symptoms.", "Dr. Ananya Sen"),
    ]
    for crid, pid, anon, mode, slot, st, urg, nts, couns in counselling_requests:
        cursor.execute("""
            INSERT OR REPLACE INTO counselling_requests (id, personnel_id, is_anonymous, preferred_mode, preferred_slot, status, urgency, notes_encrypted, assigned_counsellor, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (crid, pid, anon, mode, slot, st, urg, encrypt_field(nts), couns, now_iso))

    conn.commit()
    conn.close()
    print("✓ Successfully seeded Multi-Force Defence, CAPF, State Police & NDRF database records.")

if __name__ == "__main__":
    seed_database(force_reseed=True)
