/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { generateAndDownloadProjectZip } from '../utils/clientZip';
import {
  X,
  Download,
  CheckCircle2,
  AlertTriangle,
  FolderArchive,
  Terminal,
  Copy,
  Check,
  FileCode,
  ExternalLink,
} from 'lucide-react';

interface DownloadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadProjectModal: React.FC<DownloadProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    const res = await generateAndDownloadProjectZip();
    setIsGenerating(false);

    if (res.success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } else {
      alert(`Download error: ${res.error}`);
    }
  };

  const gitCommands = `# 1. Open Terminal or Command Prompt on your computer
mkdir healthcare-intelligence
cd healthcare-intelligence

# 2. Extract the downloaded healthcare-intelligence-source.zip here
# 3. Install packages and run
npm install
npm run dev`;

  const copyGitCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1300] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Download Complete Source Code (ZIP)
              </h3>
              <p className="text-xs text-slate-500">
                Windows, macOS & Linux compatible archive with zero corruption
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Main Action Banner */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Fixed Windows-Compatible ZIP Archive
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  The previous download failed because the browser preview iframe intercepted the file as HTML. Click below to generate a fresh, verified binary ZIP directly inside your browser.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-60"
            >
              <Download className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
              <span>
                {isGenerating
                  ? 'Packaging All Files...'
                  : 'Download healthcare-intelligence-source.zip'}
              </span>
            </button>

            {downloadSuccess && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/80 p-2.5 rounded-lg border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Downloaded successfully! Check your <strong>Downloads</strong> folder. Right-click and choose <strong>"Extract All..."</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Windows Troubleshooting Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Why Windows Showed "The Compressed Folder is Invalid":
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-800">1. Cause</div>
                <p className="text-slate-600">
                  Your browser saved a 0-byte or HTML webpage error file instead of the actual ZIP file because of iframe security sandbox.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-800">2. Fix (Active Now)</div>
                <p className="text-slate-600">
                  We now assemble all files into real standard binary ZIP format with <strong>DOS/Windows compatible compression</strong> directly in memory.
                </p>
              </div>
            </div>
          </div>

          {/* How to run locally */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                How to Run on Your PC
              </span>
              <button
                onClick={copyGitCommands}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                {copiedGit ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
              {gitCommands}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
