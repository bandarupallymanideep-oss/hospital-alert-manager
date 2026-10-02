import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { PatientCategory } from '../../types';
import { 
  X, 
  UserPlus, 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientAdded?: (patientId: string) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onPatientAdded }) => {
  const { currentHospital, addPatient, floors } = useHospital();

  const [formData, setFormData] = useState({
    name: '',
    age: 50,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    floor: floors[0]?.floorNumber || 1,
    roomNumber: floors[0]?.departments[0]?.rooms[0]?.roomNumber || 'ICU-101',
    bedNumber: 'B-1',
    category: (floors[0]?.departments[0]?.rooms[0]?.category || 'ICU') as PatientCategory,
    department: floors[0]?.departments[0]?.name || currentHospital.departments[0] || 'ICU',
    diagnosis: '',
    doctor: currentHospital.isDemo ? 'Dr. Ananya Rao' : 'Dr. Attending Physician',
    nurse: currentHospital.isDemo ? 'Priya Sharma, RN' : 'Senior Staff Nurse',
    heartRate: 75,
    spo2: 98,
    temperature: 37.0,
    systolicBP: 120,
    diastolicBP: 80,
    respiratoryRate: 16
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update room list when floor changes
  const selectedFloorObj = floors.find(f => f.floorNumber === formData.floor) || floors[0];
  const availableRooms = selectedFloorObj?.departments.flatMap(d => d.rooms.map(r => ({
    ...r,
    deptName: d.name
  }))) || [];

  useEffect(() => {
    if (availableRooms.length > 0 && !availableRooms.some(r => r.roomNumber === formData.roomNumber)) {
      const firstRoom = availableRooms[0];
      setFormData(prev => ({
        ...prev,
        roomNumber: firstRoom.roomNumber,
        category: firstRoom.category,
        department: firstRoom.deptName
      }));
    }
  }, [formData.floor, availableRooms]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Patient full name is required';
    if (!formData.diagnosis.trim()) errs.diagnosis = 'Primary diagnosis is required';
    if (!formData.roomNumber.trim()) errs.roomNumber = 'Room number is required';
    if (formData.age < 0 || formData.age > 120) errs.age = 'Valid age is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePrefillSample = () => {
    const defaultRoom = availableRooms[0] || { roomNumber: 'ICU-101', category: 'ICU', deptName: 'ICU' };
    setFormData({
      name: 'Aditya Deshmukh',
      age: 48,
      gender: 'Male',
      bloodGroup: 'B+',
      floor: formData.floor,
      roomNumber: defaultRoom.roomNumber,
      bedNumber: 'B-1',
      category: defaultRoom.category as PatientCategory,
      department: defaultRoom.deptName,
      diagnosis: 'Acute Coronary Syndrome, Troponin Positive',
      doctor: currentHospital.isDemo ? 'Dr. Ananya Rao' : 'Dr. Attending Physician',
      nurse: currentHospital.isDemo ? 'Priya Sharma, RN' : 'Senior Staff Nurse',
      heartRate: 88,
      spo2: 96,
      temperature: 37.2,
      systolicBP: 135,
      diastolicBP: 85,
      respiratoryRate: 18
    });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newPt = addPatient({
      name: formData.name.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      floor: Number(formData.floor),
      roomNumber: formData.roomNumber.trim(),
      bedNumber: formData.bedNumber.trim(),
      category: formData.category,
      department: formData.department,
      diagnosis: formData.diagnosis.trim(),
      admissionDate: new Date().toISOString().slice(0, 10),
      doctor: formData.doctor.trim(),
      nurse: formData.nurse.trim(),
      heartRate: Number(formData.heartRate),
      spo2: Number(formData.spo2),
      temperature: Number(formData.temperature),
      systolicBP: Number(formData.systolicBP),
      diastolicBP: Number(formData.diastolicBP),
      respiratoryRate: Number(formData.respiratoryRate),
      vitalHistory: [],
      riskScore: 20,
      riskCategory: 'LOW',
      lastUpdated: 'Just now',
      monitoringStatus: 'ACTIVE'
    });

    if (onPatientAdded) {
      onPatientAdded(newPt.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Admit New Inpatient</h3>
              <p className="text-xs text-slate-400">
                Register patient to <strong className="text-teal-300">{currentHospital.name}</strong> ({currentHospital.id})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrefillSample}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 rounded-xl text-xs font-medium transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sample Patient</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admission Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Patient Demographics */}
          <div>
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-3">
              1. Demographics & Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Full Patient Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none ${
                    errors.name ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-[10px] mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Age *</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & Bed Assignment */}
          <div>
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-3">
              2. Ward, Room & Bed Assignment
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Hospital Floor</label>
                <select
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  {floors.map(f => (
                    <option key={f.floorNumber} value={f.floorNumber}>
                      Floor {f.floorNumber} ({f.name.split('—')[1] || f.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Room Number *</label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  placeholder="e.g. ICU-101"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Bed Number</label>
                <input
                  type="text"
                  value={formData.bedNumber}
                  onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                  placeholder="e.g. B-1"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ward Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as PatientCategory })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
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
            </div>
          </div>

          {/* Clinical Diagnosis & Staff */}
          <div>
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-3">
              3. Clinical Diagnosis & Attending Staff
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-slate-400 mb-1">Primary Clinical Diagnosis *</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="e.g. Bilateral Lower Lobe Pneumonia, Severe Sepsis Alert"
                  className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none ${
                    errors.diagnosis ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                {errors.diagnosis && <p className="text-red-400 text-[10px] mt-0.5">{errors.diagnosis}</p>}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Attending Physician</label>
                <input
                  type="text"
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Primary Staff Nurse</label>
                <input
                  type="text"
                  value={formData.nurse}
                  onChange={(e) => setFormData({ ...formData, nurse: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Initial Telemetry Vital Signs */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="font-semibold text-teal-400 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Activity className="w-4 h-4" />
              <span>4. Baseline Vital Telemetry Parameters</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              <div>
                <label className="block text-slate-400 text-[10px] mb-1">HR (BPM)</label>
                <input
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-center font-mono font-bold text-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">SpO₂ (%)</label>
                <input
                  type="number"
                  value={formData.spo2}
                  onChange={(e) => setFormData({ ...formData, spo2: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-center font-mono font-bold text-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-center font-mono font-bold text-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Sys BP</label>
                <input
                  type="number"
                  value={formData.systolicBP}
                  onChange={(e) => setFormData({ ...formData, systolicBP: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-center font-mono font-bold text-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Dia BP</label>
                <input
                  type="number"
                  value={formData.diastolicBP}
                  onChange={(e) => setFormData({ ...formData, diastolicBP: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-center font-mono font-bold text-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Resp (/min)</label>
                <input
                  type="number"
                  value={formData.respiratoryRate}
                  onChange={(e) => setFormData({ ...formData, respiratoryRate: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-center font-mono font-bold text-white focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-teal-950/50 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admit & Start Telemetry Monitoring</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
