# Healthcare Intelligence – Nearby Hospital Discovery

A production-grade web application to discover, verify, and navigate **Government and Private** hospitals within a customizable search radius. The system validates 40+ healthcare facilities (Emergency, ICU, Oxygen, Ventilator, Blood Bank, Diagnostics, and Clinical Specialities) against verified public healthcare directories and institutional registries.

---

## 🌟 Key Features

- **Government & Private Discovery**: Identifies Medical College Hospitals, District Headquarters Hospitals, Taluk Hospitals, Community Health Centres (CHCs), Primary Health Centres (PHCs), Private Super-Speciality / Multi-Speciality Hospitals, and Clinics.
- **Facility Verification Standards**: 4-state grounded verification model (`Verified`, `Contact to Confirm`, `Not Verified`, `Unavailable`) preventing misleading hospital claims.
- **Interactive Leaflet Map**: Custom color-coded markers (Blue for user location, Green for Government, Red for Private, Purple for Specialty) with search radius boundary rings.
- **Google Maps Navigation**: 1-click direct GPS directions link (`https://www.google.com/maps/dir/?api=1&destination=...`) for every hospital.
- **Side-by-Side Comparison Matrix**: Compare up to 3 hospitals simultaneously on critical care capabilities, diagnostics, and distance.
- **Geolocation & Test Presets**: Supports direct browser GPS location ("Use My Current Location") as well as 1-click test coordinate presets.
- **Zero-Break Fallback**: Seamless fallback to verified local registry when external map APIs encounter network latency.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   cd <YOUR_REPOSITORY_NAME>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
├── index.html                   # HTML entry point with Leaflet & typography setup
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite bundler configuration
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Main application orchestrator & layout
    ├── index.css                # Tailwind CSS & custom map pin styles
    ├── types/
    │   └── hospital.ts          # Type definitions for hospitals, facilities & filters
    ├── data/
    │   └── verifiedHospitals.ts # Verified hospital registry with facility audits
    ├── services/
    │   └── hospitalService.ts   # Haversine distance, OSM live query & deduplication
    └── components/
        ├── Navbar.tsx           # Navigation bar with quick ER dispatch action
        ├── SearchHeader.tsx     # Location inputs, radius selector & KPI summary
        ├── HospitalFilters.tsx  # Category tabs & facility checklist
        ├── HospitalCard.tsx     # Comprehensive hospital card
        ├── InteractiveMap.tsx   # Leaflet interactive map with custom colored pins
        ├── HospitalDetailsModal.tsx # Detailed hospital profile with facility audit tabs
        ├── HospitalCompareModal.tsx # Side-by-side comparison table
        ├── EmergencyBanner.tsx  # National emergency helplines (108 / 112 / 104)
        └── VerificationStandards.tsx# Audit framework & data governance rules
```

---

## 🔒 Data Governance & Accuracy

This project follows strict healthcare data governance guidelines:
- Never assumes that a hospital has a facility merely because it is large or famous.
- No fabricated phone numbers, coordinates, or facility ratings.
- Clarifies that directory listings do not replace real-time emergency triage or bed reservations. In life-threatening emergencies, always dial **108 / 112**.

---

## 📄 License

Apache-2.0


## website link 
https://healthcare-intelligence-nearby-hospital-discovery.ai.studio
