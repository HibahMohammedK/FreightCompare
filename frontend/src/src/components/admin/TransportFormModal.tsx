import React, { useEffect, useMemo, useState } from 'react';
import { CalendarIcon, LinkIcon } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { AdminTransport } from '../../utils/mockData';

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
  companies: string[];
  initialValues?: AdminTransport | null;
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
  companies,
  initialValues
}) => {
  const [values, setValues] = useState<TransportFormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TransportFormValues, string>>>({});

  useEffect(() => {
    if (initialValues) {
      setValues({
        company: initialValues.company,
        transportType: initialValues.transportType,
        source: initialValues.source,
        destination: initialValues.destination,
        price: String(initialValues.price),
        duration: initialValues.duration,
        departureDate: initialValues.departureDate,
        bookingUrl: initialValues.bookingUrl
      });
      setErrors({});
      return;
    }

    setValues({
      ...emptyValues,
      company: companies[0] ?? ''
    });
    setErrors({});
  }, [companies, initialValues, isOpen]);

  const title = useMemo(
    () => (initialValues ? 'Edit Transport' : 'Add Transport'),
    [initialValues]
  );

  const updateField = <K extends keyof TransportFormValues>(field: K, nextValue: TransportFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof TransportFormValues, string>> = {};

    if (!values.company) nextErrors.company = 'Select a company.';
    if (!values.source.trim()) nextErrors.source = 'Source is required.';
    if (!values.destination.trim()) nextErrors.destination = 'Destination is required.';
    if (!values.price.trim() || Number(values.price) <= 0) {
      nextErrors.price = 'Enter a valid price.';
    }
    if (!values.duration.trim()) nextErrors.duration = 'Duration is required.';
    if (!values.departureDate) nextErrors.departureDate = 'Departure date is required.';
    if (!values.bookingUrl.trim()) {
      nextErrors.bookingUrl = 'Booking URL is required.';
    } else if (!/^https?:\/\//i.test(values.bookingUrl.trim())) {
      nextErrors.bookingUrl = 'Use a valid URL starting with http:// or https://';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-3xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-medium">Company</label>
            <select
              value={values.company}
              onChange={(event) => updateField('company', event.target.value)}
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-text-darker focus:outline-none focus:ring-1 ${
                errors.company
                  ? 'border-error focus:border-error focus:ring-error'
                  : 'border-border-light focus:border-primary focus:ring-primary'
              }`}
            >
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
            {errors.company && <span className="text-xs text-error">{errors.company}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-medium">Transport Type</label>
            <select
              value={values.transportType}
              onChange={(event) => updateField('transportType', event.target.value as 'AIR' | 'SEA')}
              className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm text-text-darker focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="AIR">AIR</option>
              <option value="SEA">SEA</option>
            </select>
          </div>

          <Input
            label="Source"
            value={values.source}
            onChange={(event) => updateField('source', event.target.value)}
            error={errors.source}
            placeholder="Enter source city or port"
          />
          <Input
            label="Destination"
            value={values.destination}
            onChange={(event) => updateField('destination', event.target.value)}
            error={errors.destination}
            placeholder="Enter destination city or port"
          />
          <Input
            label="Price"
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(event) => updateField('price', event.target.value)}
            error={errors.price}
            placeholder="Enter quoted price"
          />
          <Input
            label="Duration"
            value={values.duration}
            onChange={(event) => updateField('duration', event.target.value)}
            error={errors.duration}
            placeholder="e.g. 2 days or 18 days"
          />
          <Input
            label="Departure Date"
            type="date"
            value={values.departureDate}
            onChange={(event) => updateField('departureDate', event.target.value)}
            error={errors.departureDate}
            icon={<CalendarIcon size={16} />}
          />
          <Input
            label="Booking URL"
            type="url"
            value={values.bookingUrl}
            onChange={(event) => updateField('bookingUrl', event.target.value)}
            error={errors.bookingUrl}
            placeholder="https://example.com/booking"
            icon={<LinkIcon size={16} />}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border-light pt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initialValues ? 'Save Changes' : 'Add Transport'}</Button>
        </div>
      </form>
    </Modal>
  );
};
