import React, { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { HospitalType } from '../types';
import { 
  Building2, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Layers, 
  Bed, 
  Lock, 
  Info,
  Sliders,
  Check,
  AlertCircle
} from 'lucide-react';

export const HospitalSettingsView: React.FC = () => {
  const { currentHospital, updateHospitalSettings, currentRole } = useHospital();

  const [formData, setFormData] = useState({
    name: currentHospital.name,
    licenseNumber: currentHospital.licenseNumber,
    email: currentHospital.email,
    phone: currentHospital.phone,
    address: currentHospital.address,
    city: currentHospital.city,
    state: currentHospital.state,
    pinCode: currentHospital.pinCode,
    country: currentHospital.country,
    hospitalType: currentHospital.hospitalType,
    adminName: currentHospital.adminName,
    adminEmail: currentHospital.adminEmail,
    adminPhone: currentHospital.adminPhone,
    numFloors: currentHospital.numFloors,
    numRooms: currentHospital.numRooms,
    numBeds: currentHospital.numBeds,
    numIcuBeds: currentHospital.numIcuBeds,
    numGeneralBeds: currentHospital.numGeneralBeds,
    departments: [...currentHospital.departments]
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const canEdit = currentRole === 'ADMIN' || currentRole === 'DOCTOR';

  // Synchronize when currentHospital changes
  useEffect(() => {
    setFormData({
      name: currentHospital.name,
      licenseNumber: currentHospital.licenseNumber,
      email: currentHospital.email,
      phone: currentHospital.phone,
      address: currentHospital.address,
      city: currentHospital.city,
      state: currentHospital.state,
      pinCode: currentHospital.pinCode,
      country: currentHospital.country,
      hospitalType: currentHospital.hospitalType,
      adminName: currentHospital.adminName,
      adminEmail: currentHospital.adminEmail,
      adminPhone: currentHospital.adminPhone,
      numFloors: currentHospital.numFloors,
      numRooms: currentHospital.numRooms,
      numBeds: currentHospital.numBeds,
      numIcuBeds: currentHospital.numIcuBeds,
      numGeneralBeds: currentHospital.numGeneralBeds,
      departments: [...currentHospital.departments]
    });
  }, [currentHospital]);

  const hospitalTypes: HospitalType[] = [
    'Multispeciality Hospital',
    'General Hospital',
    'Private Hospital',
    'Government Hospital',
    'Clinic',
    'Medical College Hospital',
    'Other'
  ];

  const availableDepartments = [
    'Emergency',
    'ICU',
    'Critical Care',
    'Cardiology',
    'Neurology',
    'General Medicine',
    'Orthopedics',
    'Pediatrics',
    'Oncology',
    'Nephrology',
    'General Ward',
    'Other'
  ];

  const handleDepartmentToggle = (dept: string) => {
    if (!canEdit) return;
    setFormData(prev => {
      const exists = prev.departments.includes(dept);
      return {
        ...prev,
        departments: exists 
          ? prev.departments.filter(d => d !== dept) 
          : [...prev.departments, dept]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    updateHospitalSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Facility Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-950/50 shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300">
                Hospital ID: {currentHospital.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {currentHospital.hospitalType}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {currentHospital.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{currentHospital.address}, {currentHospital.city}, {currentHospital.state} — PIN {currentHospital.pinCode}</span>
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {!canEdit && (
        <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-center space-x-2.5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>You are currently in Nurse role (Read-only). Switch to Administrator or Doctor role in the header to modify hospital parameters.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Core Hospital Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>Hospital Identification & Licensing</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Primary clinical registration and public directory records</p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 bg-slate-800 rounded-lg text-teal-300 border border-slate-700">
              ID: {currentHospital.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Hospital Name */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Hospital Name</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            {/* License Number */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Registration / License Number</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            {/* Hospital Type */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Hospital Type</label>
              <select
                disabled={!canEdit}
                value={formData.hospitalType}
                onChange={(e) => setFormData({ ...formData, hospitalType: e.target.value as HospitalType })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              >
                {hospitalTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Official Hospital Email</label>
              <input
                type="email"
                disabled={!canEdit}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Telephone Contact</label>
              <input
                type="tel"
                disabled={!canEdit}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Campus / Street Address</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            {/* City */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            {/* State */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">State / Region</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            {/* PIN Code */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">PIN / Postal Code</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Administrator Contact */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Designated Administrator Details</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Primary clinical administrator and IT operations contact</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Administrator Full Name</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Administrator Email (Login ID)</label>
              <input
                type="email"
                disabled={!canEdit}
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Administrator Direct Phone</label>
              <input
                type="tel"
                disabled={!canEdit}
                value={formData.adminPhone}
                onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Capacity & Physical Infrastructure */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Physical Infrastructure & Bed Allocations</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Reported bed count and telemetry surveillance allocation</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Total Floors</label>
              <input
                type="number"
                min="1"
                max="50"
                disabled={!canEdit}
                value={formData.numFloors}
                onChange={(e) => setFormData({ ...formData, numFloors: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Total Rooms</label>
              <input
                type="number"
                min="1"
                max="500"
                disabled={!canEdit}
                value={formData.numRooms}
                onChange={(e) => setFormData({ ...formData, numRooms: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Total Beds</label>
              <input
                type="number"
                min="1"
                max="2000"
                disabled={!canEdit}
                value={formData.numBeds}
                onChange={(e) => setFormData({ ...formData, numBeds: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">ICU Beds</label>
              <input
                type="number"
                min="0"
                max="500"
                disabled={!canEdit}
                value={formData.numIcuBeds}
                onChange={(e) => setFormData({ ...formData, numIcuBeds: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-red-400 focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">General Ward Beds</label>
              <input
                type="number"
                min="0"
                max="1500"
                disabled={!canEdit}
                value={formData.numGeneralBeds}
                onChange={(e) => setFormData({ ...formData, numGeneralBeds: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-teal-300 focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Departments */}
          <div className="pt-3">
            <label className="block font-semibold text-slate-300 text-xs mb-2">
              Active Hospital Departments
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {availableDepartments.map(dept => {
                const isChecked = formData.departments.includes(dept);
                return (
                  <label
                    key={dept}
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border transition-all ${
                      canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
                    } ${
                      isChecked 
                        ? 'bg-teal-950/40 border-teal-500/70 text-white font-semibold' 
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={!canEdit}
                      checked={isChecked}
                      onChange={() => handleDepartmentToggle(dept)}
                      className="rounded border-slate-700 text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                    <span>{dept}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save Actions */}
        {canEdit && (
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="submit"
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 active:scale-95 text-white font-bold rounded-xl text-sm shadow-xl shadow-teal-950/50 transition-all hover:scale-[1.01]"
            >
              <Save className="w-4 h-4" />
              <span>Save Hospital Configuration</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
