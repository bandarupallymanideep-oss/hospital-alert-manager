import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { UserRole } from '../types';
import { 
  HeartPulse, 
  LogIn, 
  Building2, 
  Lock, 
  Mail, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const HospitalLoginView: React.FC = () => {
  const { 
    setAuthScreen, 
    loginHospital, 
    hospitalsList, 
    currentHospital 
  } = useHospital();

  const [hospitalIdentifier, setHospitalIdentifier] = useState<string>(currentHospital.id || 'HSP-DEMO');
  const [userEmail, setUserEmail] = useState<string>('demo@sanjeevanihospital.com');
  const [password, setPassword] = useState<string>('Demo@12345');
  const [selectedRole, setSelectedRole] = useState<UserRole>('DOCTOR');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!hospitalIdentifier.trim()) {
      setErrorMessage('Please enter a Hospital ID or Hospital Email.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const result = loginHospital(hospitalIdentifier.trim(), password.trim(), selectedRole, userEmail.trim());
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleSelectExistingHospital = (hId: string) => {
    const selected = hospitalsList.find(h => h.id === hId);
    if (selected) {
      setHospitalIdentifier(selected.id);
      setUserEmail(selected.adminEmail);
      if (selected.id === 'HSP-DEMO') {
        setPassword('Demo@12345');
      } else if (selected.adminPassword) {
        setPassword(selected.adminPassword);
      }
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setHospitalIdentifier('HSP-DEMO');
    setUserEmail('demo@sanjeevanihospital.com');
    setPassword('Demo@12345');
    setSelectedRole(role);
    const result = loginHospital('HSP-DEMO', 'Demo@12345', role, 'demo@sanjeevanihospital.com');
    if (!result.success) {
      setErrorMessage(result.error || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden justify-center">
      <div className="absolute inset-0 ecg-grid opacity-30 pointer-events-none"></div>

      <div className="max-w-md mx-auto w-full relative z-10 space-y-6">
        {/* Back Link */}
        <button
          onClick={() => setAuthScreen('landing')}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-900/40">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Hospital Portal Login
            </h1>
            <p className="text-xs text-slate-400">
              Access your hospital's AI Early Warning & Vital Telemetry Surveillance platform
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Quick selector of registered hospitals */}
            {hospitalsList.length > 1 && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Select Registered Facility (Optional Shortcut)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <select
                    value={hospitalIdentifier}
                    onChange={(e) => handleSelectExistingHospital(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-teal-500"
                  >
                    {hospitalsList.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Hospital ID or Hospital Email */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Hospital ID or Hospital Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={hospitalIdentifier}
                  onChange={(e) => setHospitalIdentifier(e.target.value)}
                  placeholder="e.g. HSP-DEMO or operations@hospital.org"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Administrator / User Email */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Administrator / Staff Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. demo@sanjeevanihospital.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Clinical Role Selection */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Login Role / Access Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['DOCTOR', 'NURSE', 'ADMIN'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedRole === role
                        ? 'bg-teal-600 border-teal-500 text-white shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {role === 'DOCTOR' ? '👩‍⚕️ Doctor' : role === 'NURSE' ? '🧑‍⚕️ Nurse' : '👨‍💼 Admin'}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-teal-900/40 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Login to Hospital Dashboard'}</span>
            </button>
          </form>

          {/* Quick Demo Pre-filled Credentials Box */}
          <div className="border-t border-slate-800 pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Demo Hospital Account
              </span>
              <span className="text-[10px] text-teal-400 font-mono font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                HSP-DEMO
              </span>
            </div>

            <div className="p-3 bg-slate-800/70 border border-slate-700/80 rounded-xl text-[11px] space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Hospital:</span>
                <span className="font-semibold text-white">Sanjeevani Multispeciality Hospital</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono text-teal-300">demo@sanjeevanihospital.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Password:</span>
                <span className="font-mono text-amber-300">Demo@12345</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('DOCTOR')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-teal-600/30 text-teal-300 hover:text-white border border-slate-700 rounded-lg text-center transition-colors text-[11px] font-semibold"
              >
                1-Click Doctor
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('NURSE')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-teal-600/30 text-teal-300 hover:text-white border border-slate-700 rounded-lg text-center transition-colors text-[11px] font-semibold"
              >
                1-Click Nurse
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-teal-600/30 text-teal-300 hover:text-white border border-slate-700 rounded-lg text-center transition-colors text-[11px] font-semibold"
              >
                1-Click Admin
              </button>
            </div>
          </div>

          {/* Register new link */}
          <div className="text-center pt-1 text-xs text-slate-400">
            <span>New hospital? </span>
            <button
              onClick={() => setAuthScreen('register')}
              className="text-teal-400 hover:text-teal-300 font-bold underline"
            >
              Register New Hospital Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
