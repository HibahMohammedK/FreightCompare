import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Edit3Icon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  TruckIcon
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { TransportDeleteDialog } from '../../components/admin/TransportDeleteDialog';
import { TransportFormModal, TransportFormValues } from '../../components/admin/TransportFormModal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  addAdminTransport,
  deleteAdminTransport,
  updateAdminTransport
} from '../../redux/transportSlice';
import { AdminTransport, mockAdminUsers } from '../../utils/mockData';

const PAGE_SIZE = 5;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price);

const formatDepartureDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : format(date, 'MMM d, yyyy');
};

export const TransportManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const transports = useAppSelector((state) => state.transport.adminTransports);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<AdminTransport | null>(null);
  const [transportToDelete, setTransportToDelete] = useState<AdminTransport | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const companies = useMemo(() => {
    const companySet = new Set<string>([
      ...mockAdminUsers.filter((user) => user.role === 'staff' || user.role === 'admin').map((user) => user.name),
      ...transports.map((transport) => transport.company),
      'CMA CGM',
      'MSC Cargo',
      'Emirates SkyCargo',
      'DHL Express',
      'FedEx Freight'
    ]);

    return Array.from(companySet).sort((left, right) => left.localeCompare(right));
  }, [transports]);

  const filteredTransports = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return transports;

    return transports.filter((transport) =>
      [
        transport.company,
        transport.transportType,
        transport.source,
        transport.destination,
        transport.duration
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [search, transports]);

  const totalPages = Math.max(1, Math.ceil(filteredTransports.length / PAGE_SIZE));
  const paginatedTransports = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredTransports.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredTransports]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const openCreateModal = () => {
    setEditingTransport(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (values: TransportFormValues) => {
    const normalizedTransport: AdminTransport = {
      id: editingTransport?.id ?? `transport-${Date.now()}`,
      company: values.company,
      transportType: values.transportType,
      source: values.source.trim(),
      destination: values.destination.trim(),
      price: Number(values.price),
      duration: values.duration.trim(),
      departureDate: values.departureDate,
      bookingUrl: values.bookingUrl.trim()
    };

    if (editingTransport) {
      dispatch(updateAdminTransport(normalizedTransport));
    } else {
      dispatch(addAdminTransport(normalizedTransport));
    }

    setIsFormOpen(false);
    setEditingTransport(null);
    setCurrentPage(1);
  };

  const handleDelete = () => {
    if (!transportToDelete) return;
    dispatch(deleteAdminTransport(transportToDelete.id));
    setTransportToDelete(null);
  };

  const rangeStart = filteredTransports.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredTransports.length);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Manage Transports</h1>
          <p className="mt-1 text-sm text-text-light">
            Maintain transport listings, booking data, and bulk imports from one place.
          </p>
        </div>
        <Button icon={<PlusIcon size={16} />} onClick={openCreateModal}>
          Add Transport
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-dark">Transport Listings</h2>
            <p className="mt-1 text-sm text-text-light">
              Review and update live transport options shown to your operations team.
            </p>
          </div>
          <div className="w-full md:w-80">
            <Input
              placeholder="Search company, route, or type..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              icon={<SearchIcon size={18} />}
            />
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-light bg-bg-light">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-medium">Company Name</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-medium">Transport Type</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-medium">Source</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-medium">Destination</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-medium">Price</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-medium">Duration</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-medium">Departure Date</th>
                <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-text-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {paginatedTransports.map((transport) => (
                <tr key={transport.id} className="transition-colors hover:bg-bg-light/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <TruckIcon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-dark">{transport.company}</p>
                        <a
                          href={transport.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:text-primary-dark"
                        >
                          Booking link
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        transport.transportType === 'AIR'
                          ? 'border-air-border bg-air-bg text-air-text'
                          : 'border-sea-border bg-sea-bg text-sea-text'
                      }`}
                    >
                      {transport.transportType}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-medium">{transport.source}</td>
                  <td className="p-4 text-sm text-text-medium">{transport.destination}</td>
                  <td className="p-4 text-sm font-semibold text-text-dark">{formatPrice(transport.price)}</td>
                  <td className="p-4 text-sm text-text-medium">{transport.duration}</td>
                  <td className="p-4 text-sm text-text-medium">{formatDepartureDate(transport.departureDate)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        icon={<Edit3Icon size={14} />}
                        onClick={() => {
                          setEditingTransport(transport);
                          setIsFormOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="danger"
                        icon={<Trash2Icon size={14} />}
                        onClick={() => setTransportToDelete(transport)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedTransports.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-text-light">
                    No transport records found for the current search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 border-t border-border-light px-4 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-text-light">
            Showing {rangeStart}-{rangeEnd} of {filteredTransports.length} transports
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<ChevronLeftIcon size={14} />}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              Previous
            </Button>
            <span className="px-3 text-sm font-medium text-text-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<ChevronRightIcon size={14} />}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <TransportFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransport(null);
        }}
        onSubmit={handleFormSubmit}
        companies={companies}
        initialValues={editingTransport}
      />

      <TransportDeleteDialog
        isOpen={Boolean(transportToDelete)}
        transportLabel={transportToDelete ? `${transportToDelete.company} (${transportToDelete.source} to ${transportToDelete.destination})` : undefined}
        onClose={() => setTransportToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
