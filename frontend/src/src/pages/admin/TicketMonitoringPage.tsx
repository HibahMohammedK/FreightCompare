// import React, { useEffect } from 'react';
// import { TicketList } from '../../components/shared/ticket/TicketList';
// import { TicketDetails } from '../../components/shared/ticket/TicketDetails';
// import { useAppSelector, useAppDispatch } from '../../hooks/redux';
// import { setActiveTicket, setTicketFilter } from '../../redux/ticketSlice';

// import {
//   selectFilteredTickets,
//   selectActiveTicket
// } from '../../redux/selectors/ticketSelectors';

// export const TicketMonitoringPage: React.FC = () => {
//   const dispatch = useAppDispatch();

//   // ✅ Redux selectors (single source of truth)
//   const tickets = useAppSelector(selectFilteredTickets);
//   const activeTicket = useAppSelector(selectActiveTicket);
//   const { user } = useAppSelector((state) => state.auth);
//   const filter = useAppSelector((state) => state.ticket.filter.status);

//   // ✅ Auto-select first ticket
//   useEffect(() => {
//     if (tickets.length && !activeTicket) {
//       dispatch(setActiveTicket(tickets[0].id)); // 🔥 FIXED
//     }
//   }, [tickets, activeTicket, dispatch]);

//   return (
//     <div className="flex-1 flex h-full overflow-hidden">
      
//       <TicketList
//         tickets={tickets}
//         activeTicketId={activeTicket?.id ?? null}
        
//         // 🔥 FIXED: pass ticketId only
//         onTicketClick={(ticketId) => dispatch(setActiveTicket(ticketId))}
        
//         // 🔥 Move filter to Redux
//         onFilterChange={(status) => dispatch(setTicketFilter({ status }))}
//         currentFilter={filter}
//       />

//       <div className="flex-1 flex flex-col min-w-0">
//         <TicketDetails
//           ticket={activeTicket}
//           role={user?.role || 'admin'} 
//         />
//       </div>
      
//     </div>
//   );
// };