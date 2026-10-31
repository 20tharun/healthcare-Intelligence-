/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhoneCall } from 'lucide-react';

interface NavbarProps {
  onQuickLocateEmergency: () => void;
  onOpenCompare?: () => void;
  compareCount: number;
  onOpenDownloadModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onQuickLocateEmergency,
  onOpenCompare,
  compareCount,
  onOpenDownloadModal,
}) => {
  return (
    <header className="sticky top-0 z-[1000] bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>Healthcare Intelligence</span>
        </a>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#search-section"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Hospital Discovery
          </a>
          <a
            href="#map-section"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Live Map
          </a>
          <a
            href="#verification-standards"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Data Standards
          </a>
          {compareCount > 0 && onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="text-purple-700 hover:text-purple-900 font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Compare Hospitals ({compareCount})
            </button>
          )}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenDownloadModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 whitespace-nowrap cursor-pointer"
            title="Download full project code as a ZIP file"
          >
            <span>Download ZIP</span>
          </button>
          <button
            onClick={onQuickLocateEmergency}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency 24/7 ER</span>
          </button>
        </div>
      </div>
    </header>
  );
};
