import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.config import DB_PATH

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA busy_timeout = 30000;")
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Units
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS units (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        parent_unit TEXT,
        location TEXT NOT NULL,
        strength INTEGER DEFAULT 0,
        commanding_officer TEXT NOT NULL,
        force_category TEXT DEFAULT 'Armed Forces',
        force_name TEXT DEFAULT 'Indian Army',
        badge_icon TEXT DEFAULT 'Shield',
        motto TEXT DEFAULT 'Service Before Self',
        created_at TEXT NOT NULL
    );
    """)

    # 2. Personnel
    # Note: tokenised_service_id is hashed join key; raw_service_id is kept masked
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS personnel (
        id TEXT PRIMARY KEY,
        tokenised_service_id TEXT UNIQUE NOT NULL,
        raw_service_id_masked TEXT NOT NULL,
        full_name TEXT NOT NULL,
        masked_name TEXT NOT NULL,
        rank TEXT NOT NULL,
        unit_id TEXT NOT NULL,
        role TEXT DEFAULT 'personnel',
        observed_status TEXT DEFAULT 'Unspecified',
        assessed_status TEXT DEFAULT 'Unspecified',
        last_status_reason TEXT,
        last_status_updated_by TEXT,
        last_status_at TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
    );
    """)

    # 3. HRMS records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hrms_records (
        id TEXT PRIMARY KEY,
        personnel_id TEXT UNIQUE NOT NULL,
        tokenised_service_id TEXT NOT NULL,
        leave_balance_days INTEGER DEFAULT 30,
        consecutive_duty_days INTEGER DEFAULT 0,
        shift_overtime_hours REAL DEFAULT 0.0,
        transfer_count_last_2yr INTEGER DEFAULT 0,
        training_commitments_days INTEGER DEFAULT 0,
        hazardous_duty_exposure TEXT DEFAULT 'Standard',
        workload_recommendations TEXT DEFAULT '[]',
        last_leave_date TEXT,
        fitness_grade TEXT DEFAULT 'SHAPE-1',
        updated_at TEXT NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
    """)

    # Safe column migrations for existing databases
    for migration in [
        "ALTER TABLE units ADD COLUMN force_category TEXT DEFAULT 'Armed Forces';",
        "ALTER TABLE units ADD COLUMN force_name TEXT DEFAULT 'Indian Army';",
        "ALTER TABLE units ADD COLUMN badge_icon TEXT DEFAULT 'Shield';",
        "ALTER TABLE units ADD COLUMN motto TEXT DEFAULT 'Service Before Self';",
        "ALTER TABLE hrms_records ADD COLUMN training_commitments_days INTEGER DEFAULT 0;",
        "ALTER TABLE hrms_records ADD COLUMN hazardous_duty_exposure TEXT DEFAULT 'Standard';",
        "ALTER TABLE hrms_records ADD COLUMN workload_recommendations TEXT DEFAULT '[]';",
    ]:
        try:
            cursor.execute(migration)
        except Exception:
            pass

    # 4. Remarks (with tags, encrypted free-text, visibility level, expiry, severity)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS remarks (
        id TEXT PRIMARY KEY,
        personnel_id TEXT NOT NULL,
        added_by_name TEXT NOT NULL,
        added_by_role TEXT NOT NULL,
        tags TEXT NOT NULL, -- JSON array of tags e.g. ["bereavement", "financial_strain"]
        encrypted_text TEXT NOT NULL,
        visibility_level TEXT DEFAULT 'shared_with_welfare', -- 'commander_only' or 'shared_with_welfare'
        severity_proposed TEXT DEFAULT 'Low', -- 'Low', 'Moderate', 'High'
        severity_confirmed TEXT, -- Confirmed by welfare/commander
        is_reviewed INTEGER DEFAULT 0,
        expiry_date TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
    """)

    # 5. Status history (audit of every status change)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS status_history (
        id TEXT PRIMARY KEY,
        personnel_id TEXT NOT NULL,
        status_type TEXT NOT NULL, -- 'observed' or 'assessed'
        old_value TEXT,
        new_value TEXT NOT NULL,
        reason TEXT NOT NULL,
        changed_by TEXT NOT NULL,
        changed_by_role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
    """)

    # 6. Health Tracker Summaries (Daily aggregates, granular consent toggles)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS health_summaries (
        id TEXT PRIMARY KEY,
        personnel_id TEXT UNIQUE NOT NULL,
        sync_enabled INTEGER DEFAULT 0,
        share_sleep INTEGER DEFAULT 0,
        share_heart_rate INTEGER DEFAULT 0,
        share_activity INTEGER DEFAULT 0,
        coarse_chip TEXT DEFAULT 'unavailable', -- 'stable', 'declining', 'unavailable'
        avg_sleep_hours REAL DEFAULT 0.0,
        sleep_consistency_pct INTEGER DEFAULT 0,
        resting_heart_rate INTEGER DEFAULT 0,
        daily_steps INTEGER DEFAULT 0,
        historical_days_json TEXT, -- 7-day trend array
        plain_language_insight TEXT,
        last_sync_at TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
    """)

    # 7. Chat sessions & Triage
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        personnel_id TEXT NOT NULL,
        current_tier TEXT DEFAULT 'Green', -- 'Green', 'Amber', 'Red'
        encrypted_transcript TEXT, -- AES encrypted JSON list of messages
        is_escalated INTEGER DEFAULT 0,
        consent_to_share_with_welfare INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
    """)

    # 8. Routine Self-Assessments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS self_assessments (
        id TEXT PRIMARY KEY,
        personnel_id TEXT NOT NULL,
        assessment_type TEXT NOT NULL, -- 'PHQ-9', 'GAD-7', 'Mil-Stress-Check'
        score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        risk_level TEXT NOT NULL, -- 'Mild', 'Moderate', 'Severe'
        encrypted_answers TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
    """)

    # 9. Counselling Requests & Scheduling
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS counselling_requests (
        id TEXT PRIMARY KEY,
        personnel_id TEXT NOT NULL,
        is_anonymous INTEGER DEFAULT 0,
        preferred_mode TEXT DEFAULT 'in_person', -- 'in_person', 'voice_call', 'confidential_chat'
        preferred_slot TEXT,
        status TEXT DEFAULT 'pending', -- 'pending', 'scheduled', 'completed', 'cancelled'
        urgency TEXT DEFAULT 'routine', -- 'routine', 'urgent', 'crisis'
        notes_encrypted TEXT,
        assigned_counsellor TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
    """)

    # 10. Cases & Alerts (Welfare officer inbox)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        personnel_id TEXT NOT NULL,
        status TEXT DEFAULT 'ongoing', -- 'ongoing', 'resolved', 'escalated'
        priority TEXT DEFAULT 'Moderate', -- 'Normal', 'Moderate', 'Critical'
        trigger_source TEXT NOT NULL, -- 'chatbot_escalation', 'commander_review_request', 'self_assessment_alert', 'routine_screen'
        summary_minimal TEXT NOT NULL, -- Minimal alert description
        explainable_factors_json TEXT, -- Plain-language SHAP-style reasons
        assigned_to TEXT,
        sla_deadline TEXT,
        is_dismissed_false_positive INTEGER DEFAULT 0,
        dismissal_reason TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
    """)

    # 11. Confidential Counsellor Notes (Strictly accessible only by Counsellor/Welfare)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS counsellor_notes (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        personnel_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        encrypted_note TEXT NOT NULL,
        clinical_outcome TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
    """)

    # 12. Medical / Specialist Referrals
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS referrals (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        personnel_id TEXT NOT NULL,
        referred_by TEXT NOT NULL,
        referral_target TEXT NOT NULL, -- 'Base Medical Officer', 'Command Military Hospital', 'Psychiatrist Specialist'
        priority TEXT DEFAULT 'Urgent',
        notes_encrypted TEXT,
        status TEXT DEFAULT 'pending', -- 'pending', 'acknowledged', 'discharged'
        created_at TEXT NOT NULL,
        FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );
    """)

    # 13. Case Handovers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS case_handovers (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        from_counsellor TEXT NOT NULL,
        to_counsellor TEXT NOT NULL,
        handover_reason TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );
    """)

    # 14. Private Journal (Kept client-side / encrypted server mirror if requested)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        personnel_id TEXT NOT NULL,
        mood TEXT,
        encrypted_content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
    """)

    # 15. Append-Only Tamper-Evident Audit Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_name TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        action TEXT NOT NULL, -- 'VIEW_RECORD', 'UPDATE_STATUS', 'ADD_REMARK', 'EXPORT_REPORT', 'BREAK_GLASS', etc.
        target_resource TEXT NOT NULL,
        target_id TEXT,
        ip_address TEXT DEFAULT '127.0.0.1',
        details_json TEXT,
        created_at TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

def log_audit(actor_name: str, actor_role: str, action: str, target_resource: str, target_id: Optional[str] = None, details: Optional[Dict[str, Any]] = None, ip_address: str = "127.0.0.1", conn: Optional[sqlite3.Connection] = None):
    """Appends an immutable audit log entry."""
    close_after = False
    try:
        if conn is None:
            conn = get_db()
            close_after = True
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO audit_logs (actor_name, actor_role, action, target_resource, target_id, ip_address, details_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            actor_name,
            actor_role,
            action,
            target_resource,
            target_id,
            ip_address,
            json.dumps(details or {}),
            datetime.utcnow().isoformat() + "Z"
        ))
        if close_after:
            conn.commit()
    except Exception as e:
        print(f"Error logging audit trail: {e}")
    finally:
        if close_after and conn:
            conn.close()
