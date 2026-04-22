import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ShipIcon,
  LayoutDashboardIcon,
  TicketIcon,
  MessageSquareIcon,
  LogOutIcon,
  ChevronDownIcon } from
'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../redux/authSlice';
import { NotificationBell } from '../shared/notification/NotificationBell';
import { logoutUser } from '../../api/auth';
export const StaffLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [status, setStatus] = useState<'online' | 'busy' | 'offline'>('online');
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

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'online':
        return 'bg-success';
      case 'busy':
        return 'bg-warning';
      case 'offline':
        return 'bg-text-lighter';
      default:
        return 'bg-success';
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
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-sm font-medium text-text-dark">
              Notifications
            </span>
            <NotificationBell />
          </div>

          <div className="relative mb-4">
            {/* Profile Button */}
            <button
              onClick={() => navigate("/staff/profile")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-bg-light transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'S'}
                  </div>

                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(status)}`}
                  />
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold text-text-dark truncate w-28">
                    {user?.username}
                  </p>
                  <p className="text-xs text-text-light capitalize">
                    {status}
                  </p>
                </div>
              </div>
            </button>

            {/* Status Dropdown Button */}
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl border border-border-light hover:bg-bg-light transition-colors text-sm text-text-medium"
            >
              Change Status
              <ChevronDownIcon size={16} />
            </button>

            {isStatusOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-lg border border-border-light overflow-hidden z-50">
                {(['online', 'busy', 'offline'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatus(s);
                      setIsStatusOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-dark hover:bg-bg-light capitalize"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(s)}`}
                    />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

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
        <Outlet />
      </div>
    </div>);

};