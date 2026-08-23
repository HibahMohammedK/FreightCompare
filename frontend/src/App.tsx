import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./src/hooks/redux";
import { setAccessToken, setUser, logout, setAuthLoading } from "./src/redux/authSlice";
import API from "./src/api/axios";
import { getProfile } from "./src/api/auth";
import { notificationSocket } from "./src/websocket/notificationSocket";
import { supportSocket } from './src/websocket/supportSocket';
import { presenceSocket } from './src/websocket/PresenceSocket';
import { getNotifications } from './src/api/notifications';
import { setNotifications } from './src/redux/notificationSlice';
import { NotificationToast } from "./src/components/shared/notification/NotificationToast";
import { notificationAudio } from "./src/services/notificationAudio";

// Auth Pages
import { LoginPage } from './src/pages/auth/LoginPage';
import { RegisterPage } from './src/pages/auth/RegisterPage';
import { ForgotPasswordPage } from './src/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './src/pages/auth/ResetPasswordPage';
import { EmailSentPage } from './src/pages/auth/EmailSentPage';
import { OTPVerificationPage } from './src/pages/auth/OTPVerificationPage';

// Customer Pages
import { HomePage } from './src/pages/customer/HomePage';
import { SearchResultsPage } from './src/pages/customer/SearchResultsPage';
import { ProfilePage } from './src/pages/customer/ProfilePage';
import { SavedPage } from './src/pages/customer/SavedPage';
import { ComparePage } from './src/pages/customer/ComparePage';
import { HistoryPage } from './src/pages/customer/HistoryPage';
import { PricingPage } from './src/pages/customer/PricingPage';
import { SubscriptionCancelPage } from './src/pages/customer/SubscriptionCancelPage';
import { SubscriptionSuccessPage } from './src/pages/customer/SubscriptionSuccessPage';
import { CustomerSupportPage } from './src/pages/customer/CustomerSupportPage';
import { PriceAlertsPage } from './src/pages/customer/PriceAlertsPage';
import { SubscriptionHistoryPage } from "../src/src/pages/customer/SubscriptionHistoryPage";

// Staff
import { StaffLayout } from './src/components/staff/StaffLayout';
import { StaffDashboardPage } from './src/pages/staff/StaffDashboardPage';
import { StaffTicketsPage } from './src/pages/staff/StaffTicketsPage';
import { StaffProfilePage } from './src/pages/staff/StaffProfilePage';

// Admin
import { AdminLayout } from './src/components/admin/AdminLayout';
import { AdminDashboardPage } from './src/pages/admin/AdminDashboardPage';
import { UserManagementPage } from './src/pages/admin/UserManagementPage';
import { SubscriptionManagementLayout } from './src/components/admin/SubscriptionManagementLayout';
import { SubscriptionManagementPage } from './src/pages/admin/SubscriptionManagementPage';
import { StaffManagementPage } from './src/pages/admin/StaffManagementPage';
import { TicketMonitoringPage } from './src/pages/admin/TicketMonitoringPage';
import { TransportManagementPage } from './src/pages/admin/TransportManagementPage';
import { CompanyManagementPage } from './src/pages/admin/CompanyManagementPage';
import { AdminProfilePage } from './src/pages/admin/AdminProfilePage';
import { SubscriptionPlansPage } from "../src/src/pages/admin/SubscriptionPlansPage";
import { CsvUploadPage } from './src/pages/admin/CsvUploadPage';

// Auth Guards
import ProtectedRoute from './src/components/auth/ProtectedRoute';
import PublicRoute from './src/components/auth/PublicRoute';

export function App() {

    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(
        (state) => state.auth.accessToken
    );

    const user = useAppSelector(
        (state) => state.auth.user
    );

    useEffect(() => {

        const initAuth = async () => {

            try {

                const res = await API.post(
                    "/users/token/refresh/"
                );

                const accessToken =
                    res.data.access;

                dispatch(
                    setAccessToken(
                        accessToken
                    )
                );

                const profile =
                    await getProfile();

                dispatch(
                    setUser(
                        profile.data
                    )
                );

                const notificationRes =
                    await getNotifications();

                dispatch(
                    setNotifications(
                        notificationRes.data
                    )
                );

            } catch {

                dispatch(logout());

            } finally {

                dispatch(
                    setAuthLoading(
                        false
                    )
                );

            }

        };

        initAuth();

    }, [dispatch]);


    /*
     * WebSocket connections
     */
    useEffect(() => {

        if (!accessToken || !user) {
            return;
        }

        console.log(
            "AUTHENTICATED USER:",
            user.role
        );

        notificationSocket.connect(
            accessToken
        );

        supportSocket.connect(
            accessToken
        );

        if (user.role === "staff") {

            console.log(
                "STARTING STAFF PRESENCE SOCKET"
            );

            presenceSocket.connect(
                accessToken
            );
        }

        return () => {

            notificationSocket.disconnect();

            supportSocket.disconnect();

            presenceSocket.disconnect();

        };

    }, [
        accessToken,
        user?.role,
    ]);


    useEffect(() => {

        const unlockAudio = () => {

            notificationAudio.unlock();

        };

        window.addEventListener(
            "pointerdown",
            unlockAudio,
            {
                once: true,
            }
        );

        return () => {

            window.removeEventListener(
                "pointerdown",
                unlockAudio,
            );

        };

    }, []);

  return (
    <BrowserRouter>
      <NotificationToast />
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
          <Route path="/price-alerts" element={<PriceAlertsPage />} />
          <Route path="/subscription/success" element={<SubscriptionSuccessPage />}/>
          <Route path="/subscription/cancel" element={<SubscriptionCancelPage />}/>
          <Route path="/support" element={<CustomerSupportPage />} />
          <Route path="/subscription/history" element={<SubscriptionHistoryPage />}/>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="/admin/subscriptions" element={<SubscriptionManagementLayout />}>
            <Route index element={<SubscriptionManagementPage />} />
            <Route path="plans" element={<SubscriptionPlansPage />}/>
            </Route>
            <Route path="transports" element={<TransportManagementPage />} />
            <Route path="companies" element={<CompanyManagementPage />} />
            <Route path="csv-upload" element={<CsvUploadPage />} />
            <Route path="staff" element={<StaffManagementPage />} />
            <Route path="tickets" element={<TicketMonitoringPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route path="/staff/profile" element={<StaffProfilePage />} />
            <Route index element={<StaffDashboardPage />} />
            <Route path="tickets" element={<StaffTicketsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}