import React, {
    useEffect,
    useState,
} from "react";

import { UserNavbar } from "../../components/shared/UserNavbar";
import { Card } from "../../components/shared/Card";
import { EditPriceAlertModal } from "../../components/shared/price-alerts/EditPriceAlertModal";
import type { PriceAlert } from "../../types/priceAlert";
import { PriceAlertStats } from "../../components/shared/price-alerts/PriceAlertStats";
import { PriceAlertFilters } from "../../components/shared/price-alerts/PriceAlertFilters";
import { PriceAlertCard } from "../../components/shared/price-alerts/PriceAlertCard";
import {
    BellIcon,
    Trash2Icon,
} from "lucide-react";

import {
    useAppDispatch,
    useAppSelector,
} from "../../hooks/redux";

import {
    getPriceAlerts,
    deletePriceAlert,
    clearPriceAlerts as clearPriceAlertsApi,
} from "../../api/priceAlerts";

import {
    setPriceAlerts,
    removePriceAlert,
    clearPriceAlerts as clearPriceAlertsState,
} from "../../redux/transportSlice";

export const PriceAlertsPage = () => {

    const dispatch = useAppDispatch();

    const [loading, setLoading] =
        useState(true);

    const [selectedAlert, setSelectedAlert] =
        useState<PriceAlert | null>(null);

    const [editModalOpen, setEditModalOpen] =
        useState(false);

    const priceAlerts =
        useAppSelector(
            state => state.transport.priceAlerts
        );

    const [filter, setFilter] = useState<
            "all" | "active" | "triggered"
        >("all");

    const filteredAlerts = priceAlerts.filter((alert) => {

        if (filter === "active") {
            return alert.is_active;
        }

        if (filter === "triggered") {
            return !alert.is_active;
        }

        return true;

    });

    useEffect(() => {

        const fetchAlerts = async () => {

            try {

                const res =
                    await getPriceAlerts();

                dispatch(
                    setPriceAlerts(
                        res.data
                    )
                );

            } catch (error) {

                console.error(
                    "Failed to load price alerts",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAlerts();

    }, []);

    const handleDelete = async (
        id: number
    ) => {

        if (
            !window.confirm(
                "Delete this price alert?"
            )
        ) {
            return;
        }

        try {

            await deletePriceAlert(
                id
            );

            dispatch(
                removePriceAlert(
                    id
                )
            );

        } catch (error) {

            console.error(
                "Failed to delete alert",
                error
            );

        }

    };

    const handleClearAll = async () => {

        if (
            !window.confirm(
                "Clear all price alerts?"
            )
        ) {
            return;
        }

        try {

            await clearPriceAlertsApi();

            dispatch(
                clearPriceAlertsState()
            );

        } catch (error) {

            console.error(
                "Failed to clear price alerts",
                error
            );

        }

    };

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                Loading...

            </div>

        );

    }
  
    return (

        <div className="min-h-screen bg-bg-light flex flex-col">

            <UserNavbar />

            <div className="max-w-4xl mx-auto w-full px-6 py-8 flex-1">

                {/* Header */}

                <div className="mb-8">

                    <div className="flex items-center gap-3 mb-2">

                        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">

                            <BellIcon size={20} />

                        </div>

                        <h1 className="text-2xl font-bold text-text-dark">

                            Price Alerts

                        </h1>

                    </div>

                    <p className="text-sm text-text-light">
                        Manage your active price alerts
                    </p>

                    <PriceAlertStats
                        total={priceAlerts.length}
                        active={
                            priceAlerts.filter(
                                alert => alert.is_active
                            ).length
                        }
                        triggered={
                            priceAlerts.filter(
                                alert => !alert.is_active
                            ).length
                        }
                    />
                    <PriceAlertFilters
                        filter={filter}
                        onChange={setFilter}
                    />

                </div>

                {priceAlerts.length === 0 && (

                    <Card className="p-10 text-center">

                        <BellIcon
                            size={36}
                            className="mx-auto mb-4 text-text-light"
                        />

                        <h3 className="text-lg font-semibold">

                            No price alerts

                        </h3>

                        <p className="text-sm text-text-light mt-2">

                            Create a price alert from any transport search.

                        </p>

                    </Card>

                )}

                {priceAlerts.length > 0 && (

                    <div className="flex justify-end mb-4">

                        <button
                            onClick={handleClearAll}
                            className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-medium
                                text-red-600
                                hover:text-red-700
                                transition-colors
                            "
                        >

                            <Trash2Icon size={16} />

                            Clear all

                        </button>

                    </div>

                )}

                <div className="space-y-4">

                    {filteredAlerts.map((alert) => (

                        <PriceAlertCard
                            key={alert.id}
                            alert={alert}
                            onEdit={(alert) => {
                                setSelectedAlert(alert);
                                setEditModalOpen(true);
                            }}
                            onDelete={handleDelete}
                        />

                    ))}

                </div>

            </div>

            <EditPriceAlertModal
                isOpen={editModalOpen}
                onClose={() => {

                    setEditModalOpen(false);

                    setSelectedAlert(null);

                }}
                priceAlert={selectedAlert}
            />
        </div>

    );

};