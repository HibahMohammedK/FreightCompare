import React, { useEffect, useMemo, useState } from 'react';
import { CalendarIcon, LinkIcon } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';

export interface TransportFormValues {
  company: string;
  transportType: 'AIR' | 'SEA';
  source: string;
  destination: string;
  price: string;
  duration: string;
  departureDate: string;
  bookingUrl: string;
}

interface TransportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TransportFormValues) => void;
  initialValues?: any | null; // 🔥 no mock dependency
}

const emptyValues: TransportFormValues = {
  company: '',
  transportType: 'AIR',
  source: '',
  destination: '',
  price: '',
  duration: '',
  departureDate: '',
  bookingUrl: ''
};

export const TransportFormModal: React.FC<TransportFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues
}) => {
  const [values, setValues] = useState<TransportFormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TransportFormValues, string>>>({});

  // 🔥 HANDLE EDIT / CREATE
  useEffect(() => {
    if (initialValues) {
      setValues({
        company: initialValues.company,
        transportType: initialValues.transport_type?.toUpperCase() || 'AIR',
        source: initialValues.source,
        destination: initialValues.destination,
        price: String(initialValues.price),
        duration: initialValues.duration,
        departureDate: initialValues.departure_date,
        bookingUrl: initialValues.booking_url
      });
    } else {
      setValues(emptyValues);
    }

    setErrors({});
  }, [initialValues, isOpen]);

  const title = useMemo(
    () => (initialValues ? 'Edit Transport' : 'Add Transport'),
    [initialValues]
  );

  const updateField = <K extends keyof TransportFormValues>(
    field: K,
    value: TransportFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof TransportFormValues, string>> = {};

    if (!values.company.trim()) nextErrors.company = 'Company is required.';
    if (!values.source.trim()) nextErrors.source = 'Source is required.';
    if (!values.destination.trim()) nextErrors.destination = 'Destination is required.';
    if (!values.price || Number(values.price) <= 0) {
      nextErrors.price = 'Enter a valid price.';
    }
    if (values.duration === "" || values.duration === null || values.duration === undefined) {
      nextErrors.duration = "Duration is required";
    } else if (Number(values.duration) <= 0) {
      nextErrors.duration = "Duration must be greater than 0";
    }
    if (!values.departureDate) nextErrors.departureDate = 'Departure date is required.';

    if (!values.bookingUrl.trim()) {
      nextErrors.bookingUrl = 'Booking URL is required.';
    } else if (!/^https?:\/\//i.test(values.bookingUrl)) {
      nextErrors.bookingUrl = 'URL must start with http:// or https://';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-3xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input
            label="Company"
            value={values.company}
            onChange={(e) => updateField('company', e.target.value)}
            error={errors.company}
            placeholder="Enter or create company"
          />
          

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-medium">Transport Type</label>
            <select
              value={values.transportType}
              onChange={(e) =>
                updateField('transportType', e.target.value as 'AIR' | 'SEA')
              }
              className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm"
            >
              <option value="AIR">AIR</option>
              <option value="SEA">SEA</option>
            </select>
          </div>

          <Input
            label="Source"
            value={values.source}
            onChange={(e) => updateField('source', e.target.value)}
            error={errors.source}
          />

          <Input
            label="Destination"
            value={values.destination}
            onChange={(e) => updateField('destination', e.target.value)}
            error={errors.destination}
          />

          <Input
            label="Price"
            type="number"
            value={values.price}
            onChange={(e) => updateField('price', e.target.value)}
            error={errors.price}
          />

          <div className="flex flex-col">
            <Input
              label="Duration (hours)"
              type="number"
              placeholder="e.g. 48"
              value={values.duration}
              onChange={(e) => updateField('duration', e.target.value)}
              error={errors.duration}
            />

            {!errors.duration && (
              <span className="text-xs text-text-lighter mt-1">
                e.g., 48 = 2 days
              </span>
            )}
          </div>

          <Input
            label="Departure Date"
            type="date"
            value={values.departureDate}
            onChange={(e) => updateField('departureDate', e.target.value)}
            error={errors.departureDate}
            icon={<CalendarIcon size={16} />}
          />

          <Input
            label="Booking URL"
            type="url"
            value={values.bookingUrl}
            onChange={(e) => updateField('bookingUrl', e.target.value)}
            error={errors.bookingUrl}
            icon={<LinkIcon size={16} />}
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialValues ? 'Save Changes' : 'Add Transport'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};