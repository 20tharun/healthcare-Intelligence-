/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Hospital } from '../types/hospital';
import { getGoogleMapsDirectionsUrl } from '../services/hospitalService';
import { Locate, Navigation, Crosshair } from 'lucide-react';

interface InteractiveMapProps {
  userLat: number;
  userLng: number;
  radiusKm: number;
  hospitals: Hospital[];
  selectedHospitalId?: string | null;
  onSelectHospital: (hospital: Hospital) => void;
  onOpenDetails: (hospital: Hospital) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  userLat,
  userLng,
  radiusKm,
  hospitals,
  selectedHospitalId,
  onSelectHospital,
  onOpenDetails,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLat, userLng],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center, radius circle, and markers when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    // Clear previous markers
    markersLayer.clearLayers();

    // 1. User Location Marker (Blue)
    const userIcon = L.divIcon({
      className: 'user-pin-wrapper',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background-color: #2563eb;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 14px rgba(37,99,235,0.6);
          position: relative;
        ">
          <div style="
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 2px solid #60a5fa;
            opacity: 0.6;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLat, userLng]);
    } else {
      userMarkerRef.current = L.marker([userLat, userLng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(markersLayer);
      userMarkerRef.current.bindPopup(
        `<div style="font-family: inherit; font-size: 13px; font-weight: 600; color: #1e293b; padding: 4px;">
          📍 Your Search Location<br/>
          <span style="font-size: 11px; font-weight: 400; color: #64748b;">${userLat.toFixed(4)}, ${userLng.toFixed(4)}</span>
        </div>`
      );
    }

    // Radius circle
    if (radiusCircleRef.current) {
      radiusCircleRef.current.setLatLng([userLat, userLng]);
      radiusCircleRef.current.setRadius(radiusKm * 1000);
    } else {
      radiusCircleRef.current = L.circle([userLat, userLng], {
        radius: radiusKm * 1000,
        color: '#3b82f6',
        fillColor: '#93c5fd',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 6',
      }).addTo(map);
    }

    // 2. Add hospital markers
    const allLatLngs: L.LatLngTuple[] = [[userLat, userLng]];

    hospitals.forEach((hospital) => {
      allLatLngs.push([hospital.lat, hospital.lng]);

      const isSpecialty =
        hospital.hospitalType.includes('Specialty') ||
        hospital.hospitalType.includes('Speciality');
      const isGov = hospital.category === 'Government';

      // Pin Color rules: Green for Gov, Red for Private, Amber/Purple for Specialty
      let pinColor = '#dc2626'; // Red for Private
      let pinLabel = 'P';
      if (isGov) {
        pinColor = '#16a34a'; // Green for Government
        pinLabel = 'G';
      } else if (isSpecialty) {
        pinColor = '#9333ea'; // Purple for Specialty
        pinLabel = 'S';
      }

      const isSelected = hospital.id === selectedHospitalId;

      const hospitalIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            background-color: ${pinColor};
            border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 700;
            font-size: ${isSelected ? '14px' : '12px'};
            font-family: inherit;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            outline: ${isSelected ? '3px solid ' + pinColor : 'none'};
          ">
            ${pinLabel}
          </div>
        `,
        iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
        iconAnchor: [isSelected ? 18 : 15, isSelected ? 18 : 15],
      });

      const marker = L.marker([hospital.lat, hospital.lng], {
        icon: hospitalIcon,
        zIndexOffset: isSelected ? 500 : 100,
      }).addTo(markersLayer);

      const directionsUrl = getGoogleMapsDirectionsUrl(
        hospital.lat,
        hospital.lng,
        hospital.name
      );

      const hasEmergency =
        hospital.facilities.emergencyDepartment24x7 === 'verified';
      const hasIcu = hospital.facilities.icu === 'verified';

      // Popup Content
      const popupHtml = document.createElement('div');
      popupHtml.style.fontFamily =
        "'Plus Jakarta Sans', system-ui, sans-serif";
      popupHtml.style.minWidth = '240px';
      popupHtml.style.maxWidth = '290px';
      popupHtml.style.padding = '4px';

      popupHtml.innerHTML = `
        <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
          <span style="
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${isGov ? '#15803d' : '#b91c1c'};
          ">${hospital.category} · ${hospital.hospitalType}</span>
          <span style="font-size: 12px; font-weight: 600; color: #0284c7; white-space: nowrap;">
            ${hospital.distanceKm ?? 0} km away
          </span>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #0f172a; line-height: 1.3; margin-bottom: 4px;">
          ${hospital.name}
        </div>
        <div style="font-size: 12px; color: #64748b; line-height: 1.4; margin-bottom: 8px;">
          ${hospital.address}
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
          ${
            hasEmergency
              ? '<span style="font-size: 11px; font-weight: 600; color: #16a34a; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 2px 6px; border-radius: 4px;">✓ 24/7 Emergency</span>'
              : '<span style="font-size: 11px; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px 6px; border-radius: 4px;">Emergency: Unverified</span>'
          }
          ${
            hasIcu
              ? '<span style="font-size: 11px; font-weight: 600; color: #16a34a; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 2px 6px; border-radius: 4px;">✓ ICU Verified</span>'
              : ''
          }
        </div>
        <div style="display: flex; gap: 6px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
          <button id="view-details-btn-${hospital.id}" style="
            flex: 1;
            padding: 6px 10px;
            background: #0f172a;
            color: #ffffff;
            font-size: 12px;
            font-weight: 600;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            text-align: center;
          ">View Details</button>
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 10px;
            background: #f8fafc;
            color: #2563eb;
            font-size: 12px;
            font-weight: 600;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            text-decoration: none;
            white-space: nowrap;
          ">Directions ↗</a>
        </div>
      `;

      marker.bindPopup(popupHtml);

      // Handle popup open event to attach click listener
      marker.on('popupopen', () => {
        onSelectHospital(hospital);
        const btn = document.getElementById(`view-details-btn-${hospital.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            onOpenDetails(hospital);
          };
        }
      });
    });

    // Fit bounds if hospitals exist, otherwise center on user
    if (hospitals.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds(allLatLngs);
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 14,
      });
    } else {
      map.setView([userLat, userLng], 12);
    }
  }, [userLat, userLng, radiusKm, hospitals, selectedHospitalId]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLat, userLng], 13);
    }
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current) return;
    const allPoints: L.LatLngTuple[] = [
      [userLat, userLng],
      ...hospitals.map((h) => [h.lat, h.lng] as L.LatLngTuple),
    ];
    if (allPoints.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(allPoints), {
        padding: [30, 30],
        maxZoom: 14,
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      {/* Map canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="p-2.5 bg-white text-slate-700 hover:text-slate-900 rounded-lg shadow-md border border-slate-200 transition-colors"
          title="Recenter to my location"
          aria-label="Recenter to my location"
        >
          <Locate className="w-4 h-4 text-blue-600" />
        </button>
        <button
          onClick={handleFitAll}
          className="p-2.5 bg-white text-slate-700 hover:text-slate-900 rounded-lg shadow-md border border-slate-200 transition-colors"
          title="Fit all hospitals"
          aria-label="Fit all hospitals"
        >
          <Crosshair className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs py-2 px-3 rounded-lg border border-slate-200 shadow-md text-xs">
        <div className="font-semibold text-slate-900 mb-1.5">Map Legend</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-300"></span>
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            <span>Government</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span>Private</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600"></span>
            <span>Specialty</span>
          </div>
        </div>
      </div>
    </div>
  );
};
