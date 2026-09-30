export type UserRole = 'admin' | 'commander' | 'welfare_officer' | 'counsellor' | 'personnel';

export type WelfareStatus = 'Normal' | 'Moderate' | 'Critical' | 'Suspected' | 'Unspecified';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  unit_id: string;
  unit_name?: string;
  force_category?: string;
  force_name?: string;
  description: string;
}

export interface Unit {
  id: string;
  name: string;
  parent_unit: string;
  location: string;
  strength: number;
  commanding_officer: string;
  force_category?: string;
  force_name?: string;
  badge_icon?: string;
  motto?: string;
  created_at: string;
}

export interface PersonnelSummary {
  id: string;
  tokenised_service_id: string;
  raw_service_id_masked: string;
  full_name: string;
  masked_name: string;
  display_name: string;
  service_id_display: string;
  rank: string;
  unit_id: string;
  unit_name: string;
  force_category?: string;
  force_name?: string;
  badge_icon?: string;
  motto?: string;
  role: string;
  observed_status: WelfareStatus;
  assessed_status: WelfareStatus;
  last_status_reason?: string;
  last_status_updated_by?: string;
  last_status_at?: string;
  leave_balance_days?: number;
  consecutive_duty_days?: number;
  shift_overtime_hours?: number;
  transfer_count_last_2yr?: number;
  training_commitments_days?: number;
  hazardous_duty_exposure?: string;
  fitness_grade?: string;
  coarse_chip?: 'stable' | 'declining' | 'unavailable';
  avg_sleep_hours?: number;
}

export interface HRMSRecord {
  id: string;
  personnel_id: string;
  tokenised_service_id: string;
  leave_balance_days: number;
  consecutive_duty_days: number;
  shift_overtime_hours: number;
  transfer_count_last_2yr: number;
  training_commitments_days?: number;
  hazardous_duty_exposure?: string;
  workload_recommendations?: string;
  last_leave_date?: string;
  fitness_grade: string;
  updated_at: string;
}

export interface WorkloadItem {
  id: string;
  personnel_id: string;
  personnel_name: string;
  unit_name: string;
  force_name?: string;
  type: 'DUTY_ROTATION' | 'SHIFT_CAPPING' | 'LEAVE_APPROVAL' | 'BUDDY_PAIR';
  title: string;
  urgency: 'Immediate' | 'High' | 'Medium' | 'Routine';
  metric_trigger: string;
  mitigation_plan: string;
  expected_reduction: string;
}

export interface WorkloadOverview {
  summary: {
    total_monitored: number;
    high_fatigue_cases: number;
    severe_overtime_cases: number;
    leave_backlog_cases: number;
    pending_mitigation_actions: number;
  };
  actionable_recommendations: WorkloadItem[];
}

export interface Remark {
  id: string;
  personnel_id: string;
  added_by_name: string;
  added_by_role: string;
  tags: string[];
  encrypted_text: string;
  decrypted_text?: string;
  visibility_level: 'commander_only' | 'shared_with_welfare';
  severity_proposed: 'Low' | 'Moderate' | 'High';
  severity_confirmed?: string;
  is_reviewed: number;
  expiry_date?: string;
  created_at: string;
}

export interface StatusHistoryItem {
  id: string;
  personnel_id: string;
  status_type: 'observed' | 'assessed';
  old_value: string;
  new_value: string;
  reason: string;
  changed_by: string;
  changed_by_role: string;
  created_at: string;
}

export interface HealthSummary {
  id?: string;
  personnel_id?: string;
  sync_enabled: boolean;
  share_sleep: boolean;
  share_heart_rate: boolean;
  share_activity: boolean;
  coarse_chip: 'stable' | 'declining' | 'unavailable';
  avg_sleep_hours: number;
  sleep_consistency_pct: number;
  resting_heart_rate: number;
  daily_steps: number;
  historical_days?: Array<{ day: string; sleep_hours: number; steps: number; rhr: number }>;
  plain_language_insight?: string;
  last_sync_at?: string;
  message?: string;
}

export interface ContributingFactor {
  factor: string;
  impact: string;
  category: string;
}

export interface RiskModelResult {
  overall_risk_score: number;
  suggested_priority: WelfareStatus;
  contributing_factors: ContributingFactor[];
  interpretability_model: string;
}

export interface PersonnelDetail {
  personnel: PersonnelSummary;
  hrms: HRMSRecord;
  status_history: StatusHistoryItem[];
  remarks: Remark[];
  health: HealthSummary;
  risk_model: RiskModelResult;
}

export interface WelfareCase {
  id: string;
  personnel_id: string;
  status: 'ongoing' | 'resolved' | 'escalated';
  priority: 'Normal' | 'Moderate' | 'Critical';
  trigger_source: string;
  summary_minimal: string;
  factors: ContributingFactor[];
  assigned_to?: string;
  sla_deadline?: string;
  sla_remaining_minutes?: number;
  is_overdue?: boolean;
  display_name: string;
  rank: string;
  unit_name: string;
  unit_id: string;
  created_at: string;
  updated_at: string;
}

export interface CounsellorNote {
  id: string;
  case_id: string;
  personnel_id: string;
  author_name: string;
  encrypted_note: string;
  decrypted_note?: string;
  clinical_outcome?: string;
  created_at: string;
}

export interface Referral {
  id: string;
  case_id: string;
  personnel_id: string;
  referred_by: string;
  referral_target: string;
  priority: string;
  notes_encrypted?: string;
  status: string;
  created_at: string;
}

export interface CounsellingRequest {
  id: string;
  personnel_id: string;
  is_anonymous: number | boolean;
  preferred_mode: string;
  preferred_slot: string;
  status: string;
  urgency: string;
  notes?: string;
  display_identity: string;
  rank?: string;
  unit_name?: string;
  assigned_counsellor?: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  actor_name: string;
  actor_role: string;
  action: string;
  target_resource: string;
  target_id?: string;
  ip_address: string;
  details: Record<string, any>;
  created_at: string;
}
