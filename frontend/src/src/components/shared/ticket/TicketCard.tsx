import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ClockIcon } from "lucide-react";
import { useAppSelector } from "../../../hooks/redux";

import type { TicketList } from "../../../types/ticket";

interface TicketCardProps {
  ticket: TicketList;
  onClick: () => void;
  isActive?: boolean;
  showAssignedStaff?: boolean;
  showCustomer?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onClick,
  isActive = false,
  showAssignedStaff = true,
  showCustomer = true
}) => {

  const currentUser = useAppSelector(
      (state) => state.auth.user,
  );

  const senderPrefix =
      ticket.last_message_sender_id === currentUser?.id
          ? "You"
          : ticket.last_message_sender_name ?? "";

  const getStatusColor = (status: TicketList["status"]) => {
    switch (status) {
      case "open":
        return "bg-error-bg text-error border-red-200";

      case "assigned":
        return "bg-warning-bg text-warning border-yellow-200";

      case "in_progress":
        return "bg-primary-light text-primary border-blue-200";

      case "resolved":
        return "bg-success-bg text-success-dark border-green-200";

      case "closed":
        return "bg-bg-light text-text-medium border-border-light";

      default:
        return "bg-bg-light text-text-medium border-border-light";
    }
  };

  const getPriorityColor = (priority: TicketList["priority"]) => {
    switch (priority) {
      case "urgent":
        return "text-error";

      case "high":
        return "text-warning";

      case "medium":
        return "text-primary";

      case "low":
        return "text-text-medium";

      default:
        return "text-text-medium";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-xl cursor-pointer transition-all ${
        isActive
          ? "border-primary bg-primary-light/10 shadow-sm"
          : "border-border-light bg-white hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-text-light">
          #{ticket.ticket_number}
        </span>

        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusColor(
            ticket.status
          )}`}
        >
          {ticket.status
          ? ticket.status.replace(/_/g, " ")
          : ""}
        </span>
      </div>

      <h4 className="font-semibold text-text-dark text-sm mb-1 line-clamp-1">
          {ticket.subject}
      </h4>

      <p className="text-xs text-text-medium truncate">
          {ticket.last_message ? (
              <>
                  <span className="font-medium">
                      {senderPrefix}:
                  </span>{" "}
                  {ticket.last_message}
              </>
          ) : (
              "No messages yet"
          )}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span
          className={`font-medium capitalize flex items-center gap-1 ${getPriorityColor(
            ticket.priority
          )}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {ticket.priority}
        </span>

        <div className="flex items-center gap-1 text-text-light">
          <ClockIcon size={12} />
          <span>
            {formatDistanceToNow(new Date(ticket.last_message_at ?? ticket.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
        
        <div className="flex items-center gap-2">
          {ticket.unread_count > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-primary text-white text-[10px] font-semibold flex items-center justify-center">
                  {ticket.unread_count}
              </span>
          )}
        </div>

      {showCustomer && ticket.customer_name && (
        <div className="mt-3 pt-3 border-t border-border-light text-xs text-text-medium">
          Customer{" "}
          <span className="font-medium">
            {ticket.customer_name}
          </span>
        </div>
      )}

      {showAssignedStaff && ticket.assigned_staff_name && (
        <div className="mt-3 pt-3 border-t border-border-light text-xs text-text-medium">
          Assigned to{" "}
          <span className="font-medium">
            {ticket.assigned_staff_name}
          </span>
        </div>
      )}
    </div>
  );
};