/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HospitalCategory = 'Government' | 'Private';

export type GovernmentHospitalType =
  | 'Government General Hospital'
  | 'Government Medical College Hospital'
  | 'District Headquarters Hospital'
  | 'Taluk Hospital'
  | 'Primary Health Centre (PHC)'
  | 'Community Health Centre (CHC)'
  | 'Government Specialty Hospital'
  | 'Government Maternity and Child Healthcare Hospital';

export type PrivateHospitalType =
  | 'Private Multi-Speciality Hospital'
  | 'Private Super-Speciality Hospital'
  | 'Private General Hospital'
  | 'Private Specialty Hospital'
  | 'Private Emergency Care Hospital'
  | 'Private Clinic and Nursing Home';

export type HospitalType = GovernmentHospitalType | PrivateHospitalType;

export type CategoryFilter =
  | 'all'
  | 'government'
  | 'private'
  | 'multi-speciality'
  | 'specialty'
  | 'clinic';

export type FacilityVerificationStatus =
  | 'verified'
  | 'not_verified'
  | 'unavailable'
  | 'contact_to_confirm';

export interface HospitalFacilities {
  // Emergency Facilities
  emergencyDepartment24x7: FacilityVerificationStatus;
  emergencyAmbulance: FacilityVerificationStatus;
  emergencySurgery: FacilityVerificationStatus;
  traumaCare: FacilityVerificationStatus;
  emergencyMedicine: FacilityVerificationStatus;

  // Critical Care Facilities
  icu: FacilityVerificationStatus;
  nicu: FacilityVerificationStatus;
  picu: FacilityVerificationStatus;
  ccu: FacilityVerificationStatus;
  ventilatorSupport: FacilityVerificationStatus;
  oxygenSupport: FacilityVerificationStatus;
  intensiveCareServices: FacilityVerificationStatus;

  // Diagnostic Facilities
  laboratory: FacilityVerificationStatus;
  bloodBank: FacilityVerificationStatus;
  xray: FacilityVerificationStatus;
  ctScan: FacilityVerificationStatus;
  mriScan: FacilityVerificationStatus;
  ultrasound: FacilityVerificationStatus;
  ecg: FacilityVerificationStatus;
  echocardiography: FacilityVerificationStatus;

  // Medical Specialities
  cardiology: FacilityVerificationStatus;
  neurology: FacilityVerificationStatus;
  orthopaedics: FacilityVerificationStatus;
  oncology: FacilityVerificationStatus;
  nephrology: FacilityVerificationStatus;
  urology: FacilityVerificationStatus;
  dermatology: FacilityVerificationStatus;
  ophthalmology: FacilityVerificationStatus;
  ent: FacilityVerificationStatus;
  gastroenterology: FacilityVerificationStatus;
  generalMedicine: FacilityVerificationStatus;
  generalSurgery: FacilityVerificationStatus;
  paediatrics: FacilityVerificationStatus;
  gynaecologyAndObstetrics: FacilityVerificationStatus;
  psychiatry: FacilityVerificationStatus;
  pulmonology: FacilityVerificationStatus;

  // Other Facilities
  pharmacy: FacilityVerificationStatus;
  operationTheatre: FacilityVerificationStatus;
  dialysis: FacilityVerificationStatus;
  maternityServices: FacilityVerificationStatus;
  physiotherapy: FacilityVerificationStatus;
  inpatientServices: FacilityVerificationStatus;
  outpatientServices: FacilityVerificationStatus;
  parking: FacilityVerificationStatus;
  wheelchairAccessibility: FacilityVerificationStatus;
}

export interface Hospital {
  id: string;
  name: string;
  category: HospitalCategory;
  hospitalType: HospitalType;
  address: string;
  district: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  phone: string;
  emergencyPhone?: string;
  website?: string;
  dataSource: string;
  lastVerificationDate: string;
  verificationNotes?: string;
  overview?: string;
  facilities: HospitalFacilities;
  // Calculated at runtime based on user location
  distanceKm?: number;
}

export interface SearchCoordinates {
  lat: number;
  lng: number;
  label?: string;
}

export type RequiredFacilityKey =
  | 'emergencyDepartment24x7'
  | 'icu'
  | 'oxygenSupport'
  | 'ventilatorSupport'
  | 'bloodBank'
  | 'ctScan'
  | 'mriScan'
  | 'cardiology'
  | 'neurology'
  | 'dialysis'
  | 'traumaCare'
  | 'operationTheatre';

export interface FilterState {
  category: CategoryFilter;
  radiusKm: number;
  requiredFacilities: RequiredFacilityKey[];
  verifiedOnly: boolean;
  sortBy: 'distance' | 'suitability' | 'name';
  searchQuery: string;
}
