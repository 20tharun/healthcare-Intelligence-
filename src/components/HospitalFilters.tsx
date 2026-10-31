/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CategoryFilter,
  RequiredFacilityKey,
} from '../types/hospital';
import { Filter, Check, X, ShieldCheck } from 'lucide-react';

interface HospitalFiltersProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  requiredFacilities: RequiredFacilityKey[];
  onToggleFacility: (facility: RequiredFacilityKey) => void;
  verifiedOnly: boolean;
  onToggleVerifiedOnly: () => void;
  sortBy: 'distance' | 'suitability' | 'name';
  onChangeSortBy: (sort: 'distance' | 'suitability' | 'name') => void;
  onResetFilters: () => void;
}

export const HospitalFilters: React.FC<HospitalFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  requiredFacilities,
  onToggleFacility,
  verifiedOnly,
  onToggleVerifiedOnly,
  sortBy,
  onChangeSortBy,
  onResetFilters,
}) => {
  const categoryTabs: { label: string; value: CategoryFilter }[] = [
    { label: 'All Hospitals', value: 'all' },
    { label: 'Government Hospitals', value: 'government' },
    { label: 'Private Hospitals', value: 'private' },
    { label: 'Multi-Speciality', value: 'multi-speciality' },
    { label: 'Specialty Hospitals', value: 'specialty' },
    { label: 'Clinics & Nursing Homes', value: 'clinic' },
  ];

  const facilityCheckboxes: { label: string; key: RequiredFacilityKey }[] = [
    { label: '24/7 Emergency Department', key: 'emergencyDepartment24x7' },
    { label: 'Intensive Care Unit (ICU)', key: 'icu' },
    { label: 'Oxygen Support', key: 'oxygenSupport' },
    { label: 'Ventilator Support', key: 'ventilatorSupport' },
    { label: 'Blood Bank', key: 'bloodBank' },
    { label: 'CT Scan', key: 'ctScan' },
    { label: 'MRI Scan', key: 'mriScan' },
    { label: 'Cardiology', key: 'cardiology' },
    { label: 'Neurology', key: 'neurology' },
    { label: 'Dialysis Unit', key: 'dialysis' },
    { label: 'Trauma Care', key: 'traumaCare' },
    { label: 'Operation Theatre', key: 'operationTheatre' },
  ];

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    requiredFacilities.length > 0 ||
    verifiedOnly ||
    sortBy !== 'distance';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
      {/* Category Filter Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Hospital Category Filter
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Clean segmented controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-lg">
          {categoryTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onSelectCategory(tab.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                selectedCategory === tab.value
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facility Multi-Select Checklist */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Required Facilities & Equipment ({requiredFacilities.length} selected)
          </span>
          <span className="text-[11px] text-slate-400">
            Matches hospitals with verified capability
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {facilityCheckboxes.map((item) => {
            const isChecked = requiredFacilities.includes(item.key);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onToggleFacility(item.key)}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-left border transition-all ${
                  isChecked
                    ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50/60 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                    isChecked
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Verification Strictness & Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
        {/* Verified only toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={onToggleVerifiedOnly}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict Verification Mode (Hide unconfirmed / unverified status)</span>
          </div>
        </label>

        {/* Sort by selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Sort results by:</span>
          <select
            value={sortBy}
            onChange={(e) =>
              onChangeSortBy(
                e.target.value as 'distance' | 'suitability' | 'name'
              )
            }
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="distance">Nearest Distance (Default)</option>
            <option value="suitability">Emergency & Facility Readiness</option>
            <option value="name">Hospital Name (A to Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
