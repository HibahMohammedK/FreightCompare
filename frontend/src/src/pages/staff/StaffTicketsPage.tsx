import React, { useEffect, useState } from "react";
import { TicketList } from "../../components/shared/ticket/TicketList";
import { TicketDetails } from "../../components/shared/ticket/TicketDetails";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchTickets,
  fetchTicket,
} from "../../redux/ticketSlice";

export const StaffTicketsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    tickets,
    selectedTicket,
    loading,
  } = useAppSelector((state) => state.ticket);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const filteredTickets = tickets.filter((ticket) => {
      const matchesFilter =
          filter === "all" || ticket.status === filter;

      const query = search.toLowerCase();

      const matchesSearch =
          (ticket.subject ?? "").toLowerCase().includes(query) ||
          (ticket.ticket_number ?? "").toLowerCase().includes(query) ||
          (ticket.customer_name ?? "").toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    if (
      filteredTickets.length > 0 &&
      !selectedTicket
    ) {
      dispatch(fetchTicket(filteredTickets[0].id));
    }
  }, [dispatch, filteredTickets, selectedTicket]);

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <TicketList
        tickets={filteredTickets}
        activeTicketId={selectedTicket?.id ?? null}
        onTicketClick={(ticket) =>
          dispatch(fetchTicket(ticket.id))
        }
        onFilterChange={setFilter}
        currentFilter={filter}
        showAssignedStaff={false}
        showCustomer={true}
        searchValue={search}
        onSearchChange={setSearch}
        showCreateButton={false}
      />

      <div className="flex-1 min-w-0 min-h-0 flex overflow-hidden">
        <TicketDetails
          ticket={selectedTicket}
          role="staff"
        />
      </div>
    </div>
  );
};