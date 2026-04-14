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
  updateTransport // ✅ FIXED
} from '../../api/transport';

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
  const [transports, setTransports] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<any | null>(null);
  const [transportToDelete, setTransportToDelete] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ TOAST STATE (FIXED LOCATION)
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(null);

  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔥 FETCH
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

  // 🔍 SEARCH
  const filteredTransports = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return transports;

    return transports.filter((t) =>
      [t.company, t.transport_type, t.source, t.destination]
        .some((v) => v?.toLowerCase().includes(query))
    );
  }, [search, transports]);

  // 📄 PAGINATION
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

  // ➕ CREATE / UPDATE
  const handleFormSubmit = async (values: TransportFormValues) => {
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
      console.error(error.response?.data);
      showToast("Something went wrong", "error");
    }
  };

  // ❌ DELETE
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

  const handleEdit = (t: any) => {
    setEditingTransport(t);
    setIsFormOpen(true);
  };

  const openCreateModal = () => {
    setEditingTransport(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">

      {/* ✅ TOAST UI (FIXED POSITION) */}
      {toast && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white 
          ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Transports</h1>
          <p className="text-sm text-gray-500">Maintain transport listings</p>
        </div>
        <Button onClick={openCreateModal} icon={<PlusIcon size={16} />}>
          Add Transport
        </Button>
      </div>

      {/* SEARCH */}
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

      {/* TABLE */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 text-sm text-gray-500">
          Showing {rangeStart}–{rangeEnd} of {filteredTransports.length}
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4">Company</th>
              <th className="p-4">Type</th>
              <th className="p-4">Route</th>
              <th className="p-4">Price</th>
              <th className="p-4">Departure</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

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
                  <Button size="sm" onClick={() => handleEdit(t)}>
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
      </Card>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-between">
        <span>Page {currentPage} / {totalPages}</span>
        <div className="flex gap-2">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            Prev
          </Button>
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            Next
          </Button>
        </div>
      </div>

      {/* MODALS */}
      <TransportFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransport(null);
        }}
        onSubmit={handleFormSubmit}
        initialValues={editingTransport}
      />

      <TransportDeleteDialog
        isOpen={!!transportToDelete}
        onClose={() => setTransportToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};