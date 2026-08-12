import React from "react";
import type { Transport } from "../../types/transport";
import {
    PlaneTakeoffIcon,
    ShipIcon,
    HeartIcon,
    BellIcon,
    ArrowUpRightIcon,
    GitCompareArrowsIcon,
    ArrowRightIcon,
    ClockIcon,
    CalendarIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
    toggleCompareItem,
    MAX_COMPARE_ITEMS,
} from "../../redux/transportSlice";
import { formatDuration } from "../../utils/formatters";
import { toast } from "sonner";

interface TransportCardProps {
    transport: Transport;
    onBook?: () => void;
    onTrack?: () => void;
    index?: number;
    isSaved?: boolean;
    onSaveToggle?: () => void;
}

export const TransportCard: React.FC<TransportCardProps> = ({
    transport,
    onBook,
    onTrack,
    index = 0,
    isSaved,
    onSaveToggle,
}) => {
    const dispatch = useAppDispatch();

    const compareItems = useAppSelector(
        (state) => state.transport.compareItems
    );

    const isComparing = compareItems.some(
        (item) => item.id === transport.id
    );

    const compareLimitReached =
        compareItems.length >= MAX_COMPARE_ITEMS &&
        !isComparing;

    const isAir =
        transport.transport_type === "air";

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US").format(
            price
        );
    };

    const handleCompare = () => {
        /*
         * Allow removing an already selected item,
         * even when the comparison limit has been reached.
         */
        if (isComparing) {
            dispatch(toggleCompareItem(transport));
            return;
        }

        /*
         * Prevent adding a fifth item and explain
         * the reason to the user.
         */
        if (compareItems.length >= MAX_COMPARE_ITEMS) {
            toast.info(
                `You can compare up to ${MAX_COMPARE_ITEMS} transport options.`
            );
            return;
        }

        dispatch(toggleCompareItem(transport));
    };

    return (
        <article
            className="bg-white rounded-[28px] border border-slate-100 overflow-hidden shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(15,23,42,0.08)]"
            style={{
                animationDelay: `${index * 60}ms`,
            }}
        >
            <div className="p-5">
                {/* Company / Route / Price */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                        <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                isAir
                                    ? "bg-sky-50 text-sky-600"
                                    : "bg-teal-50 text-teal-700"
                            }`}
                        >
                            {isAir ? (
                                <PlaneTakeoffIcon
                                    size={24}
                                    strokeWidth={2.2}
                                />
                            ) : (
                                <ShipIcon
                                    size={24}
                                    strokeWidth={2.2}
                                />
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-[15px] font-bold text-slate-900 truncate">
                                    {transport.company}
                                </h3>

                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                                        isAir
                                            ? "bg-sky-50 text-sky-700"
                                            : "bg-teal-50 text-teal-700"
                                    }`}
                                >
                                    {transport.transport_type}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>
                                    {transport.source}
                                </span>

                                <ArrowRightIcon
                                    size={14}
                                />

                                <span>
                                    {
                                        transport.destination
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right shrink-0">
                        <div className="flex items-baseline justify-end gap-2">
                            <span className="text-[17px] font-bold text-slate-900">
                                AED
                            </span>

                            <span className="text-[20px] font-bold text-slate-900">
                                {formatPrice(
                                    transport.price
                                )}
                            </span>
                        </div>

                        <span className="mt-1 block text-[11px] text-slate-400 uppercase tracking-[0.18em]">
                            AED
                        </span>
                    </div>
                </div>

                {/* Duration / Departure */}
                <div className="flex flex-wrap items-center gap-8 mt-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                        <ClockIcon
                            size={18}
                            className="text-slate-400"
                        />

                        <span className="font-semibold text-slate-700">
                            {formatDuration(
                                transport.duration
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                        <CalendarIcon
                            size={18}
                            className="text-slate-400"
                        />

                        <span className="font-semibold text-slate-700">
                            {new Date(
                                transport.departure_date
                            ).toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 mt-6">
                    {/* Compare */}
                    <button
                        type="button"
                        onClick={handleCompare}
                        className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                            isComparing
                                ? "border-primary/20 bg-primary-light text-primary-dark"
                                : compareLimitReached
                                ? "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        <GitCompareArrowsIcon
                            size={16}
                        />

                        {isComparing
                            ? "Comparing"
                            : compareLimitReached
                            ? "Limit reached"
                            : "Compare"}
                    </button>

                    {/* Save */}
                    <button
                        type="button"
                        onClick={onSaveToggle}
                        className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                            isSaved
                                ? "border-red-200 bg-red-50 text-red-500"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        <HeartIcon
                            size={16}
                            className={
                                isSaved
                                    ? "fill-current"
                                    : ""
                            }
                        />

                        {isSaved ? "Saved" : "Save"}
                    </button>

                    {/* Track */}
                    <button
                        type="button"
                        onClick={onTrack}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                    >
                        <BellIcon size={16} />
                        Track
                    </button>

                    {/* Book */}
                    <div className="ml-auto">
                        <button
                            type="button"
                            onClick={onBook}
                            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                        >
                            Book Now
                            <ArrowUpRightIcon
                                size={16}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};