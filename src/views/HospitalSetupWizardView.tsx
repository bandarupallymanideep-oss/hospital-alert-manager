import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { FloorInfo, ThresholdSetting, PatientCategory } from '../types';
import { 
  CheckCircle2, 
  Building2, 
  Layers, 
  Bed, 
  Sliders, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles,
  ShieldCheck,
  Heart,
  Wind,
  Thermometer,
  Activity,
  Check,
  Info,
  MapPin,
  Users
} from 'lucide-react';

export const HospitalSetupWizardView: React.FC = () => {
  const { 
    setupHospital, 
    wizardStep, 
    setWizardStep, 
    updateSetupHospital, 
    completeHospitalSetup, 
    setAuthScreen 
  } = useHospital();

  if (!setupHospital) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md text-center space-y-4 shadow-2xl">
          <Building2 className="w-12 h-12 text-slate-500 mx-auto" />
          <h2 className="text-xl font-bold">No Active Hospital Setup Session</h2>
          <p className="text-xs text-slate-400">Please start by registering a new hospital or log in to an existing one.</p>
          <button
            onClick={() => setAuthScreen('register')}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-900/40"
          >
            Start Hospital Registration
          </button>
        </div>
      </div>
    );
  }

  // Local state for Step 2: Floors configuration
  const [floors, setFloors] = useState<FloorInfo[]>(setupHospital.floors || []);
  const [newFloorNumber, setNewFloorNumber] = useState<number>(floors.length + 1);
  const [newFloorName, setNewFloorName] = useState('');
  const [newFloorDept, setNewFloorDept] = useState(setupHospital.departments[0] || 'General Ward');

  // Local state for Step 3: Add new room form
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomFloor, setNewRoomFloor] = useState<number>(1);
  const [newRoomDept, setNewRoomDept] = useState(setupHospital.departments[0] || 'ICU');
  const [newRoomCategory, setNewRoomCategory] = useState<PatientCategory>('ICU');
  const [newRoomCapacity, setNewRoomCapacity] = useState<number>(4);

  // Local state for Step 4: Thresholds
  const [thresholds, setThresholds] = useState<ThresholdSetting[]>(setupHospital.thresholds || []);

  // --- Step 2 Floor helpers ---
  const handleAddFloor = () => {
    if (!newFloorName.trim()) return;
    const addedFloor: FloorInfo = {
      floorNumber: newFloorNumber,
      name: newFloorName.trim(),
      departments: [
        {
          name: newFloorDept,
          rooms: [
            { 
              roomNumber: `${newFloorDept.slice(0, 3).toUpperCase()}-${newFloorNumber}01`, 
              capacity: 4, 
              category: (newFloorDept === 'ICU' ? 'ICU' : newFloorDept === 'Emergency' ? 'Emergency' : 'General Ward') as PatientCategory 
            }
          ]
        }
      ]
    };
    const updated = [...floors, addedFloor];
    setFloors(updated);
    updateSetupHospital({ floors: updated, numFloors: updated.length });
    setNewFloorName('');
    setNewFloorNumber(updated.length + 1);
  };

  const handleRemoveFloor = (floorNum: number) => {
    if (floors.length <= 1) return;
    const updated = floors.filter(f => f.floorNumber !== floorNum);
    setFloors(updated);
    updateSetupHospital({ floors: updated, numFloors: updated.length });
  };

  // --- Step 3 Room helpers ---
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim()) return;

    const formattedRoomNum = newRoomNumber.toUpperCase().trim();

    const updated = floors.map(floor => {
      if (floor.floorNumber === newRoomFloor) {
        let deptFound = false;
        const updatedDepts = floor.departments.map(d => {
          if (d.name.toLowerCase() === newRoomDept.toLowerCase()) {
            deptFound = true;
            return {
              ...d,
              rooms: [...d.rooms, { roomNumber: formattedRoomNum, capacity: newRoomCapacity, category: newRoomCategory }]
            };
          }
          return d;
        });

        if (!deptFound) {
          updatedDepts.push({
            name: newRoomDept,
            rooms: [{ roomNumber: formattedRoomNum, capacity: newRoomCapacity, category: newRoomCategory }]
          });
        }

        return { ...floor, departments: updatedDepts };
      }
      return floor;
    });

    setFloors(updated);
    updateSetupHospital({ floors: updated });
    setNewRoomNumber('');
  };

  // --- Step 4 Threshold helpers ---
  const handleThresholdChange = (id: string, field: 'lowValue' | 'highValue', val: number) => {
    const updated = thresholds.map(t => {
      if (t.id === id) {
        return { ...t, [field]: isNaN(val) ? undefined : val };
      }
      return t;
    });
    setThresholds(updated);
    updateSetupHospital({ thresholds: updated });
  };

  const stepsList = [
    { num: 1, title: 'Hospital Created', icon: CheckCircle2 },
    { num: 2, title: 'Configure Floors', icon: Layers },
    { num: 3, title: 'Configure Rooms', icon: Bed },
    { num: 4, title: 'Threshold Protocols', icon: Sliders },
    { num: 5, title: 'Complete Setup', icon: Sparkles },
  ];

  // Total rooms and beds configured across all floors
  const totalConfiguredRooms = floors.reduce((acc, f) => 
    acc + f.departments.reduce((dAcc, d) => dAcc + d.rooms.length, 0), 0);
  const totalConfiguredBeds = floors.reduce((acc, f) => 
    acc + f.departments.reduce((dAcc, d) => dAcc + d.rooms.reduce((rAcc, r) => rAcc + r.capacity, 0), 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 ecg-grid opacity-30 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full relative z-10 space-y-6">
        {/* Wizard Progress Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-teal-400 font-mono uppercase tracking-wider flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Hospital Onboarding Wizard — {setupHospital.name}</span>
            </span>
            <span className="text-slate-400 font-mono">Step {wizardStep} of 5</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {stepsList.map(step => {
              const Icon = step.icon;
              const isPast = wizardStep > step.num;
              const isCurrent = wizardStep === step.num;

              return (
                <div
                  key={step.num}
                  onClick={() => isPast && setWizardStep(step.num)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isCurrent 
                      ? 'bg-teal-950/60 border-teal-500 text-teal-300 ring-1 ring-teal-500/50 cursor-default' 
                      : isPast
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 cursor-pointer'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-teal-400 animate-pulse' : isPast ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="hidden sm:inline truncate">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Hospital Created ✓ */}
        {wizardStep === 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-3 max-w-xl mx-auto py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Step 1 — Hospital Created Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Hospital profile and administrator account have been initialized. Your unique Hospital ID has been generated for authentication.
              </p>
            </div>

            {/* Hospital Summary Dossier */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Hospital Name</span>
                <span className="text-base font-bold text-white mt-0.5 block">{setupHospital.name}</span>
                <span className="text-xs text-teal-400 font-mono font-bold mt-1 block">
                  Hospital ID: {setupHospital.id}
                </span>
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Administrator</span>
                <span className="text-base font-bold text-white mt-0.5 block">{setupHospital.adminName}</span>
                <span className="text-[11px] text-slate-300 font-mono mt-0.5 block">{setupHospital.adminEmail}</span>
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">License / Registration</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">{setupHospital.licenseNumber}</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">{setupHospital.hospitalType}</span>
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Location</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">{setupHospital.city}, {setupHospital.state}</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">{setupHospital.country} • PIN: {setupHospital.pinCode}</span>
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Physical Capacity</span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {setupHospital.numFloors} Floors • {setupHospital.numRooms} Rooms • {setupHospital.numBeds} Beds
                </span>
                <span className="text-[11px] text-red-400 block mt-0.5">
                  {setupHospital.numIcuBeds} ICU Beds • {setupHospital.numGeneralBeds} General Ward Beds
                </span>
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Active Departments</span>
                <span className="text-sm font-semibold text-teal-300 mt-0.5 block">
                  {setupHospital.departments.slice(0, 3).join(', ')}{setupHospital.departments.length > 3 ? ` +${setupHospital.departments.length - 3} more` : ''}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setWizardStep(2)}
                className="flex items-center space-x-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-900/40 transition-all hover:scale-[1.02]"
              >
                <span>Continue to Step 2 — Configure Floors</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Configure Floors */}
        {wizardStep === 2 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-teal-400 font-mono uppercase tracking-wider">
                STEP 2 OF 5
              </span>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Configure Hospital Floors & Wards
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize floor numbers, floor names, and assign clinical departments (e.g. Floor 1 → Emergency & ICU, Floor 2 → General Ward).
              </p>
            </div>

            {/* Existing Floors List */}
            <div className="space-y-3">
              {floors.map((floor) => (
                <div
                  key={floor.floorNumber}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                      F{floor.floorNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{floor.name}</h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {floor.departments.map(d => (
                          <span key={d.name} className="px-2 py-0.5 rounded-full bg-slate-700 text-teal-300 text-[10px] font-medium font-mono">
                            {d.name} ({d.rooms.length} Rooms)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveFloor(floor.floorNumber)}
                    disabled={floors.length <= 1}
                    className="p-1.5 bg-slate-700/60 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed self-end sm:self-center"
                    title="Remove Floor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Floor Box */}
            <div className="p-4 bg-slate-950/60 border border-dashed border-slate-700 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Add Floor to Hospital Layout</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Floor Number</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newFloorNumber}
                    onChange={(e) => setNewFloorNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Floor Name</label>
                  <input
                    type="text"
                    value={newFloorName}
                    onChange={(e) => setNewFloorName(e.target.value)}
                    placeholder={`e.g. Floor ${newFloorNumber} — ICU & Cardiac Suite`}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <select
                    value={newFloorDept}
                    onChange={(e) => setNewFloorDept(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    {setupHospital.departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddFloor}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Append Floor to Layout</span>
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setWizardStep(1)}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setWizardStep(3)}
                className="flex items-center space-x-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-900/40"
              >
                <span>Continue to Step 3 — Configure Rooms</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Configure Rooms */}
        {wizardStep === 3 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-teal-400 font-mono uppercase tracking-wider">
                STEP 3 OF 5
              </span>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Configure Hospital Rooms & Bed Capacities
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Define telemetry-enabled rooms with room number, floor assignment, clinical category, and bed capacity.
              </p>
            </div>

            {/* Add Room Quick Form */}
            <form onSubmit={handleAddRoom} className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-teal-300 flex items-center space-x-1.5">
                <Plus className="w-4 h-4" />
                <span>Add Room to Floor</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Room Number</label>
                  <input
                    type="text"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder="e.g. ICU-103"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Floor</label>
                  <select
                    value={newRoomFloor}
                    onChange={(e) => setNewRoomFloor(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    {floors.map(f => (
                      <option key={f.floorNumber} value={f.floorNumber}>Floor {f.floorNumber}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <select
                    value={newRoomDept}
                    onChange={(e) => setNewRoomDept(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    {setupHospital.departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newRoomCategory}
                    onChange={(e) => setNewRoomCategory(e.target.value as PatientCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="ICU">ICU</option>
                    <option value="General Ward">General Ward</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Critical Care">Critical Care</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Bed Capacity</label>
                  <select
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value={1}>1 Bed (Private)</option>
                    <option value={2}>2 Beds (Semi-Private)</option>
                    <option value={4}>4 Beds (Standard)</option>
                    <option value={6}>6 Beds (High-Density)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Room</span>
              </button>
            </form>

            {/* Configured Rooms Preview Grid */}
            <div className="space-y-4">
              {floors.map(floor => (
                <div key={floor.floorNumber} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">Floor {floor.floorNumber}: {floor.name}</span>
                    <span className="text-slate-400 font-mono">
                      {floor.departments.reduce((acc, d) => acc + d.rooms.length, 0)} Active Rooms
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {floor.departments.flatMap(d => d.rooms.map(r => (
                      <div key={r.roomNumber} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-white block">{r.roomNumber}</span>
                          <span className="text-[10px] text-slate-400 block">{d.name} • {r.category}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-teal-400 font-mono">
                          {r.capacity} Beds
                        </span>
                      </div>
                    )))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setWizardStep(2)}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setWizardStep(4)}
                className="flex items-center space-x-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-900/40"
              >
                <span>Continue to Step 4 — Threshold Protocols</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Configure Monitoring Thresholds */}
        {wizardStep === 4 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-teal-400 font-mono uppercase tracking-wider">
                STEP 4 OF 5
              </span>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Configure Hospital Monitoring Thresholds
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure hospital baseline threshold triggers for Heart Rate, SpO₂, Temperature, Blood Pressure, and Respiratory Rate.
              </p>
            </div>

            {/* Clinical Advisory Banner */}
            <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Threshold limits defined here protect inpatient beds automatically. Alerts trigger bedside alarms whenever telemetry values cross these boundaries.
              </p>
            </div>

            {/* Threshold Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {thresholds.map((threshold) => (
                <div key={threshold.id} className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                    <span className="font-bold text-white text-sm">{threshold.label}</span>
                    <span className="text-[10px] font-mono text-teal-300 px-2 py-0.5 rounded bg-slate-900">
                      Unit: {threshold.unit}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {threshold.lowValue !== undefined && (
                      <div>
                        <label className="block text-[11px] text-red-400 font-semibold mb-1">
                          Low Alarm Limit
                        </label>
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="number"
                            value={threshold.lowValue}
                            onChange={(e) => handleThresholdChange(threshold.id, 'lowValue', parseFloat(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-bold font-mono text-white focus:outline-none focus:border-teal-500"
                          />
                          <span className="text-slate-400 font-mono text-[11px]">{threshold.unit}</span>
                        </div>
                      </div>
                    )}

                    {threshold.highValue !== undefined && (
                      <div>
                        <label className="block text-[11px] text-red-400 font-semibold mb-1">
                          High Alarm Limit
                        </label>
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="number"
                            value={threshold.highValue}
                            onChange={(e) => handleThresholdChange(threshold.id, 'highValue', parseFloat(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-bold font-mono text-white focus:outline-none focus:border-teal-500"
                          />
                          <span className="text-slate-400 font-mono text-[11px]">{threshold.unit}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => setWizardStep(3)}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setWizardStep(5)}
                className="flex items-center space-x-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-900/40"
              >
                <span>Review & Finish Setup →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Hospital Setup Complete (Prompt Requirement #5) */}
        {wizardStep === 5 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-3 max-w-xl mx-auto py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-950/50">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Hospital Setup Complete
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                All physical wards, rooms, thresholds, and administrative credentials for <strong className="text-white">{setupHospital.name}</strong> have been configured and saved.
              </p>
            </div>

            {/* Complete Setup Dossier Summary */}
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Hospital ID</span>
                  <span className="text-base font-black text-teal-400 font-mono mt-0.5 block">{setupHospital.id}</span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Floors Active</span>
                  <span className="text-base font-black text-white mt-0.5 block">{floors.length} Floors</span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Configured Rooms</span>
                  <span className="text-base font-black text-white mt-0.5 block">{totalConfiguredRooms} Rooms</span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Total Beds</span>
                  <span className="text-base font-black text-emerald-400 mt-0.5 block">{totalConfiguredBeds} Beds</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span>Administrator Account:</span>
                  <span className="text-white font-bold">{setupHospital.adminName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Login Identifier:</span>
                  <span className="font-mono text-teal-300">{setupHospital.id} or {setupHospital.adminEmail}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Clinical Specialty Wards:</span>
                  <span className="text-slate-200">{setupHospital.departments.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Launch Command Center Button (Requirement: "Go to Dashboard") */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => setWizardStep(4)}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Thresholds</span>
              </button>

              <button
                onClick={() => completeHospitalSetup({ floors, thresholds })}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white rounded-xl text-sm font-black shadow-xl shadow-teal-900/50 transition-all hover:scale-[1.02]"
              >
                <span>Go to Dashboard →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
