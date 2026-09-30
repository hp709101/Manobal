import React from 'react';
import { PersonnelSummary, WelfareStatus } from '../../types';
import { UserCheck, MessageSquarePlus, Send, Eye } from 'lucide-react';

interface PersonnelTableProps {
  personnel: PersonnelSummary[];
  onSelectPersonnel: (id: string) => void;
  onUpdateStatus: (personnel: PersonnelSummary) => void;
  onAddRemark: (personnel: PersonnelSummary) => void;
  onRequestWelfare: (personnel: PersonnelSummary) => void;
  isMobileFrame?: boolean;
}

const statusBadgeClasses: Record<WelfareStatus, string> = {
  Normal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Moderate: 'bg-amber-50 text-amber-800 border-amber-200',
  Critical: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse',
  Suspected: 'bg-purple-50 text-purple-700 border-purple-200',
  Unspecified: 'bg-slate-100 text-slate-600 border-slate-200',
};

const coarseChipClasses = {
  stable: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  declining: 'bg-rose-50 text-rose-700 border-rose-200',
  unavailable: 'bg-slate-100 text-slate-500 border-slate-200',
};

export const PersonnelTable: React.FC<PersonnelTableProps> = ({
  personnel,
  onSelectPersonnel,
  onUpdateStatus,
  onAddRemark,
  onRequestWelfare,
  isMobileFrame,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* MOBILE VIEW: Native touch cards with zero horizontal scroll */}
      <div className={isMobileFrame ? 'block divide-y divide-slate-100' : 'block sm:hidden divide-y divide-slate-100'}>
        {personnel.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs">
            No personnel matching current filters.
          </div>
        ) : (
          personnel.map((p) => {
            const isHighStreak = (p.consecutive_duty_days ?? 0) >= 45;
            return (
              <div
                key={p.id}
                className="p-3.5 space-y-3 hover:bg-slate-50/80 transition-colors"
              >
                {/* Header: Name, Rank, Protected ID */}
                <div
                  className="flex items-start justify-between gap-2 cursor-pointer"
                  onClick={() => onSelectPersonnel(p.id)}
                >
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 text-xs truncate">
                      {p.display_name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {p.rank} · {p.fitness_grade || 'SHAPE-1'}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold truncate mt-0.5">
                      {p.unit_name} · <span className="font-normal text-slate-500">{p.force_name || 'Armed Forces'}</span>
                    </div>
                  </div>

                  <span className="shrink-0 font-mono text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                    {p.service_id_display}
                  </span>
                </div>

                {/* Status Badges Row */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      Observed Status
                    </div>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          statusBadgeClasses[p.observed_status] || statusBadgeClasses.Unspecified
                        }`}
                      >
                        {p.observed_status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      Assessed (Clinical)
                    </div>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          statusBadgeClasses[p.assessed_status] || statusBadgeClasses.Unspecified
                        }`}
                      >
                        {p.assessed_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Trend & Duty Stats Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-600">
                  {/* Coarse Trend Chip */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                      coarseChipClasses[p.coarse_chip || 'unavailable']
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        p.coarse_chip === 'stable'
                          ? 'bg-emerald-600'
                          : p.coarse_chip === 'declining'
                          ? 'bg-rose-600 animate-ping'
                          : 'bg-slate-400'
                      }`}
                    />
                    {p.coarse_chip === 'stable' && 'Trend: Stable'}
                    {p.coarse_chip === 'declining' && 'Trend: Declining'}
                    {(!p.coarse_chip || p.coarse_chip === 'unavailable') && 'Unavailable'}
                  </span>

                  {/* HRMS Streak */}
                  <div className="flex items-center gap-2 text-[10px] shrink-0">
                    <span>Streak: <strong className="text-slate-900">{p.consecutive_duty_days ?? 0}d</strong></span>
                    <span>Leave: <strong className="text-slate-900">{p.leave_balance_days ?? 30}d</strong></span>
                  </div>
                </div>

                {isHighStreak && (
                  <div className="px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold rounded-xl flex items-center justify-between gap-1.5 flex-wrap">
                    <span className="truncate">⚠️ Consecutive Duty Alert (&gt;45 days)</span>
                    <span className="uppercase text-[9px] bg-rose-200/90 text-rose-900 px-1.5 py-0.5 rounded font-black shrink-0">R&R Due</span>
                  </div>
                )}

                {/* Action Buttons Grid */}
                <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onSelectPersonnel(p.id)}
                    className="flex flex-col items-center justify-center py-1.5 px-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-[10px] font-semibold gap-0.5 min-w-0"
                    title="View Profile Details"
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate w-full text-center">View</span>
                  </button>

                  <button
                    onClick={() => onUpdateStatus(p)}
                    className="flex flex-col items-center justify-center py-1.5 px-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-colors text-[10px] font-semibold gap-0.5 border border-emerald-200 min-w-0"
                    title="Set Observed Welfare Status"
                  >
                    <UserCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate w-full text-center">Observe</span>
                  </button>

                  <button
                    onClick={() => onAddRemark(p)}
                    className="flex flex-col items-center justify-center py-1.5 px-0.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl transition-colors text-[10px] font-semibold gap-0.5 border border-sky-200 min-w-0"
                    title="Add Confidential Encrypted Remark"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate w-full text-center">Remark</span>
                  </button>

                  <button
                    onClick={() => onRequestWelfare(p)}
                    className="flex flex-col items-center justify-center py-1.5 px-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl transition-colors text-[10px] font-semibold gap-0.5 border border-amber-200 min-w-0"
                    title="Refer to RMO & Welfare Officer"
                  >
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate w-full text-center">Refer</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP / TABLET VIEW: Full 8-column table with horizontal scroll */}
      {!isMobileFrame && (
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <th className="py-3.5 px-4">Soldier / Officer (Masked)</th>
              <th className="py-3.5 px-4">Protected ID</th>
              <th className="py-3.5 px-4">Formation</th>
              <th className="py-3.5 px-4">
                <div className="flex flex-col">
                  <span>Observed Status</span>
                  <span className="text-[9px] text-slate-400 font-normal">Chain of Command</span>
                </div>
              </th>
              <th className="py-3.5 px-4">
                <div className="flex flex-col">
                  <span>Assessed Status</span>
                  <span className="text-[9px] text-slate-400 font-normal">Counsellor Only</span>
                </div>
              </th>
              <th className="py-3.5 px-4">
                <div className="flex flex-col">
                  <span>Health Trend Chip</span>
                  <span className="text-[9px] text-slate-400 font-normal">Coarse Only</span>
                </div>
              </th>
              <th className="py-3.5 px-4">HRMS Duty Stats</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {personnel.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  No personnel matching current filters.
                </td>
              </tr>
            ) : (
              personnel.map((p) => {
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onSelectPersonnel(p.id)}
                  >
                    {/* Name & Rank */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">
                        {p.display_name}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {p.rank} · {p.fitness_grade || 'SHAPE-1'}
                      </span>
                    </td>

                    {/* Masked Unique ID */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                        {p.service_id_display}
                      </span>
                    </td>

                    {/* Unit & Force */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-medium truncate max-w-[140px]">{p.unit_name}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{p.force_name || 'Armed Forces'}</div>
                    </td>

                    {/* Observed Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          statusBadgeClasses[p.observed_status] || statusBadgeClasses.Unspecified
                        }`}
                      >
                        {p.observed_status}
                      </span>
                    </td>

                    {/* Assessed Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          statusBadgeClasses[p.assessed_status] || statusBadgeClasses.Unspecified
                        }`}
                      >
                        {p.assessed_status}
                      </span>
                    </td>

                    {/* Coarse Health Trend Chip (Feature 17) */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          coarseChipClasses[p.coarse_chip || 'unavailable']
                        }`}
                        title="Aggregated trend for consenting personnel. Raw biometric data is technically concealed from commanders."
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.coarse_chip === 'stable'
                              ? 'bg-emerald-600'
                              : p.coarse_chip === 'declining'
                              ? 'bg-rose-600 animate-ping'
                              : 'bg-slate-400'
                          }`}
                        />
                        {p.coarse_chip === 'stable' && 'Trend: Stable'}
                        {p.coarse_chip === 'declining' && 'Trend: Declining'}
                        {(!p.coarse_chip || p.coarse_chip === 'unavailable') && 'Unavailable'}
                      </span>
                    </td>

                    {/* HRMS Stats */}
                    <td className="py-3.5 px-4 text-[11px] text-slate-600">
                      <div>Streak: <strong className="text-slate-900">{p.consecutive_duty_days ?? 0}d</strong></div>
                      <div>Leave: <strong className="text-slate-900">{p.leave_balance_days ?? 30}d</strong></div>
                      {(p.consecutive_duty_days ?? 0) >= 45 && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[9px] font-bold rounded">
                          R&R Rotation Due
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectPersonnel(p.id)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          title="View Individual Stats Dashboard"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onUpdateStatus(p)}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors"
                          title="Set Observed Status"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onAddRemark(p)}
                          className="p-1.5 bg-slate-100 hover:bg-sky-100 text-sky-800 rounded-lg transition-colors"
                          title="Add Remark (Tags + Encrypted Free Text)"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onRequestWelfare(p)}
                          className="p-1.5 bg-slate-100 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors"
                          title="Route to Welfare Officer Queue"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};
