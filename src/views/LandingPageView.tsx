import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  HeartPulse, 
  LogIn, 
  Building2, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  AlertOctagon, 
  Sliders, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const { setAuthScreen, loginHospital } = useHospital();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Background glow and subtle medical grid */}
      <div className="absolute inset-0 ecg-grid opacity-40 pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-900/30">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white block">
                Sanjeevani AI Hospital Monitoring System
              </span>
              <span className="text-[11px] text-teal-400 font-mono tracking-wider block">
                CLINICAL DECISION SUPPORT PLATFORM
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAuthScreen('login')}
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-400" />
              <span>Login to Hospital</span>
            </button>
            <button
              onClick={() => setAuthScreen('register')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/40 transition-all hover:scale-[1.02]"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Register New Hospital</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headings, Description & Buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span>Next-Generation Inpatient Early Warning Surveillance</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Sanjeevani AI Hospital <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-300">
                  Monitoring System
                </span>
              </h1>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-300 mt-3 tracking-tight">
                AI-Powered Early Warning & Patient Health Monitoring
              </h2>
            </div>

            {/* Prompt exact description quote */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              "Monitor patients continuously, detect early warning signs, and help healthcare professionals prioritize patients who need attention."
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setAuthScreen('login')}
                className="flex items-center space-x-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-xl shadow-teal-900/40 transition-all hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Hospital</span>
              </button>

              <button
                onClick={() => setAuthScreen('register')}
                className="flex items-center space-x-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border-2 border-indigo-500/50 hover:border-indigo-400 text-indigo-200 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
              >
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Register New Hospital</span>
              </button>

              {/* Direct Demo Access button for Sanjeevani */}
              <button
                onClick={() => loginHospital('HSP-DEMO', 'Demo@12345', 'DOCTOR')}
                className="flex items-center space-x-2 px-4 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
                title="Directly launch active demo command center with 28 simulated patients"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Quick Demo Access (Sanjeevani Hospital)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Continuous Automated Vitals</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Explainable AI Risk Factors</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Dual-Tone Audio Telemetry</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Telemetry Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border-2 border-teal-500/40 rounded-3xl p-6 shadow-2xl shadow-teal-950/50 relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                    Live Telemetry Surveillance
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">ICU Bed B-1</span>
              </div>

              {/* Patient preview */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">Rahul Sharma</h3>
                  <p className="text-xs text-slate-400">64y • ICU-104 • Severe Pneumonia</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white animate-pulse">
                  CRITICAL (92/100)
                </span>
              </div>

              {/* Live Waveform */}
              <div className="my-4 h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center px-3 relative overflow-hidden">
                <div className="absolute inset-0 ecg-grid-dark opacity-30"></div>
                <svg className="w-full h-10 overflow-visible relative z-10" viewBox="0 0 300 40">
                  <path
                    d="M 0 20 L 40 20 L 50 18 L 55 22 L 60 20 L 70 20 L 75 8 L 80 32 L 85 15 L 90 20 L 110 20 L 120 20 L 130 18 L 135 22 L 140 20 L 150 20 L 155 8 L 160 32 L 165 15 L 170 20 L 300 20"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300">
                  <span className="text-[10px] text-slate-400 block font-semibold">HEART RATE</span>
                  <span className="text-xl font-black font-mono">48</span>
                  <span className="text-[10px] block">BPM (Low)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300">
                  <span className="text-[10px] text-slate-400 block font-semibold">SpO₂</span>
                  <span className="text-xl font-black font-mono">89%</span>
                  <span className="text-[10px] block">Hypoxic</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">TEMP</span>
                  <span className="text-xl font-black font-mono">38.9°C</span>
                  <span className="text-[10px] text-amber-400 block">Pyrexia</span>
                </div>
              </div>

              {/* Alert Notification Quote */}
              <div className="mt-4 p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-xs text-red-200 flex items-start space-x-2">
                <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <span className="font-bold text-white">Automated Alert: </span>
                  <span>Parameters crossed doctor limit. Bedside alert chime active.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Section */}
        <div className="mt-16 pt-12 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Continuous Vital Telemetry</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Real-time surveillance of Heart Rate, SpO₂, Blood Pressure, Temperature, and Respiratory Rate, replacing tedious manual checks across hundreds of patients.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Explainable AI Risk Scores</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Transparent 0–100 Early Warning Scoring with explicit clinical factors explaining why a patient is deteriorating before acute collapse occurs.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Doctor Configurable Limits</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Attending physicians set protocol limits hospital-wide, ward-specific, or patient-tailored, with full audit trail logging of staff modifications.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <p>Sanjeevani AI Hospital Monitoring System • Clinical Decision Support Prototype v2.5</p>
        <p className="text-[11px] text-slate-600 mt-1">Designed for multispeciality hospitals, ICUs, emergency wards, and surgical suites.</p>
      </footer>
    </div>
  );
};
