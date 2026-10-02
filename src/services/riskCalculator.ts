import { Patient, RiskCategory, ThresholdSetting, AlertSeverity } from '../types';

export interface RiskFactor {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  parameter: string;
  currentValue: string;
  thresholdValue: string;
  explanation: string;
}

export interface RiskEvaluationResult {
  score: number;
  category: RiskCategory;
  factors: RiskFactor[];
  hasCriticalAlert: boolean;
  alertTriggers: {
    parameter: 'Heart Rate' | 'SpO₂' | 'Temperature' | 'Blood Pressure' | 'Respiratory Rate' | 'Overall Risk';
    severity: AlertSeverity;
    currentValue: string;
    thresholdValue: string;
    message: string;
  }[];
}

export function evaluatePatientRisk(
  patient: Pick<Patient, 'heartRate' | 'spo2' | 'temperature' | 'systolicBP' | 'diastolicBP' | 'respiratoryRate' | 'category'>,
  customThresholds?: ThresholdSetting[]
): RiskEvaluationResult {
  const factors: RiskFactor[] = [];
  const alertTriggers: RiskEvaluationResult['alertTriggers'] = [];
  let score = 10; // Baseline healthy score

  // 1. SpO₂ (Oxygen Saturation) - crucial indicator
  const spo2Thresh = customThresholds?.find(t => t.parameter === 'spo2')?.lowValue ?? 92;
  if (patient.spo2 < spo2Thresh) {
    const isSevere = patient.spo2 < 88;
    score += isSevere ? 40 : 30;
    factors.push({
      severity: isSevere ? 'CRITICAL' : 'WARNING',
      parameter: 'SpO₂',
      currentValue: `${patient.spo2}%`,
      thresholdValue: `< ${spo2Thresh}%`,
      explanation: `Oxygen saturation is severely desaturated (${patient.spo2}% vs threshold ${spo2Thresh}%). Risk of tissue hypoxia and respiratory compromise.`
    });
    alertTriggers.push({
      parameter: 'SpO₂',
      severity: isSevere || patient.spo2 <= 90 ? 'CRITICAL' : 'HIGH',
      currentValue: `${patient.spo2}%`,
      thresholdValue: `${spo2Thresh}%`,
      message: `SpO₂ dropped to ${patient.spo2}% (Doctor threshold: ${spo2Thresh}%)`
    });
  } else if (patient.spo2 < 95) {
    score += 10;
    factors.push({
      severity: 'WARNING',
      parameter: 'SpO₂',
      currentValue: `${patient.spo2}%`,
      thresholdValue: '95%',
      explanation: `Mild hypoxemia detected (${patient.spo2}%). Patient requires supplementary O₂ monitoring.`
    });
  }

  // 2. Heart Rate (BPM)
  const hrLowThresh = customThresholds?.find(t => t.parameter === 'heartRate')?.lowValue ?? 50;
  const hrHighThresh = customThresholds?.find(t => t.parameter === 'heartRate')?.highValue ?? 120;

  if (patient.heartRate < hrLowThresh) {
    const isSevere = patient.heartRate < 45;
    score += isSevere ? 35 : 25;
    factors.push({
      severity: isSevere ? 'CRITICAL' : 'WARNING',
      parameter: 'Heart Rate',
      currentValue: `${patient.heartRate} BPM`,
      thresholdValue: `< ${hrLowThresh} BPM`,
      explanation: `Severe bradycardia detected (${patient.heartRate} BPM). Critical risk of decreased cardiac output and syncope.`
    });
    alertTriggers.push({
      parameter: 'Heart Rate',
      severity: isSevere || patient.heartRate <= 48 ? 'CRITICAL' : 'HIGH',
      currentValue: `${patient.heartRate} BPM`,
      thresholdValue: `${hrLowThresh} BPM`,
      message: `Heart rate bradycardia: ${patient.heartRate} BPM (Threshold: ${hrLowThresh} BPM)`
    });
  } else if (patient.heartRate > hrHighThresh) {
    const isSevere = patient.heartRate > 140;
    score += isSevere ? 35 : 25;
    factors.push({
      severity: isSevere ? 'CRITICAL' : 'WARNING',
      parameter: 'Heart Rate',
      currentValue: `${patient.heartRate} BPM`,
      thresholdValue: `> ${hrHighThresh} BPM`,
      explanation: `Tachycardia observed (${patient.heartRate} BPM). Indicates physiological distress, sepsis, or acute cardiovascular strain.`
    });
    alertTriggers.push({
      parameter: 'Heart Rate',
      severity: isSevere ? 'CRITICAL' : 'HIGH',
      currentValue: `${patient.heartRate} BPM`,
      thresholdValue: `${hrHighThresh} BPM`,
      message: `Heart rate tachycardia: ${patient.heartRate} BPM (Threshold: ${hrHighThresh} BPM)`
    });
  } else if (patient.heartRate < 60 || patient.heartRate > 100) {
    score += 8;
  }

  // 3. Temperature (°C)
  const tempHighThresh = customThresholds?.find(t => t.parameter === 'temperature')?.highValue ?? 38.0;
  if (patient.temperature > tempHighThresh) {
    const isSevere = patient.temperature > 39.0;
    score += isSevere ? 25 : 15;
    factors.push({
      severity: isSevere ? 'CRITICAL' : 'WARNING',
      parameter: 'Temperature',
      currentValue: `${patient.temperature.toFixed(1)}°C`,
      thresholdValue: `> ${tempHighThresh}°C`,
      explanation: `Elevated body temperature (${patient.temperature.toFixed(1)}°C). Potential infectious process, systemic inflammatory response, or hyperpyrexia.`
    });
    alertTriggers.push({
      parameter: 'Temperature',
      severity: isSevere ? 'CRITICAL' : 'WARNING',
      currentValue: `${patient.temperature.toFixed(1)}°C`,
      thresholdValue: `${tempHighThresh}°C`,
      message: `Pyrexia: Temperature reached ${patient.temperature.toFixed(1)}°C (Threshold: ${tempHighThresh}°C)`
    });
  } else if (patient.temperature < 35.5) {
    score += 20;
    factors.push({
      severity: 'WARNING',
      parameter: 'Temperature',
      currentValue: `${patient.temperature.toFixed(1)}°C`,
      thresholdValue: '< 35.5°C',
      explanation: `Hypothermia detected (${patient.temperature.toFixed(1)}°C). Patient may be in early septic shock or exposure.`
    });
  }

  // 4. Systolic Blood Pressure (mmHg)
  const sbpLowThresh = customThresholds?.find(t => t.parameter === 'systolicBP')?.lowValue ?? 90;
  const sbpHighThresh = customThresholds?.find(t => t.parameter === 'systolicBP')?.highValue ?? 160;

  if (patient.systolicBP < sbpLowThresh) {
    const isSevere = patient.systolicBP < 80;
    score += isSevere ? 35 : 25;
    factors.push({
      severity: isSevere ? 'CRITICAL' : 'WARNING',
      parameter: 'Blood Pressure',
      currentValue: `${patient.systolicBP}/${patient.diastolicBP} mmHg`,
      thresholdValue: `< ${sbpLowThresh} mmHg Systolic`,
      explanation: `Hypotension detected (Systolic ${patient.systolicBP} mmHg). Risk of circulatory collapse and hypoperfusion.`
    });
    alertTriggers.push({
      parameter: 'Blood Pressure',
      severity: isSevere ? 'CRITICAL' : 'HIGH',
      currentValue: `${patient.systolicBP}/${patient.diastolicBP} mmHg`,
      thresholdValue: `${sbpLowThresh} mmHg`,
      message: `Hypotensive episode: ${patient.systolicBP}/${patient.diastolicBP} mmHg (Low threshold: ${sbpLowThresh} mmHg)`
    });
  } else if (patient.systolicBP > sbpHighThresh) {
    score += 20;
    factors.push({
      severity: 'WARNING',
      parameter: 'Blood Pressure',
      currentValue: `${patient.systolicBP}/${patient.diastolicBP} mmHg`,
      thresholdValue: `> ${sbpHighThresh} mmHg Systolic`,
      explanation: `Hypertensive urgency range (${patient.systolicBP}/${patient.diastolicBP} mmHg). Elevated afterload burden.`
    });
  }

  // 5. Respiratory Rate (breaths/min)
  const rrLowThresh = customThresholds?.find(t => t.parameter === 'respiratoryRate')?.lowValue ?? 10;
  const rrHighThresh = customThresholds?.find(t => t.parameter === 'respiratoryRate')?.highValue ?? 25;

  if (patient.respiratoryRate > rrHighThresh) {
    const isSevere = patient.respiratoryRate >= 30;
    score += isSevere ? 30 : 20;
    factors.push({
      severity: isSevere ? 'CRITICAL' : 'WARNING',
      parameter: 'Respiratory Rate',
      currentValue: `${patient.respiratoryRate}/min`,
      thresholdValue: `> ${rrHighThresh}/min`,
      explanation: `Tachypnea noted (${patient.respiratoryRate}/min). Strong clinical predictor of impending respiratory fatigue or acidosis.`
    });
    alertTriggers.push({
      parameter: 'Respiratory Rate',
      severity: isSevere ? 'CRITICAL' : 'HIGH',
      currentValue: `${patient.respiratoryRate}/min`,
      thresholdValue: `${rrHighThresh}/min`,
      message: `Tachypnea: ${patient.respiratoryRate}/min (Threshold: ${rrHighThresh}/min)`
    });
  } else if (patient.respiratoryRate < rrLowThresh) {
    score += 30;
    factors.push({
      severity: 'CRITICAL',
      parameter: 'Respiratory Rate',
      currentValue: `${patient.respiratoryRate}/min`,
      thresholdValue: `< ${rrLowThresh}/min`,
      explanation: `Bradypnea detected (${patient.respiratoryRate}/min). Impending central respiratory depression.`
    });
    alertTriggers.push({
      parameter: 'Respiratory Rate',
      severity: 'CRITICAL',
      currentValue: `${patient.respiratoryRate}/min`,
      thresholdValue: `${rrLowThresh}/min`,
      message: `Bradypnea: ${patient.respiratoryRate}/min (Low threshold: ${rrLowThresh}/min)`
    });
  }

  // Clamp score between 0 and 100
  score = Math.min(100, Math.max(5, score));

  // Determine Risk Category
  let category: RiskCategory = 'STABLE';
  if (score >= 90) {
    category = 'CRITICAL';
  } else if (score >= 75) {
    category = 'HIGH';
  } else if (score >= 50) {
    category = 'MODERATE';
  } else if (score >= 25) {
    category = 'LOW';
  } else {
    category = 'STABLE';
  }

  const hasCriticalAlert = alertTriggers.some(t => t.severity === 'CRITICAL') || category === 'CRITICAL';

  return {
    score,
    category,
    factors,
    hasCriticalAlert,
    alertTriggers,
  };
}
