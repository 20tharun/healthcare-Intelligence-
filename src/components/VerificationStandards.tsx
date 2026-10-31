/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const VerificationStandards: React.FC = () => {
  return (
    <section
      id="verification-standards"
      className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <div className="text-xs font-bold tracking-wider uppercase text-blue-700 mb-1">
            Data Governance & Integrity
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Hospital Verification Framework & Standards
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            In healthcare, inaccurate facility claims can cost critical minutes. This platform adheres to a zero-fabrication protocol: every facility is classified into verifiable statuses based on official audits.
          </p>
        </div>

        {/* 4 Status Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified</span>
            </div>
            <p className="text-xs text-emerald-950/80 leading-relaxed">
              Backed by official State Health Department audit, NABH / NABL accreditation registries, or statutory public health filings.
            </p>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Contact to Confirm</span>
            </div>
            <p className="text-xs text-amber-950/80 leading-relaxed">
              Facility exists on directory records but requires telephone inquiry to confirm current shift doctor availability or operational status.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Not Verified</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              No recent audit data exists for this specific equipment or facility. Never assumed just because a hospital is famous or large.
            </p>
          </div>

          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>Unavailable</span>
            </div>
            <p className="text-xs text-rose-950/80 leading-relaxed">
              Confirmed that the institution does not provide this medical facility or speciality (e.g. single-specialty eye hospitals without trauma ICU).
            </p>
          </div>
        </div>

        {/* Institutional Classification Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              Government Healthcare Classification
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Government General Hospitals & Medical College Teaching Hospitals</li>
              <li>District Headquarters Hospitals (Secondary Referral)</li>
              <li>Taluk Hospitals & Sub-District Hospitals</li>
              <li>Primary Health Centres (PHC & UPHC)</li>
              <li>Community Health Centres (CHC) & Rural Hospitals</li>
              <li>Government Maternity & Child Healthcare Specialized Institutes</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-rose-700" />
              Private Healthcare Classification
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Private Multi-Speciality & Super-Speciality Tertiary Care Hospitals</li>
              <li>Private Specialty Centres (Orthopaedics, Gastroenterology, Oncology, Eye)</li>
              <li>Private Emergency Care & Trauma Centres</li>
              <li>Private General Hospitals & Charitable Trust Institutions</li>
              <li>Private Daycare Clinics & Licensed Nursing Homes</li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold text-slate-700">Transparency Note:</span> Public directory and geospatial information does not guarantee real-time hospital bed acceptance, physician shift readiness, or ventilator availability. Data is maintained for informational and emergency navigation guidance. In an emergency, always contact local emergency dispatch (108) or call the hospital prior to transit when feasible.
        </div>
      </div>
    </section>
  );
};
