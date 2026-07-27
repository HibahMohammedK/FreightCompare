import React from "react";
import Select from "react-select";
import { Input } from "../Input";

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

interface TicketFormProps {
  formData: TicketFormData;
  errors?: {
    subject?: string;
    category?: string;
    priority?: string;
    description?: string;
  };
  onChange: (field: keyof TicketFormData, value: any) => void;
}

const categoryOptions: Option[] = [
  { value: "transport", label: "Transport" },
  { value: "payment", label: "Payment" },
  { value: "subscription", label: "Subscription" },
  { value: "technical", label: "Technical" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

const priorityOptions: Option[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const TicketForm: React.FC<TicketFormProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-5">

      <Input
        label="Subject"
        placeholder="Enter ticket subject"
        value={formData.subject}
        onChange={(e) => onChange("subject", e.target.value)}
        error={errors?.subject}
      />

      <div>
        <label className="block text-xs font-medium text-text-medium mb-1.5">
          Category
        </label>

        <Select
          options={categoryOptions}
          value={formData.category}
          onChange={(value) => onChange("category", value)}
          placeholder="Select category"
        />

        {errors?.category && (
          <p className="text-xs text-error mt-1">
            {errors.category}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-text-medium mb-1.5">
          Priority
        </label>

        <Select
          options={priorityOptions}
          value={formData.priority}
          onChange={(value) => onChange("priority", value)}
          placeholder="Select priority"
        />

        {errors?.priority && (
          <p className="text-xs text-error mt-1">
            {errors.priority}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-text-medium mb-1.5">
          Description
        </label>

        <textarea
          rows={6}
          className="
            w-full rounded-xl border border-border-light
            bg-white px-4 py-3 text-sm text-text-darker
            placeholder:text-text-lighter
            focus:border-primary
            focus:ring-1
            focus:ring-primary
            focus:outline-none
            resize-none
          "
          placeholder="Describe your issue in detail..."
          value={formData.description}
          onChange={(e) =>
            onChange("description", e.target.value)
          }
        />

        {errors?.description && (
          <p className="text-xs text-error mt-1">
            {errors.description}
          </p>
        )}
      </div>

    </div>
  );
};