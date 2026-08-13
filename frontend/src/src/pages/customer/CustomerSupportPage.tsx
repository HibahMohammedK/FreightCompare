import React, { useState,useEffect } from "react";
import { UserNavbar } from "../../components/shared/UserNavbar";
import { PremiumUpgradeModal } from "../../components/shared/premium/PremiumUpgradeModal";
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

  const { user } = useAppSelector((state) => state.auth);

  const [showUpgradeModal, setShowUpgradeModal] =
    useState(false);

  const [upgradeMessage, setUpgradeMessage] =
    useState("");

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

  const handleCreateTicket = () => {
        if (!user?.isPremium) {
            setUpgradeMessage(
                "Creating support tickets is available only for Premium users. Upgrade to Premium to create a support ticket."
            );
            setShowUpgradeModal(true);
            return;
        }

        setShowCreateModal(true);
    };

  return (
    <div className="h-screen flex flex-col bg-bg-light overflow-hidden">
      <UserNavbar />

      <main className="flex-1 min-h-0 overflow-hidden">

        <div className="h-full min-h-0 px-6 py-4 overflow-hidden">

         <div
                className="
                    h-full
                    min-h-0
                    flex
                    overflow-hidden
                    bg-white
                    border
                    border-border-light
                    rounded-xl
                "
            >
            {tickets.length === 0 ? (

                <EmptyTicketState
                    onCreateTicket={handleCreateTicket}
                />

            ) : (

                <div
                    className="
                        flex-1
                        min-w-0
                        min-h-0
                        flex
                        overflow-hidden
                        bg-white
                        rounded-2xl
                        shadow-lg
                    "
                >

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
                        showCreateButton
                        onCreateTicket={handleCreateTicket}
                    />

                    <div className="flex-1 min-w-0 min-h-0 flex overflow-hidden">
                        <TicketDetails
                            ticket={selectedTicket}
                            role="customer"
                        />
                    </div>

                </div>

            )}

        </div>
        </div>
      </main>
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <PremiumUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          message={upgradeMessage}
      />
    </div>
  );
};