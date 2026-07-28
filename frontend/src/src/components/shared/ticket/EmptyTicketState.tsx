import React from "react";
import { Card } from "../Card";
import { Button } from "../Button";
import { MessageSquarePlusIcon } from "lucide-react";

interface Props {
  onCreateTicket: () => void;
}

export const EmptyTicketState: React.FC<Props> = ({
  onCreateTicket,
}) => {
  return (
    <Card className="flex flex-col items-center justify-center text-center py-20">
      <div className="w-16 h-16 rounded-full bg-bg-light flex items-center justify-center mb-6">
        <MessageSquarePlusIcon size={28} />
      </div>

      <h2 className="text-2xl font-bold mb-3">
        No Tickets Yet
      </h2>

      <p className="text-text-light max-w-md mb-8">
        Need assistance? Create your first support ticket and our team will
        get back to you shortly.
      </p>

      <Button onClick={onCreateTicket}>
        Create Ticket
      </Button>
    </Card>
  );
};