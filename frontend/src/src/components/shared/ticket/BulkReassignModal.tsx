import React, { useEffect, useState } from "react";
import Select from "react-select";
import { UsersRoundIcon } from "lucide-react";
import { toast } from "sonner";

import { Modal } from "../Modal";
import { Button } from "../Button";

import {
    getStaff,
    getStaffByUrl,
} from "../../../api/staff";

import {
    reassignTickets,
} from "../../../api/ticket";

interface StaffOption {
    value: string;
    label: string;
}

interface StaffUser {
    id: string;
    first_name?: string;
    last_name?: string;
    username: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;

    sourceStaffId: string;
    sourceStaffName: string | null;
}

export const BulkReassignModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onSuccess,
    sourceStaffId,
    sourceStaffName,
}) => {
    const [staffOptions, setStaffOptions] =
        useState<StaffOption[]>([]);

    const [toStaff, setToStaff] =
        useState<StaffOption | null>(null);

    const [staffLoading, setStaffLoading] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    /*
     * Load all staff when modal opens.
     */
    useEffect(() => {
        if (!isOpen) {
            setToStaff(null);
            return;
        }

        const loadStaff = async () => {
            try {
                setStaffLoading(true);

                let response = await getStaff();

                const allStaff: StaffUser[] = [
                    ...(response.data.results || []),
                ];

                let nextUrl = response.data.next;

                while (nextUrl) {
                    response =
                        await getStaffByUrl(nextUrl);

                    allStaff.push(
                        ...(response.data.results || [])
                    );

                    nextUrl = response.data.next;
                }

                const options: StaffOption[] =
                    allStaff.map((staff) => {
                        const fullName =
                            `${staff.first_name ?? ""} ${
                                staff.last_name ?? ""
                            }`.trim();

                        return {
                            value: staff.id,
                            label:
                                fullName ||
                                staff.username,
                        };
                    });

                setStaffOptions(options);

            } catch (error) {
                console.error(
                    "Failed to load staff",
                    error
                );

                toast.error(
                    "Failed to load staff members."
                );

            } finally {
                setStaffLoading(false);
            }
        };

        loadStaff();

    }, [isOpen]);

    /*
     * Reassign all tickets from the selected
     * staff member to the new staff member.
     */
    const handleReassign = async () => {
        if (!sourceStaffId || !toStaff) {
            return;
        }

        if (sourceStaffId === toStaff.value) {
            toast.error(
                "Source and target staff must be different."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await reassignTickets(
                sourceStaffId,
                toStaff.value
            );

            toast.success(
                response.data?.message ||
                "Tickets reassigned successfully."
            );

            setToStaff(null);

            onClose();

            onSuccess?.();

        } catch (error: any) {
            console.error(
                "Bulk reassignment failed",
                error
            );

            const detail =
                error?.response?.data?.detail;

            const fromStaffError =
                error?.response?.data?.from_staff;

            const toStaffError =
                error?.response?.data?.to_staff;

            toast.error(
                detail ||
                fromStaffError?.[0] ||
                toStaffError?.[0] ||
                "Failed to reassign tickets."
            );

        } finally {
            setLoading(false);
        }
    };

    /*
     * Remove the currently selected staff member
     * from the target options.
     */
    const targetStaffOptions =
        staffOptions.filter(
            (option) =>
                option.value !== sourceStaffId
        );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Reassign Staff Tickets"
            maxWidth="max-w-[500px]"
        >
            <div className="space-y-6">

                {/* Information */}
                <div className="flex items-start gap-4 bg-bg-light border border-border-light rounded-xl p-4">

                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                        <UsersRoundIcon size={20} />
                    </div>

                    <div>
                        <h4 className="font-semibold text-text-dark">
                            Transfer Staff Workload
                        </h4>

                        <p className="text-xs text-text-light mt-1 leading-relaxed">
                            Reassign all unclosed tickets from
                            this staff member to another staff
                            member. Closed tickets will not be
                            affected.
                        </p>
                    </div>

                </div>

                {/* Currently Assigned Staff */}
                <div>
                    <label className="block text-sm font-medium text-text-medium mb-2">
                        Currently Assigned To
                    </label>

                    <div className="flex items-center justify-between bg-bg-light border border-border-light rounded-lg px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-text-dark">
                                {sourceStaffName ||
                                    "Selected staff"}
                            </p>

                            <p className="text-xs text-text-light mt-0.5">
                                All unclosed tickets assigned
                                to this staff member
                            </p>
                        </div>

                        <span className="text-xs font-medium text-text-light">
                            Source
                        </span>
                    </div>
                </div>

                {/* Target Staff */}
                <div>
                    <label className="block text-sm font-medium text-text-medium mb-2">
                        Reassign To
                    </label>

                    <Select
                        options={targetStaffOptions}
                        value={toStaff}
                        onChange={(option) =>
                            setToStaff(
                                option as StaffOption | null
                            )
                        }
                        isLoading={staffLoading}
                        placeholder="Select new staff member..."
                        isClearable
                    />
                </div>

                {/* Warning */}
                {toStaff && (
                    <div className="rounded-xl border border-warning/20 bg-warning-bg px-4 py-3">

                        <p className="text-sm font-medium text-text-dark">
                            Confirm reassignment
                        </p>

                        <p className="text-xs text-text-medium mt-1 leading-relaxed">
                            All unclosed tickets currently
                            assigned to{" "}
                            <span className="font-semibold">
                                {sourceStaffName}
                            </span>{" "}
                            will be reassigned to{" "}
                            <span className="font-semibold">
                                {toStaff.label}
                            </span>
                            .
                        </p>

                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">

                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        fullWidth
                        onClick={handleReassign}
                        disabled={
                            loading ||
                            !sourceStaffId ||
                            !toStaff
                        }
                    >
                        {loading
                            ? "Reassigning..."
                            : "Reassign Tickets"}
                    </Button>

                </div>

            </div>
        </Modal>
    );
};