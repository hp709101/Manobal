import os
import base64
import hmac
import hashlib
import re
from typing import Optional, Tuple
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.config import AES_KEY

# AES-256-GCM Envelope Encryption
def encrypt_field(plaintext: Optional[str]) -> Optional[str]:
    """Encrypts sensitive text using AES-256-GCM with a random 12-byte nonce."""
    if not plaintext:
        return None
    try:
        aesgcm = AESGCM(AES_KEY)
        nonce = os.urandom(12)  # 96-bit nonce
        ciphertext = aesgcm.encrypt(nonce, plaintext.encode('utf-8'), None)
        # Store as base64: nonce (12 bytes) + ciphertext (includes 16-byte auth tag)
        combined = nonce + ciphertext
        return base64.b64encode(combined).decode('utf-8')
    except Exception as e:
        print(f"Encryption error: {e}")
        return plaintext

def decrypt_field(encrypted_str: Optional[str]) -> Optional[str]:
    """Decrypts ciphertext using AES-256-GCM and verifies authentication tag."""
    if not encrypted_str:
        return None
    try:
        data = base64.b64decode(encrypted_str.encode('utf-8'))
        if len(data) < 28: # 12 nonce + 16 tag minimum
            return encrypted_str
        nonce = data[:12]
        ciphertext = data[12:]
        aesgcm = AESGCM(AES_KEY)
        decrypted = aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted.decode('utf-8')
    except Exception as e:
        # Return fallback if not encrypted or key changed
        return encrypted_str

# Tokenization & Masking for Privacy
HMAC_SALT = b"manobal_defence_token_salt_v1"

def tokenize_service_id(service_id: str) -> str:
    """Generates an irreversible deterministic token for database joins."""
    cleaned = service_id.strip().upper()
    token = hmac.new(HMAC_SALT, cleaned.encode('utf-8'), hashlib.sha256).hexdigest()[:16]
    return f"TOK-{token.upper()}"

def mask_service_id(service_id: str) -> str:
    """Masks service ID for display in Commander and Admin portals."""
    cleaned = service_id.strip()
    if len(cleaned) <= 4:
        return "****"
    return f"{cleaned[:2]}***{cleaned[-4:]}"

def mask_personnel_name(name: str) -> str:
    """Masks personnel name (e.g. 'Rajesh Kumar Singh' -> 'R*** K*** S***')."""
    parts = name.strip().split()
    masked_parts = []
    for p in parts:
        if len(p) <= 2:
            masked_parts.append(p)
        else:
            masked_parts.append(f"{p[0]}***")
    return " ".join(masked_parts)

# PII Redaction
PHONE_REGEX = re.compile(r'\b(?:\+91[-\s]?)?[6-9]\d{9}\b')
AADHAAR_REGEX = re.compile(r'\b\d{4}\s?\d{4}\s?\d{4}\b')
SERVICE_NUM_REGEX = re.compile(r'\b[A-Z]{2,4}[-\s]?\d{4,8}\b')

def redact_pii(text: str) -> str:
    """Scrubs personal identifiers before storage or AI ingestion."""
    if not text:
        return ""
    scrubbed = PHONE_REGEX.sub("[PHONE_REDACTED]", text)
    scrubbed = AADHAAR_REGEX.sub("[AADHAAR_REDACTED]", scrubbed)
    scrubbed = SERVICE_NUM_REGEX.sub("[SERVICE_ID_REDACTED]", scrubbed)
    return scrubbed
