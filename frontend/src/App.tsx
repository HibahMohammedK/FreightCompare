// import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
// Auth Pages
import { LoginPage } from './src/pages/auth/LoginPage';
import { RegisterPage } from './src/pages/auth/RegisterPage';
import { ForgotPasswordPage } from './src/pages/auth/ForgotPasswordPage';
import { EmailSentPage } from './src/pages/auth/EmailSentPage';
import { OTPVerificationPage } from './src/pages/auth/OTPVerificationPage';
// User Pages
import { HomePage } from './src/pages/user/HomePage';
import { SearchResultsPage } from './src/pages/user/SearchResultsPage';
import { SavedPage } from './src/pages/user/SavedPage';
import { ComparePage } from './src/pages/user/ComparePage';
import { HistoryPage } from './src/pages/user/HistoryPage';
import { PricingPage } from './src/pages/user/PricingPage';
import { SupportPage } from './src/pages/user/SupportPage';
import { UserChatPage } from './src/pages/user/UserChatPage';
// Staff Pages
import { StaffLayout } from './src/components/staff/StaffLayout';
import { StaffDashboardPage } from './src/pages/staff/StaffDashboardPage';
import { StaffTicketsPage } from './src/pages/staff/StaffTicketsPage';
import { StaffChatPage } from './src/pages/staff/StaffChatPage';
// Admin Pages
import { AdminLayout } from './src/components/admin/AdminLayout';
import { AdminDashboardPage } from './src/pages/admin/AdminDashboardPage';
import { UserManagementPage } from './src/pages/admin/UserManagementPage';
import { SubscriptionManagementPage } from './src/pages/admin/SubscriptionManagementPage';
import { StaffManagementPage } from './src/pages/admin/StaffManagementPage';
import { TicketMonitoringPage } from './src/pages/admin/TicketMonitoringPage';
import { ChatMonitoringPage } from './src/pages/admin/ChatMonitoringPage';
import { TransportManagementPage } from './src/pages/admin/TransportManagementPage';
import { CsvUploadPage } from './src/pages/admin/CsvUploadPage';
export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/email-sent" element={<EmailSentPage />} />
          <Route path="/verify" element={<OTPVerificationPage />} />

          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/chat" element={<UserChatPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route
              path="subscriptions"
              element={<SubscriptionManagementPage />} />
            <Route path="transports" element={<TransportManagementPage />} />
            <Route path="csv-upload" element={<CsvUploadPage />} />
            <Route path="staff" element={<StaffManagementPage />} />
            <Route path="tickets" element={<TicketMonitoringPage />} />
            <Route path="chats" element={<ChatMonitoringPage />} />
          </Route>

          {/* Staff Routes */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<StaffDashboardPage />} />
            <Route path="tickets" element={<StaffTicketsPage />} />
            <Route path="chat" element={<StaffChatPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>);

}
