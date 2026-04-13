import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ShipIcon,
  FileSpreadsheetIcon,
  PlaneTakeoffIcon,
  LayoutDashboardIcon,
  UsersIcon,
  CreditCardIcon,
  UserCogIcon,
  TicketIcon,
  MessageSquareIcon,
  LogOutIcon } from
'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../redux/authSlice';
import { NotificationBell } from '../shared/notification/NotificationBell';
export const AdminLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  const navItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: <LayoutDashboardIcon size={20} />,
    exact: true
  },
  {
    name: 'Transport Management',
    path: '/admin/transports',
    icon: <PlaneTakeoffIcon size={20} />
  },
  {
    name: 'CSV Upload',
    path: '/admin/csv-upload',
    icon: <FileSpreadsheetIcon size={20} />
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: <UsersIcon size={20} />
  },
  {
    name: 'Subscriptions',
    path: '/admin/subscriptions',
    icon: <CreditCardIcon size={20} />
  },
  {
    name: 'Staff',
    path: '/admin/staff',
    icon: <UserCogIcon size={20} />
  },
  {
    name: 'Tickets',
    path: '/admin/tickets',
    icon: <TicketIcon size={20} />
  },
  {
    name: 'Chats',
    path: '/admin/chats',
    icon: <MessageSquareIcon size={20} />
  }];

  return (
    <div className="min-h-screen flex bg-bg-light">
      {/* Sidebar */}
      <div className="w-64 bg-primary-darkest text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <ShipIcon size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight">
                FreightCompare
              </span>
              <span className="text-[10px] text-primary-lighter uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) =>
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-primary text-white' : 'text-primary-lighter hover:bg-white/5 hover:text-white'}
              `}>
            
              {item.icon}
              {item.name}
            </NavLink>
          )}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-sm font-medium text-primary-lighter">
              Notifications
            </span>
            <div className="text-white">
              <NotificationBell placement="top" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white truncate w-32">
                {user?.username}
              </p>
              <p className="text-xs text-primary-lighter">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-white/5 transition-colors">
            
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
