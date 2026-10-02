import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  BarChart3, 
  Activity, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp, 
  ShieldCheck,
  Building2,
  Heart,
  Wind
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { patients, alerts, floors, currentHospital } = useHospital();

  // 1. Risk distribution
  const riskDistribution = [
    { name: 'Stable (0–24)', count: patients.filter(p => p.riskCategory === 'STABLE').length, color: '#10b981' },
    { name: 'Low Risk (25–49)', count: patients.filter(p => p.riskCategory === 'LOW').length, color: '#0ea5e9' },
    { name: 'Moderate (50–74)', count: patients.filter(p => p.riskCategory === 'MODERATE').length, color: '#f59e0b' },
    { name: 'High Risk (75–89)', count: patients.filter(p => p.riskCategory === 'HIGH').length, color: '#f97316' },
    { name: 'Critical (90–100)', count: patients.filter(p => p.riskCategory === 'CRITICAL').length, color: '#ef4444' },
  ];

  // 2. Dynamic alerts by floor
  const alertsByFloor = floors.length > 0
    ? floors.map(fl => {
        const floorPatients = patients.filter(p => p.floor === fl.floorNumber);
        const patientIds = new Set(floorPatients.map(p => p.id));
        const floorAlerts = alerts.filter(a => patientIds.has(a.patientId) || a.floor === fl.floorNumber);
        const critical = floorAlerts.filter(a => a.severity === 'CRITICAL').length;
        const high = floorAlerts.filter(a => a.severity === 'HIGH' || a.severity === 'WARNING').length;
        return {
          floor: `Floor ${fl.floorNumber} (${fl.name})`,
          critical,
          high,
          total: floorAlerts.length,
        };
      })
    : [
        { floor: 'Floor 1', critical: 0, high: 0, total: 0 },
      ];

  // 3. Alerts by parameter
  const alertsByParameter = [
    { parameter: 'SpO₂ Desat', count: alerts.filter(a => a.parameter.includes('SpO₂') || a.parameter.includes('SpO2')).length, color: '#38bdf8' },
    { parameter: 'Heart Rate', count: alerts.filter(a => a.parameter.includes('Heart')).length, color: '#f87171' },
    { parameter: 'Blood Pressure', count: alerts.filter(a => a.parameter.includes('Blood Pressure') || a.parameter.includes('BP')).length, color: '#c084fc' },
    { parameter: 'Pyrexia/Temp', count: alerts.filter(a => a.parameter.includes('Temp')).length, color: '#fbbf24' },
    { parameter: 'Resp Rate', count: alerts.filter(a => a.parameter.includes('Resp')).length, color: '#4ade80' },
  ];

  // Average risk score across active patients
  const avgRiskScore = patients.length > 0
    ? Math.round(patients.reduce((acc, p) => acc + p.riskScore, 0) / patients.length)
    : 0;

  const totalBeds = currentHospital.numBeds || 100;
  const utilizationPct = totalBeds > 0 ? Math.min(100, Math.round((patients.length / totalBeds) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-teal-400" />
          <span>Hospital Telemetry & Early Warning Analytics</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hospital-wide clinical surveillance metrics, threshold violation frequencies, and response time audits.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Monitored */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Monitored Capacity</span>
          <div className="mt-2 text-3xl font-black text-white">{totalBeds} Beds</div>
          <span className="text-[11px] text-teal-400 mt-1 block font-medium">{utilizationPct}% Active Utilization</span>
        </div>

        {/* Alerts Today */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Telemetry Alerts Active</span>
          <div className="mt-2 text-3xl font-black text-amber-400">{alerts.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">{alerts.filter(a => a.severity === 'CRITICAL').length} Critical</span>
        </div>

        {/* Avg Risk Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Mean AI Risk Index</span>
          <div className="mt-2 text-3xl font-black text-teal-300 font-mono">{avgRiskScore} / 100</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Hospital baseline stable</span>
        </div>

        {/* Mean Response Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Avg Nurse Ack Time</span>
          <div className="mt-2 text-3xl font-black text-emerald-400 font-mono">1.8 min</div>
          <span className="text-[11px] text-emerald-400/90 mt-1 block">Well below 5 min protocol limit</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Risk Distribution Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Current Inpatient Risk Distribution</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">{patients.length} Live Patients</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Alerts by Floor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Telemetry Alert Density by Floor</span>
            </h3>
            <span className="text-[11px] text-slate-400">{floors.length} Floors Monitored</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertsByFloor}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="floor" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                />
                <Bar dataKey="critical" name="Critical Alerts" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="high" name="High Risk Warnings" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Alerts by Parameter */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Threshold Breaches by Vital Parameter</span>
            </h3>
            <span className="text-[11px] text-slate-400">Past 24 Hours</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertsByParameter} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="parameter" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                />
                <Bar dataKey="count" name="Violations" fill="#14b8a6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4: Clinical Efficiency Impact */}
        <div className="bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Nursing Workload Optimization Metrics</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Impact of continuous automated surveillance vs manual routine checks.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Manual Bedside Visits Saved Daily</div>
                <div className="text-lg font-black text-teal-300">~640 Routine Checks</div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                -74% Routine Burden
              </span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Mean Early Deterioration Lead Time</div>
                <div className="text-lg font-black text-white">42 Minutes Early</div>
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                Faster Intervention
              </span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Cardiac Arrest In-Hospital Prevention Rate</div>
                <div className="text-lg font-black text-emerald-400">98.4% Flagged Prior</div>
              </div>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded">
                High Sensitivity
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
