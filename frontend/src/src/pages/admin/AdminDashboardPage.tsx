import React from 'react';
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
  Building2Icon
 } from
'lucide-react';
import { useAppSelector } from '../../hooks/redux';
import { mockAdminUsers, mockStaffMembers } from '../../utils/mockData';
export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const tickets = useAppSelector((state) => state.ticket.tickets);
  const conversations = useAppSelector((state) => state.chat.conversations);
  const totalUsers = mockAdminUsers.filter((u) => u.role === 'user').length;
  const premiumUsers = mockAdminUsers.filter(
    (u) => u.role === 'user' && u.isPremium
  ).length;
  const activeStaff = mockStaffMembers.filter(
    (s) => s.status !== 'offline'
  ).length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const activeChats = conversations.filter((c) => c.status === 'active').length;
  const metrics = [
  {
    label: 'Total Users',
    value: totalUsers,
    icon: <UsersIcon size={24} />,
    color: 'text-primary',
    bg: 'bg-primary-light'
  },
  {
    label: 'Premium Users',
    value: premiumUsers,
    icon: <CreditCardIcon size={24} />,
    color: 'text-warning',
    bg: 'bg-warning-bg'
  },
  {
    label: 'Active Staff',
    value: activeStaff,
    icon: <UserCogIcon size={24} />,
    color: 'text-success',
    bg: 'bg-success-bg'
  },
  {
    label: 'Open Tickets',
    value: openTickets,
    icon: <TicketIcon size={24} />,
    color: 'text-error',
    bg: 'bg-error-bg'
  },
  {
    label: 'Active Chats',
    value: activeChats,
    icon: <MessageSquareIcon size={24} />,
    color: 'text-primary',
    bg: 'bg-primary-light'
  }];

  const quickLinks = [
  {
    title: 'Transports',
    desc: 'Manage routes and bulk CSV uploads',
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
