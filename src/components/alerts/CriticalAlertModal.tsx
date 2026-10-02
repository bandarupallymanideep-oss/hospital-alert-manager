import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  AlertOctagon, 
  MapPin, 
  Clock, 
  Heart, 
  Activity, 
  CheckCircle, 
  UserCheck, 
  X, 
  VolumeX, 
  Volume2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const CriticalAlertModal: React.FC = () => {
  const { 
    activeAlertModal, 
    setActiveAlertModal, 
    acknowledgeAlert, 
    setSelectedPatientId, 
    setActiveTab,
    isAlarmMuted,
    toggleAlarmMute,
    currentUser
  } = useHospital();

  const [clinicalNote, setClinicalNote] = useState('');

  if (!activeAlertModal) return null;

  const handleAcknowledge = () => {
    acknowledgeAlert(activeAlertModal.id, clinicalNote);
    setActiveAlertModal(null);
    setClinicalNote('');
  };

  const handleViewPatient = () => {
    setSelectedPatientId(activeAlertModal.patientId);
    setActiveTab('patient-detail');
    setActiveAlertModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-red-500 rounded-2xl shadow-2xl shadow-red-950/80 overflow-hidden text-white animate-radar-critical">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full animate-bounce">
              <AlertOctagon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-black/40 text-red-100 rounded text-xs font-bold tracking-widest uppercase">
                  URGENT TELEMETRY ALERT
                </span>
                <span className="text-xs text-red-100/90 font-mono">
                  {activeAlertModal.timestamp}
                </span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white mt-0.5">
                CRITICAL CLINICAL ALERT
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleAlarmMute}
              className="p-2 bg-black/30 hover:bg-black/50 text-white rounded-lg transition-colors flex items-center space-x-1 text-xs"
              title={isAlarmMuted ? 'Alarm muted' : 'Mute alarm sound'}
            >
              {isAlarmMuted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4 text-white animate-pulse" />}
              <span className="hidden sm:inline">{isAlarmMuted ? 'Muted' : 'Mute Sound'}</span>
            </button>
            <button
              onClick={() => setActiveAlertModal(null)}
              className="p-2 bg-black/30 hover:bg-black/50 text-white/80 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Patient Location and Demographics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient Details</span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-xl font-bold text-white">{activeAlertModal.patientName}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-teal-300 font-mono">
                  {activeAlertModal.patientId}
                </span>
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">
                Ward Category: <strong className="text-slate-200">{activeAlertModal.category}</strong>
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Exact Location</span>
              <div className="mt-1 flex items-center space-x-2 text-rose-300 font-medium">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-base font-bold text-white">
                  Floor {activeAlertModal.floor} → {activeAlertModal.roomNumber} → Bed {activeAlertModal.bedNumber}
                </span>
              </div>
              <span className="text-xs text-emerald-400/90 block mt-0.5">
                Immediate bedside response dispatched
              </span>
            </div>
          </div>

          {/* Triggered Parameter Breakdown */}
          <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-4">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400 animate-pulse" />
                <span className="text-sm font-semibold text-red-200 uppercase tracking-wider">
                  Parameter Crossed: <span className="text-white text-base font-bold">{activeAlertModal.parameter}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-red-300">AI Risk Score:</span>
                <span className="px-2.5 py-0.5 bg-red-600 text-white font-mono font-black text-sm rounded-full">
                  {activeAlertModal.riskScore} / 100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-red-500/20">
                <span className="text-xs text-slate-400 block">Current Telemetry Reading</span>
                <span className="text-2xl font-black text-red-400 font-mono">
                  {activeAlertModal.currentValue}
                </span>
                <span className="text-[11px] text-red-300/80 block mt-0.5 font-medium">
                  Status: Below doctor limit
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400 block">Doctor-Configured Threshold</span>
                <span className="text-2xl font-black text-amber-300 font-mono">
                  {activeAlertModal.thresholdValue}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Protocol limit set by clinical lead
                </span>
              </div>
            </div>

            <p className="mt-3 text-xs text-red-200/90 leading-relaxed bg-red-900/20 p-2.5 rounded-lg border border-red-500/10">
              {activeAlertModal.message}
            </p>
          </div>

          {/* Clinical Note Input for Acknowledgment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nurse / Doctor Bedside Observation Note (Optional)
            </label>
            <input
              type="text"
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
              placeholder="e.g. Attending at bedside, patient placed on 4L O2 cannula, vitals stabilizing..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleViewPatient}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-sm font-semibold text-slate-200 transition-colors"
            >
              <span>View Full Patient Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleAcknowledge}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02]"
            >
              <UserCheck className="w-4 h-4" />
              <span>ACKNOWLEDGE ALERT ({currentUser.name})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
