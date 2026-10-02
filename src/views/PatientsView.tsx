import React, { useState, useMemo } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Patient, RiskCategory, PatientCategory } from '../types';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Wind, 
  Thermometer, 
  Activity,
  SlidersHorizontal,
  X,
  UserPlus,
  Users
} from 'lucide-react';
import { AddPatientModal } from '../components/common/AddPatientModal';

export const PatientsView: React.FC = () => {
  const { patients, setSelectedPatientId, setActiveTab, floors, currentHospital } = useHospital();
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  // Filters & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'riskScore' | 'name' | 'floor' | 'heartRate' | 'spo2'>('riskScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Filtered & Sorted list
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Search
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.doctor.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Floor filter
      if (selectedFloor !== 'ALL' && patient.floor !== parseInt(selectedFloor)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && patient.category !== selectedCategory) {
        return false;
      }

      // Risk filter
      if (selectedRisk !== 'ALL' && patient.riskCategory !== selectedRisk) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'riskScore') {
        comparison = a.riskScore - b.riskScore;
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'floor') {
        comparison = a.floor - b.floor;
      } else if (sortField === 'heartRate') {
        comparison = a.heartRate - b.heartRate;
      } else if (sortField === 'spo2') {
        comparison = a.spo2 - b.spo2;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [patients, searchTerm, selectedFloor, selectedCategory, selectedRisk, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleRowClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patient-detail');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFloor('ALL');
    setSelectedCategory('ALL');
    setSelectedRisk('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== '' || selectedFloor !== 'ALL' || selectedCategory !== 'ALL' || selectedRisk !== 'ALL';

  return (
    <div className="space-y-5">
      {/* Top Title & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Patient Telemetry Monitoring Table</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold">
              {filteredPatients.length} Active Patients
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time automated vital signs surveillance across all floors and hospital wards.
          </p>
        </div>

        {/* Live Status Summary Pills & Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 font-bold">
            Critical: {patients.filter(p => p.riskCategory === 'CRITICAL').length}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-400 font-bold">
            High Risk: {patients.filter(p => p.riskCategory === 'HIGH').length}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-bold">
            Stable: {patients.filter(p => p.riskCategory === 'STABLE' || p.riskCategory === 'LOW').length}
          </span>
          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-md shadow-teal-950/40 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admit Patient</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, ID, room, diagnosis, doctor..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Floor Filter */}
          <div>
            <select
              value={selectedFloor}
              onChange={(e) => {
                setSelectedFloor(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Floors ({floors.length} Total)</option>
              {floors.map(f => (
                <option key={f.floorNumber} value={f.floorNumber.toString()}>
                  Floor {f.floorNumber} ({f.name.split('—')[1] || f.name})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Categories</option>
              <option value="ICU">ICU</option>
              <option value="Emergency">Emergency</option>
              <option value="Critical Care">Critical Care</option>
              <option value="General Ward">General Ward</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">🔴 Critical (90–100)</option>
              <option value="HIGH">🟠 High Risk (75–89)</option>
              <option value="MODERATE">🟡 Moderate (50–74)</option>
              <option value="LOW">🔵 Low Risk (25–49)</option>
              <option value="STABLE">🟢 Stable (0–24)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Showing {filteredPatients.length} of {patients.length} patients
            </span>
            <button
              onClick={clearFilters}
              className="text-teal-400 hover:text-teal-300 font-medium flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Monitoring Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th 
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Patient</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Patient ID</th>
                <th 
                  onClick={() => handleSort('floor')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Floor / Room</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Category</th>
                <th 
                  onClick={() => handleSort('heartRate')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors text-right"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Heart Rate</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('spo2')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors text-right"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>SpO₂</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Temp</th>
                <th className="py-3 px-3 text-right">BP</th>
                <th className="py-3 px-3 text-right">Resp Rate</th>
                <th 
                  onClick={() => handleSort('riskScore')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-center"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>AI Risk</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    {patients.length === 0 ? (
                      <div className="space-y-3 max-w-sm mx-auto">
                        <Users className="w-10 h-10 text-slate-600 mx-auto" />
                        <p className="font-bold text-white text-base">No patients registered yet</p>
                        <p className="text-xs text-slate-400">
                          {currentHospital.name} currently has 0 admitted patients. Admit your first patient to begin telemetry monitoring.
                        </p>
                        <button
                          onClick={() => setIsAddPatientOpen(true)}
                          className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg"
                        >
                          Add First Patient
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-semibold text-white">No patients match the search or filter criteria</p>
                        <button onClick={clearFilters} className="text-teal-400 underline text-xs font-medium">Clear all filters</button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => {
                const isCritical = patient.riskCategory === 'CRITICAL';
                const isHigh = patient.riskCategory === 'HIGH';
                const isModerate = patient.riskCategory === 'MODERATE';

                // Check abnormal thresholds
                const isHRAbnormal = patient.heartRate < 50 || patient.heartRate > 120;
                const isSpO2Abnormal = patient.spo2 < 92;
                const isTempAbnormal = patient.temperature > 38.0 || patient.temperature < 35.5;
                const isBPAbnormal = patient.systolicBP < 90 || patient.systolicBP > 160;
                const isRRAbnormal = patient.respiratoryRate > 25 || patient.respiratoryRate < 10;

                return (
                  <tr
                    key={patient.id}
                    onClick={() => handleRowClick(patient.id)}
                    className={`hover:bg-slate-800/60 cursor-pointer transition-colors ${
                      isCritical ? 'bg-red-950/20' : isHigh ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    {/* Patient Name & Demographics */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-white text-sm flex items-center space-x-1.5">
                          <span>{patient.name}</span>
                          {isCritical && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {patient.age}y • {patient.gender} • {patient.bloodGroup} • Dr. {patient.doctor.split(' ')[1] || patient.doctor}
                        </div>
                      </div>
                    </td>

                    {/* Patient ID */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono font-bold text-[11px]">
                        {patient.id}
                      </span>
                    </td>

                    {/* Floor & Room */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200">
                        {patient.roomNumber} ({patient.bedNumber})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Floor {patient.floor}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                        {patient.category}
                      </span>
                    </td>

                    {/* Heart Rate */}
                    <td className="py-3.5 px-3 text-right">
                      <div className={`font-mono font-bold text-sm ${
                        isHRAbnormal ? 'text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded animate-pulse' : 'text-slate-200'
                      }`}>
                        {patient.heartRate} <span className="text-[10px] text-slate-400 font-normal">BPM</span>
                      </div>
                    </td>

                    {/* SpO2 */}
                    <td className="py-3.5 px-3 text-right">
                      <div className={`font-mono font-bold text-sm ${
                        isSpO2Abnormal ? 'text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded animate-pulse' : 'text-slate-200'
                      }`}>
                        {patient.spo2}<span className="text-[10px] text-slate-400 font-normal">%</span>
                      </div>
                    </td>

                    {/* Temperature */}
                    <td className="py-3.5 px-3 text-right">
                      <div className={`font-mono font-medium ${
                        isTempAbnormal ? 'text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded' : 'text-slate-300'
                      }`}>
                        {patient.temperature.toFixed(1)}°C
                      </div>
                    </td>

                    {/* Blood Pressure */}
                    <td className="py-3.5 px-3 text-right">
                      <div className={`font-mono font-medium ${
                        isBPAbnormal ? 'text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded' : 'text-slate-300'
                      }`}>
                        {patient.systolicBP}/{patient.diastolicBP}
                      </div>
                    </td>

                    {/* Respiratory Rate */}
                    <td className="py-3.5 px-3 text-right">
                      <div className={`font-mono font-medium ${
                        isRRAbnormal ? 'text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded' : 'text-slate-300'
                      }`}>
                        {patient.respiratoryRate}/min
                      </div>
                    </td>

                    {/* AI Risk Score */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`px-2 py-0.5 rounded-full font-mono font-black text-xs ${
                          isCritical ? 'bg-red-600 text-white' :
                          isHigh ? 'bg-amber-500 text-slate-950 font-bold' :
                          isModerate ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {patient.riskScore} / 100
                        </span>
                      </div>
                    </td>

                    {/* Risk Status Label */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                        isHigh ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        isModerate ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {patient.riskCategory}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(patient.id);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="View Complete Patient Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-800/40 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {filteredPatients.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || filteredPatients.length === 0}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || filteredPatients.length === 0}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Admission Modal */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onPatientAdded={(newId) => handleRowClick(newId)}
      />
    </div>
  );
};
