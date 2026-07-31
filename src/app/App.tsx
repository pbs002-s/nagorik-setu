import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "./components/AuthContext";
import { DataProvider } from "./components/DataContext";
import { AppShell } from "./components/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ComplaintListPage } from "./pages/ComplaintListPage";
import { ComplaintFormPage } from "./pages/ComplaintFormPage";
import { ComplaintDetailPage } from "./pages/ComplaintDetailPage";
import { PollsPage } from "./pages/PollsPage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { AdminPage } from "./pages/AdminPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { DiscussionsPage } from "./pages/DiscussionsPage";
import { SuggestionBoxPage } from "./pages/SuggestionBoxPage";
import { OfficerDashboardPage } from "./pages/OfficerDashboardPage";
import { SuperAdminPage } from "./pages/SuperAdminPage";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated routes — wrapped in AppShell */}
            <Route element={<AppShell />}>
              {/* Citizen */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/complaints" element={<ComplaintListPage />} />
              <Route path="/complaints/new" element={<ComplaintFormPage />} />
              <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
              <Route path="/polls" element={<PollsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/discussions" element={<DiscussionsPage />} />
              <Route path="/suggestions" element={<SuggestionBoxPage />} />
              <Route path="/services" element={<ServicesPage />} />

              {/* Officer */}
              <Route path="/officer" element={<OfficerDashboardPage />} />
              <Route path="/officer/:tab" element={<OfficerDashboardPage />} />

              {/* Super Admin */}
              <Route path="/superadmin" element={<SuperAdminPage />} />
              <Route path="/superadmin/:tab" element={<SuperAdminPage />} />

              {/* Shared */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </DataProvider>
    </AuthProvider>
  );
}
