import React, { useState,useEffect } from "react";
import { UserNavbar } from "../../components/shared/UserNavbar";
import { SupportHeader } from "../../components/shared/support/SupportHeader";
import { TicketList } from "../../components/shared/support/TicketList";
import { EmptyTicketState } from "../../components/shared/support/EmptyTicketState";
import { CreateTicketModal } from "../../components/shared/support/CreateTicketModal";
import { useAppDispatch,useAppSelector } from '../../hooks/redux';
import { fetchTickets } from "../../redux/ticketSlice";

export const CustomerSupportPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const dispatch = useAppDispatch();

  const {
    tickets,
    loading,
    error,
  } = useAppSelector(
    (state) => state.ticket
  );

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

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

      <div className="max-w-7xl mx-auto w-full px-6 -mt-24 relative z-20 pb-12 flex-1">
        {tickets.length === 0 ? (
          <EmptyTicketState
            onCreateTicket={() => setShowCreateModal(true)}
          />
        ) : (
          <TicketList tickets={tickets} />
        )}
      </div>

      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};