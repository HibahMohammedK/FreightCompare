import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import { Card } from "../../components/shared/Card";

import {
  UsersIcon,
  CreditCardIcon,
  UserCogIcon,
  TicketIcon,
  ArrowRightIcon,
  PlaneTakeoffIcon,
  Building2Icon,
  FileSpreadsheetIcon,
} from "lucide-react";

import { getDashboardMetrics } from "../../api/adminDashboard";

interface DashboardActivity {
  title: string;
  description: string;
  type: "user" | "subscription" | "ticket" | "transport";
  created_at: string;
}

interface DashboardMetrics {
  total_users: number;
  premium_users: number;
  active_staff: number;
  open_tickets: number;
}

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [metricsData, setMetricsData] =
    useState<DashboardMetrics>({
      total_users: 0,
      premium_users: 0,
      active_staff: 0,
      open_tickets: 0,
    });

  const [activities, setActivities] =
    useState<DashboardActivity[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await getDashboardMetrics();

        setMetricsData({
          total_users: res.data.total_users,
          premium_users: res.data.premium_users,
          active_staff: res.data.active_staff,
          open_tickets: res.data.open_tickets,
        });

        setActivities(
          res.data.recent_activity || []
        );
      } catch (err) {
        console.error(
          "Failed to load dashboard metrics:",
          err
        );
      }
    };

    fetchMetrics();
  }, []);

  /*
   * Dashboard metric cards
   */
  const metrics = [
    {
      label: "Total Users",
      value: metricsData.total_users,
      icon: <UsersIcon size={24} />,
      color: "text-primary",
      bg: "bg-primary-light",
    },
    {
      label: "Premium Users",
      value: metricsData.premium_users,
      icon: <CreditCardIcon size={24} />,
      color: "text-warning",
      bg: "bg-warning-bg",
    },
    {
      label: "Active Staff",
      value: metricsData.active_staff,
      icon: <UserCogIcon size={24} />,
      color: "text-success",
      bg: "bg-success-bg",
    },
    {
      label: "Open Tickets",
      value: metricsData.open_tickets,
      icon: <TicketIcon size={24} />,
      color: "text-error",
      bg: "bg-error-bg",
    },
  ];

  /*
   * Quick navigation
   */
  const quickLinks = [
    {
      title: "Transports",
      desc: "Manage routes",
      path: "/admin/transports",
      icon: <PlaneTakeoffIcon size={20} />,
    },
    {
      title: "Companies",
      desc: "Manage transport providers",
      path: "/admin/companies",
      icon: <Building2Icon size={20} />,
    },
    {
      title: "Manage Users",
      desc: "View and edit user accounts",
      path: "/admin/users",
      icon: <UsersIcon size={20} />,
    },
    {
      title: "Subscriptions",
      desc: "Track premium plans",
      path: "/admin/subscriptions",
      icon: <CreditCardIcon size={20} />,
    },
    {
      title: "CSV Upload",
      desc: "Bulk CSV uploads",
      path: "/admin/csv-upload",
      icon: <FileSpreadsheetIcon size={20} />,
    },
    {
      title: "Staff Status",
      desc: "Monitor staff workload",
      path: "/admin/staff",
      icon: <UserCogIcon size={20} />,
    },
    {
      title: "Ticket Queue",
      desc: "Reassign or close tickets",
      path: "/admin/tickets",
      icon: <TicketIcon size={20} />,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-dark">
          System Dashboard
        </h1>

        <p className="text-sm text-text-light">
          Overview of platform activity and metrics.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {metrics.map((metric) => (
          <Card
            key={metric.label}
            className="p-5 flex flex-col gap-3"
          >
            <div
              className={`
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                ${metric.bg}
                ${metric.color}
              `}
            >
              {metric.icon}
            </div>

            <div>
              <p className="text-2xl font-bold text-text-dark">
                {metric.value}
              </p>

              <p className="text-xs font-medium text-text-light">
                {metric.label}
              </p>
            </div>
          </Card>
        ))}

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Quick Actions */}
        <div className="lg:col-span-2">

          <h2 className="text-lg font-bold text-text-dark mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {quickLinks.map((link) => (
              <Card
                key={link.title}
                className="
                  p-5
                  hover:border-primary
                  cursor-pointer
                  transition-colors
                  group
                "
                onClick={() => navigate(link.path)}
              >

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-lg
                        bg-bg-light
                        flex
                        items-center
                        justify-center
                        text-text-medium
                        group-hover:bg-primary-light
                        group-hover:text-primary
                        transition-colors
                      "
                    >
                      {link.icon}
                    </div>

                    <div>

                      <h3 className="font-semibold text-text-dark text-sm">
                        {link.title}
                      </h3>

                      <p className="text-xs text-text-light">
                        {link.desc}
                      </p>

                    </div>

                  </div>

                  <ArrowRightIcon
                    size={16}
                    className="
                      text-text-lighter
                      group-hover:text-primary
                      transition-colors
                    "
                  />

                </div>

              </Card>
            ))}

          </div>

        </div>

        {/* Recent Activity */}
        <div>

          <h2 className="text-lg font-bold text-text-dark mb-4">
            Recent Activity
          </h2>

          <Card className="p-0 overflow-hidden">

            {activities.length === 0 ? (

              <div className="p-6 text-center text-sm text-text-light">
                No recent activity.
              </div>

            ) : (

              <div className="divide-y divide-border-light">

                {activities.map((activity, index) => (

                  <div
                    key={`${activity.type}-${activity.created_at}-${index}`}
                    className="p-4 flex items-start gap-3"
                  >

                    {/* Activity indicator */}
                    <div
                      className={`
                        mt-1.5
                        w-2
                        h-2
                        rounded-full
                        shrink-0
                        ${
                          activity.type === "subscription"
                            ? "bg-success"
                            : activity.type === "ticket"
                            ? "bg-warning"
                            : activity.type === "transport"
                            ? "bg-primary"
                            : "bg-primary"
                        }
                      `}
                    />

                    <div className="min-w-0">

                      <p className="text-sm font-medium text-text-dark">
                        {activity.title}
                      </p>

                      <p className="text-xs text-text-light truncate">
                        {activity.description}
                      </p>

                      <p className="text-xs text-text-lighter mt-1">
                        {formatDistanceToNow(
                          new Date(activity.created_at),
                          {
                            addSuffix: true,
                          }
                        )}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </Card>

        </div>

      </div>

    </div>
  );
};