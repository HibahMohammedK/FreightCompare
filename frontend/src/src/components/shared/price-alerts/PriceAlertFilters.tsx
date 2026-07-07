import React from "react";

interface PriceAlertFiltersProps {
    filter: "all" | "active" | "triggered";
    onChange: (
        value: "all" | "active" | "triggered"
    ) => void;
}

export const PriceAlertFilters: React.FC<
    PriceAlertFiltersProps
> = ({
    filter,
    onChange,
}) => {

    const filters = [
        {
            key: "all",
            label: "All",
        },
        {
            key: "active",
            label: "Active",
        },
        {
            key: "triggered",
            label: "Triggered",
        },
    ] as const;

    return (

        <div className="flex items-center gap-3 mb-6">

            {filters.map((item) => (

                <button
                    key={item.key}
                    onClick={() =>
                        onChange(
                            item.key
                        )
                    }
                    className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-medium
                        transition-all
                        duration-200

                        ${
                            filter === item.key
                                ? "bg-primary text-white shadow-sm"
                                : "bg-white border border-border-light text-text-medium hover:bg-bg-light"
                        }
                    `}
                >

                    {item.label}

                </button>

            ))}

        </div>

    );

};