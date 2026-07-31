import React from "react";

interface DashboardHeaderProps {
    title?: string;
    children?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    title,
    children,
}) => {

    return (

        <header
            className="
                h-16
                bg-white
                border-b
                border-border-light
                px-6
                flex
                items-center
                justify-between
                shrink-0
            "
        >

            <div className="flex items-center">

                {title && (
                    <h1
                        className="
                            text-xl
                            font-semibold
                            text-text-dark
                        "
                    >
                        {title}
                    </h1>
                )}

            </div>

            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >
                {children}
            </div>

        </header>

    );

};