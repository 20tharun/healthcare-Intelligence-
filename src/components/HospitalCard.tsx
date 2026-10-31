/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Hospital } from '../types/hospital';
import { getGoogleMapsDirectionsUrl } from '../services/hospitalService';
import {
  Phone,
  Navigation,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  Check,
  Plus,
  CheckSquare,
} from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  onViewDetails: (hospital: Hospital) => void;
  isSelected?: boolean;
  onSelect?: (hospital: Hospital) => void;
  isCompared?: boolean;
  onToggleCompare?: (hospital: Hospital) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  onViewDetails,
  isSelected,
  onSelect,
  isCompared,
  onToggleCompare,
}) => {
  const directionsUrl = getGoogleMapsDirectionsUrl(
    hospital.lat,
    hospital.lng,
    hospital.name
  );

  const isGov = hospital.category === 'Government';
  const has24x7Emergency =
    hospital.facilities.emergencyDepartment24x7 === 'verified';
  const hasIcu = hospital.facilities.icu === 'verified';
  const hasOxygen = hospital.facilities.oxygenSupport === 'verified';
  const hasVentilator = hospital.facilities.ventilatorSupport === 'verified';
  const hasBloodBank = hospital.facilities.bloodBank === 'verified';

  // Highlight key specialities that are verified
  const verifiedSpecialities: string[] = [];
  const specMap: Record<string, string> = {
    cardiology: 'Cardiology',
    neurology: 'Neurology',
    orthopaedics: 'Orthopaedics',
    oncology: 'Oncology',
    nephrology: 'Nephrology',
    urology: 'Urology',
    gastroenterology: 'Gastroenterology',
    paediatrics: 'Paediatrics',
    gynaecologyAndObstetrics: 'Obstetrics & Gynae',
  };

  Object.entries(specMap).forEach(([key, label]) => {
    if (
      hospital.facilities[key as keyof typeof hospital.facilities] === 'verified'
    ) {
      verifiedSpecialities.push(label);
    }
  });

  return (
    <div
      onClick={() => onSelect && onSelect(hospital)}
      className={`relative bg-white rounded-xl border transition-all duration-150 p-5 ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
          : 'border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Top Header Row: Category, Type & Distance */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span
            className={`font-semibold tracking-wide uppercase ${
              isGov ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {hospital.category} Hospital
          </span>
          <span className="text-slate-300" aria-hidden="true">
            /
          </span>
          <span className="text-slate-600 font-medium">
            {hospital.hospitalType}
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
            {hospital.distanceKm ?? 0}
          </span>
          <span className="text-xs text-slate-500 ml-1">km away</span>
        </div>
      </div>

      {/* Hospital Name */}
      <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug mb-1">
        {hospital.name}
      </h3>

      {/* Address */}
      <p className="text-xs text-slate-500 line-clamp-2 mb-3.5">
        {hospital.address}
      </p>

      {/* Emergency & Critical Facilities Status Grid */}
      <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-100 mb-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-200/60">
          <span className="font-semibold text-slate-700">
            Emergency Department
          </span>
          {has24x7Emergency ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Verified 24/7
            </span>
          ) : hospital.facilities.emergencyDepartment24x7 ===
            'contact_to_confirm' ? (
            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
              <AlertTriangle className="w-3 h-3" />
              Contact to confirm
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Info className="w-3 h-3" />
              Information unavailable
            </span>
          )}
        </div>

        {/* Quick Facility Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5 text-[11px]">
          <div>
            <span className="text-slate-500 block">ICU</span>
            <span
              className={`font-semibold ${
                hasIcu
                  ? 'text-emerald-700'
                  : hospital.facilities.icu === 'contact_to_confirm'
                  ? 'text-amber-700'
                  : 'text-slate-400'
              }`}
            >
              {hasIcu
                ? 'Verified'
                : hospital.facilities.icu === 'contact_to_confirm'
                ? 'Check status'
                : 'Unavailable'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Oxygen Support</span>
            <span
              className={`font-semibold ${
                hasOxygen
                  ? 'text-emerald-700'
                  : hospital.facilities.oxygenSupport === 'contact_to_confirm'
                  ? 'text-amber-700'
                  : 'text-slate-400'
              }`}
            >
              {hasOxygen
                ? 'Verified'
                : hospital.facilities.oxygenSupport === 'contact_to_confirm'
                ? 'Check status'
                : 'Not verified'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Ventilator</span>
            <span
              className={`font-semibold ${
                hasVentilator
                  ? 'text-emerald-700'
                  : hospital.facilities.ventilatorSupport === 'contact_to_confirm'
                  ? 'text-amber-700'
                  : 'text-slate-400'
              }`}
            >
              {hasVentilator
                ? 'Verified'
                : hospital.facilities.ventilatorSupport === 'contact_to_confirm'
                ? 'Check status'
                : 'Not verified'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Blood Bank</span>
            <span
              className={`font-semibold ${
                hasBloodBank
                  ? 'text-emerald-700'
                  : hospital.facilities.bloodBank === 'contact_to_confirm'
                  ? 'text-amber-700'
                  : 'text-slate-400'
              }`}
            >
              {hasBloodBank
                ? 'Verified'
                : hospital.facilities.bloodBank === 'contact_to_confirm'
                ? 'Check status'
                : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>

      {/* Specialities Line */}
      {verifiedSpecialities.length > 0 && (
        <div className="mb-3.5 text-xs">
          <span className="text-slate-500 font-medium mr-1.5">
            Verified Specialities:
          </span>
          <span className="text-slate-700">
            {verifiedSpecialities.slice(0, 4).join(', ')}
            {verifiedSpecialities.length > 4 &&
              ` +${verifiedSpecialities.length - 4} more`}
          </span>
        </div>
      )}

      {/* Verification Meta & Data Source */}
      <div className="flex flex-wrap items-center justify-between gap-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100 mb-3.5">
        <div className="flex items-center gap-1.5 truncate max-w-[260px]">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">Source: {hospital.dataSource}</span>
        </div>
        <div className="tabular-nums">
          Verified: {hospital.lastVerificationDate}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(hospital);
          }}
          className="flex-1 min-w-[100px] px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors text-center whitespace-nowrap"
        >
          View Details
        </button>

        <a
          href={`tel:${hospital.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
          title={`Call ${hospital.phone}`}
        >
          <Phone className="w-3.5 h-3.5 text-slate-600" />
          <span>Call Hospital</span>
        </a>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors whitespace-nowrap"
          title="Open in Google Maps"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
        </a>

        {onToggleCompare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(hospital);
            }}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              isCompared
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
            }`}
            title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
            aria-label={isCompared ? 'Remove from comparison' : 'Add to comparison'}
          >
            {isCompared ? (
              <CheckSquare className="w-4 h-4 text-purple-600" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
