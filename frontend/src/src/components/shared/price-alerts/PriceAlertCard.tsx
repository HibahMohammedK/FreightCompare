import React from "react";
import {
    PlaneIcon,
    ShipIcon,
    ArrowRightIcon,
    PencilIcon,
    Trash2Icon,
    CheckCircle2Icon,
    Clock3Icon,
} from "lucide-react";

import { Card } from "../Card";
import { Button } from "../Button";

import type { PriceAlert } from "../../../types/priceAlert";

interface PriceAlertCardProps {
    alert: PriceAlert;
    onEdit: (alert: PriceAlert) => void;
    onDelete: (id: number) => void;
}

export const PriceAlertCard: React.FC<
    PriceAlertCardProps
> = ({
    alert,
    onEdit,
    onDelete,
}) => {

    const isTriggered =
        alert.status === "triggered";

    return (

        <Card className="p-5">

            <div className="flex justify-between items-start gap-5">

                {/* Left */}

                <div className="flex gap-5 flex-1">

                    <div className="w-12 h-12 rounded-full bg-bg-light flex items-center justify-center text-text-medium shrink-0">

                        {alert.transport_type === "air"
                            ? <PlaneIcon size={20} />
                            : <ShipIcon size={20} />
                        }

                    </div>

                    <div className="flex-1">

                        {/* Route */}

                        <div className="flex items-center gap-3 flex-wrap">

                            <span className="font-semibold text-text-dark">

                                {alert.source}

                            </span>

                            <ArrowRightIcon
                                size={16}
                                className="text-text-light"
                            />

                            <span className="font-semibold text-text-dark">

                                {alert.destination}

                            </span>

                            <span
                                className={`
                                    inline-flex
                                    items-center
                                    gap-1
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-medium

                                    ${
                                        isTriggered
                                            ? "bg-green-100 text-green-700"
                                            : "bg-blue-100 text-blue-700"
                                    }
                                `}
                            >

                                {isTriggered
                                    ? (
                                        <>
                                            <CheckCircle2Icon size={14} />
                                            Triggered
                                        </>
                                    )
                                    : (
                                        <>
                                            <Clock3Icon size={14} />
                                            Active
                                        </>
                                    )}

                            </span>

                        </div>

                        {/* Details */}

                        <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-5">

                            <div>

                                <p className="text-xs text-text-light">

                                    Departure

                                </p>

                                <p className="font-medium text-text-dark mt-1">

                                    {new Date(
                                        alert.departure_date
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}

                                </p>

                            </div>

                            <div>

                                <p className="text-xs text-text-light">

                                    Target Price

                                </p>

                                <p className="font-semibold text-primary mt-1">

                                    AED {alert.target_price}

                                </p>

                            </div>

                            {!isTriggered ? (

                                <div>

                                    <p className="text-xs text-text-light">

                                        Created

                                    </p>

                                    <p className="font-medium text-text-dark mt-1">

                                        {new Date(
                                            alert.created_at
                                        ).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            }
                                        )}

                                    </p>

                                </div>

                            ) : (

                                <>
                                    <div>

                                        <p className="text-xs text-text-light">

                                            Triggered Price

                                        </p>

                                        <p className="font-medium text-green-600 mt-1">

                                            AED {alert.triggered_price}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs text-text-light">

                                            Triggered At

                                        </p>

                                        <p className="font-medium text-text-dark mt-1">

                                            {alert.triggered_at &&
                                                new Date(
                                                    alert.triggered_at
                                                ).toLocaleString()
                                            }

                                        </p>

                                    </div>
                                </>

                            )}

                        </div>

                    </div>

                </div>

                {/* Right */}

                <div className="flex gap-2">

                    {!isTriggered && (

                        <Button
                            variant="secondary"
                            onClick={() =>
                                onEdit(alert)
                            }
                        >

                            <PencilIcon size={16} />

                        </Button>

                    )}

                    <Button
                        variant="secondary"
                        onClick={() =>
                            onDelete(alert.id)
                        }
                    >

                        <Trash2Icon size={16} />

                    </Button>

                </div>

            </div>

        </Card>

    );

};