import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from "react";
import { useAppDispatch } from "./src/hooks/redux";
import { setAccessToken, setUser, logout } from "./src/redux/authSlice";
import API from "./src/api/axios";
import { getProfile } from "./src/api/auth";

// Auth Pages
import { LoginPage } from './src/pages/auth/LoginPage';
import { RegisterPage } from './src/pages/auth/RegisterPage';
import { ForgotPasswordPage } from './src/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './src/pages/auth/ResetPasswordPage';
import { EmailSentPage } from './src/pages/auth/EmailSentPage';
import { OTPVerificationPage } from './src/pages/auth/OTPVerificationPage';

// User Pages
import { HomePage } from './src/pages/user/HomePage';
import { SearchResultsPage } from './src/pages/user/SearchResultsPage';
import { ProfilePage } from './src/pages/user/ProfilePage';
import { SavedPage } from './src/pages/user/SavedPage';
import { ComparePage } from './src/pages/user/ComparePage';
import { HistoryPage } from './src/pages/user/HistoryPage';
import { PricingPage } from './src/pages/user/PricingPage';
import { SupportPage } from './src/pages/user/SupportPage';
import { UserChatPage } from './src/pages/user/UserChatPage';

// Staff
import { StaffLayout } from './src/components/staff/StaffLayout';
import { StaffDashboardPage } from './src/pages/staff/StaffDashboardPage';
import { StaffTicketsPage } from './src/pages/staff/StaffTicketsPage';
import { StaffChatPage } from './src/pages/staff/StaffChatPage';
import { StaffProfilePage } from './src/pages/staff/StaffProfilePage';

// Admin
import { AdminLayout } from './src/components/admin/AdminLayout';
import { AdminDashboardPage } from './src/pages/admin/AdminDashboardPage';
import { UserManagementPage } from './src/pages/admin/UserManagementPage';
import { SubscriptionManagementPage } from './src/pages/admin/SubscriptionManagementPage';
import { StaffManagementPage } from './src/pages/admin/StaffManagementPage';
import { TicketMonitoringPage } from './src/pages/admin/TicketMonitoringPage';
import { ChatMonitoringPage } from './src/pages/admin/ChatMonitoringPage';
import { TransportManagementPage } from './src/pages/admin/TransportManagementPage';
import { CompanyManagementPage } from './src/pages/admin/CompanyManagementPage';
import { AdminProfilePage } from './src/pages/admin/AdminProfilePage';

import { CsvUploadPage } from './src/pages/admin/CsvUploadPage';

// Auth Guards
import ProtectedRoute from './src/components/auth/ProtectedRoute';
import PublicRoute from './src/components/auth/PublicRoute';

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await API.post("/users/token/refresh/");
        dispatch(setAccessToken(res.data.access));

        const profile = await getProfile();
        dispatch(setUser(profile.data));
      } catch {
        dispatch(logout());
      }
    };

    initAuth();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/email-sent" element={<EmailSentPage />} />
        <Route path="/verify" element={<OTPVerificationPage />} />

        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/chat" element={<UserChatPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="subscriptions" element={<SubscriptionManagementPage />} />
            <Route path="transports" element={<TransportManagementPage />} />
            <Route path="companies" element={<CompanyManagementPage />} />
            <Route path="csv-upload" element={<CsvUploadPage />} />
            <Route path="staff" element={<StaffManagementPage />} />
            <Route path="tickets" element={<TicketMonitoringPage />} />
            <Route path="chats" element={<ChatMonitoringPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route path="/staff/profile" element={<StaffProfilePage />} />
            <Route index element={<StaffDashboardPage />} />
            <Route path="tickets" element={<StaffTicketsPage />} />
            <Route path="chat" element={<StaffChatPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}