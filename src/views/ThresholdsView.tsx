import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Sliders, 
  ShieldAlert, 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  Check, 
  RotateCcw, 
  UserCheck, 
  Clock, 
  Info,
  Layers,
  Save,
  Lock
} from 'lucide-react';

export const ThresholdsView: React.FC = () => {
  const { thresholds, updateThreshold, currentRole, currentUser } = useHospital();

  const [activeScope, setActiveScope] = useState<'HOSPITAL' | 'WARD' | 'PATIENT'>('HOSPITAL');
  const [selectedWard, setSelectedWard] = useState<string>('ICU');
  
  // Local edit states
  const [editingValues, setEditingValues] = useState<Record<string, { low?: number; high?: number }>>(() => {
    const initial: Record<string, { low?: number; high?: number }> = {};
    thresholds.forEach(t => {
      initial[t.id] = { low: t.lowValue, high: t.highValue };
    });
    return initial;
  });

  // Keep editing values synchronized when switching hospitals or thresholds update
  React.useEffect(() => {
    const updated: Record<string, { low?: number; high?: number }> = {};
    thresholds.forEach(t => {
      updated[t.id] = { low: t.lowValue, high: t.highValue };
    });
    setEditingValues(updated);
  }, [thresholds]);

  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  const canEdit = currentRole === 'DOCTOR' || currentRole === 'ADMIN';

  const handleValueChange = (id: string, field: 'low' | 'high', val: number) => {
    setEditingValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: isNaN(val) ? undefined : val
      }
    }));
  };

  const handleSaveThreshold = (id: string) => {
    if (!canEdit) return;
    const current = editingValues[id];
    updateThreshold(id, current.low, current.high);
    setSavedSuccessMsg(`Threshold settings for parameter updated and audited successfully!`);
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  const getIcon = (param: string) => {
    switch (param) {
      case 'heartRate': return <Heart className="w-5 h-5 text-red-400" />;
      case 'spo2': return <Wind className="w-5 h-5 text-sky-400" />;
      case 'temperature': return <Thermometer className="w-5 h-5 text-amber-400" />;
      case 'systolicBP': return <Activity className="w-5 h-5 text-purple-400" />;
      case 'respiratoryRate': return <Activity className="w-5 h-5 text-emerald-400" />;
      default: return <Sliders className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Authorization Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Sliders className="w-6 h-6 text-teal-400" />
            <span>Clinical Threshold Protocols & Limits</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated alarm trigger boundaries for vital sign parameters across hospital services.
          </p>
        </div>

        {/* Scope Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs">
          <button
            onClick={() => setActiveScope('HOSPITAL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeScope === 'HOSPITAL' 
                ? 'bg-teal-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hospital Defaults
          </button>
          <button
            onClick={() => setActiveScope('WARD')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeScope === 'WARD' 
                ? 'bg-teal-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ward Specific
          </button>
          <button
            onClick={() => setActiveScope('PATIENT')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeScope === 'PATIENT' 
                ? 'bg-teal-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Patient Overrides
          </button>
        </div>
      </div>

      {/* Mandatory Clinical Disclaimer Banner (Prompt Requirement #11 & #32) */}
      <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-start space-x-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Mandatory Clinical Advisory:</span>
          <p className="mt-0.5 text-amber-200/80 leading-relaxed">
            Thresholds shown are demonstration baseline values. Attending clinical staff and intensivists must configure parameters appropriate to each specific patient and established hospital clinical protocol.
          </p>
        </div>
      </div>

      {/* Role permission status */}
      {!canEdit && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>
              You are currently logged in as <strong>{currentUser.name} ({currentUser.role})</strong>. Modifying threshold protocols requires Doctor or Admin credentials. Switch role from header to edit.
            </span>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {savedSuccessMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Ward Selector if Scope is WARD */}
      {activeScope === 'WARD' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-3 text-xs">
          <span className="text-slate-300 font-semibold">Select Ward Department:</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="ICU">Intensive Care Unit (ICU)</option>
            <option value="Emergency">Emergency (ER)</option>
            <option value="Critical Care">Critical Care Unit (CCU)</option>
            <option value="General Ward">General Ward</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
          </select>
        </div>
      )}

      {/* Threshold Parameter Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {thresholds.map((threshold) => {
          const currentEdit = editingValues[threshold.id] || { low: threshold.lowValue, high: threshold.highValue };

          return (
            <div
              key={threshold.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-800">
                    {getIcon(threshold.parameter)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{threshold.label}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Unit: {threshold.unit}</span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-teal-300 border border-slate-700">
                  {threshold.scope} PROTOCOL
                </span>
              </div>

              {/* Input Ranges */}
              <div className="grid grid-cols-2 gap-4">
                {/* Low Threshold */}
                {threshold.lowValue !== undefined && (
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <label className="block text-[11px] font-semibold text-red-400 mb-1">
                      Critical Low Threshold
                    </label>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="number"
                        disabled={!canEdit}
                        value={currentEdit.low ?? ''}
                        onChange={(e) => handleValueChange(threshold.id, 'low', parseFloat(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-teal-500 disabled:opacity-50"
                      />
                      <span className="text-xs text-slate-400 font-mono">{threshold.unit}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Alarm fires if reading falls below this
                    </span>
                  </div>
                )}

                {/* High Threshold */}
                {threshold.highValue !== undefined && (
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <label className="block text-[11px] font-semibold text-red-400 mb-1">
                      Critical High Threshold
                    </label>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="number"
                        disabled={!canEdit}
                        value={currentEdit.high ?? ''}
                        onChange={(e) => handleValueChange(threshold.id, 'high', parseFloat(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-teal-500 disabled:opacity-50"
                      />
                      <span className="text-xs text-slate-400 font-mono">{threshold.unit}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Alarm fires if reading exceeds this
                    </span>
                  </div>
                )}
              </div>

              {/* Audit Trail Stamp */}
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Configured by: <strong className="text-slate-300">{threshold.configuredBy}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] text-slate-500">{threshold.updatedAt}</span>
                  {canEdit && (
                    <button
                      onClick={() => handleSaveThreshold(threshold.id)}
                      className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1 transition-all"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
