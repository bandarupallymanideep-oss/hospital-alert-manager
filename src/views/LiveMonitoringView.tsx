import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  MapPin, 
  AlertOctagon, 
  Filter, 
  Eye, 
  Play, 
  Pause,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const LiveMonitoringView: React.FC = () => {
  const { 
    patients, 
    setSelectedPatientId, 
    setActiveTab, 
    isSimulating, 
    setIsSimulating,
    triggerEmergencySimulation 
  } = useHospital();

  const [categoryFilter, setCategoryFilter] = useState<string>('ICU_CRITICAL');

  const filteredPatients = patients.filter(p => {
    if (categoryFilter === 'ICU_CRITICAL') {
      return p.category === 'ICU' || p.category === 'Critical Care' || p.category === 'Emergency';
    }
    if (categoryFilter === 'CRITICAL_ONLY') {
      return p.riskCategory === 'CRITICAL' || p.riskCategory === 'HIGH';
    }
    if (categoryFilter !== 'ALL') {
      return p.category === categoryFilter;
    }
    return true;
  });

  const handlePatientClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patient-detail');
  };

  return (
    <div className="space-y-6">
      {/* Title & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
              <Activity className="w-6 h-6 text-teal-400" />
              <span>Continuous Telemetry Command Wall</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-xs font-bold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              <span>LIVE</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            High-density multi-patient bedside monitor feed simulating physiological telemetry.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="ICU_CRITICAL">ICU, CCU & Emergency ({patients.filter(p => p.category === 'ICU' || p.category === 'Critical Care' || p.category === 'Emergency').length} Beds)</option>
            <option value="CRITICAL_ONLY">Critical & High Risk Only ({patients.filter(p => p.riskCategory === 'CRITICAL' || p.riskCategory === 'HIGH').length} Beds)</option>
            <option value="ALL">All Monitored Beds ({patients.length} Beds)</option>
          </select>
        </div>
      </div>

      {/* Grid of Medical Telemetry Monitors */}
      {filteredPatients.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Activity className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Active Telemetry Feeds</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {patients.length === 0 
              ? 'No patients have been registered to this hospital yet. Admit a patient to begin streaming real-time vital signs.' 
              : 'No patients currently match the selected filter category.'}
          </p>
          {patients.length > 0 && categoryFilter !== 'ALL' && (
            <button
              onClick={() => setCategoryFilter('ALL')}
              className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-xl text-xs font-semibold"
            >
              View All Hospital Patients ({patients.length})
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => {
          const isCrit = patient.riskCategory === 'CRITICAL';
          const isHigh = patient.riskCategory === 'HIGH';

          return (
            <div
              key={patient.id}
              onClick={() => handlePatientClick(patient.id)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:scale-[1.01] shadow-xl relative overflow-hidden flex flex-col justify-between ${
                isCrit 
                  ? 'bg-slate-950 border-red-500/80 shadow-red-950/40 animate-radar-critical' 
                  : isHigh 
                  ? 'bg-slate-950 border-amber-500/70 shadow-amber-950/20' 
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              {/* Top Row: Patient ID, Room, Bed, Risk */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-white text-base">{patient.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[11px] font-bold">
                        {patient.roomNumber} ({patient.bedNumber})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {patient.id} • Floor {patient.floor} • {patient.category}
                    </div>
                  </div>

                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase font-mono ${
                    isCrit ? 'bg-red-600 text-white animate-pulse' :
                    isHigh ? 'bg-amber-500 text-slate-950' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    RISK {patient.riskScore}
                  </div>
                </div>

                {/* Simulated Real-Time ECG Waveform Graphic */}
                <div className="my-3 h-14 w-full bg-slate-900/90 rounded-xl border border-slate-800 flex items-center px-3 relative overflow-hidden">
                  <div className="absolute inset-0 ecg-grid-dark opacity-30"></div>
                  
                  {/* SVG ECG trace */}
                  <svg className="w-full h-10 overflow-visible relative z-10" viewBox="0 0 300 40">
                    <path
                      d="M 0 20 L 40 20 L 50 18 L 55 22 L 60 20 L 70 20 L 75 8 L 80 32 L 85 15 L 90 20 L 110 20 L 120 20 L 130 18 L 135 22 L 140 20 L 150 20 L 155 8 L 160 32 L 165 15 L 170 20 L 190 20 L 200 20 L 210 18 L 215 22 L 220 20 L 230 20 L 235 8 L 240 32 L 245 15 L 250 20 L 300 20"
                      fill="none"
                      stroke={isCrit ? '#ef4444' : isHigh ? '#f59e0b' : '#14b8a6'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-pulse"
                    />
                  </svg>
                  <span className="absolute right-2 bottom-1 text-[9px] font-mono text-slate-500">
                    LEAD II • 25mm/s
                  </span>
                </div>

                {/* Telemetry Parameter Readings Grid */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {/* HR */}
                  <div className={`p-2 rounded-xl border ${
                    patient.heartRate < 50 || patient.heartRate > 120 
                      ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-400 block font-semibold flex items-center justify-center space-x-1">
                      <Heart className="w-3 h-3 text-red-400" />
                      <span>HR</span>
                    </span>
                    <span className="text-xl font-black font-mono">{patient.heartRate}</span>
                    <span className="text-[9px] text-slate-400 block">BPM</span>
                  </div>

                  {/* SpO2 */}
                  <div className={`p-2 rounded-xl border ${
                    patient.spo2 < 92 
                      ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-400 block font-semibold flex items-center justify-center space-x-1">
                      <Wind className="w-3 h-3 text-sky-400" />
                      <span>SpO₂</span>
                    </span>
                    <span className="text-xl font-black font-mono">{patient.spo2}</span>
                    <span className="text-[9px] text-slate-400 block">%</span>
                  </div>

                  {/* BP */}
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">NIBP</span>
                    <span className="text-sm font-black font-mono">{patient.systolicBP}/{patient.diastolicBP}</span>
                    <span className="text-[9px] text-slate-400 block">mmHg</span>
                  </div>

                  {/* Resp Rate */}
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">RESP</span>
                    <span className="text-xl font-black font-mono">{patient.respiratoryRate}</span>
                    <span className="text-[9px] text-slate-400 block">/min</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Diagnosis & Doctor */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 truncate max-w-[200px] text-[11px]">
                  Dr. {patient.doctor.split(' ')[1] || patient.doctor} • {patient.diagnosis}
                </span>
                <span className="text-teal-400 font-bold flex items-center space-x-0.5 shrink-0 hover:text-teal-300">
                  <span>Open Feed</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
