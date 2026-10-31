/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import JSZip from 'jszip';

// Use Vite's raw glob import to embed all source files directly at build time
const rawFiles = import.meta.glob(
  [
    '/src/**/*.{ts,tsx,css}',
    '/package.json',
    '/index.html',
    '/tsconfig.json',
    '/vite.config.ts',
    '/metadata.json',
    '/README.md',
    '/.env.example',
    '/.gitignore',
  ],
  { query: '?raw', eager: true, import: 'default' }
);

export async function generateAndDownloadProjectZip(): Promise<{ success: boolean; error?: string }> {
  try {
    const zip = new JSZip();

    // Iterate through all imported files
    for (const [path, content] of Object.entries(rawFiles)) {
      // Remove leading slash if present
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      if (typeof content === 'string') {
        zip.file(cleanPath, content);
      }
    }

    // Generate valid Windows-compatible ZIP blob
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
      platform: 'DOS', // Guarantee Windows File Explorer compatibility
    });

    // Create download link and trigger
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'healthcare-intelligence-source.zip';
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);

    return { success: true };
  } catch (err: any) {
    console.error('Failed to generate client zip', err);
    return { success: false, error: err?.message || 'Failed to generate ZIP' };
  }
}
