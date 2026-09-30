import React, { useEffect, useState } from 'react';
import { Unit, PersonnelSummary } from '../../types';
import { api } from '../../services/api';
import { UnitGroupCards } from './UnitGroupCards';
import { PersonnelTable } from './PersonnelTable';
import { PersonnelDetailModal } from './PersonnelDetailModal';
import { StatusUpdateModal } from './StatusUpdateModal';
import { AddRemarkModal } from './AddRemarkModal';
import { BulkHRMSModal } from './BulkHRMSModal';
import { UnitAnalyticsModal } from './UnitAnalyticsModal';
import { WorkloadBalancingView } from './WorkloadBalancingView';
import {
  Users, Search, Filter, UploadCloud, BarChart3,
  RefreshCw, CheckCircle, Shield, Scale
} from 'lucide-react';
import { scrollToTop } from '../../utils/scroll';

interface Dashboard1ViewProps {
  currentUserRole: string;
  activeMobileTab?: string;
  setActiveMobileTab?: (tab: string) => void;
  isMobileFrame?: boolean;
}

export const Dashboard1View: React.FC<Dashboard1ViewProps> = ({ currentUserRole, activeMobileTab, setActiveMobileTab, isMobileFrame }) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'workload'>('roster');
  const [selectedForce, setSelectedForce] = useState<string>('ALL');
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('ALL');
  const [personnel, setPersonnel] = useState<PersonnelSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    scrollToTop();
  }, [activeTab]);

  useEffect(() => {
    if (activeMobileTab === 'workload') {
      setActiveTab('workload');
    } else if (activeMobileTab === 'roster') {
      setActiveTab('roster');
    } else if (activeMobileTab === 'analytics') {
      setAnalyticsUnitId('ALL');
    }
  }, [activeMobileTab]);

  // Modals state
  const [detailPersonnelId, setDetailPersonnelId] = useState<string | null>(null);
  const [statusUpdatePersonnel, setStatusUpdatePersonnel] = useState<PersonnelSummary | null>(null);
  const [addRemarkPersonnel, setAddRemarkPersonnel] = useState<PersonnelSummary | null>(null);
  const [isBulkHRMSOpen, setIsBulkHRMSOpen] = useState(false);
  const [analyticsUnitId, setAnalyticsUnitId] = useState<string | null>(null);

  // Success alert
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadUnits();
  }, [currentUserRole, selectedForce]);

  useEffect(() => {
    loadPersonnel();
  }, [selectedUnitId, statusFilter, searchQuery, currentUserRole, selectedForce]);

  const loadUnits = async () => {
    try {
      const data = await api.getUnits(selectedForce);
      setUnits(data);
      if (currentUserRole === 'commander' && data.length > 0) {
        setSelectedUnitId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadPersonnel = async () => {
    setLoading(true);
    try {
      const data = await api.getPersonnel({
        unit_id: selectedUnitId === 'ALL' ? undefined : selectedUnitId,
        status_filter: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchQuery.trim() || undefined,
        force_category: selectedForce === 'ALL' ? undefined : selectedForce,
      });
      setPersonnel(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRequestWelfare = async (p: PersonnelSummary) => {
    const reason = prompt(`Reason for routing ${p.display_name} to Welfare Officer queue:`, 'Prolonged high duty fatigue and noticeable withdrawal');
    if (!reason) return;

    try {
      await api.requestWelfareReview(p.id, { reason, priority: 'Moderate' });
      showNotification(`Successfully routed ${p.display_name} to Welfare Officer queue.`);
      loadPersonnel();
    } catch (e: any) {
      alert(e.message || 'Failed to request welfare review');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className={`bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col ${isMobileFrame ? 'gap-3' : 'md:flex-row md:items-center md:justify-between gap-3'}`}>
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-col gap-1">
            <span className="self-start text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
              Dashboard 1 · Operational Command
            </span>
            <h1 className="text-base sm:text-xl font-black text-slate-900 leading-snug break-words">
              Formation Commander & Unit Welfare Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed break-words">
            Manage unit groupings, observed welfare levels, encrypted remarks, and automated workload balancing.
          </p>
        </div>

        {/* Global actions */}
        <div className={`flex flex-wrap items-center gap-2 ${isMobileFrame ? 'w-full' : 'sm:w-auto'} shrink-0`}>
          {currentUserRole === 'admin' && (
            <button
              onClick={() => setIsBulkHRMSOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all text-center"
            >
              <UploadCloud className="w-4 h-4 shrink-0" />
              <span className="truncate">Bulk HRMS Import</span>
            </button>
          )}

          <button
            onClick={() => setAnalyticsUnitId(selectedUnitId === 'ALL' && units.length > 0 ? units[0].id : selectedUnitId)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm text-center"
          >
            <BarChart3 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Unit Analytics</span>
          </button>
        </div>
      </div>

      {/* Force Filter & Sub-View Switcher Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shadow-sm">
        {/* Sub-tab view buttons */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'roster'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              <span className="inline sm:hidden">Roster</span>
              <span className="hidden sm:inline">Unit Formations & Roster</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('workload')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'workload'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              <span className="inline sm:hidden">Workload & R&R</span>
              <span className="hidden sm:inline">Workload Balancer & R&R</span>
            </span>
          </button>
        </div>

        {/* Force Category Dropdown */}
        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-semibold text-slate-600">
          <span className="shrink-0">Branch:</span>
          <select
            value={selectedForce}
            onChange={(e) => setSelectedForce(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">🇮🇳 All Uniformed Forces</option>
            <option value="Armed Forces">🛡️ Indian Armed Forces</option>
            <option value="CAPFs">⚔️ Central Armed Police (CAPFs)</option>
            <option value="State Police">🚓 State Police</option>
            <option value="Disaster Response">🌊 Disaster Response (NDRF)</option>
          </select>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Conditionally Render Workload Balancing vs Roster */}
      {activeTab === 'workload' ? (
        <WorkloadBalancingView
          unitId={selectedUnitId === 'ALL' ? undefined : selectedUnitId}
          forceCategory={selectedForce}
          isMobileFrame={isMobileFrame}
        />
      ) : (
        <>
          {/* Feature 1: Unit Group Cards */}
          <UnitGroupCards
            units={units}
            selectedUnitId={selectedUnitId}
            onSelectUnit={setSelectedUnitId}
            currentUserRole={currentUserRole}
            isMobileFrame={isMobileFrame}
          />

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by masked name, service ID, or rank..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-1 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-initial bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2 py-1 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Critical">Critical</option>
              <option value="Moderate">Moderate</option>
              <option value="Suspected">Suspected</option>
              <option value="Normal">Normal</option>
              <option value="Unspecified">Unspecified</option>
            </select>
          </div>
        </div>

        <button
          onClick={loadPersonnel}
          className="flex items-center justify-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors shrink-0"
          title="Refresh List"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Feature 2, 4, 9, 12, 17: Personnel Table */}
      <PersonnelTable
        personnel={personnel}
        onSelectPersonnel={(id) => setDetailPersonnelId(id)}
        onUpdateStatus={(p) => setStatusUpdatePersonnel(p)}
        onAddRemark={(p) => setAddRemarkPersonnel(p)}
        onRequestWelfare={handleRequestWelfare}
        isMobileFrame={isMobileFrame}
      />
      </>
      )}

      {/* Modals */}
      <PersonnelDetailModal
        personnelId={detailPersonnelId}
        onClose={() => setDetailPersonnelId(null)}
        onRefresh={loadPersonnel}
        currentUserRole={currentUserRole}
      />

      <StatusUpdateModal
        personnel={statusUpdatePersonnel}
        onClose={() => setStatusUpdatePersonnel(null)}
        onSuccess={() => {
          showNotification('Welfare status successfully updated and recorded in audit log.');
          loadPersonnel();
        }}
        currentUserRole={currentUserRole}
      />

      <AddRemarkModal
        personnel={addRemarkPersonnel}
        onClose={() => setAddRemarkPersonnel(null)}
        onSuccess={() => {
          showNotification('Remark securely recorded with AES-256-GCM encryption.');
          loadPersonnel();
        }}
      />

      <BulkHRMSModal
        isOpen={isBulkHRMSOpen}
        onClose={() => setIsBulkHRMSOpen(false)}
        onSuccess={() => {
          showNotification('Bulk HRMS records committed and matched against tokenized service IDs.');
          loadPersonnel();
        }}
      />

      <UnitAnalyticsModal
        unitId={analyticsUnitId}
        onClose={() => setAnalyticsUnitId(null)}
      />
    </div>
  );
};
