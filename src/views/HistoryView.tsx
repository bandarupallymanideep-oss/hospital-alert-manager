import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertOctagon, 
  AlertTriangle, 
  UserCheck, 
  Clock, 
  MapPin, 
  FileText,
  Download
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { alerts, setSelectedPatientId, setActiveTab, currentHospital } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredHistory = alerts.filter(a => {
    const matchesSearch = 
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.acknowledgedBy && a.acknowledgedBy.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    return true;
  });

  const handlePatientClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patient-detail');
  };

  const handleExportCSV = () => {
    const headers = ['Alert ID', 'Patient', 'Patient ID', 'Room', 'Parameter', 'Current Value', 'Threshold', 'Severity', 'Status', 'Timestamp', 'Acknowledged By', 'Acknowledged At'];
    const rows = filteredHistory.map(a => [
      a.id,
      `"${a.patientName}"`,
      a.patientId,
      a.roomNumber,
      a.parameter,
      `"${a.currentValue}"`,
      `"${a.thresholdValue}"`,
      a.severity,
      a.status,
      a.timestamp,
      `"${a.acknowledgedBy || 'Unacknowledged'}"`,
      a.acknowledgedAt || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const safeName = (currentHospital?.name || 'Hospital').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.setAttribute('download', `${safeName}_Alert_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-teal-400" />
            <span>Audit Trail & Historical Telemetry Alert Logs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete compliance archive of all detected vital parameter breaches, staff responses, and time-stamped resolutions.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search historical logs by patient, room, staff name, or parameter..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">🔴 Critical Alerts</option>
              <option value="HIGH">🟠 High Risk Warnings</option>
              <option value="WARNING">🟡 General Warnings</option>
              <option value="RESOLVED">🟢 Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Patient / Location</th>
                <th className="py-3 px-4">Telemetry Parameter</th>
                <th className="py-3 px-4">Measurement vs Threshold</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status & Staff Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredHistory.map((alert) => {
                const isCrit = alert.severity === 'CRITICAL';
                const isHigh = alert.severity === 'HIGH';

                return (
                  <tr key={alert.id} className="hover:bg-slate-800/50 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </td>

                    {/* Patient & Location */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span 
                          onClick={() => handlePatientClick(alert.patientId)}
                          className="font-bold text-white hover:text-teal-400 cursor-pointer"
                        >
                          {alert.patientName}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {alert.patientId} • Floor {alert.floor} • Room {alert.roomNumber} ({alert.bedNumber})
                        </div>
                      </div>
                    </td>

                    {/* Parameter */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200">
                        {alert.parameter}
                      </span>
                    </td>

                    {/* Reading vs Threshold */}
                    <td className="py-3.5 px-4 font-mono">
                      <div>
                        <span className="text-red-400 font-bold">{alert.currentValue}</span>
                        <span className="text-slate-500 text-[11px] block">Threshold: {alert.thresholdValue}</span>
                      </div>
                    </td>

                    {/* Severity Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isCrit ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                        isHigh ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>

                    {/* Staff Audit & Resolution */}
                    <td className="py-3.5 px-4">
                      {alert.acknowledgedBy ? (
                        <div>
                          <div className="flex items-center space-x-1.5 text-teal-300 font-medium text-[11px]">
                            <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>{alert.acknowledgedBy}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            at {alert.acknowledgedAt}
                          </span>
                          {alert.clinicalNote && (
                            <span className="text-[11px] text-slate-300 italic block mt-0.5">
                              "{alert.clinicalNote}"
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-amber-400 text-[11px] font-semibold flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                          <span>Pending Bedside Response</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
