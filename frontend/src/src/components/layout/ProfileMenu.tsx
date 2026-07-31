import React, { useEffect, useRef, useState } from "react";
import {
    ChevronDownIcon,
    LogOutIcon,
    UserIcon,
} from "lucide-react";

interface ProfileMenuProps {
    username: string;
    profileImage?: string | null;
    status?: "online" | "busy" | "offline";

    onProfile: () => void;
    onLogout: () => void;

    onStatusChange?: (
        status: "online" | "busy" | "offline"
    ) => Promise<void> | void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
    username,
    profileImage,
    status,
    onProfile,
    onLogout,
    onStatusChange,
}) => {

    const [isOpen, setIsOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent
        ) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target as Node
                )
            ) {
                setIsOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    const getStatusColor = (value: string) => {

        switch (value) {

            case "online":
                return "bg-success";

            case "busy":
                return "bg-warning";

            case "offline":
                return "bg-text-lighter";

            default:
                return "bg-success";
        }

    };

    return (

        <div
            ref={menuRef}
            className="relative"
        >

            {/* Trigger */}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-2
                    py-1.5
                    hover:bg-bg-light
                    transition-colors
                "
            >

                <div className="relative">

                    <div
                        className="
                            w-9
                            h-9
                            rounded-full
                            overflow-hidden
                            bg-primary-light
                            flex
                            items-center
                            justify-center
                        "
                    >
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt={username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span
                                className="
                                    font-semibold
                                    text-xs
                                    text-primary-darker
                                "
                            >
                                {username.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {status && (
                        <div
                            className={`
                                absolute
                                bottom-0
                                right-0
                                w-3
                                h-3
                                rounded-full
                                border-2
                                border-white
                                ${getStatusColor(status)}
                            `}
                        />
                    )}

                </div> {/* ← Close relative div */}

                <div className="text-left">

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-text-dark
                        "
                    >
                        {username}
                    </p>

                    {status && (
                        <p
                            className="
                                text-xs
                                text-text-light
                                capitalize
                            "
                        >
                            {status}
                        </p>
                    )}

                </div> {/* ← Close text-left div */}

                <ChevronDownIcon
                    size={16}
                    className="text-text-light"
                />

            </button>

            {/* Dropdown */}

            {isOpen && (

                <div
                    className="
                        absolute
                        top-full
                        right-0
                        mt-3
                        w-60
                        bg-white
                        rounded-xl
                        border
                        border-border-light
                        shadow-xl
                        overflow-hidden
                        z-50
                    "
                >

                    {/* Status */}

                    {status && onStatusChange && (
                        <>
                            {(["online", "busy", "offline"] as const).map((item) => (
                                <button
                                    key={item}
                                    onClick={async () => {
                                        await onStatusChange(item);
                                        setIsOpen(false);
                                    }}
                                    className="
                                        w-full
                                        flex
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        hover:bg-bg-light
                                        text-sm
                                        capitalize
                                    "
                                >
                                    <div
                                        className={`
                                            w-2
                                            h-2
                                            rounded-full
                                            ${getStatusColor(item)}
                                        `}
                                    />
                                    {item}
                                </button>
                            ))}

                            <div className="border-t border-border-light" />
                        </>
                    )}

                    <button
                        onClick={() => {

                            onProfile();

                            setIsOpen(false);

                        }}
                        className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            hover:bg-bg-light
                            text-sm
                        "
                    >

                        <UserIcon size={16} />

                        Profile

                    </button>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onLogout();
                        }}
                        className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            text-red-600
                            hover:bg-red-50
                            text-sm
                        "
                    >

                        <LogOutIcon size={16} />

                        Logout

                    </button>

                </div>

            )}

        </div>

    );

};