/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Hospital, FacilityVerificationStatus } from '../types/hospital';
import { getGoogleMapsDirectionsUrl } from '../services/hospitalService';
import {
  X,
  Phone,
  Navigation,
  Globe,
  MapPin,
  Calendar,
  Database,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MinusCircle,
  Activity,
  HeartPulse,
  Stethoscope,
  Microscope,
  Building2,
  Copy,
  Check,
} from 'lucide-react';

interface HospitalDetailsModalProps {
  hospital: Hospital | null;
  onClose: () => void;
  onToggleCompare?: (hospital: Hospital) => void;
  isCompared?: boolean;
}

export const HospitalDetailsModal: React.FC<HospitalDetailsModalProps> = ({
  hospital,
  onClose,
  onToggleCompare,
  isCompared,
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'emergency' | 'critical' | 'diagnostic' | 'specialities' | 'other'
  >('overview');

  if (!hospital) return null;

  const directionsUrl = getGoogleMapsDirectionsUrl(
    hospital.lat,
    hospital.lng,
    hospital.name
  );

  const isGov = hospital.category === 'Government';

  const copyAddress = () => {
    navigator.clipboard.writeText(
      `${hospital.name}, ${hospital.address}, Pincode: ${hospital.pincode}`
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const renderStatusBadge = (status: FacilityVerificationStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            Verified
          </span>
        );
      case 'contact_to_confirm':
        return (
          <span className="inline-flex items-center gap-1 text-amber-800 font-semibold text-xs bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            <AlertCircle className="w-3.5 h-3.5" />
            Contact to confirm
          </span>
        );
      case 'not_verified':
        return (
          <span className="inline-flex items-center gap-1 text-slate-600 text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
            <HelpCircle className="w-3.5 h-3.5" />
            Not verified
          </span>
        );
      case 'unavailable':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-rose-700 text-xs bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
            <MinusCircle className="w-3.5 h-3.5" />
            Unavailable
          </span>
        );
    }
  };

  // Facility dictionary configs
  const emergencyList: { label: string; key: keyof typeof hospital.facilities }[] = [
    { label: '24/7 Emergency Department', key: 'emergencyDepartment24x7' },
    { label: 'Emergency Ambulance', key: 'emergencyAmbulance' },
    { label: 'Emergency Surgery', key: 'emergencySurgery' },
    { label: 'Trauma Care & Resuscitation', key: 'traumaCare' },
    { label: 'Emergency Medicine Specialists', key: 'emergencyMedicine' },
  ];

  const criticalCareList: { label: string; key: keyof typeof hospital.facilities }[] = [
    { label: 'Intensive Care Unit (ICU)', key: 'icu' },
    { label: 'Neonatal ICU (NICU)', key: 'nicu' },
    { label: 'Paediatric ICU (PICU)', key: 'picu' },
    { label: 'Coronary Care Unit (CCU)', key: 'ccu' },
    { label: 'Mechanical Ventilator Support', key: 'ventilatorSupport' },
    { label: 'Continuous Oxygen Support & Supply', key: 'oxygenSupport' },
    { label: 'Intensive Care Services 24/7', key: 'intensiveCareServices' },
  ];

  const diagnosticList: { label: string; key: keyof typeof hospital.facilities }[] = [
    { label: 'Diagnostic Laboratory', key: 'laboratory' },
    { label: 'Blood Bank / Storage Center', key: 'bloodBank' },
    { label: 'Digital X-Ray', key: 'xray' },
    { label: 'Computed Tomography (CT Scan)', key: 'ctScan' },
    { label: 'Magnetic Resonance Imaging (MRI)', key: 'mriScan' },
    { label: 'Ultrasound / Ultrasonography', key: 'ultrasound' },
    { label: 'Electrocardiogram (ECG)', key: 'ecg' },
    { label: 'Echocardiography (ECHO)', key: 'echocardiography' },
  ];

  const specialitiesList: { label: string; key: keyof typeof hospital.facilities }[] = [
    { label: 'Cardiology (Heart Care)', key: 'cardiology' },
    { label: 'Neurology & Neurosurgery', key: 'neurology' },
    { label: 'Orthopaedics & Joint Replacement', key: 'orthopaedics' },
    { label: 'Medical & Surgical Oncology (Cancer)', key: 'oncology' },
    { label: 'Nephrology (Kidney Care)', key: 'nephrology' },
    { label: 'Urology', key: 'urology' },
    { label: 'Dermatology (Skin)', key: 'dermatology' },
    { label: 'Ophthalmology (Eye Care)', key: 'ophthalmology' },
    { label: 'Ear, Nose & Throat (ENT)', key: 'ent' },
    { label: 'Gastroenterology & Hepatology', key: 'gastroenterology' },
    { label: 'General Medicine', key: 'generalMedicine' },
    { label: 'General Surgery', key: 'generalSurgery' },
    { label: 'Paediatrics & Child Health', key: 'paediatrics' },
    { label: 'Gynaecology & Obstetrics (Maternity)', key: 'gynaecologyAndObstetrics' },
    { label: 'Psychiatry & Mental Health', key: 'psychiatry' },
    { label: 'Pulmonology (Respiratory)', key: 'pulmonology' },
  ];

  const otherList: { label: string; key: keyof typeof hospital.facilities }[] = [
    { label: '24/7 Pharmacy', key: 'pharmacy' },
    { label: 'Modular Operation Theatre', key: 'operationTheatre' },
    { label: 'Hemodialysis Unit', key: 'dialysis' },
    { label: 'Maternity Services & Labour Room', key: 'maternityServices' },
    { label: 'Physiotherapy & Rehabilitation', key: 'physiotherapy' },
    { label: 'Inpatient Hospitalization Wards', key: 'inpatientServices' },
    { label: 'Outpatient Specialty Clinics', key: 'outpatientServices' },
    { label: 'Visitor Parking Facility', key: 'parking' },
    { label: 'Wheelchair & Barrier-Free Access', key: 'wheelchairAccessibility' },
  ];

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`font-bold tracking-wide uppercase ${
                    isGov ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {hospital.category} Institution
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-600 font-medium">
                  {hospital.hospitalType}
                </span>
                <span className="text-slate-300">/</span>
                <span className="font-mono text-slate-700 font-semibold tabular-nums">
                  {hospital.distanceKm ?? 0} km from search origin
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {hospital.name}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Contact & Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-4 text-xs">
            <a
              href={`tel:${hospital.phone}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {hospital.phone}</span>
            </a>

            {hospital.emergencyPhone && (
              <a
                href={`tel:${hospital.emergencyPhone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Emergency: {hospital.emergencyPhone}</span>
              </a>
            )}

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps Directions ↗</span>
            </a>

            {hospital.website && (
              <a
                href={hospital.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Official Website ↗</span>
              </a>
            )}

            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(hospital)}
                className={`ml-auto px-3.5 py-2 rounded-lg font-semibold border transition-colors ${
                  isCompared
                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {isCompared ? '✓ Added to Compare' : '+ Compare Hospital'}
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-white overflow-x-auto shrink-0 py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Overview & Coordinates
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'emergency'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Emergency (5)
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'critical'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Critical Care (7)
          </button>
          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'diagnostic'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Diagnostic (8)
          </button>
          <button
            onClick={() => setActiveTab('specialities')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'specialities'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Specialities (16)
          </button>
          <button
            onClick={() => setActiveTab('other')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'other'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Other Facilities (9)
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overview text */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">
                  Institutional Profile & Overview
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {hospital.overview ||
                    'Publicly registered healthcare institution providing clinical consultations, emergency response, and diagnostic care.'}
                </p>
                {hospital.verificationNotes && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">
                      Audit Notes:{' '}
                    </span>
                    {hospital.verificationNotes}
                  </div>
                )}
              </div>

              {/* Complete Address & Location Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Complete Address
                    </span>
                    <button
                      onClick={copyAddress}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-slate-800 font-medium leading-normal mb-2">
                    {hospital.address}
                  </p>
                  <div className="text-xs text-slate-500">
                    District: {hospital.district} · State: {hospital.state} · PIN: {hospital.pincode}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Location Coordinates & Geolocation
                  </span>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Latitude:</span>
                      <span className="font-mono text-slate-800 font-semibold tabular-nums">
                        {hospital.lat}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Longitude:</span>
                      <span className="font-mono text-slate-800 font-semibold tabular-nums">
                        {hospital.lng}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Calculated Distance:</span>
                      <span className="font-mono text-blue-700 font-bold tabular-nums">
                        {hospital.distanceKm ?? 0} km
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Verification Guarantee and Accuracy Rules */}
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Mandatory Healthcare Intelligence Notice
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Only show a facility as available when supported by verified official data. We never assume a facility exists simply because an institution is large or renowned. Public directory information does not guarantee real-time hospital bed acceptance or capacity. In life-threatening emergencies, always dial 108 or proceed directly to the nearest emergency room.
                </p>
              </div>

              {/* Data Provenance & Verification Audit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <Database className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-slate-500 block">Data Source</span>
                    <span className="font-semibold text-slate-800">
                      {hospital.dataSource}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-slate-500 block">Last Verified Date</span>
                    <span className="font-semibold text-slate-800 font-mono tabular-nums">
                      {hospital.lastVerificationDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  Emergency Facilities Audit
                </h4>
                <span className="text-xs text-slate-500">
                  5 monitored parameters
                </span>
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {emergencyList.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/70"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {item.label}
                    </span>
                    {renderStatusBadge(hospital.facilities[item.key])}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'critical' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Critical Care & Intensive Services Audit
                </h4>
                <span className="text-xs text-slate-500">
                  7 monitored parameters
                </span>
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {criticalCareList.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/70"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {item.label}
                    </span>
                    {renderStatusBadge(hospital.facilities[item.key])}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'diagnostic' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-indigo-600" />
                  Diagnostic & Imaging Facilities Audit
                </h4>
                <span className="text-xs text-slate-500">
                  8 monitored parameters
                </span>
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {diagnosticList.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/70"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {item.label}
                    </span>
                    {renderStatusBadge(hospital.facilities[item.key])}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'specialities' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  Medical & Surgical Specialities Audit
                </h4>
                <span className="text-xs text-slate-500">
                  16 clinical disciplines
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {specialitiesList.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 bg-slate-50/80 border border-slate-200/80 rounded-lg"
                  >
                    <span className="text-xs font-semibold text-slate-800">
                      {item.label}
                    </span>
                    {renderStatusBadge(hospital.facilities[item.key])}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'other' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  Other Institutional & Support Facilities
                </h4>
                <span className="text-xs text-slate-500">
                  9 infrastructure indicators
                </span>
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {otherList.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/70"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {item.label}
                    </span>
                    {renderStatusBadge(hospital.facilities[item.key])}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Hospital ID: <span className="font-mono">{hospital.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
