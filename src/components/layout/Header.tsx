import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types';
import { 
  Building2, 
  Search, 
  Bell, 
  Volume2, 
  VolumeX, 
  User, 
  Clock, 
  ShieldAlert, 
  ChevronDown,
  Activity,
  HeartPulse,
  UserCheck,
  LogOut
} from 'lucide-react';


export const Header: React.FC = () => {
  const { 
    currentUser, 
    currentRole, 
    setCurrentRole, 
    currentHospital,
    hospitalsList,
    switchHospital,
    logoutHospital,
    setAuthScreen,
    alerts, 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    setSelectedPatientId, 
    setActiveTab,
    isAlarmMuted,
    toggleAlarmMute,
    setActiveAlertModal
  } = useHospital();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState<boolean>(false);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const criticalAlertsCount = alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL').length;

  const handleSelectSearchResult = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patient-detail');
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setShowRoleDropdown(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Hospital Branding */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-900/30 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-teal-400 transition-colors">
                {currentHospital.name}
              </h1>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-teal-500/15 border border-teal-500/40 text-teal-300 rounded-md">
                Hospital ID: {currentHospital.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {currentHospital.city ? `${currentHospital.city} • ` : ''}AI Patient Early Warning & Clinical Monitoring System
            </p>
          </div>
        </div>


        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search patient by name, ID, room number or diagnosis..."
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Search Dropdown Results */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-3 py-2 bg-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
                    Patients Found ({searchResults.length})
                  </div>
                  {searchResults.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectSearchResult(p.id)}
                      className="px-3 py-2.5 hover:bg-slate-800 cursor-pointer border-b border-slate-800/50 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-white">{p.name}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 font-mono">
                            {p.id}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            p.riskCategory === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                            p.riskCategory === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {p.riskCategory}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Floor {p.floor} • Room {p.roomNumber} ({p.bedNumber}) • {p.diagnosis}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-300">
                          {p.heartRate} BPM • {p.spo2}% SpO₂
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-4 text-xs text-slate-400 text-center">
                  No matching patients found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Time, Audio Mute, Notifications, Role Switcher */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Live Clock */}
          <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/60 font-mono">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{currentTime}</span>
          </div>

          {/* Alarm Audio Toggle */}
          <button
            onClick={toggleAlarmMute}
            className={`p-2 rounded-xl border transition-all ${
              isAlarmMuted 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
            }`}
            title={isAlarmMuted ? 'Telemetry Alarm Sound Muted' : 'Telemetry Alarm Sound Active'}
          >
            {isAlarmMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Active Alerts Bell */}
          <button
            onClick={() => setActiveTab('alerts')}
            className={`relative p-2 rounded-xl border transition-all ${
              criticalAlertsCount > 0 
                ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={`${activeAlertsCount} active alerts (${criticalAlertsCount} critical)`}
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-black rounded-full text-white ${
                criticalAlertsCount > 0 ? 'bg-red-600 animate-bounce' : 'bg-amber-500'
              }`}>
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Role & Staff Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-left transition-colors"
            >
              <span className="text-lg leading-none">{currentUser.avatar}</span>
              <div className="hidden sm:block">
                <div className="font-semibold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-teal-400 font-mono tracking-wide">{currentUser.role}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-2 py-1.5 border-b border-slate-800 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Clinical Role
                  </span>
                </div>
                <button
                  onClick={() => handleRoleSelect('DOCTOR')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center space-x-2 transition-colors ${
                    currentRole === 'DOCTOR' ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-base">👩‍⚕️</span>
                  <div>
                    <div className="font-semibold">
                      Doctor {currentHospital.isDemo ? '(Dr. Ananya Rao)' : '(Chief Physician)'}
                    </div>
                    <div className="text-[10px] text-slate-400">Full clinical authority & thresholds</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('NURSE')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center space-x-2 transition-colors ${
                    currentRole === 'NURSE' ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-base">🧑‍⚕️</span>
                  <div>
                    <div className="font-semibold">
                      Nurse {currentHospital.isDemo ? '(Priya Sharma, RN)' : '(ICU Charge Nurse)'}
                    </div>
                    <div className="text-[10px] text-slate-400">Vitals monitoring & alert response</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('ADMIN')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center space-x-2 transition-colors ${
                    currentRole === 'ADMIN' ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-base">👨‍💼</span>
                  <div>
                    <div className="font-semibold">Administrator ({currentHospital.adminName})</div>
                    <div className="text-[10px] text-slate-400">System settings & facility config</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Logout / Switch Portal */}
          <button
            onClick={logoutHospital}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 transition-all flex items-center space-x-1"
            title="Log out of hospital command center to Portal"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden xl:inline text-xs font-semibold">Exit</span>
          </button>
        </div>
      </div>
    </header>

  );
};
