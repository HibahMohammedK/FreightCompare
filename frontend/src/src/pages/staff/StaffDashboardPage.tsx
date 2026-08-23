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
import { fetchConversations } from '../../redux/chatSlice';

export const StaffDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(fetchConversations());
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
            <h2 className="text-lg font-bold text-text-dark">
              Active Chats
            </h2>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/staff/tickets")}
              className="text-primary"
            >
              View Tickets
              <ArrowRightIcon size={16} className="ml-1" />
            </Button>
          </div>

          <div className="space-y-4">

            {activeChats.slice(0, 3).map((conversation) => (

              <Card
                key={conversation.id}
                className="p-4 flex items-center justify-between hover:border-primary cursor-pointer transition-colors"
                onClick={() =>
                  navigate(
                    `/staff/tickets?ticket=${conversation.ticket_id}`
                  )
                }
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-semibold">
                    {(conversation.customer_name || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <h4 className="font-semibold text-text-dark text-sm truncate">
                        {conversation.customer_name}
                      </h4>

                      {conversation.unread_count > 0 && (
                        <span className="inline-flex w-4 h-4 bg-primary text-white text-[10px] font-bold items-center justify-center rounded-full shrink-0">
                          {conversation.unread_count}
                        </span>
                      )}

                    </div>

                    <p className="text-xs text-text-light">
                      {conversation.ticket_number}
                    </p>

                    <p className="text-xs text-text-medium truncate max-w-[220px]">
                      {conversation.last_message || "No messages yet"}
                    </p>

                  </div>

                </div>

                <div className="text-right shrink-0">

                  {conversation.last_message_at && (
                    <span className="text-[10px] text-text-lighter block">
                      {formatDistanceToNow(
                        new Date(conversation.last_message_at),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  )}

                </div>

              </Card>

            ))}

            {activeChats.length === 0 && (
              <Card className="p-8 text-center text-text-light">
                No active chats right now.
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>);

};