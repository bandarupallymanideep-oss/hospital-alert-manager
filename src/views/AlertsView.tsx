import React, { useState, useMemo } from 'react';
import { useHospital } from '../context/HospitalContext';
import { AlertSeverity, AlertStatus } from '../types';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  MapPin, 
  Search, 
  UserCheck, 
  Eye, 
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    resolveAlert, 
    setSelectedPatientId, 
    setActiveTab, 
    setActiveAlertModal,
    currentUser,
    floors 
  } = useHospital();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [parameterFilter, setParameterFilter] = useState<string>('ALL');
  const [floorFilter, setFloorFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Acknowledge note input modal state
  const [ackModalAlertId, setAckModalAlertId] = useState<string | null>(null);
  const [ackNote, setAckNote] = useState<string>('');

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Search
      const matchesSearch = 
        alert.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Severity
      if (severityFilter !== 'ALL' && alert.severity !== severityFilter) {
        return false;
      }

      // Status
      if (statusFilter !== 'ALL' && alert.status !== statusFilter) {
        return false;
      }

      // Parameter
      if (parameterFilter !== 'ALL' && alert.parameter !== parameterFilter) {
        return false;
      }

      // Floor
      if (floorFilter !== 'ALL' && alert.floor !== parseInt(floorFilter)) {
        return false;
      }

      return true;
    });
  }, [alerts, searchQuery, severityFilter, statusFilter, parameterFilter, floorFilter]);

  const handleOpenAcknowledge = (alertId: string) => {
    setAckModalAlertId(alertId);
    setAckNote('');
  };

  const handleConfirmAcknowledge = () => {
    if (ackModalAlertId) {
      acknowledgeAlert(ackModalAlertId, ackNote);
      setAckModalAlertId(null);
      setAckNote('');
    }
  };

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patient-detail');
  };

  // Severity counts
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH' && a.status === 'ACTIVE').length;
  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const ackedCount = alerts.filter(a => a.status === 'ACKNOWLEDGED').length;

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Clinical Alert Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono font-bold">
              {activeCount} Active Alerts
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time critical, high-risk, and warning telemetry breaches with staff audit trail.
          </p>
        </div>

        {/* Status Counter Pills */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => { setSeverityFilter('CRITICAL'); setStatusFilter('ACTIVE'); }}
            className={`px-3 py-1 rounded-xl font-bold border transition-all ${
              severityFilter === 'CRITICAL' 
                ? 'bg-red-600 text-white border-red-500' 
                : 'bg-red-950/40 text-red-300 border-red-500/40 hover:bg-red-900/50'
            }`}
          >
            Critical: {criticalCount}
          </button>
          <button
            onClick={() => { setSeverityFilter('HIGH'); setStatusFilter('ACTIVE'); }}
            className={`px-3 py-1 rounded-xl font-bold border transition-all ${
              severityFilter === 'HIGH' 
                ? 'bg-amber-600 text-white border-amber-500' 
                : 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-900/50'
            }`}
          >
            High Risk: {highCount}
          </button>
          <button
            onClick={() => { setStatusFilter('ACKNOWLEDGED'); setSeverityFilter('ALL'); }}
            className={`px-3 py-1 rounded-xl font-bold border transition-all ${
              statusFilter === 'ACKNOWLEDGED' 
                ? 'bg-slate-700 text-white border-slate-600' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Acknowledged: {ackedCount}
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert by patient, room..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Severity */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">🔴 Critical</option>
              <option value="HIGH">🟠 High Risk</option>
              <option value="WARNING">🟡 Warning</option>
              <option value="RESOLVED">🟢 Resolved</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Alert Statuses</option>
              <option value="ACTIVE">⚡ Active (Unacknowledged)</option>
              <option value="ACKNOWLEDGED">✓ Acknowledged</option>
              <option value="RESOLVED">✓ Resolved</option>
            </select>
          </div>

          {/* Parameter */}
          <div>
            <select
              value={parameterFilter}
              onChange={(e) => setParameterFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Parameters</option>
              <option value="Heart Rate">Heart Rate</option>
              <option value="SpO₂">SpO₂</option>
              <option value="Temperature">Temperature</option>
              <option value="Blood Pressure">Blood Pressure</option>
              <option value="Respiratory Rate">Respiratory Rate</option>
            </select>
          </div>

          {/* Floor */}
          <div>
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Floors ({floors.length > 0 ? `1–${floors.length}` : 'All'})</option>
              {floors.map(fl => (
                <option key={fl.floorNumber} value={fl.floorNumber.toString()}>
                  Floor {fl.floorNumber} ({fl.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';
            const isResolved = alert.status === 'RESOLVED';
            const isAck = alert.status === 'ACKNOWLEDGED';

            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCrit && !isAck && !isResolved
                    ? 'bg-red-950/40 border-red-500/70 shadow-lg shadow-red-950/40 animate-radar-critical'
                    : isHigh && !isAck && !isResolved
                    ? 'bg-amber-950/30 border-amber-500/60'
                    : isResolved
                    ? 'bg-slate-900/60 border-slate-800/80 opacity-75'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left Column: Severity icon + Patient & parameter details */}
                  <div className="flex items-start space-x-3.5">
                    <div className={`p-2.5 rounded-xl shrink-0 mt-1 ${
                      isCrit ? 'bg-red-600 text-white animate-pulse' :
                      isHigh ? 'bg-amber-500 text-slate-950' :
                      isResolved ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {isCrit ? <AlertOctagon className="w-5 h-5" /> :
                       isResolved ? <CheckCircle2 className="w-5 h-5" /> :
                       <AlertTriangle className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span 
                          onClick={() => handleViewPatient(alert.patientId)}
                          className="text-base font-bold text-white hover:text-teal-400 cursor-pointer underline-offset-2 hover:underline"
                        >
                          {alert.patientName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono font-bold">
                          {alert.patientId}
                        </span>
                        <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-400" />
                          <span>Floor {alert.floor} • Room {alert.roomNumber} (Bed {alert.bedNumber})</span>
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          isCrit ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          isHigh ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          isResolved ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span className="text-slate-300">
                          Triggered Parameter: <strong className="text-white">{alert.parameter}</strong>
                        </span>
                        <span className="text-slate-300">
                          Current Value: <strong className="text-red-400 font-mono">{alert.currentValue}</strong>
                        </span>
                        <span className="text-slate-300">
                          Doctor Threshold: <strong className="text-amber-400 font-mono">{alert.thresholdValue}</strong>
                        </span>
                        <span className="text-slate-300">
                          AI Risk: <strong className="text-white font-mono">{alert.riskScore}/100</strong>
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-200/90 leading-relaxed bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                        {alert.message}
                      </p>

                      {/* Acknowledgement Audit info if acknowledged */}
                      {alert.acknowledgedBy && (
                        <div className="mt-2 text-[11px] text-teal-300 flex items-center space-x-1.5 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                          <span>
                            Acknowledged by {alert.acknowledgedBy} at {alert.acknowledgedAt}
                          </span>
                          {alert.clinicalNote && (
                            <span className="text-slate-400 italic">
                              — "{alert.clinicalNote}"
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Time and Action Buttons */}
                  <div className="flex flex-row lg:flex-col items-end justify-between gap-3 shrink-0 self-stretch lg:self-auto border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.timestamp}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewPatient(alert.patientId)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Patient Profile
                      </button>

                      {alert.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleOpenAcknowledge(alert.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold shadow-md transition-all"
                        >
                          Acknowledge
                        </button>
                      )}

                      {alert.status === 'ACKNOWLEDGED' && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-200 text-xs font-semibold transition-colors"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Matching Alerts</h3>
            <p className="text-xs text-slate-400 mt-1">
              All monitored patient telemetry parameters are within configured limits.
            </p>
          </div>
        )}
      </div>

      {/* Acknowledge Dialog Modal */}
      {ackModalAlertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-teal-400" />
                <span>Acknowledge Health Alert</span>
              </h3>
              <button 
                onClick={() => setAckModalAlertId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Confirming acknowledgment registers that <strong className="text-white">{currentUser.name} ({currentUser.role})</strong> has reviewed the alert and initiated clinical response.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bedside Observation / Response Action (Optional)
              </label>
              <textarea
                value={ackNote}
                onChange={(e) => setAckNote(e.target.value)}
                placeholder="e.g. Attending patient at bedside, initiated supplementary O2 at 4L/min, vital re-check scheduled in 5 mins."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 h-24"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setAckModalAlertId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAcknowledge}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-900/40"
              >
                Confirm Acknowledgment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
