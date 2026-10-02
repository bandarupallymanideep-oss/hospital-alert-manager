import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  Activity, 
  AlertOctagon, 
  Heart, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const DemoControlBar: React.FC = () => {
  const { 
    patients, 
    triggerEmergencySimulation, 
    isSimulating, 
    setIsSimulating,
    isAlarmMuted,
    toggleAlarmMute,
    setSelectedPatientId,
    setActiveTab
  } = useHospital();

  const [selectedTargetId, setSelectedTargetId] = useState<string>(patients[0]?.id || 'P1024');

  // Keep selected target in sync with available patients
  React.useEffect(() => {
    if (patients.length > 0 && !patients.some(p => p.id === selectedTargetId)) {
      setSelectedTargetId(patients[0].id);
    }
  }, [patients, selectedTargetId]);

  const handleTrigger = (type: 'HEART_RATE_ALERT' | 'SPO2_ALERT' | 'CRITICAL_CASCADE' | 'WARNING_RISE' | 'STABILIZE_PATIENT' | 'RESET_ALL') => {
    if (patients.length === 0 && type !== 'RESET_ALL') return;
    const target = selectedTargetId || patients[0]?.id;
    triggerEmergencySimulation(type, target);
    if (type !== 'RESET_ALL' && target) {
      setSelectedPatientId(target);
    }
  };

  const hasPatients = patients.length > 0;

  return (
    <aside aria-label="Demo and Simulation Controls" className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 px-3 py-2 text-white shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Badge */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-500/20 border border-indigo-400/40 rounded-full text-xs font-semibold text-indigo-300 tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>DEMO PRESENTATION CONTROLS</span>
          </div>

          {/* Target Patient Selector */}
          {hasPatients && (
            <div className="flex items-center space-x-1.5 text-xs text-slate-300">
              <span className="hidden sm:inline text-slate-400 font-medium">Target:</span>
              <select
                aria-label="Target Patient"
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="bg-slate-800/90 border border-slate-700 rounded-md px-2 py-1 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500"
              >
                {patients.slice(0, 10).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id} - {p.roomNumber})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Trigger Buttons or Empty Notice */}
        {!hasPatients ? (
          <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-lg">
            <span>Add a patient first to use monitoring simulation.</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Heart Rate Alert (Prompt Requirement: Rahul Sharma HR 72 -> 48 BPM) */}
          <button
            onClick={() => handleTrigger('HEART_RATE_ALERT')}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 hover:border-red-400 text-red-200 rounded-md transition-all font-medium shadow-sm hover:scale-[1.02] active:scale-95"
            title="Simulate bradycardia: Drops heart rate below 50 BPM (triggers alarm)"
          >
            <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Trigger HR Alert (48 BPM)</span>
          </button>

          {/* SpO2 Alert */}
          <button
            onClick={() => handleTrigger('SPO2_ALERT')}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/50 hover:border-sky-400 text-sky-200 rounded-md transition-all font-medium shadow-sm hover:scale-[1.02] active:scale-95"
            title="Simulate desaturation: Drops SpO2 to 87%"
          >
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>Trigger SpO₂ Alert (87%)</span>
          </button>

          {/* Simulate Critical */}
          <button
            onClick={() => handleTrigger('CRITICAL_CASCADE')}
            className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 bg-rose-600/40 hover:bg-rose-600/60 border border-rose-500/50 text-rose-200 rounded-md transition-all font-medium hover:scale-[1.02] active:scale-95"
            title="Simulate multi-organ critical failure"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Critical</span>
          </button>

          {/* Simulate Warning */}
          <button
            onClick={() => handleTrigger('WARNING_RISE')}
            className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-200 rounded-md transition-all font-medium hover:scale-[1.02] active:scale-95"
            title="Simulate vitals rising into warning zone"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Warning</span>
          </button>

          {/* Simulate Normal / Stabilize */}
          <button
            onClick={() => handleTrigger('STABILIZE_PATIENT')}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-200 rounded-md transition-all font-medium hover:scale-[1.02] active:scale-95"
            title="Normalize patient vitals"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stabilize Patient</span>
          </button>

          {/* Reset All */}
          <button
            onClick={() => handleTrigger('RESET_ALL')}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-md transition-all hover:scale-[1.02] active:scale-95"
            title="Reset all patients & vitals to initial demo baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset All</span>
          </button>
        </div>
        )}

        {/* Right Controls: Telemetry Ticker Toggle & Mute */}
        <div className="flex items-center space-x-2">
          {/* Live Telemetry Ticker Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
              isSimulating 
                ? 'bg-teal-950/60 border-teal-500/50 text-teal-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle background subtle vital fluctuation ticker"
          >
            {isSimulating ? (
              <>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                <span>Live Feed ON</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-slate-400" />
                <span>Live Feed Paused</span>
              </>
            )}
          </button>

          {/* Sound Alarm Mute */}
          <button
            onClick={toggleAlarmMute}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
              isAlarmMuted 
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' 
                : 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300'
            }`}
            title={isAlarmMuted ? 'Telemetry alarm sound muted' : 'Telemetry alarm sound active'}
          >
            {isAlarmMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                <span>Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Audio Active</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
