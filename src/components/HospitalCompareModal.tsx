/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Hospital, FacilityVerificationStatus } from '../types/hospital';
import { getGoogleMapsDirectionsUrl } from '../services/hospitalService';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MinusCircle,
  Phone,
  Navigation,
  Trash2,
} from 'lucide-react';

interface HospitalCompareModalProps {
  hospitals: Hospital[];
  onClose: () => void;
  onRemoveHospital: (hospitalId: string) => void;
  onOpenDetails: (hospital: Hospital) => void;
}

export const HospitalCompareModal: React.FC<HospitalCompareModalProps> = ({
  hospitals,
  onClose,
  onRemoveHospital,
  onOpenDetails,
}) => {
  if (hospitals.length === 0) return null;

  const renderBadge = (status: FacilityVerificationStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified
          </span>
        );
      case 'contact_to_confirm':
        return (
          <span className="inline-flex items-center gap-1 text-amber-800 font-medium text-xs bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <AlertCircle className="w-3.5 h-3.5" />
            Confirm
          </span>
        );
      case 'not_verified':
        return (
          <span className="inline-flex items-center gap-1 text-slate-500 text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            <HelpCircle className="w-3.5 h-3.5" />
            Not verified
          </span>
        );
      case 'unavailable':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-rose-700 text-xs bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            <MinusCircle className="w-3.5 h-3.5" />
            Unavailable
          </span>
        );
    }
  };

  const comparisonRows: {
    label: string;
    getValue: (h: Hospital) => React.ReactNode;
  }[] = [
    {
      label: 'Category',
      getValue: (h) => (
        <span
          className={`font-semibold uppercase text-xs ${
            h.category === 'Government' ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {h.category}
        </span>
      ),
    },
    {
      label: 'Hospital Type',
      getValue: (h) => <span className="text-xs text-slate-700 font-medium">{h.hospitalType}</span>,
    },
    {
      label: 'Distance',
      getValue: (h) => (
        <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
          {h.distanceKm ?? 0} km away
        </span>
      ),
    },
    {
      label: '24/7 Emergency',
      getValue: (h) => renderBadge(h.facilities.emergencyDepartment24x7),
    },
    {
      label: 'Trauma Care',
      getValue: (h) => renderBadge(h.facilities.traumaCare),
    },
    {
      label: 'ICU (Intensive Care)',
      getValue: (h) => renderBadge(h.facilities.icu),
    },
    {
      label: 'Oxygen Support',
      getValue: (h) => renderBadge(h.facilities.oxygenSupport),
    },
    {
      label: 'Ventilator Support',
      getValue: (h) => renderBadge(h.facilities.ventilatorSupport),
    },
    {
      label: 'Blood Bank',
      getValue: (h) => renderBadge(h.facilities.bloodBank),
    },
    {
      label: 'CT Scan',
      getValue: (h) => renderBadge(h.facilities.ctScan),
    },
    {
      label: 'MRI Scan',
      getValue: (h) => renderBadge(h.facilities.mriScan),
    },
    {
      label: 'Cardiology',
      getValue: (h) => renderBadge(h.facilities.cardiology),
    },
    {
      label: 'Neurology',
      getValue: (h) => renderBadge(h.facilities.neurology),
    },
    {
      label: 'Orthopaedics',
      getValue: (h) => renderBadge(h.facilities.orthopaedics),
    },
    {
      label: 'Dialysis Unit',
      getValue: (h) => renderBadge(h.facilities.dialysis),
    },
    {
      label: 'Data Source',
      getValue: (h) => (
        <span className="text-[11px] text-slate-500 line-clamp-2">
          {h.dataSource}
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-[1250] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Comparison Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side facility and service verification audit ({hospitals.length}/3 hospitals)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            aria-label="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-5 overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full border-collapse text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">
                  Feature / Parameter
                </th>
                {hospitals.map((hospital) => (
                  <th
                    key={hospital.id}
                    className="p-3 bg-slate-50 text-left align-top w-1/3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900 leading-snug">
                          {hospital.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {hospital.district}, {hospital.state}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveHospital(hospital.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove from comparison"
                        aria-label="Remove from comparison"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => onOpenDetails(hospital)}
                        className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800"
                      >
                        Details
                      </button>
                      <a
                        href={getGoogleMapsDirectionsUrl(
                          hospital.lat,
                          hospital.lng,
                          hospital.name
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                      >
                        Directions ↗
                      </a>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {comparisonRows.map((row, idx) => (
                <tr
                  key={row.label}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                >
                  <td className="p-3 font-medium text-slate-700 text-xs">
                    {row.label}
                  </td>
                  {hospitals.map((hospital) => (
                    <td key={hospital.id} className="p-3 align-middle">
                      {row.getValue(hospital)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            Ratings strictly reflect verifiable institutional infrastructure records.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
