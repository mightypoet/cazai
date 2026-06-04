import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { DashboardLayout } from './pages/DashboardLayout';
import { MedicalDashboard } from './pages/MedicalDashboard';
import { RealEstateDashboard } from './pages/RealEstateDashboard';
import { PersonalAssistantDashboard } from './pages/PersonalAssistantDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route path="/dashboards" element={<DashboardLayout />}>
            <Route path="medical" element={<MedicalDashboard />} />
            <Route path="real-estate" element={<RealEstateDashboard />} />
            <Route path="personal" element={<PersonalAssistantDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route index element={<Navigate to="/onboarding" replace />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
