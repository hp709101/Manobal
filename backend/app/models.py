from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class StatusUpdateRequest(BaseModel):
    new_status: str = Field(..., description="Normal, Moderate, Critical, Suspected, Unspecified")
    reason: str = Field(..., min_length=3, description="Mandatory justification for status change")
    status_type: str = Field("observed", description="'observed' (commander/admin) or 'assessed' (counsellor)")

class RemarkCreateRequest(BaseModel):
    free_text: str = Field(..., min_length=3)
    tags: Optional[List[str]] = Field(default_factory=list)
    visibility_level: str = Field("shared_with_welfare", description="'commander_only' or 'shared_with_welfare'")
    expiry_date: Optional[str] = None

class RemarkConfirmRequest(BaseModel):
    confirmed_severity: str = Field(..., description="'Low', 'Moderate', 'High'")

class WelfareReviewRequest(BaseModel):
    reason: str = Field(..., min_length=3)
    priority: str = Field("Moderate", description="'Normal', 'Moderate', 'Critical'")

class HRMSUploadItem(BaseModel):
    service_id: str
    leave_balance_days: int = 30
    consecutive_duty_days: int = 0
    shift_overtime_hours: float = 0.0
    transfer_count_last_2yr: int = 0
    last_leave_date: Optional[str] = None
    fitness_grade: Optional[str] = "SHAPE-1"

class HRMSBulkUploadRequest(BaseModel):
    records: List[HRMSUploadItem]
    commit: bool = True

class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1)
    language: str = Field("en", description="'en' or 'hi'")
    session_id: Optional[str] = None

class ConsentEscalationRequest(BaseModel):
    session_id: str
    preferred_contact: Optional[str] = "Confidential Portal"
    notes: Optional[str] = None

class SelfAssessmentRequest(BaseModel):
    assessment_type: str = Field("PHQ-9", description="'PHQ-9', 'GAD-7', or 'Mil-Stress-Check'")
    answers: Dict[str, int] = Field(..., description="Mapping of question key to score (0-3)")

class CounsellingBookingRequest(BaseModel):
    is_anonymous: bool = False
    preferred_mode: str = Field("in_person", description="'in_person', 'voice_call', 'confidential_chat'")
    preferred_slot: str = "Tomorrow Morning 1000h"
    urgency: str = Field("routine", description="'routine', 'urgent', 'crisis'")
    notes: Optional[str] = None

class CounsellorNoteRequest(BaseModel):
    note_text: str = Field(..., min_length=3)
    clinical_outcome: Optional[str] = "Ongoing Support"

class ReferralRequest(BaseModel):
    referral_target: str = Field(..., description="'Base Medical Officer', 'Command Military Hospital', etc.")
    priority: str = Field("Urgent", description="'Routine', 'Urgent', 'Emergency'")
    notes: Optional[str] = None

class DismissFalsePositiveRequest(BaseModel):
    dismissal_reason: str = Field(..., min_length=5, description="Clinical reason for marking false positive")

class CaseHandoverRequest(BaseModel):
    to_counsellor: str
    handover_reason: str = Field(..., min_length=5)

class HealthSyncToggleRequest(BaseModel):
    sync_enabled: bool
    share_sleep: bool = False
    share_heart_rate: bool = False
    share_activity: bool = False

class JournalEntryRequest(BaseModel):
    mood: Optional[str] = "neutral"
    content: str = Field(..., min_length=1)
