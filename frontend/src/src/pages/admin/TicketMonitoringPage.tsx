import React, { useEffect, useState } from "react";
import { TicketList } from "../../components/shared/ticket/TicketList";
import { TicketDetails } from "../../components/shared/ticket/TicketDetails";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchTickets,
  fetchTicket,
  clearSelectedTicket,
} from "../../redux/ticketSlice";
import { StaffUser } from "../../types/user";
import { getAllStaff } from "../../api/staff";
import { BulkReassignModal } from "../../components/shared/ticket/BulkReassignModal";

export const TicketMonitoringPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    tickets,
    selectedTicket,
  } = useAppSelector((state) => state.ticket);

  const { user } = useAppSelector((state) => state.auth);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [selectedStaff, setSelectedStaff] = useState("all");
  const [staff, setStaff] = useState<StaffUser[]>([]);

  const [showBulkReassign, setShowBulkReassign] =
    useState(false);

  /*
   * Load all staff
   */
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const allStaff = await getAllStaff();
        setStaff(allStaff);
      } catch (error) {
        console.error("Failed to load staff", error);
      }
    };

    loadStaff();
  }, []);

  /*
   * Fetch tickets whenever staff filter changes
   * and clear the previously selected ticket.
   */
  useEffect(() => {
    dispatch(clearSelectedTicket());

    dispatch(
      fetchTickets(
        selectedStaff === "all"
          ? undefined
          : selectedStaff
      )
    );
  }, [dispatch, selectedStaff]);

  /*
   * Filter tickets by status and search text.
   */
  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter =
      filter === "all" || ticket.status === filter;

    const query = search.toLowerCase();

    const matchesSearch =
      (ticket.subject ?? "")
        .toLowerCase()
        .includes(query) ||
      (ticket.ticket_number ?? "")
        .toLowerCase()
        .includes(query) ||
      (ticket.customer_name ?? "")
        .toLowerCase()
        .includes(query);

    return matchesFilter && matchesSearch;
  });

  /*
   * Keep selected ticket synchronized with the
   * currently visible ticket list.
   */
  useEffect(() => {
    const selectedStillVisible =
      selectedTicket &&
      filteredTickets.some(
        (ticket) => ticket.id === selectedTicket.id
      );

    if (!selectedStillVisible) {
      if (filteredTickets.length > 0) {
        dispatch(
          fetchTicket(filteredTickets[0].id)
        );
      } else {
        dispatch(clearSelectedTicket());
      }
    }
  }, [
    dispatch,
    filteredTickets,
    selectedTicket,
  ]);

  /*
   * Get the staff currently selected in the filter.
   */
  const selectedStaffMember = staff.find(
    (member) => member.id === selectedStaff
  );

  const selectedStaffName = selectedStaffMember
    ? (
        `${selectedStaffMember.first_name ?? ""} ${
          selectedStaffMember.last_name ?? ""
        }`
      ).trim() || selectedStaffMember.username
    : null;

  return (
    <div className="flex h-full min-h-0 overflow-hidden">

      <TicketList
        tickets={filteredTickets}
        activeTicketId={selectedTicket?.id ?? null}
        onTicketClick={(ticket) =>
          dispatch(fetchTicket(ticket.id))
        }

        onFilterChange={setFilter}
        currentFilter={filter}

        staff={staff}
        selectedStaff={selectedStaff}
        onStaffChange={setSelectedStaff}

        showCustomer={true}
        showSearch={true}
        searchValue={search}
        onSearchChange={setSearch}

        showCreateButton={false}

        showBulkReassign={
          selectedStaff !== "all" &&
          selectedStaff !== "unassigned"
        }

        onBulkReassign={() =>
          setShowBulkReassign(true)
        }
      />

      <div className="flex-1 min-w-0 min-h-0 flex overflow-hidden">

        <TicketDetails
          ticket={selectedTicket}
          role={user?.role ?? "admin"}
        />

      </div>

      <BulkReassignModal
        isOpen={showBulkReassign}
        onClose={() =>
          setShowBulkReassign(false)
        }
        sourceStaffId={selectedStaff}
        sourceStaffName={selectedStaffName}
        onSuccess={() => {
          dispatch(
            fetchTickets(
              selectedStaff === "all"
                ? undefined
                : selectedStaff
            )
          );
        }}
      />

    </div>
  );
};