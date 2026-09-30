import {
  UserProfile, Unit, PersonnelSummary, PersonnelDetail,
  WelfareCase, CounsellingRequest, AuditLog
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8001/api';

let activeRoleKey = 'commander_u1';

export const setClientActiveRole = (roleKey: string) => {
  activeRoleKey = roleKey;
};

export const getClientActiveRole = () => activeRoleKey;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'x-manobal-role': activeRoleKey,
});

export const api = {
  // Auth & Roles
  async login(payload: {
    auth_type: 'credential' | 'biometric' | 'persona' | 'anonymous' | 'otp';
    role_key?: string;
    service_id?: string;
    passcode?: string;
    force_category?: string;
  }): Promise<{ status: string; token: string; user: UserProfile; auth_type: string; message: string }> {
    if (payload.role_key) {
      activeRoleKey = payload.role_key;
    }
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.user?.id) {
      if (payload.role_key) activeRoleKey = payload.role_key;
    }
    return data;
  },

  async getRoles(): Promise<{ current_user_key: string; available_roles: Record<string, UserProfile> }> {
    const res = await fetch(`${API_BASE}/auth/roles`);
    return res.json();
  },

  async switchRole(roleKey: string): Promise<{ user: UserProfile }> {
    activeRoleKey = roleKey;
    const res = await fetch(`${API_BASE}/auth/switch-role/${roleKey}`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return res.json();
  },

  async getCurrentUser(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
    return res.json();
  },

  // Units
  async getUnits(forceCategory?: string): Promise<Unit[]> {
    const query = new URLSearchParams();
    if (forceCategory && forceCategory !== 'ALL') query.append('force_category', forceCategory);
    const res = await fetch(`${API_BASE}/units?${query.toString()}`, { headers: authHeaders() });
    return res.json();
  },

  async getUnitAnalytics(unitId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/unit/${unitId}`, { headers: authHeaders() });
    return res.json();
  },

  // Workload Balancing Engine
  async getWorkloadOverview(params?: { unit_id?: string; force_category?: string }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.unit_id) query.append('unit_id', params.unit_id);
    if (params?.force_category && params.force_category !== 'ALL') query.append('force_category', params.force_category);
    const res = await fetch(`${API_BASE}/workload/overview?${query.toString()}`, { headers: authHeaders() });
    return res.json();
  },

  async approveWorkloadAction(payload: { personnel_id: string; action_type: string; action_id?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/workload/approve-action`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Personnel
  async getPersonnel(params?: { unit_id?: string; status_filter?: string; search?: string; force_category?: string }): Promise<PersonnelSummary[]> {
    const query = new URLSearchParams();
    if (params?.unit_id) query.append('unit_id', params.unit_id);
    if (params?.status_filter) query.append('status_filter', params.status_filter);
    if (params?.search) query.append('search', params.search);
    if (params?.force_category && params.force_category !== 'ALL') query.append('force_category', params.force_category);

    const res = await fetch(`${API_BASE}/personnel?${query.toString()}`, { headers: authHeaders() });
    return res.json();
  },

  async getPersonnelDetail(id: string): Promise<PersonnelDetail> {
    const res = await fetch(`${API_BASE}/personnel/${id}`, { headers: authHeaders() });
    return res.json();
  },

  async updateStatus(personnelId: string, payload: { new_status: string; reason: string; status_type?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/personnel/${personnelId}/status`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to update status');
    }
    return res.json();
  },

  async addRemark(personnelId: string, payload: { free_text: string; tags: string[]; visibility_level: string; expiry_date?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/personnel/${personnelId}/remarks`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to add remark');
    }
    return res.json();
  },

  async confirmRemarkSeverity(remarkId: string, severity: string): Promise<any> {
    const res = await fetch(`${API_BASE}/remarks/${remarkId}/confirm`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ confirmed_severity: severity }),
    });
    return res.json();
  },

  async requestWelfareReview(personnelId: string, payload: { reason: string; priority: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/personnel/${personnelId}/request-welfare`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async bulkUploadHRMS(records: any[], commit: boolean = true): Promise<any> {
    const res = await fetch(`${API_BASE}/hrms/bulk-upload`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ records, commit }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'HRMS Bulk upload failed');
    }
    return res.json();
  },

  // Welfare Dashboard
  async getWelfareAlerts(): Promise<WelfareCase[]> {
    const res = await fetch(`${API_BASE}/welfare/alerts`, { headers: authHeaders() });
    return res.json();
  },

  async getCaseDetail(caseId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/welfare/cases/${caseId}`, { headers: authHeaders() });
    return res.json();
  },

  async addCounsellorNote(caseId: string, payload: { note_text: string; clinical_outcome?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/welfare/cases/${caseId}/notes`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async referCase(caseId: string, payload: { referral_target: string; priority: string; notes?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/welfare/cases/${caseId}/refer`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async dismissCase(caseId: string, reason: string): Promise<any> {
    const res = await fetch(`${API_BASE}/welfare/cases/${caseId}/dismiss`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ dismissal_reason: reason }),
    });
    return res.json();
  },

  async handoverCase(caseId: string, payload: { to_counsellor: string; handover_reason: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/welfare/cases/${caseId}/handover`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getCounsellingRequests(): Promise<CounsellingRequest[]> {
    const res = await fetch(`${API_BASE}/welfare/counselling-requests`, { headers: authHeaders() });
    return res.json();
  },

  async getWelfareTemplates(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/welfare/templates`, { headers: authHeaders() });
    return res.json();
  },

  async getWelfareAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/welfare/anonymised-analytics`, { headers: authHeaders() });
    return res.json();
  },

  // Personnel Portal
  async getPortalProfile(): Promise<any> {
    const res = await fetch(`${API_BASE}/portal/profile`, { headers: authHeaders() });
    return res.json();
  },

  async sendChatMessage(payload: { message: string; language: string; session_id?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/portal/chat`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async consentAmberEscalation(sessionId: string, contactMode?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/portal/chat/escalate-consent`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ session_id: sessionId, preferred_contact: contactMode || 'Confidential Chat' }),
    });
    return res.json();
  },

  async submitAssessment(payload: { assessment_type: string; answers: Record<string, number> }): Promise<any> {
    const res = await fetch(`${API_BASE}/portal/assessment`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async bookCounsellor(payload: { is_anonymous: boolean; preferred_mode: string; preferred_slot: string; urgency: string; notes?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/portal/book-counsellor`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async updateHealthSync(payload: { sync_enabled: boolean; share_sleep: boolean; share_heart_rate: boolean; share_activity: boolean }): Promise<any> {
    const res = await fetch(`${API_BASE}/portal/health-sync`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async purgeHealthData(): Promise<any> {
    const res = await fetch(`${API_BASE}/portal/health-sync/purge`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return res.json();
  },

  async getJournal(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/portal/journal`, { headers: authHeaders() });
    return res.json();
  },

  async addJournal(payload: { mood: string; content: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/portal/journal`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Security, Audit, Export
  async getAuditLogs(search?: string, limit: number = 50): Promise<AuditLog[]> {
    const q = new URLSearchParams();
    if (search) q.append('search', search);
    q.append('limit', limit.toString());
    const res = await fetch(`${API_BASE}/audit/logs?${q.toString()}`, { headers: authHeaders() });
    return res.json();
  },

  async generateWatermarkedExport(type: string = 'unit_summary'): Promise<any> {
    const res = await fetch(`${API_BASE}/export/watermarked?export_type=${type}`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return res.json();
  },

  async getComplianceStatus(): Promise<any> {
    const res = await fetch(`${API_BASE}/security/compliance-status`, { headers: authHeaders() });
    return res.json();
  },
};
