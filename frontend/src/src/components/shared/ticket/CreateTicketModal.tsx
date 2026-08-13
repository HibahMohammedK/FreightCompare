import React, { useState } from "react";
import { Modal } from "../Modal";
import { Button } from "../Button";
import { TicketForm } from "./TicketForm";
import { toast } from "sonner";

import { useAppDispatch} from "../../../hooks/redux";
import {
  createNewTicket,
  fetchTicket,
} from "../../../redux/ticketSlice";
import { CreateTicketRequest } from "../../../types/ticket";


interface Option {
  value: string;
  label: string;
}

interface TicketFormData {
  subject: string;
  category: Option | null;
  priority: Option | null;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<TicketFormData>({
    subject: "",
    category: null,
    priority: null,
    description: "",
  });

  const [errors, setErrors] = useState<{
    subject?: string;
    category?: string;
    priority?: string;
    description?: string;
  }>({});

  

  const handleChange = (
    field: keyof TicketFormData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required.";
    }

    if (!formData.category) {
      newErrors.category = "Category is required.";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload: CreateTicketRequest = {
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      category: formData.category!.value as CreateTicketRequest["category"],
      priority: formData.priority!.value as CreateTicketRequest["priority"],
    };

    try {
      const ticket = await dispatch(
        createNewTicket(payload)
      ).unwrap();

      // Open the newly created ticket immediately
      dispatch(fetchTicket(ticket.id));

      toast.success("Support ticket created successfully.");

      setFormData({
        subject: "",
        category: null,
        priority: null,
        description: "",
      });

      setErrors({});

      onClose();
    } catch (error: any) {

        if (
            error.subject ||
            error.description ||
            error.category ||
            error.priority
        ) {

            setErrors({
                subject: error.subject?.[0] ?? "",
                category: error.category?.[0] ?? "",
                priority: error.priority?.[0] ?? "",
                description: error.description?.[0] ?? "",
            });

            return;
        }

        toast.error(
            error.detail ??
            "Failed to create support ticket."
        );

    }
    finally {
        setLoading(false);
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Create Support Ticket"
        maxWidth="max-w-2xl"
      >
        <TicketForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Ticket"}
          </Button>
        </div>
      </Modal>
      
    </>
  );
};