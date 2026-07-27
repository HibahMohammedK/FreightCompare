import React from "react";
import { Card } from "../Card";
import { ArrowRightIcon } from "lucide-react";
import type { TicketList as TicketListType } from "../../../types/ticket";
import { useNavigate } from "react-router-dom";

interface Props {
  ticket: TicketListType;
}

export const TicketCard: React.FC<Props> = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="p-5 hover:border-primary transition cursor-pointer"
      onClick={() => navigate(`/support/${ticket.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-text-light font-medium">
            {ticket.ticket_number}
          </p>

          <h3 className="text-lg font-semibold text-text-dark mt-1">
            {ticket.subject}
          </h3>
        </div>

        <ArrowRightIcon
          size={18}
          className="text-text-lighter"
        />
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-text-light">
        <span>{ticket.category}</span>

        <span>•</span>

        <span>{ticket.priority}</span>

        <span>•</span>

        <span>{ticket.status}</span>
      </div>
    </Card>
  );
};