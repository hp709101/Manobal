import os
import secrets
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = os.environ.get("MANOBAL_DB_PATH", str(BASE_DIR / "manobal.db"))

# AES-256-GCM Key (32 bytes) - In production loaded from KMS / HashiCorp Vault
# Stored securely for persistent encryption during runtime
ENCRYPTION_KEY_HEX = os.environ.get(
    "MANOBAL_ENCRYPTION_KEY",
    "4a7f8e1b2c3d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f"
)
AES_KEY = bytes.fromhex(ENCRYPTION_KEY_HEX)

# Session Secret Key
SECRET_KEY = os.environ.get("MANOBAL_SECRET_KEY", "manobal-defense-secure-jwt-2026-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Privacy and Defense Standards
K_ANONYMITY_THRESHOLD = 3
SLA_HOURS_RED = 2
SLA_HOURS_AMBER = 24

# Emergency Helplines (Defence and Indian National Care)
HELPLINES = {
    "tele_manas": {
        "name": "Tele-MANAS (Govt of India)",
        "number": "14416",
        "toll_free": "1800-891-4416",
        "description": "24x7 Comprehensive Mental Health Helpline"
    },
    "kiran": {
        "name": "KIRAN Helpline (MSJE)",
        "number": "1800-599-0019",
        "description": "24x7 National Mental Health Rehabilitation"
    },
    "military_medical_emergency": {
        "name": "Unit Medical Aid Post / MH",
        "number": "112 / Internal 3333",
        "description": "Emergency Military Medical Officer Dispatch"
    }
}
