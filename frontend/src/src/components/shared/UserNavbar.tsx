import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  SearchIcon,
  BookmarkIcon,
  ClockIcon,
  ArrowLeftRightIcon,
  CreditCardIcon,
  MessageSquareIcon,
  ShipIcon,
  LogOutIcon,
  BellIcon,
  MenuIcon,
  XIcon,
  UserIcon,
} from "lucide-react";

import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { logoutUser } from "../../api/auth";
import { logout } from "../../redux/authSlice";
import { NotificationBell } from "./notification/NotificationBell";
import { notificationSocket } from "../../websocket/notificationSocket";

export const UserNavbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(
    (state) => state.auth.user
  );

  const compareCount = useAppSelector(
    (state) => state.transport.compareItems.length
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      notificationSocket.disconnect();
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const navItems = [
    {
      name: "Search",
      path: "/search",
      icon: <SearchIcon size={17} />,
    },
    {
      name: "Saved",
      path: "/saved",
      icon: <BookmarkIcon size={17} />,
    },
    {
      name: "History",
      path: "/history",
      icon: <ClockIcon size={17} />,
    },
    {
      name: "Compare",
      path: "/compare",
      icon: <ArrowLeftRightIcon size={17} />,
      badge:
        compareCount > 0
          ? compareCount
          : undefined,
    },
    {
      name: "Price Alerts",
      path: "/price-alerts",
      icon: <BellIcon size={17} />,
    },
    {
      name: "Subscription",
      path: "/pricing",
      icon: <CreditCardIcon size={17} />,
    },
    {
      name: "Support",
      path: "/support",
      icon: <MessageSquareIcon size={17} />,
    },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-border-light shadow-sm">

      <div className="h-16 flex items-center px-3 sm:px-5 lg:px-6">

        <div className="flex items-center w-full max-w-7xl mx-auto">

          {/* =========================
              LOGO
          ========================== */}
          <NavLink
            to="/"
            onClick={() =>
              setIsMobileMenuOpen(false)
            }
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white">
              <ShipIcon size={20} />
            </div>

            <span className="font-bold text-[15px] text-primary-darkest hidden sm:block">
              FreightCompare
            </span>
          </NavLink>

          {/* =========================
              DESKTOP NAVIGATION
          ========================== */}
          <div className="hidden xl:flex items-center gap-1.5 ml-8 flex-1">

            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  relative
                  flex items-center justify-center
                  gap-1.5
                  px-2.5
                  py-2
                  rounded-lg
                  text-[13px]
                  font-medium
                  whitespace-nowrap
                  transition-colors
                  ${
                    isActive
                      ? "bg-primary-light text-primary-dark"
                      : "text-text-medium-light hover:bg-gray-50 hover:text-text-dark"
                  }
                `}
              >
                {item.icon}

                <span>
                  {item.name}
                </span>

                {item.badge !== undefined && (
                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      min-w-4
                      h-4
                      px-1
                      bg-primary
                      text-white
                      text-[9px]
                      font-bold
                      flex
                      items-center
                      justify-center
                      rounded-full
                    "
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}

          </div>

          {/* =========================
              RIGHT SIDE
          ========================== */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">

            {/* Notification */}
            <div className="flex items-center justify-center">
              <NotificationBell />
            </div>

            {/* User Profile - Desktop */}
            <button
              onClick={() =>
                navigate("/profile")
              }
              className="
                hidden
                xl:flex
                items-center
                gap-2
                px-2
                py-1.5
                rounded-lg
                hover:bg-gray-100
                transition-colors
              "
            >
              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  overflow-hidden
                  bg-primary-light
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-semibold text-xs text-primary-darker">
                    {user?.username
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <span className="text-sm font-medium text-text-medium max-w-24 truncate">
                {user?.username}
              </span>
            </button>

            {/* Logout - Desktop */}
            <button
              onClick={handleLogout}
              className="
                hidden
                xl:flex
                w-9
                h-9
                rounded-lg
                bg-gray-100
                items-center
                justify-center
                text-text-medium-light
                hover:bg-gray-200
                hover:text-text-dark
                transition-colors
              "
              title="Logout"
            >
              <LogOutIcon size={16} />
            </button>

            {/* Mobile Profile Avatar */}
            <button
              onClick={() =>
                navigate("/profile")
              }
              className="
                xl:hidden
                w-9
                h-9
                rounded-full
                overflow-hidden
                bg-primary-light
                flex
                items-center
                justify-center
                shrink-0
              "
              aria-label="Open profile"
            >
              {user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-semibold text-xs text-primary-darker">
                  {user?.username
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                setIsMobileMenuOpen(
                  (prev) => !prev
                )
              }
              className="
                xl:hidden
                w-9
                h-9
                rounded-lg
                flex
                items-center
                justify-center
                text-text-medium
                hover:bg-gray-100
                transition-colors
              "
              aria-label={
                isMobileMenuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={
                isMobileMenuOpen
              }
            >
              {isMobileMenuOpen ? (
                <XIcon size={20} />
              ) : (
                <MenuIcon size={20} />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* =========================
          MOBILE / TABLET MENU
      ========================== */}
      {isMobileMenuOpen && (
        <div
          className="
            xl:hidden
            border-t
            border-border-light
            bg-white
            shadow-lg
          "
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-5 py-4">

            {/* User information */}
            <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-bg-light rounded-xl">

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  overflow-hidden
                  bg-primary-light
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-semibold text-sm text-primary-darker">
                    {user?.username
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-dark truncate">
                  {user?.username}
                </p>

                <button
                  onClick={() =>
                    handleNavigation(
                      "/profile"
                    )
                  }
                  className="text-xs text-primary hover:underline"
                >
                  View Profile
                </button>
              </div>

            </div>

            {/* Navigation links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">

              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() =>
                    setIsMobileMenuOpen(
                      false
                    )
                  }
                  className={({ isActive }) => `
                    relative
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-xl
                    text-sm
                    font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-primary-light text-primary-dark"
                        : "text-text-medium hover:bg-gray-50"
                    }
                  `}
                >
                  {item.icon}

                  <span>
                    {item.name}
                  </span>

                  {item.badge !== undefined && (
                    <span
                      className="
                        ml-auto
                        min-w-5
                        h-5
                        px-1
                        bg-primary
                        text-white
                        text-[10px]
                        font-bold
                        flex
                        items-center
                        justify-center
                        rounded-full
                      "
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}

            </div>

            {/* Mobile logout */}
            <div className="mt-3 pt-3 border-t border-border-light">

              <button
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  text-error
                  hover:bg-red-50
                  transition-colors
                "
              >
                <LogOutIcon size={17} />
                Logout
              </button>

            </div>

          </div>
        </div>
      )}
    </nav>
  );
};