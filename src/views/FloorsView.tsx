import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Building2, 
  MapPin, 
  Users, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  ChevronRight, 
  Heart, 
  Wind, 
  ArrowLeft,
  Bed,
  Layers
} from 'lucide-react';

export const FloorsView: React.FC = () => {
  const { floors, patients, setSelectedPatientId, setActiveTab } = useHospital();

  const [activeFloorNumber, setActiveFloorNumber] = useState<number>(1);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string | null>(null);

  // Active Floor object
  const activeFloor = floors.find(f => f.floorNumber === activeFloorNumber) || floors[0];

  // Helper to get room patients
  const getRoomPatients = (roomNumber: string) => {
    return patients.filter(p => p.roomNumber === roomNumber);
  };

  // Helper to compute room risk status
  const getRoomStatus = (roomNumber: string) => {
    const roomPatients = getRoomPatients(roomNumber);
    if (roomPatients.some(p => p.riskCategory === 'CRITICAL')) {
      return { label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/40', dot: 'bg-red-500', isCrit: true };
    }
    if (roomPatients.some(p => p.riskCategory === 'HIGH')) {
      return { label: 'High Risk', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', dot: 'bg-amber-500', isCrit: false };
    }
    if (roomPatients.some(p => p.riskCategory === 'MODERATE')) {
      return { label: 'Warning', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', dot: 'bg-yellow-400', isCrit: false };
    }
    if (roomPatients.length === 0) {
      return { label: 'Available', color: 'bg-slate-800 text-slate-400 border-slate-700', dot: 'bg-slate-500', isCrit: false };
    }
    return { label: 'Stable', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', dot: 'bg-emerald-500', isCrit: false };
  };

  const handlePatientClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patient-detail');
  };

  // Detail Room View if a room is selected
  const activeRoomPatients = selectedRoomNumber ? getRoomPatients(selectedRoomNumber) : [];

  return (
    <div className="space-y-6">
      {/* Title & Floor Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-teal-400" />
            <span>Hospital Floor & Room Architecture Map</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Spatial monitoring layout of all hospital wings, department suites, and telemetry bed allocations.
          </p>
        </div>

        {/* Floor Switcher Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          {floors.map(floor => (
            <button
              key={floor.floorNumber}
              onClick={() => {
                setActiveFloorNumber(floor.floorNumber);
                setSelectedRoomNumber(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFloorNumber === floor.floorNumber
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Floor {floor.floorNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Room Drill-Down Detail View (Prompt Requirement #16) */}
      {selectedRoomNumber ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedRoomNumber(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Back to Floor Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-white">
                    Room {selectedRoomNumber}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRoomStatus(selectedRoomNumber).color}`}>
                    {getRoomStatus(selectedRoomNumber).label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Floor {activeFloorNumber} • {activeFloor.name} • 4 Beds Capacity
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Occupancy: <strong className="text-white">{activeRoomPatients.length} / 4 Beds</strong>
            </div>
          </div>

          {/* Bed Allocation Cards (B1 - B4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['B-1', 'B-2', 'B-3', 'B-4'].map(bedLabel => {
              const bedPatient = activeRoomPatients.find(p => p.bedNumber === bedLabel);

              if (!bedPatient) {
                return (
                  <div
                    key={bedLabel}
                    className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center min-h-[180px] text-slate-500"
                  >
                    <Bed className="w-8 h-8 opacity-40 mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bed {bedLabel}</span>
                    <span className="text-xs text-slate-600 mt-0.5">Available for admission</span>
                  </div>
                );
              }

              const isCrit = bedPatient.riskCategory === 'CRITICAL';
              const isHigh = bedPatient.riskCategory === 'HIGH';

              return (
                <div
                  key={bedLabel}
                  onClick={() => handlePatientClick(bedPatient.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] shadow-lg flex flex-col justify-between ${
                    isCrit 
                      ? 'bg-red-950/40 border-red-500/70 shadow-red-950/30 animate-radar-critical' 
                      : isHigh
                      ? 'bg-amber-950/30 border-amber-500/50'
                      : 'bg-slate-800/80 border-slate-700/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal-400 font-mono">Bed {bedLabel}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isCrit ? 'bg-red-600 text-white animate-pulse' :
                        isHigh ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {bedPatient.riskCategory} ({bedPatient.riskScore})
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="font-black text-white text-base leading-tight">
                        {bedPatient.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {bedPatient.id} • {bedPatient.age}y {bedPatient.gender}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 line-clamp-1 italic">
                        "{bedPatient.diagnosis}"
                      </div>
                    </div>

                    {/* Vitals snapshot */}
                    <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-900/80 p-2 rounded-lg text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block">HR</span>
                        <span className={`font-bold ${bedPatient.heartRate < 50 || bedPatient.heartRate > 120 ? 'text-red-400' : 'text-slate-200'}`}>
                          {bedPatient.heartRate} BPM
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">SpO₂</span>
                        <span className={`font-bold ${bedPatient.spo2 < 92 ? 'text-red-400' : 'text-slate-200'}`}>
                          {bedPatient.spo2}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-teal-400 font-semibold">
                    <span>Evaluate Bedside</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Floor Department Breakdown (Prompt Requirement #15) */}
      <div className="space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Floor {activeFloor.floorNumber} Overview</span>
              <h3 className="text-lg font-black text-white">{activeFloor.name}</h3>
            </div>
            <div className="text-xs text-slate-400 flex items-center space-x-3">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Stable</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span>Warning</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Critical</span>
              </span>
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-6">
            {activeFloor.departments.map(dept => (
              <div key={dept.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-teal-400" />
                    <span>{dept.name}</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {dept.rooms.length} Rooms
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {dept.rooms.map(room => {
                    const roomPatients = getRoomPatients(room.roomNumber);
                    const status = getRoomStatus(room.roomNumber);
                    const isSelected = selectedRoomNumber === room.roomNumber;

                    return (
                      <div
                        key={room.roomNumber}
                        onClick={() => setSelectedRoomNumber(room.roomNumber)}
                        className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] shadow-sm ${
                          status.isCrit 
                            ? 'bg-red-950/30 border-red-500/60 hover:bg-red-950/40' 
                            : isSelected
                            ? 'bg-teal-950/30 border-teal-500'
                            : 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${status.dot} ${status.isCrit ? 'animate-ping' : ''}`}></span>
                            <span className="font-extrabold text-sm text-white font-mono">
                              {room.roomNumber}
                            </span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{roomPatients.length} / {room.capacity} Beds</span>
                          </span>
                          <span className="text-teal-400 font-semibold flex items-center space-x-0.5">
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>

                        {/* Patient Names preview */}
                        {roomPatients.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-700/50 space-y-1">
                            {roomPatients.map(p => (
                              <div key={p.id} className="text-[11px] text-slate-300 flex items-center justify-between">
                                <span className="truncate max-w-[130px] font-medium">{p.name}</span>
                                <span className={`font-mono text-[10px] ${p.riskCategory === 'CRITICAL' ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                                  {p.bedNumber} ({p.riskScore})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
