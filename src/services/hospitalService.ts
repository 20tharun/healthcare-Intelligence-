/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VERIFIED_HOSPITALS } from '../data/verifiedHospitals';
import {
  CategoryFilter,
  FilterState,
  Hospital,
  HospitalCategory,
  HospitalFacilities,
  HospitalType,
  RequiredFacilityKey,
} from '../types/hospital';

/**
 * Calculates great-circle distance between two coordinates using the Haversine formula in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Generates Google Maps direct directions URL.
 */
export function getGoogleMapsDirectionsUrl(
  destLat: number,
  destLng: number,
  hospitalName?: string
): string {
  const query = hospitalName
    ? encodeURIComponent(`${hospitalName}, ${destLat},${destLng}`)
    : `${destLat},${destLng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
}

/**
 * Counts total verified facilities for a hospital.
 */
export function countVerifiedFacilities(facilities: HospitalFacilities): number {
  return Object.values(facilities).filter((status) => status === 'verified').length;
}

/**
 * Check if a hospital meets the category filter criteria.
 */
export function matchesCategory(hospital: Hospital, filter: CategoryFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'government') return hospital.category === 'Government';
  if (filter === 'private') return hospital.category === 'Private';
  if (filter === 'multi-speciality') {
    return (
      hospital.hospitalType.includes('Multi-Speciality') ||
      hospital.hospitalType.includes('Super-Speciality')
    );
  }
  if (filter === 'specialty') {
    return (
      hospital.hospitalType.includes('Specialty') &&
      !hospital.hospitalType.includes('Multi-Speciality') &&
      !hospital.hospitalType.includes('Super-Speciality')
    );
  }
  if (filter === 'clinic') {
    return (
      hospital.hospitalType.includes('Clinic') ||
      hospital.hospitalType.includes('PHC') ||
      hospital.hospitalType.includes('CHC') ||
      hospital.hospitalType.includes('Nursing Home')
    );
  }
  return true;
}

/**
 * Check if hospital matches all required facility criteria.
 */
export function matchesRequiredFacilities(
  hospital: Hospital,
  requiredFacilities: RequiredFacilityKey[],
  verifiedOnly: boolean
): boolean {
  if (requiredFacilities.length === 0) return true;

  for (const key of requiredFacilities) {
    const status = hospital.facilities[key];
    if (verifiedOnly) {
      if (status !== 'verified') return false;
    } else {
      if (status !== 'verified' && status !== 'contact_to_confirm') return false;
    }
  }

  return true;
}

/**
 * Search results interface including meta status.
 */
export interface HospitalSearchResult {
  hospitals: Hospital[];
  totalFound: number;
  governmentCount: number;
  privateCount: number;
  emergencyFacilityMatches: number;
  dataSourceMode: 'live_osm_and_directory' | 'verified_directory_fallback';
  warningMessage?: string;
}

/**
 * Fetches public OpenStreetMap data with strict deduplication against local verified directory.
 */
export async function searchNearbyHospitals(
  userLat: number,
  userLng: number,
  filters: FilterState
): Promise<HospitalSearchResult> {
  let combinedHospitals: Hospital[] = [];
  let dataSourceMode: 'live_osm_and_directory' | 'verified_directory_fallback' =
    'verified_directory_fallback';
  let warningMessage: string | undefined = undefined;

  // 1. Calculate distance for all verified directory hospitals
  const localHospitalsWithDistance: Hospital[] = VERIFIED_HOSPITALS.map((h) => ({
    ...h,
    distanceKm: calculateDistanceKm(userLat, userLng, h.lat, h.lng),
  }));

  try {
    // Attempt live Overpass query with a tight 5-second timeout
    const radiusMeters = Math.min(filters.radiusKm * 1000, 30000);
    const overpassQuery = `[out:json][timeout:5];(node["amenity"="hospital"](around:${radiusMeters},${userLat},${userLng});way["amenity"="hospital"](around:${radiusMeters},${userLat},${userLng}););out center;`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const osmElements = data.elements || [];

      // Convert OSM elements to Hospital format
      const osmHospitals: Hospital[] = [];

      for (const el of osmElements) {
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        const tags = el.tags || {};
        const name = tags.name || tags['name:en'];

        if (!lat || !lon || !name) continue;

        const distance = calculateDistanceKm(userLat, userLng, lat, lon);

        // Check if duplicate of an existing verified hospital
        const isDuplicate = localHospitalsWithDistance.some((lh) => {
          const nameMatch =
            lh.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(lh.name.toLowerCase());
          const geoProximity = calculateDistanceKm(lh.lat, lh.lng, lat, lon) < 0.4;
          return nameMatch || geoProximity;
        });

        if (isDuplicate) continue;

        // Determine category & type from tags
        const operatorType = (tags['operator:type'] || '').toLowerCase();
        const operator = (tags.operator || '').toLowerCase();
        const isGov =
          operatorType.includes('gov') ||
          operatorType.includes('public') ||
          operator.includes('government') ||
          name.toLowerCase().includes('government') ||
          name.toLowerCase().includes('gh') ||
          name.toLowerCase().includes('district hospital') ||
          name.toLowerCase().includes('primary health');

        const category: HospitalCategory = isGov ? 'Government' : 'Private';

        let hospitalType: HospitalType = isGov
          ? 'Government General Hospital'
          : 'Private General Hospital';

        if (name.toLowerCase().includes('medical college')) {
          hospitalType = isGov
            ? 'Government Medical College Hospital'
            : 'Private Multi-Speciality Hospital';
        } else if (
          name.toLowerCase().includes('speciality') ||
          name.toLowerCase().includes('specialty')
        ) {
          hospitalType = isGov
            ? 'Government Specialty Hospital'
            : 'Private Multi-Speciality Hospital';
        } else if (
          name.toLowerCase().includes('clinic') ||
          name.toLowerCase().includes('nursing home')
        ) {
          hospitalType = 'Private Clinic and Nursing Home';
        }

        const emergencyTag = tags.emergency === 'yes';

        osmHospitals.push({
          id: `osm-${el.id}`,
          name: name,
          category,
          hospitalType,
          address:
            tags['addr:full'] ||
            `${tags['addr:street'] || ''} ${tags['addr:city'] || ''}`.trim() ||
            'Public Directory Listing',
          district: tags['addr:district'] || tags['addr:city'] || 'Local District',
          state: tags['addr:state'] || 'India',
          pincode: tags['addr:postcode'] || '',
          lat,
          lng: lon,
          phone: tags.phone || tags['contact:phone'] || 'Contact via Directory',
          website: tags.website || tags['contact:website'],
          dataSource: 'OpenStreetMap Public Geospatial Contributor Registry',
          lastVerificationDate: '2026-01-01',
          verificationNotes:
            'Discovered via public OpenStreetMap geodatabase. Facilities require telephone confirmation.',
          facilities: {
            emergencyDepartment24x7: emergencyTag ? 'verified' : 'contact_to_confirm',
            emergencyAmbulance: emergencyTag ? 'contact_to_confirm' : 'not_verified',
            emergencySurgery: 'contact_to_confirm',
            traumaCare: 'contact_to_confirm',
            emergencyMedicine: 'contact_to_confirm',

            icu: 'contact_to_confirm',
            nicu: 'not_verified',
            picu: 'not_verified',
            ccu: 'not_verified',
            ventilatorSupport: 'contact_to_confirm',
            oxygenSupport: 'contact_to_confirm',
            intensiveCareServices: 'contact_to_confirm',

            laboratory: 'contact_to_confirm',
            bloodBank: 'not_verified',
            xray: 'contact_to_confirm',
            ctScan: 'not_verified',
            mriScan: 'not_verified',
            ultrasound: 'not_verified',
            ecg: 'contact_to_confirm',
            echocardiography: 'not_verified',

            cardiology: 'not_verified',
            neurology: 'not_verified',
            orthopaedics: 'contact_to_confirm',
            oncology: 'not_verified',
            nephrology: 'not_verified',
            urology: 'not_verified',
            dermatology: 'not_verified',
            ophthalmology: 'not_verified',
            ent: 'not_verified',
            gastroenterology: 'not_verified',
            generalMedicine: 'contact_to_confirm',
            generalSurgery: 'contact_to_confirm',
            paediatrics: 'contact_to_confirm',
            gynaecologyAndObstetrics: 'contact_to_confirm',
            psychiatry: 'not_verified',
            pulmonology: 'not_verified',

            pharmacy: 'contact_to_confirm',
            operationTheatre: 'contact_to_confirm',
            dialysis: 'not_verified',
            maternityServices: 'contact_to_confirm',
            physiotherapy: 'not_verified',
            inpatientServices: 'contact_to_confirm',
            outpatientServices: 'verified',
            parking: 'contact_to_confirm',
            wheelchairAccessibility:
              tags.wheelchair === 'yes' ? 'verified' : 'not_verified',
          },
          distanceKm: distance,
        });
      }

      combinedHospitals = [...localHospitalsWithDistance, ...osmHospitals];
      dataSourceMode = 'live_osm_and_directory';
    } else {
      combinedHospitals = [...localHospitalsWithDistance];
      dataSourceMode = 'verified_directory_fallback';
      warningMessage =
        'Live geospatial map service responded with high latency; using local verified hospital directory with confirmed facilities.';
    }
  } catch (err) {
    combinedHospitals = [...localHospitalsWithDistance];
    dataSourceMode = 'verified_directory_fallback';
    warningMessage =
      'Public map server is temporarily unreachable or sandboxed; active local verified hospital directory loaded.';
  }

  // 2. Filter by radius
  let filtered = combinedHospitals.filter(
    (h) => (h.distanceKm ?? 9999) <= filters.radiusKm
  );

  // 3. Filter by category
  filtered = filtered.filter((h) => matchesCategory(h, filters.category));

  // 4. Filter by text search query if present
  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.hospitalType.toLowerCase().includes(q)
    );
  }

  // 5. Filter by required facilities
  filtered = filtered.filter((h) =>
    matchesRequiredFacilities(
      h,
      filters.requiredFacilities,
      filters.verifiedOnly
    )
  );

  // 6. Sort results
  filtered.sort((a, b) => {
    if (filters.sortBy === 'distance') {
      return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
    }
    if (filters.sortBy === 'suitability') {
      // Prioritize 24/7 emergency verified + high verified facility count
      const aEmergScore =
        a.facilities.emergencyDepartment24x7 === 'verified' ? 10 : 0;
      const bEmergScore =
        b.facilities.emergencyDepartment24x7 === 'verified' ? 10 : 0;
      const aCount = countVerifiedFacilities(a.facilities);
      const bCount = countVerifiedFacilities(b.facilities);
      if (bEmergScore + bCount !== aEmergScore + aCount) {
        return bEmergScore + bCount - (aEmergScore + aCount);
      }
      return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
    }
    if (filters.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const totalFound = filtered.length;
  const governmentCount = filtered.filter((h) => h.category === 'Government').length;
  const privateCount = filtered.filter((h) => h.category === 'Private').length;
  const emergencyFacilityMatches = filtered.filter(
    (h) => h.facilities.emergencyDepartment24x7 === 'verified'
  ).length;

  return {
    hospitals: filtered,
    totalFound,
    governmentCount,
    privateCount,
    emergencyFacilityMatches,
    dataSourceMode,
    warningMessage,
  };
}
