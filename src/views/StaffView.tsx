import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { STAFF_USERS } from '../data/mockPatients';
import { UserRole } from '../types';
import { 
  UserCheck, 
  Shield, 
  Check, 
  X, 
  Clock, 
  Building, 
  Stethoscope, 
  HeartHandshake, 
  Settings,
  Users
} from 'lucide-react';

export const StaffView: React.FC = () => {
  const { currentRole, setCurrentRole, currentUser, currentHospital } = useHospital();

  const hospitalStaff = React.useMemo(() => {
    if (currentHospital.isDemo) {
      return STAFF_USERS;
    }
    const adminUser = {
      id: 'USR-ADMIN',
      name: currentHospital.adminName || 'Hospital Administrator',
      role: 'ADMIN' as UserRole,
      title: 'Hospital Administrator & Operations Lead',
      department: 'Hospital Administration',
      shift: 'Day Shift (08:00 - 18:00)',
      avatar: '👔',
    };
    const clinicalStaff = STAFF_USERS.filter(u => u.role !== 'ADMIN');
    return [adminUser, ...clinicalStaff];
  }, [currentHospital]);

  const permissionsMatrix = [
    { feature: 'View All Monitored Patients', doctor: true, nurse: true, admin: true },
    { feature: 'Continuous Live Telemetry Stream', doctor: true, nurse: true, admin: true },
    { feature: 'View Explainable AI Risk Diagnostics', doctor: true, nurse: true, admin: true },
    { feature: 'Acknowledge Critical & Warning Alerts', doctor: true, nurse: true, admin: true },
    { feature: 'Add Clinical Observations & Bedside Notes', doctor: true, nurse: true, admin: false },
    { feature: 'Configure Hospital & Ward Vital Thresholds', doctor: true, nurse: false, admin: true },
    { feature: 'Override Patient Specific Thresholds', doctor: true, nurse: false, admin: false },
    { feature: 'Manage Hospital Floors & Room Allocations', doctor: false, nurse: false, admin: true },
    { feature: 'System Diagnostics & Telemetry Server Config', doctor: false, nurse: false, admin: true },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <UserCheck className="w-6 h-6 text-teal-400" />
          <span>Medical Staff & Role-Based Access Control</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Clinical roster, active shift assignments, and privilege matrix for {currentHospital.name}.
        </p>
      </div>

      {/* Current Active User Session Card */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/50 border border-teal-500/40 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="text-4xl p-3 bg-slate-800 rounded-2xl border border-slate-700">
            {currentUser.avatar}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold uppercase font-mono">
                CURRENT SESSION
              </span>
              <span className="text-xs text-slate-400">{currentUser.department}</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">{currentUser.name}</h3>
            <p className="text-xs text-teal-300 font-medium">{currentUser.title}</p>
          </div>
        </div>

        {/* Quick Role Switcher */}
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-xs text-slate-400 mb-1.5 font-medium">Switch Active Role:</span>
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700 p-1 rounded-xl">
            {(['DOCTOR', 'NURSE', 'ADMIN'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === role 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Roster Cards */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Users className="w-5 h-5 text-teal-400" />
          <span>Active On-Duty Healthcare Team</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hospitalStaff.map((user) => {
            const isCurrent = user.id === currentUser.id;
            return (
              <div
                key={user.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent 
                    ? 'bg-slate-900 border-teal-500/80 shadow-lg shadow-teal-950/40 ring-1 ring-teal-500/40' 
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-3xl p-2 bg-slate-800 rounded-xl">{user.avatar}</div>
                  <div>
                    <div className="font-bold text-white text-sm">{user.name}</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-teal-300 font-mono">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-300 leading-relaxed">
                  {user.title}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.department}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.shift}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role-Based Permissions Matrix (Prompt Requirement #19) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-teal-400" />
              <span>Clinical Role Privilege & Authorization Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Governs access control for threshold modifications, clinical orders, and system settings.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/70 border-b border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">System Capability / Operational Action</th>
                <th className="py-3 px-4 text-center">Doctor (Physician)</th>
                <th className="py-3 px-4 text-center">Nurse (Clinical Staff)</th>
                <th className="py-3 px-4 text-center">Administrator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {permissionsMatrix.map((item, index) => (
                <tr key={index} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-medium text-slate-200">{item.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {item.doctor ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-800 text-slate-500">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.nurse ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-800 text-slate-500">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.admin ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-800 text-slate-500">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
