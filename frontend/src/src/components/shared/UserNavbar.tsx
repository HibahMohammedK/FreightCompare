import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  BookmarkIcon,
  ClockIcon,
  ArrowLeftRightIcon,
  CreditCardIcon,
  MessageSquareIcon,
  ShipIcon,
  LogOutIcon,
  BellIcon } from
'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logoutUser } from '../../api/auth';
import { logout } from '../../redux/authSlice';
import { NotificationBell } from './notification/NotificationBell';
import { notificationSocket } from '../../websocket/notificationSocket';

export const UserNavbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const compareCount = useAppSelector(
    (state) => state.transport.compareItems.length
  );


  const handleLogout = async () => {
    try {
      await logoutUser(); // 🔥 clears refresh cookie in backend
    } catch (err) {
      console.error("Logout failed", err);
    } finally {

      notificationSocket.disconnect();
      dispatch(logout()); // clear redux state
      navigate('/login');
    }
  };
  const navItems = [
  {
    name: 'Search',
    path: '/search',
    icon: <SearchIcon size={16} />
  },
  {
    name: 'Saved',
    path: '/saved',
    icon: <BookmarkIcon size={16} />
  },
  {
    name: 'History',
    path: '/history',
    icon: <ClockIcon size={16} />
  },
  {
    name: 'Compare',
    path: '/compare',
    icon: <ArrowLeftRightIcon size={16} />,
    badge: compareCount > 0 ? compareCount : undefined
  },
  {
    name: 'Price Alerts',
    path: '/price-alerts',
    icon: <BellIcon size={16} />,
  },
  {
    name: 'Subscription',
    path: '/pricing',
    icon: <CreditCardIcon size={16} />
  },
  {
    name: 'Support',
    path: '/support',
    icon: <MessageSquareIcon size={16} />
  }];

  return (
    <nav className="h-16 bg-white border-b border-border-light flex items-center px-6 sticky top-0 z-30">
      <div className="flex items-center gap-10 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white">
            <ShipIcon size={20} />
          </div>
          <span className="font-bold text-[15px] text-primary-darkest">
            FreightCompare
          </span>
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-2 flex-1">
          {navItems.map((item) =>
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative
                ${isActive ? 'bg-primary-light text-primary-dark' : 'text-text-medium-light hover:bg-gray-50'}
              `}>
            
              {item.icon}
              {item.name}
              {item.badge &&
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
            }
            </NavLink>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <NotificationBell />
          <button
            onClick={() => navigate("/profile")}
            className="
              flex items-center
              gap-2
              px-2 py-1
              rounded-lg
              hover:bg-gray-100
              transition-colors
              "
            >
            {/* <div className="w-8 h-8 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-semibold text-xs">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div> */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-light flex items-center justify-center">
              {user?.profile_image ? (

                  <img
                      src={user.profile_image}
                      alt={user.username}
                      className="w-full h-full object-cover"
                  />

              ) : (

                  <span  className="font-semibold text-xs text-primary-darker">
                      {user?.username?.charAt(0).toUpperCase()}
                  </span>

              )}

            </div>
            <span className="text-sm font-medium text-text-medium">
              {user?.username}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-text-medium-light hover:bg-gray-200 transition-colors"
            title="Logout">
            
            <LogOutIcon size={16} />
          </button>
        </div>
      </div>
    </nav>);

};
