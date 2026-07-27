import React from "react";
import { Button } from "../Button";
import { PlusIcon } from "lucide-react";

interface Props {
  onCreateTicket: () => void;
}

export const SupportHeader: React.FC<Props> = ({
  onCreateTicket,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Support Center
        </h1>

        <p className="text-primary-lighter text-lg max-w-2xl">
          Create a support ticket and our team will assist you as quickly as
          possible.
        </p>
      </div>

      <Button
        size="lg"
        icon={<PlusIcon size={18} />}
        onClick={onCreateTicket}
      >
        New Ticket
      </Button>
    </div>
  );
};