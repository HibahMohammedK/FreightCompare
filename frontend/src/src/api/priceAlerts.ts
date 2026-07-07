import API from "./axios";
import type { PriceAlert } from "../types/priceAlert";

export type PriceAlertPayload = Pick<
    PriceAlert,
    | "transport"
    | "source"
    | "destination"
    | "departure_date"
    | "transport_type"
    | "target_price"
>;

export type UpdatePriceAlertPayload = Pick<
    PriceAlert,
    "target_price"
>;

export const getPriceAlerts = () =>
    API.get("/price_alerts/");

export const createPriceAlert = (
    data: PriceAlertPayload
) =>
    API.post(
        "/price_alerts/",
        data
    );

export const updatePriceAlert = (
    id: number,
    data: UpdatePriceAlertPayload
) =>
    API.patch(
        `/price_alerts/${id}/`,
        data
    );

export const deletePriceAlert = (
    id: number
) =>
    API.delete(
        `/price_alerts/${id}/`
    );

export const clearPriceAlerts = () =>
    API.delete("/price_alerts/");