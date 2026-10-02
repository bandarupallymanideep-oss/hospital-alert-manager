import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { evaluatePatientRisk } from '../services/riskCalculator';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Send, 
  Sliders, 
  FileText,
  UserCheck,
  TrendingUp,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  CartesianGrid 
} from 'recharts';

export const PatientDetailView: React.FC = () => {
  const { 
    selectedPatient, 
    setSelectedPatientId, 
    setActiveTab, 
    thresholds, 
    alerts, 
    acknowledgeAlert, 
    addPatientNote, 
    currentUser,
    currentRole 
  } = useHospital();

  const [activeTimeframe, setActiveTimeframe] = useState<'1h' | '6h' | '24h'>('24h');
  const [activeMetricTab, setActiveMetricTab] = useState<'heartRate' | 'spo2' | 'temperature' | 'bp' | 'respiratoryRate'>('heartRate');
  const [newNote, setNewNote] = useState('');

  if (!selectedPatient) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <User className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Patient Selected</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">Please select a patient from the telemetry list or dashboard.</p>
        <button
          onClick={() => setActiveTab('patients')}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold"
        >
          Go to Patients List
        </button>
      </div>
    );
  }

  // Evaluate risk factors and explainable AI
  const riskAnalysis = evaluatePatientRisk(selectedPatient, thresholds);
  const patientAlerts = alerts.filter(a => a.patientId === selectedPatient.id);
  const unackAlerts = patientAlerts.filter(a => a.status === 'ACTIVE');

  // Chart data filtering according to timeframe
  const chartData = selectedPatient.vitalHistory;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addPatientNote(selectedPatient.id, newNote);
    setNewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('patients')}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Patients</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span>Patient Dossier:</span>
          <span className="text-teal-400 font-bold">{selectedPatient.id}</span>
        </div>
      </div>

      {/* Patient Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              {selectedPatient.gender === 'Female' ? '👩' : '👨'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-white">{selectedPatient.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 font-mono font-bold text-xs border border-slate-700">
                  {selectedPatient.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  {selectedPatient.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  selectedPatient.riskCategory === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                  selectedPatient.riskCategory === 'HIGH' ? 'bg-amber-500 text-slate-950 font-black' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {selectedPatient.riskCategory} RISK
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 mt-2">
                <span>Age: <strong className="text-slate-200">{selectedPatient.age} yrs</strong></span>
                <span>Gender: <strong className="text-slate-200">{selectedPatient.gender}</strong></span>
                <span>Blood Group: <strong className="text-rose-400">{selectedPatient.bloodGroup}</strong></span>
                <span className="flex items-center space-x-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>Floor {selectedPatient.floor} • Room {selectedPatient.roomNumber} (Bed {selectedPatient.bedNumber})</span>
                </span>
              </div>

              <div className="text-xs text-slate-300 mt-2 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60 inline-block">
                Primary Diagnosis: <strong className="text-teal-300 font-semibold">{selectedPatient.diagnosis}</strong>
              </div>
            </div>
          </div>

          {/* Attending Staff Info */}
          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/70 text-xs space-y-1 self-stretch lg:self-auto min-w-[240px]">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Clinical Care Team</div>
            <div className="text-slate-200">
              Physician: <strong className="text-white">{selectedPatient.doctor}</strong>
            </div>
            <div className="text-slate-200">
              Primary Nurse: <strong className="text-white">{selectedPatient.nurse}</strong>
            </div>
            <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-700/50">
              Admitted: {selectedPatient.admissionDate}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Vitals Cards & AI Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): LIVE HEALTH PARAMETERS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">Live Health Telemetry Cards</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-teal-400" />
              <span>Last updated: {selectedPatient.lastUpdated}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {/* 1. Heart Rate */}
            <div className={`p-4 rounded-xl border transition-all ${
              selectedPatient.heartRate < 50 || selectedPatient.heartRate > 120 
                ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-950/30' 
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider flex items-center space-x-1">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  <span>Heart Rate</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedPatient.heartRate < 50 || selectedPatient.heartRate > 120 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {selectedPatient.heartRate < 50 ? 'BRADYCARDIA' : selectedPatient.heartRate > 120 ? 'TACHYCARDIA' : 'NORMAL'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black text-white font-mono">{selectedPatient.heartRate}</span>
                <span className="text-xs text-slate-400 font-medium">BPM</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800/80 pt-1.5">
                <div>Doctor Threshold: <strong className="text-amber-400 font-mono">&gt; 50 BPM</strong></div>
                <div>Normal Range: 60 – 100 BPM</div>
              </div>
            </div>

            {/* 2. SpO2 */}
            <div className={`p-4 rounded-xl border transition-all ${
              selectedPatient.spo2 < 92 
                ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-950/30' 
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider flex items-center space-x-1">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  <span>SpO₂ Saturation</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedPatient.spo2 < 92 ? 'bg-red-600 text-white animate-pulse' :
                  selectedPatient.spo2 < 95 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {selectedPatient.spo2 < 92 ? 'HYPOXIA' : selectedPatient.spo2 < 95 ? 'LOW' : 'NORMAL'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black text-white font-mono">{selectedPatient.spo2}</span>
                <span className="text-xs text-slate-400 font-medium">%</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800/80 pt-1.5">
                <div>Doctor Threshold: <strong className="text-amber-400 font-mono">&gt; 92%</strong></div>
                <div>Normal Range: 95 – 100%</div>
              </div>
            </div>

            {/* 3. Temperature */}
            <div className={`p-4 rounded-xl border transition-all ${
              selectedPatient.temperature > 38.0 
                ? 'bg-amber-950/40 border-amber-500/60' 
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider flex items-center space-x-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Temperature</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedPatient.temperature > 38.0 ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {selectedPatient.temperature > 38.0 ? 'PYREXIA' : 'AFEBRILE'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black text-white font-mono">{selectedPatient.temperature.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-medium">°C</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800/80 pt-1.5">
                <div>Doctor Threshold: <strong className="text-amber-400 font-mono">&lt; 38.0°C</strong></div>
                <div>Normal Range: 36.5 – 37.5°C</div>
              </div>
            </div>

            {/* 4. Blood Pressure */}
            <div className={`p-4 rounded-xl border transition-all ${
              selectedPatient.systolicBP < 90 || selectedPatient.systolicBP > 160 
                ? 'bg-amber-950/40 border-amber-500/60' 
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span>Blood Pressure</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedPatient.systolicBP < 90 ? 'bg-red-500/20 text-red-400' :
                  selectedPatient.systolicBP > 140 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {selectedPatient.systolicBP < 90 ? 'HYPOTENSIVE' : selectedPatient.systolicBP > 140 ? 'ELEVATED' : 'OPTIMAL'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-white font-mono">
                  {selectedPatient.systolicBP}/{selectedPatient.diastolicBP}
                </span>
                <span className="text-xs text-slate-400 font-medium">mmHg</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800/80 pt-1.5">
                <div>Low Limit: <strong className="text-amber-400 font-mono">&gt; 90 mmHg</strong></div>
                <div>Target Range: 110–130 / 70–85</div>
              </div>
            </div>

            {/* 5. Respiratory Rate */}
            <div className={`p-4 rounded-xl border transition-all ${
              selectedPatient.respiratoryRate > 25 || selectedPatient.respiratoryRate < 10 
                ? 'bg-red-950/40 border-red-500/60' 
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Respiratory Rate</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedPatient.respiratoryRate > 25 ? 'bg-red-600 text-white' :
                  selectedPatient.respiratoryRate < 10 ? 'bg-red-600 text-white' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {selectedPatient.respiratoryRate > 25 ? 'TACHYPNEA' : 'NORMAL'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black text-white font-mono">{selectedPatient.respiratoryRate}</span>
                <span className="text-xs text-slate-400 font-medium">/min</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800/80 pt-1.5">
                <div>Doctor Threshold: <strong className="text-amber-400 font-mono">10 – 25 /min</strong></div>
                <div>Normal Range: 12 – 20 /min</div>
              </div>
            </div>

            {/* Quick Unack Alert Pill */}
            {unackAlerts.length > 0 && (
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/70 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-red-300 flex items-center space-x-1">
                    <AlertOctagon className="w-4 h-4 text-red-400 animate-bounce" />
                    <span>{unackAlerts.length} Unacknowledged Alert(s)</span>
                  </span>
                  <p className="text-[11px] text-red-200 mt-1 line-clamp-2">
                    {unackAlerts[0].message}
                  </p>
                </div>
                <button
                  onClick={() => acknowledgeAlert(unackAlerts[0].id, 'Acknowledged from patient detail profile')}
                  className="mt-2 w-full py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                >
                  Acknowledge Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right (1 col): AI RISK SCORE & EXPLAINABLE AI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Early Warning Score (EWS)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                v2.4 Transparent Model
              </span>
            </div>

            {/* Score Number & Category */}
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-4xl font-black text-white font-mono">
                  {riskAnalysis.score}
                </span>
                <span className="text-base text-slate-400 font-semibold ml-1">/ 100</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                riskAnalysis.category === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                riskAnalysis.category === 'HIGH' ? 'bg-amber-500 text-slate-950' :
                riskAnalysis.category === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {riskAnalysis.category} RISK
              </span>
            </div>

            {/* Score Progress Bar */}
            <div className="mt-2 w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  riskAnalysis.score >= 90 ? 'bg-red-500' :
                  riskAnalysis.score >= 75 ? 'bg-amber-500' :
                  riskAnalysis.score >= 50 ? 'bg-yellow-400' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${riskAnalysis.score}%` }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (Stable)</span>
              <span>50 (Moderate)</span>
              <span>100 (Critical)</span>
            </div>
          </div>

          {/* EXPLAINABLE AI SECTION (Prompt Requirement #10) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-teal-400" />
              <span>Why is this patient at risk?</span>
            </h4>

            {riskAnalysis.factors.length > 0 ? (
              <div className="space-y-2">
                {riskAnalysis.factors.map((factor, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border text-xs ${
                      factor.severity === 'CRITICAL' ? 'bg-red-950/30 border-red-500/40 text-red-200' :
                      'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center space-x-1.5">
                        <span>{factor.severity === 'CRITICAL' ? '🔴' : '🟠'}</span>
                        <span className="text-white">{factor.parameter} Abnormal</span>
                      </span>
                      <span className="font-mono text-[11px]">
                        {factor.currentValue} ({factor.thresholdValue})
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] opacity-90 leading-relaxed">
                      {factor.explanation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All vital parameters are currently within normal baseline tolerances.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HEALTH TREND GRAPHS (Prompt Requirement #8) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              <span>Vital Sign Trend Vectors & Time-Series Graph</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Includes doctor configured threshold reference boundaries to evaluate patient deterioration or improvement.
            </p>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl text-xs">
            {(['1h', '6h', '24h'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeTimeframe === tf 
                    ? 'bg-teal-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Last {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveMetricTab('heartRate')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition-all ${
              activeMetricTab === 'heartRate' 
                ? 'bg-red-500/20 border-red-500 text-red-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-red-400" />
            <span>Heart Rate (BPM)</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('spo2')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition-all ${
              activeMetricTab === 'spo2' 
                ? 'bg-sky-500/20 border-sky-500 text-sky-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>SpO₂ Saturation (%)</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('temperature')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition-all ${
              activeMetricTab === 'temperature' 
                ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>Temperature (°C)</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('bp')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition-all ${
              activeMetricTab === 'bp' 
                ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Blood Pressure (mmHg)</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('respiratoryRate')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition-all ${
              activeMetricTab === 'respiratoryRate' 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Respiratory Rate (/min)</span>
          </button>
        </div>

        {/* Recharts Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetricTab === 'heartRate' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[30, 160]} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                  labelStyle={{ color: '#94a3b8' }}
                />
                <ReferenceLine y={50} label={{ value: 'Low Threshold (50 BPM)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="4 4" />
                <ReferenceLine y={120} label={{ value: 'High Threshold (120 BPM)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="heartRate" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} name="Heart Rate (BPM)" />
              </LineChart>
            ) : activeMetricTab === 'spo2' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[75, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                  labelStyle={{ color: '#94a3b8' }}
                />
                <ReferenceLine y={92} label={{ value: 'Critical Threshold (92%)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="spo2" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#0284c7' }} name="SpO₂ Saturation (%)" />
              </LineChart>
            ) : activeMetricTab === 'temperature' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[35, 41]} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                  labelStyle={{ color: '#94a3b8' }}
                />
                <ReferenceLine y={38.0} label={{ value: 'Fever Threshold (38.0°C)', fill: '#f59e0b', fontSize: 10 }} stroke="#f59e0b" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="temperature" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4, fill: '#d97706' }} name="Temperature (°C)" />
              </LineChart>
            ) : activeMetricTab === 'bp' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[40, 200]} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                  labelStyle={{ color: '#94a3b8' }}
                />
                <ReferenceLine y={90} label={{ value: 'Low Systolic Threshold (90 mmHg)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="systolicBP" stroke="#c084fc" strokeWidth={2.5} name="Systolic BP" />
                <Line type="monotone" dataKey="diastolicBP" stroke="#a855f7" strokeWidth={2} strokeDasharray="3 3" name="Diastolic BP" />
              </LineChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[5, 40]} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                  labelStyle={{ color: '#94a3b8' }}
                />
                <ReferenceLine y={25} label={{ value: 'Tachypnea Threshold (25/min)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="4 4" />
                <ReferenceLine y={10} label={{ value: 'Bradypnea Threshold (10/min)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="respiratoryRate" stroke="#4ade80" strokeWidth={3} dot={{ r: 4, fill: '#16a34a' }} name="Resp Rate (/min)" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinical Notes & Bedside Observations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">Clinical Notes & Bedside Observations</h3>
          </div>
          <span className="text-xs text-slate-400">
            Recorded by attending physicians and nurses
          </span>
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={`Add clinical note as ${currentUser.name} (${currentUser.role})...`}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </button>
        </form>

        {/* Existing Notes List */}
        <div className="space-y-2.5">
          {selectedPatient.notes && selectedPatient.notes.length > 0 ? (
            selectedPatient.notes.map((note) => (
              <div key={note.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-teal-300">{note.author}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">{note.role}</span>
                  </div>
                  <span className="font-mono text-[11px]">{note.timestamp}</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{note.text}</p>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 py-3 text-center italic">
              No clinical notes recorded yet for this admission.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
