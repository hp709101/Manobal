import React from 'react';
import { Unit } from '../../types';
import { Shield, MapPin, Users, Award } from 'lucide-react';

interface UnitGroupCardsProps {
  units: Unit[];
  selectedUnitId: string | null;
  onSelectUnit: (unitId: string) => void;
  currentUserRole: string;
  isMobileFrame?: boolean;
}

export const UnitGroupCards: React.FC<UnitGroupCardsProps> = ({
  units,
  selectedUnitId,
  onSelectUnit,
  currentUserRole,
  isMobileFrame = true,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 flex-wrap">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Operational Formations & Battalions</span>
          </h2>
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
            <span>Group formations with troop strength</span>
            <span className="text-emerald-600 font-semibold">· Swipe →</span>
          </p>
        </div>
        {currentUserRole === 'admin' && (
          <button
            onClick={() => onSelectUnit('ALL')}
            className={`self-start sm:self-auto px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedUnitId === 'ALL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Formations
          </button>
        )}
      </div>

      <div className={`flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar gap-3 pb-2 pt-1 -mx-1 px-1 ${
        isMobileFrame ? '' : 'sm:grid sm:grid-cols-2 md:grid-cols-3 sm:overflow-visible sm:mx-0 sm:px-0'
      }`}>
        {units.map((unit) => {
          const isSelected = selectedUnitId === unit.id;
          return (
            <div
              key={unit.id}
              onClick={() => onSelectUnit(unit.id)}
              className={`shrink-0 w-[270px] ${isMobileFrame ? '' : 'sm:w-auto sm:snap-align-none'} snap-center cursor-pointer rounded-2xl p-4 transition-all border ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold shrink-0">
                    {unit.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                    {unit.force_name || 'Armed Forces'}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium shrink-0">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <strong className="text-slate-800">{unit.strength}</strong> Troops
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-0.5 break-words">{unit.name}</h3>
              <p className="text-xs text-emerald-700 font-medium mb-1 break-words">{unit.parent_unit}</p>
              {unit.motto && (
                <div className="text-[10px] italic text-slate-500 mb-2 break-words">"{unit.motto}"</div>
              )}

              <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{unit.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-700 font-medium">CO: {unit.commanding_officer}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
