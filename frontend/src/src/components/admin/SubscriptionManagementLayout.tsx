import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export const SubscriptionManagementLayout: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-text-dark">
          Subscription Management
        </h1>

        <p className="text-sm text-text-light mt-1">
          Manage customer subscriptions and subscription plans.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-light mb-6">
        <nav className="flex gap-6">

          <NavLink
            to="/admin/subscriptions"
            end
            className={({ isActive }) => `
              relative
              px-1
              pb-3
              text-sm
              font-medium
              transition-colors
              ${
                isActive
                  ? "text-primary"
                  : "text-text-medium hover:text-text-dark"
              }
            `}
          >
            {({ isActive }) => (
              <>
                Customers

                <span
                  className={`
                    absolute
                    left-0
                    right-0
                    bottom-0
                    h-0.5
                    rounded-full
                    transition-opacity
                    ${
                      isActive
                        ? "bg-primary opacity-100"
                        : "opacity-0"
                    }
                  `}
                />
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/subscriptions/plans"
            className={({ isActive }) => `
              relative
              px-1
              pb-3
              text-sm
              font-medium
              transition-colors
              ${
                isActive
                  ? "text-primary"
                  : "text-text-medium hover:text-text-dark"
              }
            `}
          >
            {({ isActive }) => (
              <>
                Plans

                <span
                  className={`
                    absolute
                    left-0
                    right-0
                    bottom-0
                    h-0.5
                    rounded-full
                    transition-opacity
                    ${
                      isActive
                        ? "bg-primary opacity-100"
                        : "opacity-0"
                    }
                  `}
                />
              </>
            )}
          </NavLink>

        </nav>
      </div>

      {/* Tab Content */}
      <Outlet />

    </div>
  );
};