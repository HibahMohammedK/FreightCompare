import React from "react";
import { Card } from "../Card";
import {
    BellIcon,
    Clock3Icon,
    CheckCircle2Icon,
} from "lucide-react";

interface PriceAlertStatsProps {
    total: number;
    active: number;
    triggered: number;
}

export const PriceAlertStats: React.FC<
    PriceAlertStatsProps
> = ({
    total,
    active,
    triggered,
}) => {

    const stats = [
        {
            title: "Total",
            value: total,
            icon: <BellIcon size={18} />,
            iconClass:
                "bg-blue-100 text-blue-600",
        },
        {
            title: "Active",
            value: active,
            icon: <Clock3Icon size={18} />,
            iconClass:
                "bg-amber-100 text-amber-600",
        },
        {
            title: "Triggered",
            value: triggered,
            icon: <CheckCircle2Icon size={18} />,
            iconClass:
                "bg-green-100 text-green-600",
        },
    ];

    return (

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

            {stats.map((stat) => (

                <Card
                    key={stat.title}
                    className="p-5"
                >

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-text-light">

                                {stat.title}

                            </p>

                            <h3 className="text-3xl font-bold text-text-dark mt-1">

                                {stat.value}

                            </h3>

                        </div>

                        <div
                            className={`
                                w-12
                                h-12
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                ${stat.iconClass}
                            `}
                        >

                            {stat.icon}

                        </div>

                    </div>

                </Card>

            ))}

        </div>

    );

};