import React, { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { Button } from "../Button";
import Select from "react-select";
import { UserCogIcon } from "lucide-react";
import { getStaff } from "../../../api/staff";
import type { TicketDetail } from "../../../types/ticket";
import { toast } from "sonner";
import { useAppDispatch } from "../../../hooks/redux";
import { assignTicketToStaff } from "../../../redux/ticketSlice";

interface StaffOption {
    value: string;
    label: string;
}
interface StaffUser {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
}


interface Props {
    isOpen: boolean;
    onClose: () => void;
    ticket: TicketDetail;
    currentStaff?: string | null;
}

export const AssignTicketModal: React.FC<Props> = ({
    isOpen,
    onClose,
    ticket,
    currentStaff,
}) => {
    const [loading, setLoading] = useState(false);
    const [staffLoading, setStaffLoading] = useState(false);

    const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isOpen) {
            setSelectedStaff(null);
            setStaffOptions([]);
        }
    }, [isOpen]);

    const fetchStaff = async () => {
            try {
                setStaffLoading(true);

                const response = await getStaff();

                const options: StaffOption[] = response.data.results.map(
                    (staff: StaffUser) => {
                        const fullName = `${staff.first_name ?? ""} ${staff.last_name ?? ""}`.trim();

                        return {
                            value: staff.id,
                            label: fullName || staff.username,
                        };
                    }
                );

                setStaffOptions(options);
                if (currentStaff) {
                    const current = options.find(
                        (option) => option.label === currentStaff
                    );

                    setSelectedStaff(current ?? null);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setStaffLoading(false);
            }
        };

    const [selectedStaff, setSelectedStaff] =
        useState<StaffOption | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchStaff();
        }
    }, [isOpen]);

    const handleAssignTicket = async () => {
        if (!ticket || !selectedStaff) return;

        try {
            setLoading(true);

            await dispatch(
                assignTicketToStaff({
                    id: ticket.id,
                    data: {
                        assigned_staff: selectedStaff.value,
                    },
                })
            ).unwrap();

            setSelectedStaff(null);

            toast.success("Ticket assigned successfully.");

            onClose();
        } catch (error: any) {
            toast.error(
                error?.detail ?? "Failed to assign ticket."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Assign Ticket"
            maxWidth="max-w-[450px]"
        >
            <div className="space-y-6">

                <div className="flex items-center gap-4 bg-bg-light border border-border-light rounded-xl p-4">
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                        <UserCogIcon size={20} />
                    </div>

                    <div>
                        <h4 className="font-semibold text-text-dark">
                            Assign Support Staff
                        </h4>

                        <p className="text-xs text-text-light">
                            Select the staff member responsible for handling this ticket.
                        </p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-medium mb-2">
                        Staff Member
                    </label>

                    <Select
                        options={staffOptions}
                        value={selectedStaff}
                        onChange={(option) =>
                            setSelectedStaff(option as StaffOption)
                        }
                        isLoading={staffLoading}
                        placeholder="Select a staff member..."
                    />
                </div>

                {currentStaff && (
                    <div className="bg-bg-light rounded-xl border border-border-light p-4">
                        <p className="text-xs text-text-light mb-1">
                            Currently Assigned
                        </p>

                        <p className="font-medium text-text-dark">
                            {currentStaff}
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        fullWidth
                        onClick={handleAssignTicket}
                        disabled={
                            loading ||
                            !selectedStaff
                        }
                    >
                        {loading
                        ? "Saving..."
                        : currentStaff
                            ? "Reassign Ticket"
                            : "Assign Ticket"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};