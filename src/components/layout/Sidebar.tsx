import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  Building, 
  Activity, 
  BarChart3, 
  Sliders, 
  UserCheck, 
  History,
  ShieldAlert,
  HelpCircle,
  Layers,
  HeartPulse,
  Settings
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, currentRole, currentHospital } = useHospital();

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const criticalCount = alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL').length;

  const navItems = [
    { id: 'dashboard', label: 'Hospital Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients List', icon: Users },
    { 
      id: 'alerts', 
      label: 'Alert Center', 
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeColor: criticalCount > 0 ? 'bg-red-600' : 'bg-amber-500'
    },
    { id: 'floors', label: 'Floors & Rooms', icon: Building },
    { id: 'live-monitoring', label: 'Live Telemetry', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { 
      id: 'thresholds', 
      label: 'Threshold Settings', 
      icon: Sliders,
      badgeText: currentRole === 'NURSE' ? 'Read-only' : null
    },
    { id: 'staff', label: 'Medical Staff', icon: UserCheck },
    { id: 'history', label: 'Alert History', icon: History },
    { id: 'settings', label: 'Hospital Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
      {/* Hospital Quick Overview Section */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>AUTOMATED MONITORING</span>
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
          </div>
          <div className="text-sm font-bold text-white flex items-center space-x-1.5">
            <HeartPulse className="w-4 h-4 text-teal-400" />
            <span>{currentHospital.numBeds || 100} Beds Monitored</span>
          </div>
          <div className="text-[11px] text-teal-300/80 mt-1 font-mono">
            {currentHospital.id} • AI Early Warning
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
          Clinical Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-900/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== null && item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-full text-white ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}

              {item.badgeText && (
                <span className="px-1.5 py-0.5 text-[9px] rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {item.badgeText}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Hospital Identity Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-1">
          <span>{currentHospital.city || 'Facility'}</span>
          <span>{currentHospital.numFloors} Flrs • {currentHospital.numRooms} Rms</span>
        </div>
        <div className="text-[10px] text-slate-400 leading-tight truncate font-semibold">
          {currentHospital.name}
        </div>
      </div>
    </aside>
  );
};
