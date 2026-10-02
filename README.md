# Sanjeevani Multispeciality Hospital
## AI-Based Early Warning & Patient Health Monitoring Command Center

A modern, responsive healthcare monitoring web platform designed to continuously monitor patient vital signs across all hospital wards and automatically detect physiological deterioration, reducing routine manual checks and directing immediate clinical focus to patients in critical need.

> **Clinical Decision Support Prototype Disclaimer:**  
> This system is intended as a clinical decision-support prototype and demonstration model. Alerts and risk scores are for decision support and do not replace professional medical judgment or physician assessment.

---

## 🏥 Hospital Overview
- **Hospital Name:** Sanjeevani Multispeciality Hospital
- **Campus:** Sector 14 Healthcare Complex
- **Floor Hierarchy & Departments:**
  - **Floor 1:** Critical Care & Emergency Complex (Emergency ER-101 to ER-102, ICU-101 to ICU-104, CCU-105 to CCU-106)
  - **Floor 2:** General Inpatient Wards (General Ward A: GW-201 to GW-203, General Ward B: GW-204 to GW-206)
  - **Floor 3:** Speciality Care (Cardiology Ward: CARD-301 to CARD-303, Neurology Ward: NEURO-304 to NEURO-305)
  - **Floor 4:** Surgery & Internal Medicine (Orthopedics Ward: ORTHO-401 to ORTHO-402, General Medicine: MED-403 to MED-405)
- **Monitored Capacity:** 126 Monitored Beds with 28 detailed patient telemetry profiles.

---

## 🚀 Key Features

### 1. Continuous Automated Patient Monitoring
- Real-time physiological telemetry for:
  - **Heart Rate / BPM** (Bradycardia & Tachycardia detection)
  - **Oxygen Saturation (SpO₂ %)** (Hypoxemia & Desaturation detection)
  - **Body Temperature (°C)** (Pyrexia & Hypothermia detection)
  - **Non-Invasive Blood Pressure (NIBP mmHg)** (Hypotension & Hypertensive urgency detection)
  - **Respiratory Rate (/min)** (Tachypnea & Bradypnea detection)
- Automated comparison against doctor-configured thresholds.

### 2. Explainable AI & Risk Scoring Engine
- **Transparent Early Warning Score (0 – 100):**
  - `0 – 24`: Stable (🟢 Green)
  - `25 – 49`: Low Risk (🔵 Blue)
  - `50 – 74`: Moderate Risk (🟡 Yellow)
  - `75 – 89`: High Risk (🟠 Orange)
  - `90 – 100`: Critical (🔴 Red)
- **Explainable AI Breakdown:** Clear clinical factor rationale explaining *"Why is this patient at risk?"* with exact abnormal measurements vs configured thresholds.

### 3. Real-Time Alert System & Web Audio Telemetry Alarm
- Instant detection when parameters breach thresholds.
- High-visibility red alert notification and modal popup.
- Dual-tone medical telemetry alarm (880Hz / 660Hz oscillating pulses using standard Web Audio API).
- Toggleable sound mute control with unacknowledged alert persistence.
- Bedside observation notes recording and time-stamped staff acknowledgment.

### 4. Patient Detail View & Health Trend Graphs
- Interactive time-series trend lines powered by **Recharts** over 1h, 6h, and 24h intervals.
- Clearly marked threshold reference boundary lines.
- Complete demographics, assigned physician, assigned charge nurse, admission date, and primary diagnosis.
- Clinical observation log with real-time entry.

### 5. Hospital Floor & Room Architecture Map
- Interactive 4-floor map with department categorization.
- Real-time room status badges (Stable 🟢, Warning 🟡, Critical 🔴).
- Room drill-down view showing 4-bed allocations (B1 to B4) with patient vitals and room occupancy.

### 6. Threshold Management
- Configurable low/high thresholds with Hospital-wide, Ward-specific, and Patient-specific scopes.
- Role-based authorization (Doctor/Admin editing authority, Nurse observation).
- Audit trail recording who modified limits and when.

### 7. Interactive Presentation DEMO MODE
- Dedicated top bar for project presenters to demonstrate emergency response:
  - **Trigger HR Alert (48 BPM):** Simulates acute bradycardia for Rahul Sharma in ICU-104 (HR drops from 72 to 48 BPM, breaching the 50 BPM threshold, firing the alarm, popup, and audit log).
  - **Trigger SpO₂ Alert (87%):** Simulates desaturation hypoxia.
  - **Simulate Critical Patient:** Triggers multi-organ deterioration.
  - **Simulate Warning:** Simulates mild vitals elevation.
  - **Stabilize Patient:** Normalizes vitals and resolves active alarms.
  - **Reset All:** Restores original demo baseline.
  - **Live Feed Toggle:** Starts/pauses subtle background physiological fluctuations.

---

## 🛠️ Tech Stack
- **Framework:** React 18 with TypeScript & Vite
- **Styling:** Tailwind CSS with medical telemetry theme and ECG grid animations
- **Charts:** Recharts (LineChart, BarChart, PieChart with ReferenceLines)
- **Icons:** Lucide React
- **Audio:** Web Audio API telemetry tone synthesizer (zero external asset dependencies)

---

## 💻 Running the Application Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in any modern web browser.

3. **Build production bundle:**
   ```bash
   npm run build
   ```
