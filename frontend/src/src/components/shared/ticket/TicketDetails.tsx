import React, { useState } from "react";
import type {
    TicketDetail,
    TicketStatus,
} from "../../../types/ticket";
import {
    useAppSelector,
    useAppDispatch,
} from "../../../hooks/redux";
import { updateTicket } from "../../../redux/ticketSlice";
import { Button } from "../Button";
import { format } from "date-fns";
import {
    ShieldIcon,
    ChevronUpIcon,
    ChevronDownIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AssignTicketModal } from "./AssignTicketModal";
import { Select } from "../Select";
import { ChatWindow } from "../chat/ChatWindow";

interface TicketDetailsProps {
    ticket: TicketDetail | null;
    role: "admin" | "staff" | "customer";
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({
    ticket,
    role,
}) => {
    const dispatch = useAppDispatch();

    const [showAssignModal, setShowAssignModal] =
        useState(false);

    const [isHeaderCollapsed, setIsHeaderCollapsed] =
        useState(false);

    const statusOptions =
        role === "admin"
            ? [
                  {
                      value: "open",
                      label: "Open",
                  },
                  {
                      value: "assigned",
                      label: "Assigned",
                  },
                  {
                      value: "in_progress",
                      label: "In Progress",
                  },
                  {
                      value: "resolved",
                      label: "Resolved",
                  },
                  {
                      value: "closed",
                      label: "Closed",
                  },
              ]
            : [
                  {
                      value: "assigned",
                      label: "Assigned",
                  },
                  {
                      value: "in_progress",
                      label: "In Progress",
                  },
                  {
                      value: "resolved",
                      label: "Resolved",
                  },
              ];

    const handleStatusChange = async (
        status: TicketStatus,
    ) => {
        if (!ticket) return;

        try {
            await dispatch(
                updateTicket({
                    id: ticket.id,
                    data: {
                        status,
                    },
                }),
            ).unwrap();

            toast.success(
                "Ticket status updated.",
            );
        } catch {
            toast.error(
                "Failed to update ticket status.",
            );
        }
    };

    const updatingStatus = useAppSelector(
        (state) =>
            state.ticket.loading.updateStatus,
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
                    Choose a ticket from the list to view
                    details and respond.
                </p>
            </div>
        );
    }

    const isClosed =
        ticket.status === "closed";

    const getPriorityBadge = () => {
        switch (ticket.priority) {
            case "urgent":
                return "bg-error-bg text-error";

            case "high":
                return "bg-warning-bg text-warning";

            case "medium":
                return "bg-primary-light text-primary";

            case "low":
                return "bg-bg-light text-text-medium";

            default:
                return "bg-bg-light text-text-medium";
        }
    };

    const getStatusBadge = () => {
        switch (ticket.status) {
            case "open":
                return "bg-error-bg text-error";

            case "assigned":
                return "bg-warning-bg text-warning";

            case "in_progress":
                return "bg-primary-light text-primary";

            case "resolved":
                return "bg-success-bg text-success-dark";

            case "closed":
                return "bg-bg-light text-text-medium";

            default:
                return "bg-bg-light text-text-medium";
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-bg-light">
            {/* Ticket Header */}
            <div className="bg-white border-b border-border-light shrink-0">
                {/* Compact Header Row */}
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <h2 className="text-base font-semibold text-text-dark truncate">
                                {ticket.subject}
                            </h2>

                            <span className="text-xs font-medium text-text-light shrink-0">
                                #{ticket.ticket_number}
                            </span>
                        </div>

                        {/* Compact metadata when collapsed */}
                        {isHeaderCollapsed && (
                            <div className="flex items-center gap-2 mt-1.5">
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusBadge()}`}
                                >
                                    {ticket.status.replace(
                                        "_",
                                        " ",
                                    )}
                                </span>

                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getPriorityBadge()}`}
                                >
                                    {ticket.priority}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Assign / Reassign */}
                        {(role === "staff" ||
                            role === "admin") &&
                            !isClosed &&
                            role === "admin" && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                        setShowAssignModal(
                                            true,
                                        )
                                    }
                                >
                                    {ticket.assigned_staff
                                        ? "Reassign"
                                        : "Assign"}
                                </Button>
                            )}

                        {/* Collapse / Expand */}
                        <button
                            type="button"
                            onClick={() =>
                                setIsHeaderCollapsed(
                                    (previous) =>
                                        !previous,
                                )
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-text-light hover:text-text-dark hover:bg-bg-light transition-colors"
                            aria-label={
                                isHeaderCollapsed
                                    ? "Expand ticket details"
                                    : "Collapse ticket details"
                            }
                        >
                            {isHeaderCollapsed ? (
                                <ChevronDownIcon
                                    size={18}
                                />
                            ) : (
                                <ChevronUpIcon
                                    size={18}
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* Expanded Ticket Details */}
                {!isHeaderCollapsed && (
                    <div className="px-6 pb-5">
                        {/* Description */}
                        <p className="text-sm text-text-medium mb-5">
                            {ticket.description}
                        </p>

                        {/* Ticket Metadata */}
                        <div className="flex items-center gap-6 text-sm">
                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-text-dark">
                                    Status:
                                </span>

                                {role ===
                                "customer" ? (
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge()}`}
                                    >
                                        {ticket.status.replace(
                                            "_",
                                            " ",
                                        )}
                                    </span>
                                ) : (
                                    <Select
                                        value={
                                            ticket.status
                                        }
                                        options={
                                            statusOptions
                                        }
                                        onChange={(
                                            value: string,
                                        ) =>
                                            handleStatusChange(
                                                value as TicketStatus,
                                            )
                                        }
                                        disabled={
                                            updatingStatus
                                        }
                                        className="w-44"
                                    />
                                )}
                            </div>

                            {/* Priority */}
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-text-dark">
                                    Priority:
                                </span>

                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getPriorityBadge()}`}
                                >
                                    {ticket.priority}
                                </span>
                            </div>

                            {/* Created */}
                            <div className="flex items-center gap-2 text-text-light">
                                <span className="font-medium text-text-dark">
                                    Created:
                                </span>

                                <span>
                                    {format(
                                        new Date(
                                            ticket.created_at,
                                        ),
                                        "MMM d, yyyy",
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat / Conversation */}
            <div className="flex-1 min-h-0 overflow-hidden flex">
                {ticket.conversation_id ? (
                    <ChatWindow
                        conversationId={
                            ticket.conversation_id
                        }
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-text-light text-sm">
                        {ticket.status === "open"
                            ? "This ticket hasn't been assigned to a support agent yet."
                            : "No conversation is available for this ticket."}
                    </div>
                )}
            </div>

            {/* Assign Ticket Modal */}
            <AssignTicketModal
                isOpen={showAssignModal}
                onClose={() =>
                    setShowAssignModal(false)
                }
                ticket={ticket}
                currentStaff={
                    ticket.assigned_staff_name
                }
            />
        </div>
    );
};