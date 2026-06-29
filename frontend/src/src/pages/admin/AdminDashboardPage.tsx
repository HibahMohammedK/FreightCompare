import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/shared/Card';
import {
  UsersIcon,
  CreditCardIcon,
  UserCogIcon,
  TicketIcon,
  MessageSquareIcon,
  ArrowRightIcon,
  PlaneTakeoffIcon,
  Building2Icon,
  FileSpreadsheetIcon
 } from
'lucide-react';

import { getDashboardMetrics } from '../../api/adminDashboard';
export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [metricsData, setMetricsData] =
        useState({
          total_users: 0,
          premium_users: 0,
          active_staff: 0,
          open_tickets: 0,
          active_chats: 0,
        });
  useEffect(() => {

    const fetchMetrics = async () => {

      try {

        const res =
          await getDashboardMetrics();

        setMetricsData(res.data);

      } catch (err) {

        console.error(err);

      }
    };

    fetchMetrics();

  }, []);
    const metrics = [
    {
      label: 'Total Users',
      value: metricsData.total_users,
      icon: <UsersIcon size={24} />,
      color: 'text-primary',
      bg: 'bg-primary-light'
    },
    {
      label: 'Premium Users',
      value: metricsData.premium_users,
      icon: <CreditCardIcon size={24} />,
      color: 'text-warning',
      bg: 'bg-warning-bg'
    },
    {
      label: 'Active Staff',
      value: metricsData.active_staff,
      icon: <UserCogIcon size={24} />,
      color: 'text-success',
      bg: 'bg-success-bg'
    },
    {
      label: 'Open Tickets',
      value: metricsData.open_tickets,
      icon: <TicketIcon size={24} />,
      color: 'text-error',
      bg: 'bg-error-bg'
    },
    {
      label: 'Active Chats',
      value: metricsData.active_chats,
      icon: <MessageSquareIcon size={24} />,
      color: 'text-primary',
      bg: 'bg-primary-light'
    }
  ];

  const quickLinks = [
  {
    title: 'Transports',
    desc: 'Manage routes',
    path: '/admin/transports',
    icon: <PlaneTakeoffIcon size={20} />
  },
  {
    title: 'Companies',
    desc: 'Manage transport providers',
    path: '/admin/companies',
    icon: <Building2Icon size={20} />
  },
  {
    title: 'Manage Users',
    desc: 'View and edit user accounts',
    path: '/admin/users',
    icon: <UsersIcon size={20} />
  },
  {
    title: 'Subscriptions',
    desc: 'Track premium plans',
    path: '/admin/subscriptions',
    icon: <CreditCardIcon size={20} />
  },
  {
    title: 'CSV Upload',
    desc: 'Bulk CSV uploads',
    path: '/admin/csv-upload',
    icon: <FileSpreadsheetIcon size={20} />
  },
  {
    title: 'Staff Status',
    desc: 'Monitor staff workload',
    path: '/admin/staff',
    icon: <UserCogIcon size={20} />
  },
  {
    title: 'Ticket Queue',
    desc: 'Reassign or close tickets',
    path: '/admin/tickets',
    icon: <TicketIcon size={20} />
  }];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-dark">System Dashboard</h1>
        <p className="text-sm text-text-light">
          Overview of platform activity and metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {metrics.map((metric, idx) =>
        <Card key={idx} className="p-5 flex flex-col gap-3">
            <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.bg} ${metric.color}`}>
            
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
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-text-dark mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link, idx) =>
            <Card
              key={idx}
              className="p-5 hover:border-primary cursor-pointer transition-colors group"
              onClick={() => navigate(link.path)}>
              
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-bg-light flex items-center justify-center text-text-medium group-hover:bg-primary-light group-hover:text-primary transition-colors">
                      {link.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-dark text-sm">
                        {link.title}
                      </h3>
                      <p className="text-xs text-text-light">{link.desc}</p>
                    </div>
                  </div>
                  <ArrowRightIcon
                  size={16}
                  className="text-text-lighter group-hover:text-primary transition-colors" />
                
                </div>
              </Card>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-text-dark mb-4">
            Recent Activity
          </h2>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-border-light">
              {[
              {
                title: 'New Premium User',
                time: '10 mins ago',
                type: 'success'
              },
              {
                title: 'Ticket #T1234 Escalated',
                time: '1 hour ago',
                type: 'warning'
              },
              {
                title: 'Staff Member Online',
                time: '2 hours ago',
                type: 'info'
              },
              {
                title: 'System Backup Completed',
                time: '5 hours ago',
                type: 'success'
              },
              {
                title: 'New User Registration',
                time: '1 day ago',
                type: 'info'
              }].
              map((activity, idx) =>
              <div key={idx} className="p-4 flex items-start gap-3">
                  <div
                  className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${activity.type === 'success' ? 'bg-success' : activity.type === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
                
                  <div>
                    <p className="text-sm font-medium text-text-dark">
                      {activity.title}
                    </p>
                    <p className="text-xs text-text-lighter">{activity.time}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>);

};
