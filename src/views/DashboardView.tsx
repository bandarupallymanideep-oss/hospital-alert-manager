import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Users, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  Activity, 
  ArrowRight, 
  MapPin, 
  Building2,
  Clock,
  UserPlus,
  Sliders,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { AddPatientModal } from '../components/common/AddPatientModal';

export const DashboardView: React.FC = () => {
  const { 
    patients, 
    alerts, 
    floors,
    currentHospital,
    setSelectedPatientId, 
    setActiveTab, 
    setActiveAlertModal 
  } = useHospital();

  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  // Summary counts
  const totalBedsCapacity = currentHospital.numBeds || 100;
  const activeMonitoredPatients = patients.length;
  const criticalPatients = patients.filter(p => p.riskCategory === 'CRITICAL');
  const highRiskPatients = patients.filter(p => p.riskCategory === 'HIGH');
  const moderatePatients = patients.filter(p => p.riskCategory === 'MODERATE');
  const stablePatients = patients.filter(p => p.riskCategory === 'STABLE' || p.riskCategory === 'LOW');
  const icuPatients = patients.filter(p => p.category === 'ICU' || p.category === 'Critical Care');
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  const requireAttentionCount = criticalPatients.length + highRiskPatients.length;

  const handlePatientClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patient-detail');
  };

  return (
    <div className="space-y-6">
      {/* 1. CONTINUOUS PATIENT MONITORING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/90 via-slate-900 to-indigo-950 border border-teal-500/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Activity className="w-80 h-80 text-teal-400" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span>Active Clinical AI Telemetry</span>
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {currentHospital.id} • {floors.length} Floors Configured
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
              {currentHospital.name} Command Center
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              {patients.length > 0 ? (
                <>
                  <strong className="text-teal-300">{activeMonitoredPatients} active telemetry streams</strong> out of {totalBedsCapacity} beds monitored. The early warning system continuously calculates risk, prioritizing the <strong className="text-red-400">{requireAttentionCount} patients requiring bedside attention</strong>.
                </>
              ) : (
                <>
                  Continuous vital surveillance platform initialized for {totalBedsCapacity} beds across {floors.length} floors. No patients admitted yet. Add your first patient to begin automated AI early warning surveillance.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddPatientOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-900/40 transition-all hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admit Patient</span>
            </button>
            <button
              onClick={() => setActiveTab('live-monitoring')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Telemetry Wall</span>
            </button>
            <button
              onClick={() => setActiveTab('floors')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Floor Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOP SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Patients */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Beds</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white">{totalBedsCapacity}</div>
          <div className="mt-1 text-[11px] text-teal-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
            <span>{activeMonitoredPatients} active feeds</span>
          </div>
        </div>

        {/* Critical Patients (RED) */}
        <div className={`rounded-2xl p-4 border transition-all ${
          criticalPatients.length > 0 
            ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-950/50' 
            : 'bg-slate-800/80 border-slate-700/80'
        }`}>
          <div className="flex items-center justify-between text-red-300 text-xs font-bold uppercase tracking-wider">
            <span>Critical</span>
            <AlertOctagon className={`w-4 h-4 text-red-400 ${criticalPatients.length > 0 ? 'animate-bounce' : ''}`} />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-red-400">{criticalPatients.length}</div>
          <div className="mt-1 text-[11px] text-red-300/80 font-medium">
            {criticalPatients.length > 0 ? 'Immediate bedside focus' : 'No critical alerts'}
          </div>
        </div>

        {/* High Risk (ORANGE) */}
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4">
          <div className="flex items-center justify-between text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>High Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-400">{highRiskPatients.length}</div>
          <div className="mt-1 text-[11px] text-amber-300/80 font-medium">
            Warning limits crossed
          </div>
        </div>

        {/* Stable (GREEN) */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <span>Stable</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-400">{stablePatients.length}</div>
          <div className="mt-1 text-[11px] text-emerald-300/80 font-medium">
            Normal vital ranges
          </div>
        </div>

        {/* Active Alerts */}
        <div className={`rounded-2xl p-4 border transition-all ${
          activeAlerts.length > 0 
            ? 'bg-rose-950/30 border-rose-500/40 shadow-sm' 
            : 'bg-slate-800/80 border-slate-700/80'
        }`}>
          <div className="flex items-center justify-between text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <span>Active Alerts</span>
            <Bell className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-rose-400">{activeAlerts.length}</div>
          <div className="mt-1 text-[11px] text-rose-300/80 font-medium">
            Across {floors.length} floors
          </div>
        </div>

        {/* ICU Occupancy */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>ICU Patients</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white">{icuPatients.length}</div>
          <div className="mt-1 text-[11px] text-cyan-300 font-medium">
            {currentHospital.numIcuBeds || 16} ICU Beds Total
          </div>
        </div>
      </div>

      {/* 3. PATIENTS SECTION / EMPTY STATE (Requirement #14) */}
      {patients.length === 0 ? (
        <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-xl font-black text-white">No patients registered yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-white">{currentHospital.name}</strong> ({currentHospital.id}) has been successfully provisioned. Begin automated telemetry monitoring by admitting your first inpatient.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAddPatientOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-teal-950/50 transition-all hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add First Patient</span>
            </button>
            <button
              onClick={() => setActiveTab('floors')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
            >
              View Configured Floors ({floors.length})
            </button>
            <button
              onClick={() => setActiveTab('thresholds')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
            >
              Configure Thresholds
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Priority Focus Patients Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold text-white">
                  Patients Requiring Immediate Bedside Focus
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-mono font-bold">
                  {requireAttentionCount} Flagged
                </span>
              </div>
              <button
                onClick={() => setActiveTab('patients')}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
              >
                <span>View All Patients ({patients.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...criticalPatients, ...highRiskPatients, ...moderatePatients, ...stablePatients].slice(0, 6).map((patient) => {
                const isCritical = patient.riskCategory === 'CRITICAL';
                const isHigh = patient.riskCategory === 'HIGH';

                return (
                  <div
                    key={patient.id}
                    onClick={() => handlePatientClick(patient.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 hover:scale-[1.01] shadow-lg relative overflow-hidden ${
                      isCritical 
                        ? 'bg-gradient-to-br from-red-950/60 to-slate-900 border-red-500/60 hover:border-red-400' 
                        : isHigh
                        ? 'bg-gradient-to-br from-amber-950/50 to-slate-900 border-amber-500/50 hover:border-amber-400'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-black text-white">{patient.name}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {patient.id}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                          <span>Floor {patient.floor} • Room {patient.roomNumber} ({patient.bedNumber})</span>
                        </div>
                      </div>

                      {/* Risk Badge */}
                      <div className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        isCritical ? 'bg-red-600 text-white animate-pulse' : 
                        isHigh ? 'bg-amber-500 text-slate-950' : 
                        patient.riskCategory === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {patient.riskCategory} ({patient.riskScore})
                      </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="mt-2 text-xs text-slate-300 line-clamp-1 italic">
                      "{patient.diagnosis}"
                    </div>

                    {/* Current Vital Numbers */}
                    <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <div className={`text-center p-1 rounded-lg ${patient.heartRate < 50 || patient.heartRate > 120 ? 'bg-red-500/20 text-red-400' : 'text-slate-200'}`}>
                        <span className="text-[10px] text-slate-400 block font-semibold">HEART RATE</span>
                        <span className="text-sm font-black font-mono">{patient.heartRate}</span>
                        <span className="text-[10px] ml-0.5 text-slate-400">BPM</span>
                      </div>

                      <div className={`text-center p-1 rounded-lg ${patient.spo2 < 92 ? 'bg-red-500/20 text-red-400' : 'text-slate-200'}`}>
                        <span className="text-[10px] text-slate-400 block font-semibold">SPO₂</span>
                        <span className="text-sm font-black font-mono">{patient.spo2}</span>
                        <span className="text-[10px] ml-0.5 text-slate-400">%</span>
                      </div>

                      <div className={`text-center p-1 rounded-lg ${patient.systolicBP < 90 || patient.systolicBP > 160 ? 'bg-amber-500/20 text-amber-400' : 'text-slate-200'}`}>
                        <span className="text-[10px] text-slate-400 block font-semibold">BP</span>
                        <span className="text-sm font-black font-mono">{patient.systolicBP}/{patient.diastolicBP}</span>
                      </div>
                    </div>

                    {/* Footer Staff & Action */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px] truncate max-w-[180px]">
                        MD: <strong className="text-slate-200">{patient.doctor}</strong>
                      </span>
                      <span className="text-teal-400 hover:text-teal-300 font-bold flex items-center space-x-1">
                        <span>Evaluate</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. SPLIT SECTION: RECENT TELEMETRY ALERTS & FLOOR OVERVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Alerts Feed (2 cols) */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-teal-400" />
                  <h3 className="text-base font-bold text-white">Active Clinical Health Alerts</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 text-xs font-mono font-bold">
                    {activeAlerts.length} Active
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300"
                >
                  Open Alert Center →
                </button>
              </div>

              {activeAlerts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-800/30 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">All Vital Parameters Nominal</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">No unacknowledged or active telemetry threshold breaches.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeAlerts.slice(0, 5).map((alert) => {
                    const isCrit = alert.severity === 'CRITICAL';
                    return (
                      <div
                        key={alert.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                          isCrit 
                            ? 'bg-red-950/30 border-red-500/40 hover:bg-red-950/50' 
                            : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg mt-0.5 ${
                            isCrit ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            <AlertOctagon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span 
                                onClick={() => handlePatientClick(alert.patientId)}
                                className="font-bold text-sm text-white hover:text-teal-400 cursor-pointer underline-offset-2 hover:underline"
                              >
                                {alert.patientName}
                              </span>
                              <span className="text-xs text-slate-400 font-mono">
                                Floor {alert.floor} • Room {alert.roomNumber} ({alert.bedNumber})
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                isCrit ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                              }`}>
                                {alert.parameter}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1">
                              Current: <strong className="text-red-400 font-mono">{alert.currentValue}</strong> (Threshold: {alert.thresholdValue}) • {alert.message}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                          <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{alert.timestamp}</span>
                          </span>
                          <button
                            onClick={() => setActiveAlertModal(alert)}
                            className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Acknowledge
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dynamic Floor Status Snapshot Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-teal-400" />
                  <h3 className="text-base font-bold text-white">Floor Telemetry Status</h3>
                </div>
                <button
                  onClick={() => setActiveTab('floors')}
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300"
                >
                  Floor Map →
                </button>
              </div>

              <div className="space-y-3">
                {floors.map(floor => {
                  const floorPatients = patients.filter(p => p.floor === floor.floorNumber);
                  const floorAlerts = alerts.filter(a => a.floor === floor.floorNumber && a.status === 'ACTIVE');
                  const hasCrit = floorAlerts.some(a => a.severity === 'CRITICAL');
                  const hasHigh = floorAlerts.some(a => a.severity === 'HIGH');
                  const totalRooms = floor.departments.reduce((acc, d) => acc + d.rooms.length, 0);

                  return (
                    <div 
                      key={floor.floorNumber}
                      onClick={() => setActiveTab('floors')}
                      className="p-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">
                          Floor {floor.floorNumber}: {floor.name}
                        </span>
                        {hasCrit ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                            Critical Alert
                          </span>
                        ) : hasHigh ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                            Warning
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            Stable
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex justify-between">
                        <span>{totalRooms} Rooms • {floor.departments.map(d => d.name).join(', ')}</span>
                        <span className="font-mono text-teal-300">{floorPatients.length} Admitted</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Patient Admission Modal */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onPatientAdded={(newId) => handlePatientClick(newId)}
      />
    </div>
  );
};
