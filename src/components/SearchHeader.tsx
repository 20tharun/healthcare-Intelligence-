/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Download,
} from 'lucide-react';
import { FilterState, SearchCoordinates } from '../types/hospital';

interface SearchHeaderProps {
  coordinates: SearchCoordinates;
  onChangeCoordinates: (coords: SearchCoordinates) => void;
  radiusKm: number;
  onChangeRadius: (radius: number) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  locationError?: string | null;
  // Summary Stats
  totalFound: number;
  governmentCount: number;
  privateCount: number;
  emergencyCount: number;
  dataSourceMode: 'live_osm_and_directory' | 'verified_directory_fallback';
  warningMessage?: string;
  onOpenDownloadModal?: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  coordinates,
  onChangeCoordinates,
  radiusKm,
  onChangeRadius,
  searchQuery,
  onChangeSearchQuery,
  onUseCurrentLocation,
  isLocating,
  locationError,
  totalFound,
  governmentCount,
  privateCount,
  emergencyCount,
  dataSourceMode,
  warningMessage,
  onOpenDownloadModal,
}) => {
  const [showCustomCoords, setShowCustomCoords] = useState(false);
  const [customLat, setCustomLat] = useState(coordinates.lat.toString());
  const [customLng, setCustomLng] = useState(coordinates.lng.toString());

  // Prompt's exact example coordinates:
  // Latitude: 11.032731848247023, Longitude: 76.92993497319851 (Coimbatore)
  const exampleCoords: SearchCoordinates = {
    lat: 11.032731848247023,
    lng: 76.92993497319851,
    label: 'Coimbatore, Tamil Nadu (Example Coordinates)',
  };

  const handleApplyCustomCoords = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      onChangeCoordinates({
        lat,
        lng,
        label: `Custom Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      });
      setShowCustomCoords(false);
    }
  };

  const radiusOptions = [5, 10, 15, 25, 50];

  return (
    <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title & Introduction */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-blue-700 mb-1">
              Healthcare Intelligence Platform
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Nearby Hospital Discovery & Facility Verification
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Identify verified Government and Private hospitals within your radius. Every medical facility status (Emergency, ICU, Oxygen, Ventilator, Blood Bank) is grounded in verified institutional and public health registries.
            </p>
          </div>

          {/* Quick preset & download buttons */}
          <div className="shrink-0 flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenDownloadModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
              title="Download entire project code as a ZIP archive"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Code (.ZIP)</span>
            </button>
            <button
              onClick={() => {
                onChangeCoordinates(exampleCoords);
                onChangeRadius(15);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Load Prompt Test Data (Coimbatore 15km)</span>
            </button>
          </div>
        </div>

        {/* Search Controls Toolbar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          {/* Location Action & Info (5 cols) */}
          <div className="lg:col-span-5 flex items-center gap-2">
            <button
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting Location...' : 'Use My Current Location'}</span>
            </button>

            <div className="min-w-0 flex-1 px-2.5 py-2 bg-white rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center gap-1 text-slate-500 font-medium truncate">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">
                  {coordinates.label || 'Search Origin'}:
                </span>
              </div>
              <div className="font-mono font-semibold text-slate-800 text-[11px] truncate tabular-nums">
                {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
              </div>
            </div>

            <button
              onClick={() => setShowCustomCoords(!showCustomCoords)}
              className="p-2.5 bg-white text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-xs"
              title="Enter custom coordinates"
              aria-label="Enter custom coordinates"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Search Radius Options (4 cols) */}
          <div className="lg:col-span-4 flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap mr-1">
              Radius:
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 w-full justify-between">
              {radiusOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => onChangeRadius(r)}
                  className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors font-mono tabular-nums ${
                    radiusKm === r
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>
          </div>

          {/* Name / Keyword Search Input (3 cols) */}
          <div className="lg:col-span-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              placeholder="Search by hospital name..."
              className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Custom Coordinates Collapsible Form */}
        {showCustomCoords && (
          <form
            onSubmit={handleApplyCustomCoords}
            className="p-4 bg-slate-100 rounded-xl border border-slate-300 flex flex-wrap items-center gap-3 text-xs"
          >
            <div className="font-semibold text-slate-700">Enter Coordinates:</div>
            <div className="flex items-center gap-2">
              <label className="text-slate-500">Latitude:</label>
              <input
                type="text"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs w-36"
                placeholder="e.g. 11.0327"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-slate-500">Longitude:</label>
              <input
                type="text"
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs w-36"
                placeholder="e.g. 76.9299"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800"
            >
              Update Search Origin
            </button>
            <button
              type="button"
              onClick={() => setShowCustomCoords(false)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Geolocation Warning / Feedback */}
        {locationError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Search Summary Metric Strip (Matching Section 8 of prompt) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Total Hospitals Found</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-0.5">
              {totalFound}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Within {radiusKm} km radius
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Government Hospitals</div>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-0.5">
              {governmentCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Public & teaching institutions
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Private Hospitals</div>
            <div className="text-2xl font-extrabold text-rose-700 font-mono tabular-nums mt-0.5">
              {privateCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Super-speciality & clinics
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Emergency 24/7 Verified</div>
            <div className="text-2xl font-extrabold text-blue-700 font-mono tabular-nums mt-0.5">
              {emergencyCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Instant casualty & trauma care
            </div>
          </div>
        </div>

        {/* Directory Coverage Notice */}
        {warningMessage && (
          <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
            <span>ℹ️ {warningMessage}</span>
            <span className="font-semibold text-slate-700">Verified Local Directory Active</span>
          </div>
        )}
      </div>
    </div>
  );
};
