import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
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

import {
  getTransports,
  createTransport,
  deleteTransport,
  updateTransport
} from '../../api/transport';

const PAGE_SIZE = 5;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0
  }).format(price);

const formatDepartureDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : format(date, 'MMM d, yyyy');
};

export const TransportManagementPage: React.FC = () => {
  const [transports, setTransports] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<any | null>(null);
  const [transportToDelete, setTransportToDelete] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<any>({});
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(null);

  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTransports = async () => {
    try {
      const res = await getTransports();
      setTransports(res.data);
    } catch (error) {
      console.error("Error fetching transports:", error);
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  const filteredTransports = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return transports;

    return transports.filter((t) =>
      [t.company, t.transport_type, t.source, t.destination]
        .some((v) => v?.toLowerCase().includes(query))
    );
  }, [search, transports]);

  const totalPages = Math.max(1, Math.ceil(filteredTransports.length / PAGE_SIZE));

  const paginatedTransports = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTransports.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredTransports]);

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const rangeStart =
    filteredTransports.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredTransports.length);

  // ✅ CREATE / UPDATE
  const handleFormSubmit = async (values: TransportFormValues) => {
    setFormErrors({}); // 🔥 clear old errors

    try {
      const payload = {
        company_name: values.company,
        transport_type: values.transportType.toLowerCase(),
        source: values.source.trim(),
        destination: values.destination.trim(),
        price: Number(values.price),
        duration: Number(values.duration),
        departure_date: values.departureDate,
        booking_url: values.bookingUrl,
      };

      if (editingTransport) {
        await updateTransport(editingTransport.id, payload);
        showToast("Transport updated successfully");
      } else {
        await createTransport(payload);
        showToast("Transport created successfully");
      }

      await fetchTransports();

      setIsFormOpen(false);
      setEditingTransport(null);
      setCurrentPage(1);

    } catch (error: any) {
      const errors = error.response?.data;
      setFormErrors(errors || {});
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!transportToDelete) return;

    try {
      await deleteTransport(transportToDelete.id);
      await fetchTransports();
      setTransportToDelete(null);
      showToast("Transport deleted successfully");
    } catch (error) {
      console.error(error);
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">

      {toast && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded-lg text-white 
          ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.message}
        </div>
      )}

      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Transports</h1>
          <p className="text-sm text-gray-500">Maintain transport listings</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} icon={<PlusIcon size={16} />}>
          Add Transport
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          icon={<SearchIcon size={18} />}
        />
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 text-sm text-gray-500">
          Showing {rangeStart}–{rangeEnd} of {filteredTransports.length}
        </div>

        <table className="w-full">
          <tbody>
            {paginatedTransports.map((t) => (
              <tr key={t.id}>
                <td className="p-4 flex gap-2">
                  <TruckIcon size={16} />
                  {t.company}
                </td>
                <td className="p-4">{t.transport_type}</td>
                <td className="p-4">{t.source} → {t.destination}</td>
                <td className="p-4">{formatPrice(Number(t.price))}</td>
                <td className="p-4">{formatDepartureDate(t.departure_date)}</td>
                <td className="p-4 flex gap-2 justify-end">
                  <Button size="sm" onClick={() => {
                    setEditingTransport(t);
                    setIsFormOpen(true);
                  }}>
                    <Edit3Icon size={14} />
                  </Button>

                  <Button size="sm" onClick={() => setTransportToDelete(t)}>
                    <Trash2Icon size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-4 border-t">
          {/* Page Info */}
          <div className="text-sm text-text-light">
            Page {currentPage} of {totalPages}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
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
          setFormErrors({});
        }}
        onSubmit={handleFormSubmit}
        initialValues={editingTransport}
        backendErrors={formErrors}
      />

      <TransportDeleteDialog
        isOpen={!!transportToDelete}
        onClose={() => setTransportToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};