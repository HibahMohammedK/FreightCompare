import React, { useEffect, useState, useRef } from 'react';
import type { TicketDetail, TicketStatus } from "../../../types/ticket";
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { updateTicket } from "../../../redux/ticketSlice";
import { Button } from '../Button';
import { format } from 'date-fns';
import { SendIcon, UserIcon, ShieldIcon, CheckCircleIcon } from 'lucide-react';
import { toast } from "sonner";
import { AssignTicketModal } from "./AssignTicketModal";
import { Select } from "../Select"
import { ChatWindow } from "../chat/ChatWindow";


interface TicketDetailsProps {
  ticket: TicketDetail | null;
  role: "admin" | "staff" | "customer";
}
export const TicketDetails: React.FC<TicketDetailsProps> = ({
  ticket,
  role
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [reply, setReply] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  

  const statusOptions =
  role === "admin"
    ? [
        { value: "open", label: "Open" },
        { value: "assigned", label: "Assigned" },
        { value: "in_progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" },
        { value: "closed", label: "Closed" },
      ]
    : [
        { value: "assigned", label: "Assigned" },
        { value: "in_progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" },
      ];

  const handleStatusChange = async (
      status: TicketStatus
  ) => {

      if (!ticket) return;

      try {

          await dispatch(
              updateTicket({
                  id: ticket.id,
                  data: {
                      status,
                  },
              })
          ).unwrap();

          toast.success(
              "Ticket status updated."
          );

      } catch {

          toast.error(
              "Failed to update ticket status."
          );

      }

  };

  const updatingStatus = useAppSelector(
      (state) => state.ticket.loading.updateStatus
  );

  if (!ticket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-light p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-text-lighter mb-4 shadow-sm">
          <ShieldIcon size={32} />
        </div>
        <h3 className="text-lg font-semibold text-text-dark mb-2">
          Select a Ticket
        </h3>
        <p className="text-sm text-text-light max-w-sm">
          Choose a ticket from the list to view details and respond.
        </p>
      </div>);

  }
  const isClosed = ticket.status === "closed";

  return (
    <div
    className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-bg-light">
      {/* Header */}
      <div className="bg-white border-b border-border-light p-6 shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-bold text-text-dark">
                {ticket.subject}
              </h2>
              <span className="text-xs font-medium text-text-light">
                #{ticket.ticket_number}
              </span>
            </div>
            <p className="text-sm text-text-medium">{ticket.description}</p>
          </div>
          {(role === "staff" || role === "admin") && !isClosed && (
            <div className="flex gap-2">

              {role === "admin" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAssignModal(true)}
                >
                  {ticket.assigned_staff
                    ? "Reassign"
                    : "Assign"}
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-dark">
                Status:
            </span>

            {role === "customer" ? (
                <span className="capitalize text-text-light">
                    {ticket.status.replace("_", " ")}
                </span>
            ) : (
                <Select
                    value={ticket.status}
                    options={statusOptions}
                    onChange={(value: string) =>
                        handleStatusChange(value as TicketStatus)
                    }
                    disabled={updatingStatus}
                    className="w-44"
                />
            )}
        </div>
          <div className="flex items-center gap-2 text-text-light">
            <span className="font-medium text-text-dark">Priority:</span>
            <span className="capitalize">{ticket.priority}</span>
          </div>
          <div className="flex items-center gap-2 text-text-light">
            <span className="font-medium text-text-dark">Created:</span>
            <span>{format(new Date(ticket.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
        <div className="flex-1 min-h-0 overflow-hidden flex">

          {ticket.conversation_id ? (

              <ChatWindow
                  conversationId={ticket.conversation_id}
              />

          ) : (

              <div className="flex h-full items-center justify-center text-text-light">

                  {ticket.status === "open"
                      ? "This ticket hasn't been assigned to a support agent yet."
                      : "No conversation is available for this ticket."}

              </div>

          )}

      </div>

      {/* Reply Box */}
      {/* <div className="bg-white border-t border-border-light p-4 shrink-0">
        {isClosed ? (
          <div className="text-center p-4 bg-bg-light rounded-xl border border-border-light text-text-medium text-sm">
            This ticket is closed. If you need further assistance, please open a new ticket.
          </div>

        ) : role === 'admin' ? (
          <div className="text-center p-4 bg-bg-light rounded-xl border border-border-light text-text-medium text-sm">
            Read-only view (Admin Monitoring)
          </div>

        ) : (
          <form onSubmit={handleReply} className="flex gap-3">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 bg-bg-light border border-border-light focus:border-primary focus:ring-1 focus:ring-primary text-sm px-4 py-3 rounded-xl text-text-dark placeholder:text-text-lighter"
            />

            <Button
              type="submit"
              disabled={!reply.trim()}
              icon={<SendIcon size={18} />}
              className="px-6"
            >
              Reply
            </Button>
          </form>
        )}
      </div> */}

      <AssignTicketModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          ticket={ticket}
          currentStaff={ticket.assigned_staff_name}
      />
    </div>);

};
