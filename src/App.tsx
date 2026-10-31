/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  CategoryFilter,
  FilterState,
  Hospital,
  RequiredFacilityKey,
  SearchCoordinates,
} from './types/hospital';
import {
  searchNearbyHospitals,
  HospitalSearchResult,
} from './services/hospitalService';
import { Navbar } from './components/Navbar';
import { SearchHeader } from './components/SearchHeader';
import { HospitalFilters } from './components/HospitalFilters';
import { HospitalCard } from './components/HospitalCard';
import { InteractiveMap } from './components/InteractiveMap';
import { HospitalDetailsModal } from './components/HospitalDetailsModal';
import { HospitalCompareModal } from './components/HospitalCompareModal';
import { DownloadProjectModal } from './components/DownloadProjectModal';
import { EmergencyBanner } from './components/EmergencyBanner';
import { VerificationStandards } from './components/VerificationStandards';
import {
  Map as MapIcon,
  List,
  Layers,
  AlertCircle,
  Building,
  RefreshCw,
} from 'lucide-react';

// Default initial coordinates matching user prompt example:
// Latitude: 11.032731848247023, Longitude: 76.92993497319851 (Coimbatore, Tamil Nadu)
const DEFAULT_COORDINATES: SearchCoordinates = {
  lat: 11.032731848247023,
  lng: 76.92993497319851,
  label: 'Coimbatore, Tamil Nadu (Preset Search Origin)',
};

export default function App() {
  const [coordinates, setCoordinates] =
    useState<SearchCoordinates>(DEFAULT_COORDINATES);
  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [requiredFacilities, setRequiredFacilities] = useState<
    RequiredFacilityKey[]
  >(['emergencyDepartment24x7']); // Default search example in prompt has Required Facility: Emergency Department
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'distance' | 'suitability' | 'name'>(
    'distance'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Results State
  const [searchResults, setSearchResults] = useState<HospitalSearchResult>({
    hospitals: [],
    totalFound: 0,
    governmentCount: 0,
    privateCount: 0,
    emergencyFacilityMatches: 0,
    dataSourceMode: 'verified_directory_fallback',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Selection & Modal States
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [detailsHospital, setDetailsHospital] = useState<Hospital | null>(null);
  const [comparedHospitals, setComparedHospitals] = useState<Hospital[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  // View Mode: 'split' | 'list' | 'map'
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');

  // Perform search
  const executeSearch = useCallback(async () => {
    setIsLoading(true);
    const filterState: FilterState = {
      category: categoryFilter,
      radiusKm,
      requiredFacilities,
      verifiedOnly,
      sortBy,
      searchQuery,
    };

    try {
      const result = await searchNearbyHospitals(
        coordinates.lat,
        coordinates.lng,
        filterState
      );
      setSearchResults(result);

      // Select first hospital by default if none selected
      if (
        result.hospitals.length > 0 &&
        (!selectedHospital ||
          !result.hospitals.some((h) => h.id === selectedHospital.id))
      ) {
        setSelectedHospital(result.hospitals[0]);
      }
    } catch (err) {
      console.error('Failed to search hospitals', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    coordinates.lat,
    coordinates.lng,
    radiusKm,
    categoryFilter,
    requiredFacilities,
    verifiedOnly,
    sortBy,
    searchQuery,
    selectedHospital,
  ]);

  // Run search when search parameters change
  useEffect(() => {
    executeSearch();
  }, [
    coordinates.lat,
    coordinates.lng,
    radiusKm,
    categoryFilter,
    requiredFacilities,
    verifiedOnly,
    sortBy,
    searchQuery,
  ]);

  // Geolocation handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        'Geolocation is not supported by your browser. You can enter coordinates manually above.'
      );
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({
          lat: latitude,
          lng: longitude,
          label: 'Your Current GPS Location',
        });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg =
            'Location permission was denied. Using current coordinates or click preset button to test.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setLocationError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Facility filter toggle
  const handleToggleFacility = (facility: RequiredFacilityKey) => {
    setRequiredFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  // Quick ER locator action in Navbar
  const handleQuickLocateEmergency = () => {
    setCategoryFilter('all');
    setRequiredFacilities(['emergencyDepartment24x7']);
    setSortBy('distance');
    setViewMode('split');
  };

  // Reset filters
  const handleResetFilters = () => {
    setCategoryFilter('all');
    setRequiredFacilities([]);
    setVerifiedOnly(false);
    setSortBy('distance');
    setSearchQuery('');
  };

  // Compare toggles
  const handleToggleCompare = (hospital: Hospital) => {
    setComparedHospitals((prev) => {
      const exists = prev.some((h) => h.id === hospital.id);
      if (exists) {
        return prev.filter((h) => h.id !== hospital.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 hospitals side-by-side.');
          return prev;
        }
        return [...prev, hospital];
      }
    });
  };

  const handleRemoveCompare = (id: string) => {
    setComparedHospitals((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar Navigation */}
      <Navbar
        onQuickLocateEmergency={handleQuickLocateEmergency}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        compareCount={comparedHospitals.length}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Emergency Advisory Strip */}
      <EmergencyBanner />

      {/* Search & Location Configuration Header */}
      <section id="search-section">
        <SearchHeader
          coordinates={coordinates}
          onChangeCoordinates={setCoordinates}
          radiusKm={radiusKm}
          onChangeRadius={setRadiusKm}
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          locationError={locationError}
          totalFound={searchResults.totalFound}
          governmentCount={searchResults.governmentCount}
          privateCount={searchResults.privateCount}
          emergencyCount={searchResults.emergencyFacilityMatches}
          dataSourceMode={searchResults.dataSourceMode}
          warningMessage={searchResults.warningMessage}
          onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        />
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Category & Facility Filters */}
        <HospitalFilters
          selectedCategory={categoryFilter}
          onSelectCategory={setCategoryFilter}
          requiredFacilities={requiredFacilities}
          onToggleFacility={handleToggleFacility}
          verifiedOnly={verifiedOnly}
          onToggleVerifiedOnly={() => setVerifiedOnly(!verifiedOnly)}
          sortBy={sortBy}
          onChangeSortBy={setSortBy}
          onResetFilters={handleResetFilters}
        />

        {/* View Mode Toolbar */}
        <div className="flex items-center justify-between pb-1">
          <div className="text-xs text-slate-500 font-medium">
            Showing{' '}
            <span className="font-bold text-slate-900 font-mono tabular-nums">
              {searchResults.hospitals.length}
            </span>{' '}
            hospitals within{' '}
            <span className="font-bold text-slate-900 font-mono tabular-nums">
              {radiusKm} km
            </span>
          </div>

          {/* Desktop & Mobile View Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('split')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'split'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'map'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Full Map</span>
            </button>
          </div>
        </div>

        {/* Dynamic Layout: Split View / List / Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Hospital Listings Column */}
          {(viewMode === 'split' || viewMode === 'list') && (
            <div
              className={`space-y-4 ${
                viewMode === 'split' ? 'lg:col-span-6 xl:col-span-7' : 'lg:col-span-12'
              }`}
            >
              {isLoading ? (
                <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                  <p className="text-sm font-medium">
                    Searching nearby Government and Private hospitals...
                  </p>
                </div>
              ) : searchResults.hospitals.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">
                    No Hospitals Matched All Selected Filters
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Try expanding the search radius, unchecking some facility requirements, or switching hospital category to "All Hospitals".
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                  >
                    Reset Filter Options
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-4 ${
                    viewMode === 'list'
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {searchResults.hospitals.map((hospital) => (
                    <HospitalCard
                      key={hospital.id}
                      hospital={hospital}
                      isSelected={hospital.id === selectedHospital?.id}
                      onSelect={(h) => setSelectedHospital(h)}
                      onViewDetails={(h) => setDetailsHospital(h)}
                      isCompared={comparedHospitals.some((c) => c.id === hospital.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Interactive Map Column */}
          {(viewMode === 'split' || viewMode === 'map') && (
            <div
              id="map-section"
              className={`sticky top-20 ${
                viewMode === 'split'
                  ? 'lg:col-span-6 xl:col-span-5 h-[680px]'
                  : 'lg:col-span-12 h-[760px]'
              }`}
            >
              <InteractiveMap
                userLat={coordinates.lat}
                userLng={coordinates.lng}
                radiusKm={radiusKm}
                hospitals={searchResults.hospitals}
                selectedHospitalId={selectedHospital?.id}
                onSelectHospital={(h) => setSelectedHospital(h)}
                onOpenDetails={(h) => setDetailsHospital(h)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Floating Compare Bar (Bottom) */}
      {comparedHospitals.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1100] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-700">
          <div className="text-xs">
            <span className="font-bold text-emerald-400 font-mono tabular-nums">
              {comparedHospitals.length}
            </span>{' '}
            hospitals selected for comparison
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Compare Side-by-Side
          </button>
          <button
            onClick={() => setComparedHospitals([])}
            className="text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* Individual Hospital Details Modal */}
      <HospitalDetailsModal
        hospital={detailsHospital}
        onClose={() => setDetailsHospital(null)}
        onToggleCompare={handleToggleCompare}
        isCompared={
          detailsHospital
            ? comparedHospitals.some((c) => c.id === detailsHospital.id)
            : false
        }
      />

      {/* Side-by-Side Compare Modal */}
      {isCompareModalOpen && (
        <HospitalCompareModal
          hospitals={comparedHospitals}
          onClose={() => setIsCompareModalOpen(false)}
          onRemoveHospital={handleRemoveCompare}
          onOpenDetails={(h) => setDetailsHospital(h)}
        />
      )}

      {/* Download Project Modal (Windows-safe JSZip generator) */}
      <DownloadProjectModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Verification Framework & Standards Section */}
      <VerificationStandards />

      {/* Clean Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Healthcare Intelligence — Nearby Government & Private Hospital Discovery Engine
          </div>
          <div className="text-slate-400">
            Real data from NHP, DME Tamil Nadu, NABH & OpenStreetMap · Verified for Emergency Readiness
          </div>
        </div>
      </footer>
    </div>
  );
}
