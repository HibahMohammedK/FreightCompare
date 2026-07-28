import React from "react";
import { SearchIcon, FilterIcon } from "lucide-react";

import { TicketCard } from "./TicketCard";
import type { TicketList as TicketListType } from "../../../types/ticket";

interface TicketListProps {
  tickets: TicketListType[];
  activeTicketId?: string | null;
  onTicketClick: (ticket: TicketListType) => void;

  onFilterChange?: (status: string) => void;
  currentFilter?: string;

  searchValue?: string;
  onSearchChange?: (value: string) => void;

  showSearch?: boolean;
  showFilter?: boolean;

  showAssignedStaff?: boolean;
  showCustomer?: boolean;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  activeTicketId = null,
  onTicketClick,
  onFilterChange,
  currentFilter = "all",
  showSearch = true,
  showFilter = true,
  showAssignedStaff = true,
  showCustomer = true,
  searchValue = "",
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-border-light w-80 shrink-0">
      <div className="p-4 border-b border-border-light space-y-4">
        <h2 className="font-bold text-text-dark">
          Support Tickets
        </h2>

        {showSearch && (
          <div className="relative">
            <SearchIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-lighter"
            />

            <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search tickets..."
                className="w-full pl-9 pr-4 py-2 bg-bg-light border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {showFilter && onFilterChange && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              "all",
              "open",
              "assigned",
              "in_progress",
              "resolved",
              "closed",
            ].map((status) => (
              <button
                key={status}
                onClick={() => onFilterChange(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap capitalize transition-colors ${
                  currentFilter === status
                    ? "bg-primary text-white"
                    : "bg-bg-light text-text-medium hover:bg-gray-200"
                }`}
              >
                {status.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isActive={ticket.id === activeTicketId}
              onClick={() => onTicketClick(ticket)}
              showAssignedStaff={showAssignedStaff}
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