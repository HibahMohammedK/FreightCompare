import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ShipIcon,
  LayoutDashboardIcon,
  TicketIcon,
  MessageSquareIcon,
  LogOutIcon } from
'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout, updateUserStatus } from '../../redux/authSlice';
import { NotificationBell } from '../shared/notification/NotificationBell';
import { DashboardHeader } from '../layout/DashboardHeader';
import { ProfileMenu } from "../layout/ProfileMenu";
import { logoutUser } from '../../api/auth';
import { updateMyStatus } from "../../api/staff";

export const StaffLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  

  const status = user?.status || "offline";
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };
  const navItems = [
  {
    name: 'Dashboard',
    path: '/staff',
    icon: <LayoutDashboardIcon size={20} />,
    exact: true
  },
  {
    name: 'Tickets',
    path: '/staff/tickets',
    icon: <TicketIcon size={20} />
  },
  {
    name: 'Chat',
    path: '/staff/chat',
    icon: <MessageSquareIcon size={20} />
  }];

  
  const handleStatusChange = async (
    newStatus:
      "online" |
      "busy" |
      "offline"
  ) => {

    try {

      await updateMyStatus(
        newStatus
      );

      dispatch(
        updateUserStatus(
          newStatus
        )
      );

    } catch (err) {

      console.error(
        "Status update failed",
        err
      );

    }

  };
  return (
    <div className="min-h-screen flex bg-bg-light">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-border-light flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border-light">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <ShipIcon size={18} />
            </div>
            <span className="font-bold text-sm text-primary-darkest">
              FreightCompare
            </span>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) =>
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-primary text-white shadow-sm' : 'text-text-medium hover:bg-bg-light hover:text-text-dark'}
              `}>
            
              {item.icon}
              {item.name}
            </NavLink>
          )}
        </div>

        <div className="p-4 border-t border-border-light">

          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error-bg transition-colors">
            
            <LogOutIcon size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

          <DashboardHeader>

              <NotificationBell />

              <ProfileMenu
                  username={user?.username ?? ""}
                  profileImage={user?.profile_image}
                  status={status}
                  onProfile={() => navigate("/staff/profile")}
                  onLogout={handleLogout}
                  onStatusChange={handleStatusChange}
              />

          </DashboardHeader>

          <main className="flex-1 min-h-0 overflow-hidden">
              <Outlet />
          </main>

      </div>
    </div>);

};