import React, { useEffect, useMemo, useState } from 'react';
import { CalendarIcon, LinkIcon, SparklesIcon } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { getCompanies } from "../../api/company";
import CreatableSelect from "react-select/creatable";
import { AITransportAssistantModal } from "../shared/AITransportAssistantModal";
import { AIRecommendation } from "../../types/ai";
import { AIRPORTS, SEAPORTS } from "../../constants";

export interface TransportFormValues {
  company: string;
  transportType: 'AIR' | 'SEA';
  source: string;
  destination: string;
  price: string;
  priceUnit: "shipment" | "kg" | "cbm" | "pallet" | "container";
  duration: string;
  departureDate: string;
  bookingUrl: string;
}

interface TransportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TransportFormValues) => void;
  initialValues?: any | null;
  backendErrors?: any; 
}

const emptyValues: TransportFormValues = {
  company: '',
  transportType: 'AIR',
  source: '',
  destination: '',
  price: '',
  priceUnit: 'shipment',
  duration: '',
  departureDate: '',
  bookingUrl: ''
};

export const TransportFormModal: React.FC<TransportFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  backendErrors
}) => {
  const [values, setValues] = useState<TransportFormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TransportFormValues, string>>>({});
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [companies, setCompanies] = useState<
    {
      id: number;
      name: string;
      is_active: boolean;
    }[]
  >([]);

  useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const res = await getCompanies();
      const companyData =
      Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setCompanies(
        companyData.filter(
          (company: any) =>
            company.is_active
        )
      );
    } catch (err) {
      console.error("Failed to fetch companies", err);
    }
  };

  if (isOpen) {
    fetchCompanies();
  }
}, [isOpen]);

  useEffect(() => {
    if (backendErrors) {
      setErrors((prev) => ({
        ...prev,
        company: backendErrors.company?.[0],
        source: backendErrors.source?.[0],
        destination: backendErrors.destination?.[0],
        price: backendErrors.price?.[0],
        duration: backendErrors.duration?.[0],
        departureDate: backendErrors.departure_date?.[0],
        bookingUrl: backendErrors.booking_url?.[0],
      }));
    }
  }, [backendErrors]);

  // 🔥 HANDLE EDIT / CREATE
  useEffect(() => {
    if (initialValues) {
      setValues({
        company: initialValues.company,
        transportType: initialValues.transport_type?.toUpperCase() || 'AIR',
        source: initialValues.source,
        destination: initialValues.destination,
        price: String(initialValues.price),
        priceUnit: initialValues.price_unit || 'shipment',
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

  const locationOptions = useMemo(() => {
    return values.transportType === "AIR"
      ? AIRPORTS
      : SEAPORTS;
  }, [values.transportType]);

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

  const handleAIApply = (recommendation: AIRecommendation) => {
    const appliedPrice =
      recommendation.price ??
      (recommendation.price_min != null &&
      recommendation.price_max != null
        ? (recommendation.price_min +
            recommendation.price_max) /
          2
        : recommendation.price_min ??
          recommendation.price_max ??
          null);

    const appliedDuration =
      recommendation.duration ??
      (recommendation.duration_min_hours != null &&
      recommendation.duration_max_hours != null
        ? Math.round(
            (recommendation.duration_min_hours +
              recommendation.duration_max_hours) /
              2
          )
        : recommendation.duration_min_hours ??
          recommendation.duration_max_hours ??
          null);

    setValues((prev) => ({
      ...prev,

      company: recommendation.company ?? "",

      price:
        appliedPrice != null
          ? String(appliedPrice)
          : prev.price,

      duration:
        appliedDuration != null
          ? String(appliedDuration)
          : prev.duration,

      bookingUrl:
        recommendation.booking_url ??
        prev.bookingUrl,
    }));

    setIsAIModalOpen(false);
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-3xl" headerAction={
        <Button
            type="button"
            size="sm"
            variant="outline"
            icon={<SparklesIcon size={16} />}
            onClick={() => setIsAIModalOpen(true)}
        >
            AI Assist
        </Button>
    }>
      <>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {backendErrors?.non_field_errors && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {backendErrors.non_field_errors[0]}
            </div>
          )}

          <div className="space-y-8">

            {/* ================= Transport Details ================= */}

            <div className="rounded-2xl border border-border-light bg-bg-light p-5">
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
                Transport Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-medium">
                    Company
                  </label>

                  <CreatableSelect
                    options={companies.map(c => ({
                      label: c.name,
                      value: c.name
                    }))}
                    value={
                      values.company
                        ? {
                            label: values.company,
                            value: values.company
                          }
                        : null
                    }
                    onChange={(selected: any) => {
                      updateField("company", selected?.value || "");
                    }}
                    onCreateOption={(inputValue: string) => {
                      updateField("company", inputValue);
                    }}
                    placeholder="Select or type company"
                  />

                  {errors.company && (
                    <span className="text-xs text-red-500">
                      {errors.company}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-medium">
                    Transport Type
                  </label>

                  <select
                    value={values.transportType}
                    onChange={(e) =>
                      updateField(
                        "transportType",
                        e.target.value as "AIR" | "SEA"
                      )
                    }
                    className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm"
                  >
                    <option value="AIR">AIR</option>
                    <option value="SEA">SEA</option>
                  </select>
                </div>

              </div>
            </div>

            {/* ================= Route ================= */}

            <div className="rounded-2xl border border-border-light bg-bg-light p-5">
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
                Route
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-medium">
                    Origin Airport / Port
                  </label>

                  <CreatableSelect
                    options={locationOptions}
                    value={
                      values.source
                        ? {
                            label: values.source,
                            value: values.source,
                          }
                        : null
                    }
                    onChange={(selected: any) => {
                      updateField("source", selected?.value || "");
                    }}
                    onCreateOption={(inputValue) => {
                      updateField("source", inputValue);
                    }}
                    placeholder="Select or type origin"
                  />

                  {errors.source && (
                    <span className="text-xs text-red-500">
                      {errors.source}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-medium">
                    Destination Airport / Port
                  </label>

                  <CreatableSelect
                    options={locationOptions}
                    value={
                      values.destination
                        ? {
                            label: values.destination,
                            value: values.destination,
                          }
                        : null
                    }
                    onChange={(selected: any) => {
                      updateField("destination", selected?.value || "");
                    }}
                    onCreateOption={(inputValue) => {
                      updateField("destination", inputValue);
                    }}
                    placeholder="Select or type destination"
                  />

                  {errors.destination && (
                    <span className="text-xs text-red-500">
                      {errors.destination}
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* ================= Transport Information ================= */}

            <div className="rounded-2xl border border-border-light bg-bg-light p-5">
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
                Transport Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-col gap-1.5">
                  <Input
                    label="Price"
                    type="number"
                    value={values.price}
                    onChange={(e) =>
                      updateField("price", e.target.value)
                    }
                    error={errors.price}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-medium">
                    Price Unit
                  </label>

                  <select
                    value={values.priceUnit}
                    onChange={(e) =>
                      updateField(
                        "priceUnit",
                        e.target.value as TransportFormValues["priceUnit"]
                      )
                    }
                    className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm"
                  >
                    <option value="shipment">Per Shipment</option>
                    <option value="kg">Per KG</option>
                    <option value="cbm">Per CBM</option>
                    <option value="pallet">Per Pallet</option>
                    <option value="container">Per Container</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <Input
                    label="Duration (hours)"
                    type="number"
                    placeholder="e.g. 48"
                    value={values.duration}
                    onChange={(e) =>
                      updateField("duration", e.target.value)
                    }
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
                  onChange={(e) =>
                    updateField("departureDate", e.target.value)
                  }
                  error={errors.departureDate}
                  icon={<CalendarIcon size={16} />}
                />

                <Input
                  label="Booking URL"
                  type="url"
                  value={values.bookingUrl}
                  onChange={(e) =>
                    updateField("bookingUrl", e.target.value)
                  }
                  error={errors.bookingUrl}
                  icon={<LinkIcon size={16} />}
                />

              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit">
              {initialValues ? "Save Changes" : "Add Transport"}
            </Button>
          </div>

        </form>
        <AITransportAssistantModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onApply={handleAIApply}
          initialSource={values.source}
          initialDestination={values.destination}
          initialTransportType={
            values.transportType.toLowerCase() as "air" | "sea"
          }
        />
      </>
    </Modal>
  );
};