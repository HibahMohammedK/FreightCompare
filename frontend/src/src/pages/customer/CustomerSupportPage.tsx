import React, { useState,useEffect } from "react";
import { UserNavbar } from "../../components/shared/UserNavbar";
import { SupportHeader } from "../../components/shared/support/SupportHeader";
import { TicketList } from "../../components/shared/ticket/TicketList";
import { TicketDetails } from "../../components/shared/ticket/TicketDetails";
import { EmptyTicketState } from "../../components/shared/ticket/EmptyTicketState";
import { CreateTicketModal } from "../../components/shared/ticket/CreateTicketModal";
import { useAppDispatch,useAppSelector } from '../../hooks/redux';
import { fetchTickets, fetchTicket } from "../../redux/ticketSlice";

export const CustomerSupportPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const dispatch = useAppDispatch();

  const {
      tickets,
      selectedTicket,
      loading,
      error,
  } = useAppSelector((state) => state.ticket);
  
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
      const matchesFilter =
          filter === "all" || ticket.status === filter;

      const query = search.toLowerCase();

      const matchesSearch =
          (ticket.subject ?? "").toLowerCase().includes(query) ||
          (ticket.ticket_number ?? "").toLowerCase().includes(query);

            return matchesFilter && matchesSearch;
        });


  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  useEffect(() => {
      if (tickets.length > 0 && !selectedTicket) {
          dispatch(fetchTicket(tickets[0].id));
      }
  }, [dispatch, tickets, selectedTicket]);

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      <div className="bg-primary-dark pt-12 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SupportHeader
            onCreateTicket={() => setShowCreateModal(true)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 -mt-24 relative z-20 pb-12">
        {tickets.length === 0 ? (
          <EmptyTicketState
            onCreateTicket={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg flex h-[700px]">
            <TicketList
                activeTicketId={selectedTicket?.id}
                onTicketClick={(ticket) =>
                    dispatch(fetchTicket(ticket.id))
                }
                showFilter={true}
                showAssignedStaff={false}
                showCustomer={false}
                searchValue={search}
                onSearchChange={setSearch}

                currentFilter={filter}
                onFilterChange={setFilter}

                tickets={filteredTickets}
            />

            <TicketDetails
                ticket={selectedTicket}
                role="customer"
            />
        </div>
        )}
      </div>

      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};