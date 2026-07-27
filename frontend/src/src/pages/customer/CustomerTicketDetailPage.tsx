import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserNavbar } from "../../components/shared/UserNavbar";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchTicket } from "../../redux/ticketSlice";

export const CustomerTicketDetailPage: React.FC = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();

  const { selectedTicket, loading } = useAppSelector(
    (state) => state.ticket
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchTicket(id));
    }
  }, [dispatch, id]);

  if (loading.fetchTicket) {
    return <div>Loading...</div>;
  }

  if (!selectedTicket) {
    return <div>Ticket not found.</div>;
  }

  return (
    <>
      <UserNavbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold">
          {selectedTicket.subject}
        </h1>

        <p className="mt-4">
          {selectedTicket.description}
        </p>

        <div className="mt-6 space-y-2">
          <p>Status: {selectedTicket.status}</p>
          <p>Priority: {selectedTicket.priority}</p>
          <p>Category: {selectedTicket.category}</p>
          <p>Ticket No: {selectedTicket.ticket_number}</p>
        </div>
      </div>
    </>
  );
};