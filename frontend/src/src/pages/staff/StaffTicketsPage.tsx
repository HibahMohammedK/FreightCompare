import React, { useEffect, useState } from 'react';
import { TicketList } from '../../components/shared/ticket/TicketList';
import { TicketDetails } from '../../components/shared/ticket/TicketDetails';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setActiveTicket } from '../../redux/ticketSlice';
export const StaffTicketsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { tickets, activeTicket } = useAppSelector((state) => state.ticket);
  const [filter, setFilter] = useState('all');
  // Filter tickets assigned to this staff member
  const assignedTickets = tickets.filter(
    (t) => t.assignedTo === user?.id || t.assignedTo === 's1'
  );
  const filteredTickets = assignedTickets.filter(
    (t) => filter === 'all' || t.status === filter
  );
  useEffect(() => {
    if (filteredTickets.length && !activeTicket) {
      dispatch(setActiveTicket(filteredTickets[0]));
    }
  }, [filteredTickets, activeTicket, dispatch]);
  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <TicketList
        tickets={filteredTickets}
        activeTicketId={activeTicket?.id ?? null}
        onTicketClick={(ticket) => dispatch(setActiveTicket(ticket))}
        onFilterChange={setFilter}
        currentFilter={filter} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TicketDetails ticket={activeTicket} isStaff={true} />
      </div>
    </div>);

};
