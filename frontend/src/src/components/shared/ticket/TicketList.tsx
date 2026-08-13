import React from "react";
import {
  SearchIcon,
  FilterIcon,
  PlusIcon,
} from "lucide-react";

import { Button } from "../Button";
import { TicketCard } from "./TicketCard";

import type { TicketList as TicketListType } from "../../../types/ticket";
import type { StaffUser } from "../../../types/user";

interface TicketListProps {
  tickets: TicketListType[];
  activeTicketId?: string | null;
  onTicketClick: (ticket: TicketListType) => void;

  onFilterChange?: (status: string) => void;
  currentFilter?: string;

  staff?: StaffUser[];
  selectedStaff?: string;
  onStaffChange?: (staffId: string) => void;

  searchValue?: string;
  onSearchChange?: (value: string) => void;

  showSearch?: boolean;
  showFilter?: boolean;

  showAssignedStaff?: boolean;
  showCustomer?: boolean;

  showCreateButton?: boolean;
  onCreateTicket?: () => void;

  showBulkReassign?: boolean;
  onBulkReassign?: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  activeTicketId = null,
  onTicketClick,

  onFilterChange,
  currentFilter = "all",

  staff = [],
  selectedStaff = "all",
  onStaffChange,

  showSearch = true,
  showFilter = true,
  showAssignedStaff = true,
  showCustomer = true,

  searchValue = "",
  onSearchChange,

  showCreateButton = true,
  onCreateTicket,
  showBulkReassign = false,
  onBulkReassign,
}) => {
  return (
    <div className="flex flex-col h-full min-h-0 bg-white border-r border-border-light w-80 shrink-0">

      {/* Header */}
      <div className="p-4 border-b border-border-light space-y-4">

        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold text-text-dark">
            Support Tickets
          </h2>

          {showBulkReassign && onBulkReassign && (
            <button
              type="button"
              onClick={onBulkReassign}
              className="px-2.5 py-1.5 rounded-lg bg-primary-light text-primary text-xs font-medium hover:bg-primary/10 transition-colors whitespace-nowrap"
            >
              Reassign Staff
            </button>
          )}
        </div>

        {showCreateButton && onCreateTicket && (
          <Button
            size="sm"
            icon={<PlusIcon size={16} />}
            onClick={onCreateTicket}
          >
            New Ticket
          </Button>
        )}

        {/* Search */}
        {showSearch && (
          <div className="relative">
            <SearchIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-lighter"
            />

            <input
              type="text"
              value={searchValue}
              onChange={(e) =>
                onSearchChange?.(e.target.value)
              }
              placeholder="Search tickets..."
              className="w-full pl-9 pr-4 py-2 bg-bg-light border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {/* Filters */}
        {(onStaffChange || (showFilter && onFilterChange)) && (
          <div className="flex items-end gap-2">

            {/* Staff Filter */}
            {onStaffChange && (
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-medium text-text-medium mb-1">
                  Staff
                </label>

                <select
                  value={selectedStaff}
                  onChange={(e) =>
                    onStaffChange(e.target.value)
                  }
                  className="w-full px-2.5 py-2 bg-bg-light border border-border-light rounded-lg text-xs text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="all">
                    All Staff
                  </option>

                  <option value="unassigned">
                    Unassigned
                  </option>

                  {staff.map((member) => (
                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {member.first_name || member.last_name
                        ? `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim()
                        : member.username}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Filter */}
            {showFilter && onFilterChange && (
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-medium text-text-medium mb-1">
                  Status
                </label>

                <select
                  value={currentFilter}
                  onChange={(e) =>
                    onFilterChange(e.target.value)
                  }
                  className="w-full px-2.5 py-2 bg-bg-light border border-border-light rounded-lg text-xs text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tickets */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isActive={
                ticket.id === activeTicketId
              }
              onClick={() =>
                onTicketClick(ticket)
              }
              showAssignedStaff={
                showAssignedStaff
              }
              showCustomer={showCustomer}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-bg-light rounded-full flex items-center justify-center text-text-lighter mx-auto mb-3">
              <FilterIcon size={24} />
            </div>

            <p className="text-sm font-medium text-text-dark">
              No tickets found
            </p>

            <p className="text-xs text-text-light mt-1">
              Try changing your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};