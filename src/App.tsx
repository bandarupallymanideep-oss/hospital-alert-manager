import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemoControlBar } from './components/common/DemoControlBar';
import { ClinicalDisclaimer } from './components/common/ClinicalDisclaimer';
import { CriticalAlertModal } from './components/alerts/CriticalAlertModal';

// Auth & Onboarding Views
import { LandingPageView } from './views/LandingPageView';
import { RegisterHospitalView } from './views/RegisterHospitalView';
import { HospitalSetupWizardView } from './views/HospitalSetupWizardView';
import { HospitalLoginView } from './views/HospitalLoginView';

// Existing Hospital Telemetry Views
import { DashboardView } from './views/DashboardView';
import { PatientsView } from './views/PatientsView';
import { PatientDetailView } from './views/PatientDetailView';
import { AlertsView } from './views/AlertsView';
import { FloorsView } from './views/FloorsView';
import { LiveMonitoringView } from './views/LiveMonitoringView';
import { AnalyticsView } from './views/AnalyticsView';
import { ThresholdsView } from './views/ThresholdsView';
import { StaffView } from './views/StaffView';
import { HistoryView } from './views/HistoryView';
import { HospitalSettingsView } from './views/HospitalSettingsView';

const MainContent: React.FC = () => {
  const { authScreen, activeTab } = useHospital();

  // Route Authentication & Onboarding Screens
  if (authScreen === 'landing') {
    return <LandingPageView />;
  }

  if (authScreen === 'login') {
    return <HospitalLoginView />;
  }

  if (authScreen === 'register') {
    return <RegisterHospitalView />;
  }

  if (authScreen === 'wizard') {
    return <HospitalSetupWizardView />;
  }

  // Authenticated State: Full Hospital Command Center & Telemetry Platform
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'patients':
        return <PatientsView />;
      case 'patient-detail':
        return <PatientDetailView />;
      case 'alerts':
        return <AlertsView />;
      case 'floors':
        return <FloorsView />;
      case 'live-monitoring':
        return <LiveMonitoringView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'thresholds':
        return <ThresholdsView />;
      case 'staff':
        return <StaffView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
      case 'hospital-settings':
        return <HospitalSettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Interactive Demo Control Presentation Bar */}
      <DemoControlBar />

      {/* 2. Hospital Header */}
      <Header />

      {/* 3. Clinical Prototype Disclaimer Banner */}
      <ClinicalDisclaimer />

      {/* 4. Body with Sidebar Navigation + Active Screen Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Central View Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/60 ecg-grid">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* 5. Pop-up Critical Alert Modal (Fires on Critical Threshold crossing) */}
      <CriticalAlertModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HospitalProvider>
      <MainContent />
    </HospitalProvider>
  );
};

export default App;
