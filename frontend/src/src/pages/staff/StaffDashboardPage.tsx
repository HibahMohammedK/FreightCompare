import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { TicketCard } from '../../components/shared/ticket/TicketCard';
import { useAppDispatch } from '../../hooks/redux';
import { fetchTickets } from '../../redux/ticketSlice';
import {
  TicketIcon,
  MessageSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon } from
'lucide-react';
import { useAppSelector } from '../../hooks/redux';
import { formatDistanceToNow } from 'date-fns';

export const StaffDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);
  const tickets = useAppSelector(
      (state) => state.ticket.tickets
  );
  const assignedTickets = tickets.filter(
      (ticket) => ticket.assigned_staff === user?.id
  );
  const conversations = useAppSelector((state) => state.chat.conversations);
  // Filter assigned tickets
  const assignedCount = assignedTickets.filter(
      (t) => t.status === "assigned"
  );

  const inProgressTickets = assignedTickets.filter(
      (t) => t.status === "in_progress"
  );

  const resolvedTickets = assignedTickets.filter(
      (t) => t.status === "resolved"
  );
  const activeChats = conversations.filter((c) => c.status === 'active');

  const recentTickets = [...assignedTickets]
    .sort(
        (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
    )
    .slice(0, 5);
  const metrics = [
  {
    label: 'Assigned',
    value: assignedCount.length,
    icon: <TicketIcon size={24} />,
    color: 'text-error',
    bg: 'bg-error-bg'
  },
  {
    label: 'In Progress',
    value: inProgressTickets.length,
    icon: <ClockIcon size={24} />,
    color: 'text-warning',
    bg: 'bg-warning-bg'
  },
  {
    label: 'Active Chats',
    value: activeChats.length,
    icon: <MessageSquareIcon size={24} />,
    color: 'text-primary',
    bg: 'bg-primary-light'
  },
  {
    label: 'Resolved',
    value: resolvedTickets.length,
    icon: <CheckCircleIcon size={24} />,
    color: 'text-success',
    bg: 'bg-success-bg'
  }];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-dark">
          Welcome back, {user?.username}
        </h1>
        <p className="text-sm text-text-light">
          Here is what's happening with your assigned support tasks today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) =>
        <Card key={idx} className="p-6 flex items-center gap-4">
            <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.bg} ${metric.color}`}>
            
              {metric.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-text-light">
                {metric.label}
              </p>
              <p className="text-2xl font-bold text-text-dark">
                {metric.value}
              </p>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark">Recent Tickets</h2>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/staff/tickets")}
                className="text-primary"
            >
              View All <ArrowRightIcon size={16} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
                <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() =>
                        navigate(`/staff/tickets?ticket=${ticket.id}`)
                    }
                    showAssignedStaff={false}
                />
            ))}
            {assignedTickets.length === 0 &&
            <Card className="p-8 text-center text-text-light">
                No tickets assigned to you.
              </Card>
            }
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark">Active Chats</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/staff/chat')}
              className="text-primary">
              
              View All <ArrowRightIcon size={16} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {activeChats.slice(0, 3).map((chat) => {
              const otherParticipant = chat.participants.find(
                (p) => p.id !== user?.id
              );
              return (
                <Card
                  key={chat.id}
                  className="p-4 flex items-center justify-between hover:border-primary cursor-pointer transition-colors"
                  onClick={() => navigate('/staff/chat')}>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-semibold">
                      {otherParticipant?.name.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-dark text-sm">
                        {otherParticipant?.name}
                      </h4>
                      <p className="text-xs text-text-medium truncate max-w-[200px]">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-text-lighter block mb-1">
                      {formatDistanceToNow(new Date(chat.lastMessageAt), {
                        addSuffix: true
                      })}
                    </span>
                    {chat.unreadCount > 0 &&
                    <span className="inline-flex w-4 h-4 bg-primary text-white text-[10px] font-bold items-center justify-center rounded-full">
                        {chat.unreadCount}
                      </span>
                    }
                  </div>
                </Card>);

            })}
            {activeChats.length === 0 &&
            <Card className="p-8 text-center text-text-light">
                No active chats right now.
              </Card>
            }
          </div>
        </div>
      </div>
    </div>);

};