import React from "react";
import { TicketCard } from "./TicketCard";
import type { TicketList as TicketListType } from "../../../types/ticket";

interface Props {
  tickets: TicketListType[];
}

export const TicketList: React.FC<Props> = ({ tickets }) => {
  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
        />
      ))}
    </div>
  );
};