import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Patient, 
  Alert, 
  ThresholdSetting, 
  StaffUser, 
  UserRole,
  FloorInfo,
  HospitalProfile,
  HospitalRegistrationData
} from '../types';
import { 
  INITIAL_PATIENTS, 
  INITIAL_ALERTS, 
  INITIAL_THRESHOLDS, 
  STAFF_USERS, 
  HOSPITAL_FLOORS,
  DEFAULT_HOSPITAL
} from '../data/mockPatients';
import { evaluatePatientRisk } from '../services/riskCalculator';
import { soundService } from '../services/soundService';

export type AuthScreen = 'landing' | 'login' | 'register' | 'wizard' | 'authenticated';

const STORAGE_KEY_HOSPITALS = 'hospital_ai_hospitals_v1';
const STORAGE_KEY_AUTH = 'hospital_ai_session_v1';
const STORAGE_KEY_PATIENTS = 'hospital_ai_patients_v1';
const STORAGE_KEY_ALERTS = 'hospital_ai_alerts_v1';
const STORAGE_KEY_SETUP = 'hospital_ai_setup_hospital_v1';
const STORAGE_KEY_STEP = 'hospital_ai_wizard_step_v1';

interface AuthSession {
  hospitalId: string;
  role: UserRole;
  user: StaffUser;
}

interface HospitalContextType {
  // Authentication & Hospital Management
  authScreen: AuthScreen;
  setAuthScreen: (screen: AuthScreen) => void;
  currentHospital: HospitalProfile;
  hospitalsList: HospitalProfile[];
  setupHospital: HospitalProfile | null;
  wizardStep: number;
  setWizardStep: (step: number) => void;
  registerHospital: (data: HospitalRegistrationData) => { success: boolean; error?: string };
  updateSetupHospital: (updates: Partial<HospitalProfile>) => void;
  completeHospitalSetup: (overrides?: { floors?: FloorInfo[]; thresholds?: ThresholdSetting[] }) => void;
  loginHospital: (identifier: string, password?: string, role?: UserRole, userEmail?: string) => { success: boolean; error?: string };
  logoutHospital: () => void;
  switchHospital: (hospitalId: string) => void;
  updateHospitalSettings: (updates: Partial<HospitalProfile>) => void;

  // Existing Hospital Telemetry & State (Isolated per hospital)
  patients: Patient[];
  allPatients: Patient[];
  alerts: Alert[];
  thresholds: ThresholdSetting[];
  currentUser: StaffUser;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedPatient: Patient | null;
  selectedRoom: string | null;
  setSelectedRoom: (room: string | null) => void;
  floors: FloorInfo[];

  // Patient Management
  addPatient: (patientData: Omit<Patient, 'id' | 'hospitalId'>) => Patient;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Patient[];

  // Alarm & Sound
  isAlarmMuted: boolean;
  toggleAlarmMute: () => void;
  hasActiveCriticalAlert: boolean;
  
  // Simulation & Ticker
  isSimulating: boolean;
  setIsSimulating: (active: boolean) => void;
  triggerEmergencySimulation: (
    type: 'HEART_RATE_ALERT' | 'SPO2_ALERT' | 'CRITICAL_CASCADE' | 'WARNING_RISE' | 'STABILIZE_PATIENT' | 'RESET_ALL',
    targetPatientId?: string
  ) => void;

  // Actions
  acknowledgeAlert: (alertId: string, note?: string) => void;
  resolveAlert: (alertId: string) => void;
  updateThreshold: (thresholdId: string, newLow?: number, newHigh?: number) => void;
  addPatientNote: (patientId: string, note: string) => void;
  activeAlertModal: Alert | null;
  setActiveAlertModal: (alert: Alert | null) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

// Helper to safely load JSON from localStorage
function safeLoadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

// Helper to safely write to localStorage
function safeSaveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
}

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from localStorage with fail-safe fallbacks
  const [hospitalsList, setHospitalsList] = useState<HospitalProfile[]>(() => {
    const stored = safeLoadFromStorage<HospitalProfile[]>(STORAGE_KEY_HOSPITALS, [DEFAULT_HOSPITAL]);
    // Ensure DEFAULT_HOSPITAL always exists in the list
    if (!stored.some(h => h.id === 'HSP-DEMO' || h.id === DEFAULT_HOSPITAL.id)) {
      return [DEFAULT_HOSPITAL, ...stored];
    }
    return stored;
  });

  const [setupHospital, setSetupHospital] = useState<HospitalProfile | null>(() => {
    return safeLoadFromStorage<HospitalProfile | null>(STORAGE_KEY_SETUP, null);
  });

  const [wizardStep, setWizardStepState] = useState<number>(() => {
    return safeLoadFromStorage<number>(STORAGE_KEY_STEP, 1);
  });

  const [allPatients, setAllPatients] = useState<Patient[]>(() => {
    const stored = safeLoadFromStorage<Patient[]>(STORAGE_KEY_PATIENTS, INITIAL_PATIENTS);
    // Ensure demo patients are present if empty
    if (!stored || stored.length === 0) {
      return INITIAL_PATIENTS;
    }
    return stored;
  });

  const [allAlerts, setAllAlerts] = useState<Alert[]>(() => {
    const stored = safeLoadFromStorage<Alert[]>(STORAGE_KEY_ALERTS, INITIAL_ALERTS);
    if (!stored || stored.length === 0) {
      return INITIAL_ALERTS;
    }
    return stored;
  });

  // Auth Session
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    return safeLoadFromStorage<AuthSession | null>(STORAGE_KEY_AUTH, null);
  });

  // Current active hospital (derived from authSession or fallback to DEFAULT_HOSPITAL)
  const [currentHospital, setCurrentHospital] = useState<HospitalProfile>(() => {
    const session = safeLoadFromStorage<AuthSession | null>(STORAGE_KEY_AUTH, null);
    if (session && session.hospitalId) {
      const storedHospitals = safeLoadFromStorage<HospitalProfile[]>(STORAGE_KEY_HOSPITALS, [DEFAULT_HOSPITAL]);
      const matched = storedHospitals.find(h => h.id === session.hospitalId);
      if (matched) return matched;
    }
    return DEFAULT_HOSPITAL;
  });

  // Screen routing state
  const [authScreen, setAuthScreenState] = useState<AuthScreen>(() => {
    const session = safeLoadFromStorage<AuthSession | null>(STORAGE_KEY_AUTH, null);
    if (session && session.hospitalId) {
      return 'authenticated';
    }
    const setup = safeLoadFromStorage<HospitalProfile | null>(STORAGE_KEY_SETUP, null);
    if (setup) {
      return 'wizard';
    }
    return 'landing';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const session = safeLoadFromStorage<AuthSession | null>(STORAGE_KEY_AUTH, null);
    return session?.role || 'DOCTOR';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAlarmMuted, setIsAlarmMuted] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [activeAlertModal, setActiveAlertModal] = useState<Alert | null>(null);

  // Synchronize state with localStorage
  useEffect(() => {
    safeSaveToStorage(STORAGE_KEY_HOSPITALS, hospitalsList);
  }, [hospitalsList]);

  useEffect(() => {
    safeSaveToStorage(STORAGE_KEY_PATIENTS, allPatients);
  }, [allPatients]);

  useEffect(() => {
    safeSaveToStorage(STORAGE_KEY_ALERTS, allAlerts);
  }, [allAlerts]);

  useEffect(() => {
    safeSaveToStorage(STORAGE_KEY_SETUP, setupHospital);
  }, [setupHospital]);

  useEffect(() => {
    safeSaveToStorage(STORAGE_KEY_AUTH, authSession);
  }, [authSession]);

  const setWizardStep = useCallback((step: number) => {
    setWizardStepState(step);
    safeSaveToStorage(STORAGE_KEY_STEP, step);
  }, []);

  const setAuthScreen = useCallback((screen: AuthScreen) => {
    setAuthScreenState(screen);
  }, []);

  // Filter patients and alerts strictly by currentHospital.id (HOSPITAL ISOLATION)
  const patients = useMemo(() => {
    return allPatients.filter(p => p.hospitalId === currentHospital.id);
  }, [allPatients, currentHospital.id]);

  const alerts = useMemo(() => {
    return allAlerts.filter(a => a.hospitalId === currentHospital.id);
  }, [allAlerts, currentHospital.id]);

  const thresholds = useMemo(() => {
    return currentHospital.thresholds && currentHospital.thresholds.length > 0 
      ? currentHospital.thresholds 
      : INITIAL_THRESHOLDS;
  }, [currentHospital.thresholds]);

  const floors = useMemo(() => {
    return currentHospital.floors && currentHospital.floors.length > 0 
      ? currentHospital.floors 
      : HOSPITAL_FLOORS;
  }, [currentHospital.floors]);

  // Current user based on role and hospital
  const currentUser: StaffUser = useMemo(() => {
    if (authSession?.user && authSession.user.role === currentRole) {
      return authSession.user;
    }
    if (currentRole === 'ADMIN') {
      return {
        id: `u-admin-${currentHospital.id}`,
        name: currentHospital.adminName || 'Hospital Administrator',
        role: 'ADMIN',
        title: 'Hospital Operations Administrator',
        department: 'Administration',
        avatar: '👨‍💼',
        shift: 'General Shift'
      };
    }
    // Return appropriate role-based doctor or nurse
    const matched = STAFF_USERS.find(u => u.role === currentRole);
    return matched || STAFF_USERS[0];
  }, [authSession, currentRole, currentHospital]);

  // Selected patient object (strictly from current hospital)
  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  // Active critical alerts count
  const hasActiveCriticalAlert = useMemo(() => {
    return alerts.some(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL');
  }, [alerts]);

  // Trigger continuous alarm sound when unacknowledged critical alert exists
  useEffect(() => {
    if (hasActiveCriticalAlert && !isAlarmMuted && authScreen === 'authenticated') {
      soundService.startAlarm();
    } else {
      soundService.stopAlarm();
    }
  }, [hasActiveCriticalAlert, isAlarmMuted, authScreen]);

  const toggleAlarmMute = useCallback(() => {
    setIsAlarmMuted(prev => {
      const next = !prev;
      soundService.setMuted(next);
      return next;
    });
  }, []);

  // Search Results strictly within current hospital
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return patients.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.roomNumber.toLowerCase().includes(q) ||
      p.bedNumber.toLowerCase().includes(q) ||
      p.diagnosis.toLowerCase().includes(q) ||
      p.doctor.toLowerCase().includes(q) ||
      p.nurse.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q)
    );
  }, [patients, searchQuery]);

  // Acknowledge Alert
  const acknowledgeAlert = useCallback((alertId: string, note?: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAllAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'ACKNOWLEDGED',
          acknowledgedBy: `${currentUser.name} (${currentUser.role})`,
          acknowledgedAt: now,
          clinicalNote: note || a.clinicalNote
        };
      }
      return a;
    }));

    if (activeAlertModal?.id === alertId) {
      setActiveAlertModal(null);
    }
    soundService.playNotificationPing();
  }, [currentUser, activeAlertModal]);

  // Resolve Alert
  const resolveAlert = useCallback((alertId: string) => {
    setAllAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'RESOLVED',
          severity: 'RESOLVED'
        };
      }
      return a;
    }));
  }, []);

  // Update Threshold for CURRENT HOSPITAL ONLY
  const updateThreshold = useCallback((thresholdId: string, newLow?: number, newHigh?: number) => {
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + 
                new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const updatedThresholds = thresholds.map(t => {
      if (t.id === thresholdId) {
        return {
          ...t,
          lowValue: newLow !== undefined ? newLow : t.lowValue,
          highValue: newHigh !== undefined ? newHigh : t.highValue,
          configuredBy: `${currentUser.name} (${currentUser.role})`,
          role: currentUser.role,
          updatedAt: now
        };
      }
      return t;
    });

    const updatedHospital: HospitalProfile = {
      ...currentHospital,
      thresholds: updatedThresholds
    };

    setCurrentHospital(updatedHospital);
    setHospitalsList(prev => prev.map(h => h.id === updatedHospital.id ? updatedHospital : h));

    // Recalculate patient risks with new thresholds only for this hospital's patients
    setAllPatients(prev => prev.map(p => {
      if (p.hospitalId !== currentHospital.id) return p;
      const evaluation = evaluatePatientRisk(p, updatedThresholds);
      return {
        ...p,
        riskScore: evaluation.score,
        riskCategory: evaluation.category
      };
    }));
  }, [currentUser, thresholds, currentHospital]);

  // Add clinical note
  const addPatientNote = useCallback((patientId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAllPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const newNote = {
          id: `note-${Date.now()}`,
          author: currentUser.name,
          role: currentUser.role,
          text: text.trim(),
          timestamp: now
        };
        return {
          ...p,
          notes: [newNote, ...(p.notes || [])]
        };
      }
      return p;
    }));
  }, [currentUser]);

  // Add Patient to Current Hospital
  const addPatient = useCallback((data: Omit<Patient, 'id' | 'hospitalId'>): Patient => {
    const newId = `P${Math.floor(1000 + Math.random() * 9000)}`;
    const evaluation = evaluatePatientRisk({
      heartRate: data.heartRate,
      spo2: data.spo2,
      temperature: data.temperature,
      systolicBP: data.systolicBP,
      diastolicBP: data.diastolicBP,
      respiratoryRate: data.respiratoryRate,
      category: data.category
    }, thresholds);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const initialTrend = [
      { time: '1h ago', heartRate: data.heartRate, spo2: data.spo2, temperature: data.temperature, systolicBP: data.systolicBP, diastolicBP: data.diastolicBP, respiratoryRate: data.respiratoryRate },
      { time: 'Just now', heartRate: data.heartRate, spo2: data.spo2, temperature: data.temperature, systolicBP: data.systolicBP, diastolicBP: data.diastolicBP, respiratoryRate: data.respiratoryRate }
    ];

    const newPatient: Patient = {
      ...data,
      id: newId,
      hospitalId: currentHospital.id,
      riskScore: evaluation.score,
      riskCategory: evaluation.category,
      lastUpdated: 'Just now',
      monitoringStatus: 'ACTIVE',
      vitalHistory: data.vitalHistory && data.vitalHistory.length > 0 ? data.vitalHistory : initialTrend
    };

    setAllPatients(prev => [newPatient, ...prev]);

    // If critical or warning, generate corresponding alert
    if (evaluation.category === 'CRITICAL' || evaluation.category === 'HIGH') {
      const isCrit = evaluation.category === 'CRITICAL';
      const newAlert: Alert = {
        id: `alt-${Date.now()}`,
        hospitalId: currentHospital.id,
        patientId: newId,
        patientName: data.name,
        floor: data.floor,
        roomNumber: data.roomNumber,
        bedNumber: data.bedNumber,
        category: data.category,
        parameter: 'Overall Risk',
        currentValue: `Risk ${evaluation.score}/100`,
        thresholdValue: 'Score > 75',
        severity: isCrit ? 'CRITICAL' : 'HIGH',
        status: 'ACTIVE',
        message: `${isCrit ? 'CRITICAL EARLY WARNING' : 'HIGH RISK ALERT'}: Patient admitted with abnormal vital parameters.`,
        riskScore: evaluation.score,
        timestamp: now
      };
      setAllAlerts(prev => [newAlert, ...prev]);
      if (isCrit) {
        setActiveAlertModal(newAlert);
        soundService.playCriticalChime();
      }
    }

    return newPatient;
  }, [currentHospital.id, thresholds]);

  // Update Hospital Settings
  const updateHospitalSettings = useCallback((updates: Partial<HospitalProfile>) => {
    const updated = {
      ...currentHospital,
      ...updates
    };
    setCurrentHospital(updated);
    setHospitalsList(prev => prev.map(h => h.id === updated.id ? updated : h));
  }, [currentHospital]);

  // Emergency Simulation Triggers for current hospital patients
  const triggerEmergencySimulation = useCallback((
    type: 'HEART_RATE_ALERT' | 'SPO2_ALERT' | 'CRITICAL_CASCADE' | 'WARNING_RISE' | 'STABILIZE_PATIENT' | 'RESET_ALL',
    targetPatientId?: string
  ) => {
    if (patients.length === 0) return;

    const targetId = targetPatientId || patients[0]?.id;
    if (!targetId) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (type === 'RESET_ALL') {
      if (currentHospital.id === 'HSP-DEMO') {
        setAllPatients(prev => [
          ...prev.filter(p => p.hospitalId !== 'HSP-DEMO'),
          ...INITIAL_PATIENTS
        ]);
        setAllAlerts(prev => [
          ...prev.filter(a => a.hospitalId !== 'HSP-DEMO'),
          ...INITIAL_ALERTS
        ]);
      }
      return;
    }

    setAllPatients(prev => prev.map(p => {
      if (p.id !== targetId || p.hospitalId !== currentHospital.id) return p;

      let newHR = p.heartRate;
      let newSpO2 = p.spo2;
      let newTemp = p.temperature;
      let newSBP = p.systolicBP;
      let newDBP = p.diastolicBP;
      let newRR = p.respiratoryRate;

      if (type === 'HEART_RATE_ALERT') {
        newHR = 48; // Critical bradycardia
      } else if (type === 'SPO2_ALERT') {
        newSpO2 = 87; // Critical hypoxia
      } else if (type === 'CRITICAL_CASCADE') {
        newHR = 46;
        newSpO2 = 86;
        newTemp = 39.2;
        newSBP = 82;
        newDBP = 50;
        newRR = 29;
      } else if (type === 'WARNING_RISE') {
        newHR = 114;
        newSpO2 = 93;
        newTemp = 38.3;
        newSBP = 144;
        newDBP = 90;
        newRR = 22;
      } else if (type === 'STABILIZE_PATIENT') {
        newHR = 72;
        newSpO2 = 98;
        newTemp = 36.8;
        newSBP = 120;
        newDBP = 80;
        newRR = 16;
      }

      const evalResult = evaluatePatientRisk({
        heartRate: newHR,
        spo2: newSpO2,
        temperature: newTemp,
        systolicBP: newSBP,
        diastolicBP: newDBP,
        respiratoryRate: newRR,
        category: p.category
      }, thresholds);

      const newHistory = [
        ...(p.vitalHistory || []).slice(1),
        {
          time: 'Just now',
          heartRate: newHR,
          spo2: newSpO2,
          temperature: newTemp,
          systolicBP: newSBP,
          diastolicBP: newDBP,
          respiratoryRate: newRR
        }
      ];

      return {
        ...p,
        heartRate: newHR,
        spo2: newSpO2,
        temperature: newTemp,
        systolicBP: newSBP,
        diastolicBP: newDBP,
        respiratoryRate: newRR,
        riskScore: evalResult.score,
        riskCategory: evalResult.category,
        lastUpdated: 'Just now',
        vitalHistory: newHistory
      };
    }));

    const patient = patients.find(p => p.id === targetId);
    if (!patient) return;

    if (type === 'HEART_RATE_ALERT') {
      const newAlert: Alert = {
        id: `alt-live-${Date.now()}`,
        hospitalId: currentHospital.id,
        patientId: patient.id,
        patientName: patient.name,
        floor: patient.floor,
        roomNumber: patient.roomNumber,
        bedNumber: patient.bedNumber,
        category: patient.category,
        parameter: 'Heart Rate',
        currentValue: '48 BPM',
        thresholdValue: '< 50 BPM',
        severity: 'CRITICAL',
        status: 'ACTIVE',
        message: `CRITICAL ALERT: Heart rate dropped below threshold to 48 BPM! Immediate bedside evaluation needed.`,
        riskScore: 92,
        timestamp: now
      };
      setAllAlerts(prev => [newAlert, ...prev]);
      setActiveAlertModal(newAlert);
      soundService.playCriticalChime();
    } else if (type === 'SPO2_ALERT') {
      const newAlert: Alert = {
        id: `alt-live-${Date.now()}`,
        hospitalId: currentHospital.id,
        patientId: patient.id,
        patientName: patient.name,
        floor: patient.floor,
        roomNumber: patient.roomNumber,
        bedNumber: patient.bedNumber,
        category: patient.category,
        parameter: 'SpO₂',
        currentValue: '87%',
        thresholdValue: '< 92%',
        severity: 'CRITICAL',
        status: 'ACTIVE',
        message: `CRITICAL HYPOXIA: SpO₂ desaturated to 87% (Threshold: 92%). Check oxygen delivery line immediately!`,
        riskScore: 95,
        timestamp: now
      };
      setAllAlerts(prev => [newAlert, ...prev]);
      setActiveAlertModal(newAlert);
      soundService.playCriticalChime();
    } else if (type === 'CRITICAL_CASCADE') {
      const newAlert: Alert = {
        id: `alt-live-${Date.now()}`,
        hospitalId: currentHospital.id,
        patientId: patient.id,
        patientName: patient.name,
        floor: patient.floor,
        roomNumber: patient.roomNumber,
        bedNumber: patient.bedNumber,
        category: patient.category,
        parameter: 'Overall Risk',
        currentValue: 'Critical (Risk 96)',
        thresholdValue: 'Score > 90',
        severity: 'CRITICAL',
        status: 'ACTIVE',
        message: `MULTI-ORGAN DETERIORATION: Patient experiencing acute hemodynamic & respiratory compromise.`,
        riskScore: 96,
        timestamp: now
      };
      setAllAlerts(prev => [newAlert, ...prev]);
      setActiveAlertModal(newAlert);
      soundService.playCriticalChime();
    } else if (type === 'STABILIZE_PATIENT') {
      soundService.playNotificationPing();
      setAllAlerts(prev => prev.map(a => a.patientId === targetId && a.hospitalId === currentHospital.id ? { ...a, status: 'RESOLVED', severity: 'RESOLVED' } : a));
    }
  }, [patients, currentHospital.id, thresholds]);

  // Live Subtle Vital Fluctuations Simulation Ticker
  useEffect(() => {
    if (!isSimulating || authScreen !== 'authenticated') return;

    const interval = setInterval(() => {
      setAllPatients(prevPatients => {
        return prevPatients.map(p => {
          if (p.monitoringStatus !== 'ACTIVE' || p.hospitalId !== currentHospital.id) return p;
          if (Math.random() > 0.4) return p;

          const hrDelta = Math.floor(Math.random() * 3) - 1;
          const spo2Delta = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const tempDelta = Number(((Math.random() - 0.5) * 0.1).toFixed(1));
          const bpDelta = Math.floor(Math.random() * 3) - 1;

          const newHR = Math.max(38, Math.min(180, p.heartRate + hrDelta));
          const newSpO2 = Math.max(75, Math.min(100, p.spo2 + spo2Delta));
          const newTemp = Number(Math.max(34.5, Math.min(41.5, p.temperature + tempDelta)).toFixed(1));
          const newSBP = Math.max(65, Math.min(220, p.systolicBP + bpDelta));
          const newDBP = Math.max(40, Math.min(130, p.diastolicBP + Math.round(bpDelta * 0.6)));
          const newRR = p.respiratoryRate;

          const evalResult = evaluatePatientRisk({
            heartRate: newHR,
            spo2: newSpO2,
            temperature: newTemp,
            systolicBP: newSBP,
            diastolicBP: newDBP,
            respiratoryRate: newRR,
            category: p.category
          }, thresholds);

          return {
            ...p,
            heartRate: newHR,
            spo2: newSpO2,
            temperature: newTemp,
            systolicBP: newSBP,
            diastolicBP: newDBP,
            riskScore: evalResult.score,
            riskCategory: evalResult.category,
            lastUpdated: 'Just now'
          };
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating, thresholds, currentHospital.id, authScreen]);

  // Generate initial floors and rooms for newly registered hospital
  const generateDefaultFloorsForHospital = (numFloors: number, departments: string[], numRooms: number): FloorInfo[] => {
    const result: FloorInfo[] = [];
    const deptList = departments && departments.length > 0 ? departments : ['Emergency', 'ICU', 'General Ward', 'Cardiology'];
    const roomsPerFloor = Math.max(2, Math.ceil(numRooms / numFloors));

    for (let f = 1; f <= numFloors; f++) {
      const dept1 = deptList[(f - 1) % deptList.length];
      const dept2 = deptList[f % deptList.length];
      const deptsForFloor = deptList.length > 1 && f === 1 ? [dept1, dept2] : [dept1];

      result.push({
        floorNumber: f,
        name: f === 1 ? `Floor 1 — ${dept1} & ${dept2}` : `Floor ${f} — ${dept1} Ward`,
        departments: deptsForFloor.map((dName, dIdx) => {
          const roomsCount = Math.max(1, Math.ceil(roomsPerFloor / deptsForFloor.length));
          const rooms = [];
          for (let r = 1; r <= roomsCount; r++) {
            const roomCode = `${dName.slice(0, 3).toUpperCase()}-${f}0${r + (dIdx * 2)}`;
            rooms.push({
              roomNumber: roomCode,
              capacity: dName === 'ICU' ? 4 : 4,
              category: (dName === 'ICU' ? 'ICU' : dName === 'Emergency' ? 'Emergency' : 'General Ward') as any
            });
          }
          return {
            name: dName,
            rooms
          };
        })
      });
    }
    return result;
  };

  // Register New Hospital
  const registerHospital = useCallback((data: HospitalRegistrationData): { success: boolean; error?: string } => {
    // Check duplicate email or registration number
    const dupEmail = hospitalsList.some(h => 
      h.email.toLowerCase() === data.email.toLowerCase() || 
      h.adminEmail.toLowerCase() === data.adminEmail.toLowerCase()
    );
    if (dupEmail) {
      return { success: false, error: 'A hospital with this official or administrator email is already registered.' };
    }

    const dupLicense = hospitalsList.some(h => 
      h.licenseNumber.toLowerCase() === data.licenseNumber.toLowerCase()
    );
    if (dupLicense) {
      return { success: false, error: 'A hospital with this Registration / License Number is already registered.' };
    }

    // Generate next sequential unique Hospital ID
    const existingIds = hospitalsList.map(h => h.id);
    let nextNum = 1001;
    while (existingIds.includes(`HSP-${nextNum}`)) {
      nextNum++;
    }
    const newId = `HSP-${nextNum}`;

    const generatedFloors = generateDefaultFloorsForHospital(data.numFloors, data.departments, data.numRooms);
    
    const newHospital: HospitalProfile = {
      id: newId,
      name: data.name,
      licenseNumber: data.licenseNumber,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      pinCode: data.pinCode,
      country: data.country,
      hospitalType: data.hospitalType,
      adminName: data.adminName,
      adminEmail: data.adminEmail,
      adminPhone: data.adminPhone,
      adminPassword: data.password,
      numFloors: data.numFloors,
      numRooms: data.numRooms,
      numBeds: data.numBeds,
      numIcuBeds: data.numIcuBeds,
      numGeneralBeds: data.numGeneralBeds,
      departments: data.departments,
      floors: generatedFloors,
      thresholds: INITIAL_THRESHOLDS,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'ONBOARDING'
    };

    setSetupHospital(newHospital);
    setWizardStep(1);
    setAuthScreen('wizard');
    return { success: true };
  }, [hospitalsList, setWizardStep]);

  // Update setup hospital during wizard steps
  const updateSetupHospital = useCallback((updates: Partial<HospitalProfile>) => {
    setSetupHospital(prev => prev ? ({ ...prev, ...updates }) : null);
  }, []);

  // Complete onboarding wizard and launch hospital command center
  const completeHospitalSetup = useCallback((overrides?: { floors?: FloorInfo[]; thresholds?: ThresholdSetting[] }) => {
    if (!setupHospital) return;
    const activated: HospitalProfile = {
      ...setupHospital,
      ...(overrides?.floors ? { floors: overrides.floors, numFloors: overrides.floors.length } : {}),
      ...(overrides?.thresholds ? { thresholds: overrides.thresholds } : {}),
      status: 'ACTIVE'
    };
    
    const updatedList = [...hospitalsList.filter(h => h.id !== activated.id), activated];
    setHospitalsList(updatedList);
    setCurrentHospital(activated);
    setSetupHospital(null);
    localStorage.removeItem(STORAGE_KEY_SETUP);

    const adminUser: StaffUser = {
      id: `u-admin-${activated.id}`,
      name: activated.adminName,
      role: 'ADMIN',
      title: 'Hospital Administrator',
      department: 'Hospital Operations',
      avatar: '👨‍💼',
      shift: 'Administration Hours'
    };

    const session: AuthSession = {
      hospitalId: activated.id,
      role: 'ADMIN',
      user: adminUser
    };

    setAuthSession(session);
    setCurrentRole('ADMIN');
    setAuthScreen('authenticated');
    setActiveTab('dashboard');
  }, [setupHospital, hospitalsList]);

  // Login to hospital with credentials validation
  const loginHospital = useCallback((identifier: string, password = '', role: UserRole = 'DOCTOR', userEmail = ''): { success: boolean; error?: string } => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = password.trim();

    // Check for demo login
    if (cleanId === 'hsp-demo' || cleanId === 'demo@sanjeevanihospital.com' || cleanId === 'admin@sanjeevanihospital.org') {
      if (cleanPass && cleanPass !== 'Demo@12345' && cleanPass !== DEFAULT_HOSPITAL.adminPassword) {
        return { success: false, error: 'Incorrect password for demo hospital. (Demo password: Demo@12345)' };
      }
      
      const demoHospital = hospitalsList.find(h => h.id === 'HSP-DEMO' || h.id === DEFAULT_HOSPITAL.id) || DEFAULT_HOSPITAL;
      setCurrentHospital(demoHospital);
      setCurrentRole(role);

      const sessionUser = role === 'ADMIN' ? {
        id: 'u-4',
        name: 'Dr. Ananya Rao',
        role: 'ADMIN' as UserRole,
        title: 'Chief Medical Administrator',
        department: 'Clinical Operations',
        avatar: '👩‍⚕️',
        shift: 'Administrative Shift'
      } : (STAFF_USERS.find(u => u.role === role) || STAFF_USERS[0]);

      const session: AuthSession = {
        hospitalId: demoHospital.id,
        role,
        user: sessionUser
      };

      setAuthSession(session);
      setAuthScreen('authenticated');
      setActiveTab('dashboard');
      return { success: true };
    }

    // Match registered hospital by ID, hospital email, admin email, or hospital name
    const targetHospital = hospitalsList.find(h => 
      h.id.toLowerCase() === cleanId ||
      h.email.toLowerCase() === cleanId ||
      h.adminEmail.toLowerCase() === cleanId ||
      h.name.toLowerCase() === cleanId
    );

    if (!targetHospital) {
      return { 
        success: false, 
        error: `Hospital with ID or Email "${identifier}" not found. Please verify credentials or register your hospital.` 
      };
    }

    // Verify password if provided on target hospital
    if (targetHospital.adminPassword && cleanPass && cleanPass !== targetHospital.adminPassword) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    // Check userEmail if provided and role is ADMIN
    if (userEmail && targetHospital.adminEmail && userEmail.toLowerCase() !== targetHospital.adminEmail.toLowerCase() && cleanId !== targetHospital.adminEmail.toLowerCase()) {
      // Allow login with warning or match
    }

    setCurrentHospital(targetHospital);
    setCurrentRole(role);

    const user: StaffUser = role === 'ADMIN' ? {
      id: `u-admin-${targetHospital.id}`,
      name: targetHospital.adminName,
      role: 'ADMIN',
      title: 'Hospital Administrator',
      department: 'Hospital Administration',
      avatar: '👨‍💼',
      shift: 'Standard Hours'
    } : {
      id: `u-staff-${targetHospital.id}`,
      name: role === 'DOCTOR' ? `Dr. Lead Clinician (${targetHospital.city})` : `Charge Nurse (${targetHospital.city})`,
      role,
      title: role === 'DOCTOR' ? 'Attending Physician' : 'Floor Charge Nurse',
      department: targetHospital.departments[0] || 'General Medicine',
      avatar: role === 'DOCTOR' ? '👩‍⚕️' : '🧑‍⚕️',
      shift: 'Day Shift'
    };

    const session: AuthSession = {
      hospitalId: targetHospital.id,
      role,
      user
    };

    setAuthSession(session);
    setAuthScreen('authenticated');
    setActiveTab('dashboard');
    return { success: true };
  }, [hospitalsList]);

  // Logout back to landing page and clear session
  const logoutHospital = useCallback(() => {
    setAuthSession(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    setSelectedPatientId(null);
    setActiveAlertModal(null);
    setAuthScreen('landing');
  }, []);

  // Switch between registered hospitals
  const switchHospital = useCallback((hospitalId: string) => {
    const target = hospitalsList.find(h => h.id === hospitalId);
    if (target) {
      setCurrentHospital(target);
      setSelectedPatientId(null);
      if (authSession) {
        const updatedSession = { ...authSession, hospitalId: target.id };
        setAuthSession(updatedSession);
      }
    }
  }, [hospitalsList, authSession]);

  return (
    <HospitalContext.Provider
      value={{
        // Auth & Multi-Hospital
        authScreen,
        setAuthScreen,
        currentHospital,
        hospitalsList,
        setupHospital,
        wizardStep,
        setWizardStep,
        registerHospital,
        updateSetupHospital,
        completeHospitalSetup,
        loginHospital,
        logoutHospital,
        switchHospital,
        updateHospitalSettings,

        // Monitoring & Telemetry (Isolated per hospital)
        patients,
        allPatients,
        alerts,
        thresholds,
        currentUser,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        selectedRoom,
        setSelectedRoom,
        floors,
        addPatient,
        searchQuery,
        setSearchQuery,
        searchResults,
        isAlarmMuted,
        toggleAlarmMute,
        hasActiveCriticalAlert,
        isSimulating,
        setIsSimulating,
        triggerEmergencySimulation,
        acknowledgeAlert,
        resolveAlert,
        updateThreshold,
        addPatientNote,
        activeAlertModal,
        setActiveAlertModal
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
