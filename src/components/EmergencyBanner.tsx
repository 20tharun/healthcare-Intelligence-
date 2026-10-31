/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhoneCall, AlertTriangle, ShieldAlert } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-rose-50 border-y border-rose-200/80 py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-rose-950">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold">Life-Threatening Emergency?</span>{' '}
            <span className="text-rose-900">
              For acute cardiac arrest, stroke, severe trauma, or respiratory distress, do not delay. Dispatch an emergency ambulance immediately.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:108"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Dial 108 (Ambulance)</span>
          </a>
          <a
            href="tel:104"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-rose-800 border border-rose-300 hover:bg-rose-100 font-semibold rounded-lg transition-colors"
          >
            <span>Dial 104 (Health Advice)</span>
          </a>
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-rose-800 border border-rose-300 hover:bg-rose-100 font-semibold rounded-lg transition-colors"
          >
            <span>Dial 112 (National Emergency)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
