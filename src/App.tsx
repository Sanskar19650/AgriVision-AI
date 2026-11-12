/**
 * AgriVision AI - Precision Agriculture & Farm Intelligence Platform
 * Main React Application Root with React Router DOM Navigation
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { FarmManagementPage } from './pages/FarmManagementPage';
import { SoilMonitoringPage } from './pages/SoilMonitoringPage';
import { CropDiseaseDetectionPage } from './pages/CropDiseaseDetectionPage';
import { CropDamageDetectionPage } from './pages/CropDamageDetectionPage';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { WeatherMonitoringPage } from './pages/WeatherMonitoringPage';
import { FarmMappingPage } from './pages/FarmMappingPage';
import { BlockchainVerificationPage } from './pages/BlockchainVerificationPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ModelStudioPage } from './pages/ModelStudioPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine if sidebar should be shown
  const isLandingOrLogin = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/landing';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 font-sans antialiased">
      <Navbar
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 relative">
        {/* Sidebar rendered on application workspace pages */}
        {!isLandingOrLogin && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main
          className={`flex-1 flex flex-col transition-all duration-200 ${
            !isLandingOrLogin ? 'lg:pl-64' : ''
          }`}
        >
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Routes>
              {/* Login at the start as requested by the user */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/farms" element={<FarmManagementPage />} />
              <Route path="/soil" element={<SoilMonitoringPage />} />
              <Route path="/disease" element={<CropDiseaseDetectionPage />} />
              <Route path="/damage" element={<CropDamageDetectionPage />} />
              <Route path="/recommend" element={<CropRecommendationPage />} />
              <Route path="/weather" element={<WeatherMonitoringPage />} />
              <Route path="/mapping" element={<FarmMappingPage />} />
              <Route path="/blockchain" element={<BlockchainVerificationPage />} />
              <Route path="/assistant" element={<AIAssistantPage />} />
              <Route path="/model-studio" element={<ModelStudioPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Fallback to Dashboard */}
              <Route path="*" element={<DashboardPage />} />
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
