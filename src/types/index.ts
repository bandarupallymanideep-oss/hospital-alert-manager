export type RiskCategory = 'STABLE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type PatientCategory = 
  | 'ICU' 
  | 'General Ward' 
  | 'Emergency' 
  | 'Critical Care' 
  | 'Cardiology' 
  | 'Neurology' 
  | 'Orthopedics' 
  | 'General Medicine';

export interface VitalHistoryPoint {
  time: string;
  heartRate: number;
  spo2: number;
  temperature: number;
  systolicBP: number;
  diastolicBP: number;
  respiratoryRate: number;
}

export interface Patient {
  id: string;
  hospitalId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  roomNumber: string;
  bedNumber: string;
  floor: number;
  department: string;
  category: PatientCategory;
  diagnosis: string;
  admissionDate: string;
  doctor: string;
  nurse: string;
  // Live parameters
  heartRate: number;
  spo2: number;
  temperature: number;
  systolicBP: number;
  diastolicBP: number;
  respiratoryRate: number;
  // Risk & status
  riskScore: number; // 0 - 100
  riskCategory: RiskCategory;
  lastUpdated: string;
  monitoringStatus: 'ACTIVE' | 'DISCHARGED' | 'OFFLINE';
  // History for graphs
  vitalHistory: VitalHistoryPoint[];
  // Clinical notes
  notes?: { id: string; author: string; role: string; text: string; timestamp: string }[];
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'WARNING' | 'RESOLVED';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id: string;
  hospitalId: string;
  patientId: string;
  patientName: string;
  floor: number;
  roomNumber: string;
  bedNumber: string;
  category: PatientCategory;
  parameter: 'Heart Rate' | 'SpO₂' | 'Temperature' | 'Blood Pressure' | 'Respiratory Rate' | 'Overall Risk';
  currentValue: string;
  thresholdValue: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  riskScore: number;
  timestamp: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  clinicalNote?: string;
}

export interface ParameterThreshold {
  parameter: string;
  unit: string;
  lowThreshold?: number;
  highThreshold?: number;
  normalMin: number;
  normalMax: number;
  description: string;
}

export interface ThresholdSetting {
  id: string;
  parameter: 'heartRate' | 'spo2' | 'temperature' | 'systolicBP' | 'respiratoryRate';
  label: string;
  unit: string;
  lowValue?: number;
  highValue?: number;
  scope: 'HOSPITAL' | 'WARD' | 'PATIENT';
  target?: string; // Ward name or patient ID if scope is WARD/PATIENT
  configuredBy: string;
  role: string;
  updatedAt: string;
}

export interface FloorInfo {
  floorNumber: number;
  name: string;
  departments: {
    name: string;
    rooms: {
      roomNumber: string;
      capacity: number;
      category: PatientCategory;
    }[];
  }[];
}

export type UserRole = 'DOCTOR' | 'NURSE' | 'ADMIN';

export interface StaffUser {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
  shift: string;
}

export type HospitalType = 
  | 'Multispeciality Hospital'
  | 'General Hospital'
  | 'Private Hospital'
  | 'Government Hospital'
  | 'Clinic'
  | 'Medical College Hospital'
  | 'Other';

export interface HospitalProfile {
  id: string;
  name: string;
  licenseNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  hospitalType: HospitalType;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword?: string;
  numFloors: number;
  numRooms: number;
  numBeds: number;
  numIcuBeds: number;
  numGeneralBeds: number;
  departments: string[];
  floors: FloorInfo[];
  thresholds: ThresholdSetting[];
  createdAt: string;
  status: 'ACTIVE' | 'ONBOARDING' | 'PENDING';
  isDemo?: boolean;
}

export interface HospitalRegistrationData {
  name: string;
  licenseNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  hospitalType: HospitalType;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  password: string;
  confirmPassword: string;
  numFloors: number;
  numRooms: number;
  numBeds: number;
  numIcuBeds: number;
  numGeneralBeds: number;
  departments: string[];
}

