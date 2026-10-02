import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { HospitalRegistrationData, HospitalType } from '../types';
import { 
  Building2, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Lock, 
  Layers, 
  Bed, 
  Sparkles,
  Info
} from 'lucide-react';

export const RegisterHospitalView: React.FC = () => {
  const { setAuthScreen, registerHospital } = useHospital();

  const [formData, setFormData] = useState<HospitalRegistrationData>({
    name: '',
    licenseNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    hospitalType: 'Multispeciality Hospital',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    password: '',
    confirmPassword: '',
    numFloors: 4,
    numRooms: 24,
    numBeds: 100,
    numIcuBeds: 20,
    numGeneralBeds: 80,
    departments: ['Emergency', 'ICU', 'Cardiology', 'General Medicine']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    'Other'
  ];

  const handleDepartmentToggle = (dept: string) => {
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Hospital info
    if (!formData.name.trim()) newErrors.name = 'Hospital name is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'Registration/License number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Hospital email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid hospital email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Hospital phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Hospital address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pinCode.trim()) newErrors.pinCode = 'PIN Code is required';

    // Admin info
    if (!formData.adminName.trim()) newErrors.adminName = 'Administrator full name is required';
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Administrator email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Please enter a valid administrator email';
    }
    if (!formData.adminPhone.trim()) newErrors.adminPhone = 'Administrator phone number is required';

    // Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must include at least one uppercase letter, one lowercase letter, and one number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Config validation
    if (!formData.numFloors || formData.numFloors < 1) {
      newErrors.numFloors = 'Must configure at least 1 floor';
    }
    if (!formData.numRooms || formData.numRooms < 1) {
      newErrors.numRooms = 'Must configure at least 1 room';
    }
    if (formData.departments.length === 0) {
      newErrors.departments = 'Select at least one department';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const result = registerHospital(formData);
      if (result && !result.success) {
        setErrors({ general: result.error || 'Registration failed' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Scroll to top of errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to prefill demo hospital data for fast testing
  const handlePrefillDemoData = () => {
    setFormData({
      name: 'Apollo City Multispeciality Center',
      licenseNumber: 'NABH-KA-2025-4109',
      email: 'operations@apollocity.org',
      phone: '+91 80 2294 8800',
      address: '42 Health Boulevard, Tech Zone II',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560100',
      country: 'India',
      hospitalType: 'Multispeciality Hospital',
      adminName: 'Dr. Ramesh Sundaram',
      adminEmail: 'r.sundaram@apollocity.org',
      adminPhone: '+91 99001 55667',
      password: 'HospitalAdmin@2026',
      confirmPassword: 'HospitalAdmin@2026',
      numFloors: 3,
      numRooms: 18,
      numBeds: 72,
      numIcuBeds: 16,
      numGeneralBeds: 56,
      departments: ['Emergency', 'ICU', 'Cardiology', 'General Medicine', 'Neurology']
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 ecg-grid opacity-30 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full relative z-10 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setAuthScreen('landing')}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Welcome Page</span>
          </button>

          <button
            type="button"
            onClick={handlePrefillDemoData}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 rounded-xl text-xs text-indigo-300 font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Prefill Sample Hospital Data</span>
          </button>
        </div>

        {/* Title Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
                ORGANIZATION ONBOARDING
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                Register Your Hospital
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Enroll your hospital healthcare facility to deploy the automated AI Early Warning & Vital Telemetry Surveillance system across all beds and wards.
              </p>
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/60 text-red-200 text-xs flex items-center space-x-3 shadow-xl animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="font-medium text-sm">{errors.general}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Hospital Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>1. Hospital Information</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Primary healthcare facility identity and licensing credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Hospital Name */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1">
                  Hospital Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sanjeevani Multispeciality Hospital"
                  className={`w-full bg-slate-800/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-[11px] mt-1 flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.name}</span></p>}
              </div>

              {/* License Number */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Registration / License Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="e.g. NABH-DL-2024-8849"
                  className={`w-full bg-slate-800/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.licenseNumber ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                {errors.licenseNumber && <p className="text-red-400 text-[11px] mt-1">{errors.licenseNumber}</p>}
              </div>

              {/* Hospital Type */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Hospital Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.hospitalType}
                  onChange={(e) => setFormData({ ...formData, hospitalType: e.target.value as HospitalType })}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  {hospitalTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Hospital Official Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. contact@hospital.org"
                    className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Hospital Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 11 4982 7700"
                    className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1">
                  Hospital Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street / Campus address, Sector / Area"
                  className={`w-full bg-slate-800/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.address ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                {errors.address && <p className="text-red-400 text-[11px] mt-1">{errors.address}</p>}
              </div>

              {/* City */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. New Delhi"
                  className={`w-full bg-slate-800/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none ${
                    errors.city ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                {errors.city && <p className="text-red-400 text-[11px] mt-1">{errors.city}</p>}
              </div>

              {/* State */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  State / Province <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Delhi"
                  className={`w-full bg-slate-800/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none ${
                    errors.state ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                {errors.state && <p className="text-red-400 text-[11px] mt-1">{errors.state}</p>}
              </div>

              {/* PIN Code */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Postal / PIN Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  placeholder="e.g. 110075"
                  className={`w-full bg-slate-800/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none ${
                    errors.pinCode ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                {errors.pinCode && <p className="text-red-400 text-[11px] mt-1">{errors.pinCode}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Country <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Administrator Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <User className="w-4 h-4 text-teal-400" />
                <span>2. Hospital Administrator Account</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Designated clinical director or systems admin with hospital management authority.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Admin Full Name */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1">
                  Administrator Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Mehta / Administrator"
                  className={`w-full bg-slate-800/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none ${
                    errors.adminName ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                {errors.adminName && <p className="text-red-400 text-[11px] mt-1">{errors.adminName}</p>}
              </div>

              {/* Admin Email */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Administrator Email (Login ID) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    placeholder="e.g. admin@hospital.org"
                    className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none ${
                      errors.adminEmail ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.adminEmail && <p className="text-red-400 text-[11px] mt-1">{errors.adminEmail}</p>}
              </div>

              {/* Admin Phone */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Administrator Mobile Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.adminPhone}
                    onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                    placeholder="e.g. +91 98101 22334"
                    className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none ${
                      errors.adminPhone ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.adminPhone && <p className="text-red-400 text-[11px] mt-1">{errors.adminPhone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
                    className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none ${
                      errors.password ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.password && <p className="text-red-400 text-[11px] mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-type password"
                    className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none ${
                      errors.confirmPassword ? 'border-red-500' : 'border-slate-700 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-[11px] mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 3: Hospital Scale & Department Configuration */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>3. Hospital Capacity & Department Configuration</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define the physical capacity metrics and clinical specialties active in your facility.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Floors <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.numFloors}
                  onChange={(e) => setFormData({ ...formData, numFloors: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Total Rooms <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={formData.numRooms}
                  onChange={(e) => setFormData({ ...formData, numRooms: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Total Beds
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.numBeds}
                  onChange={(e) => setFormData({ ...formData, numBeds: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ICU Beds
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={formData.numIcuBeds}
                  onChange={(e) => setFormData({ ...formData, numIcuBeds: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-red-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  General Beds
                </label>
                <input
                  type="number"
                  min="0"
                  max="800"
                  value={formData.numGeneralBeds}
                  onChange={(e) => setFormData({ ...formData, numGeneralBeds: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-teal-300 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Department checkboxes */}
            <div className="pt-2">
              <label className="block font-semibold text-slate-300 text-xs mb-2">
                Active Hospital Departments (Select all that apply) <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
                {availableDepartments.map(dept => {
                  const isChecked = formData.departments.includes(dept);
                  return (
                    <label
                      key={dept}
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-teal-950/40 border-teal-500/70 text-white font-semibold' 
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleDepartmentToggle(dept)}
                        className="rounded border-slate-700 text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                      <span>{dept}</span>
                    </label>
                  );
                })}
              </div>
              {errors.departments && <p className="text-red-400 text-[11px] mt-1.5">{errors.departments}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setAuthScreen('landing')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 active:scale-95 text-white rounded-xl text-sm font-bold shadow-xl shadow-teal-950/50 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Create Hospital & Continue to Setup Wizard →</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
