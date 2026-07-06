import API from "./axios";

export interface PriceAlertPayload {
    transport: number;
    source: string;
    destination: string;
    departure_date: string;
    transport_type: string;
    target_price: number;
}

export interface UpdatePriceAlertPayload {
    target_price: number;
}


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

export const clearPriceAlerts = () => {

    return API.delete(
        "/price_alerts/"
    );

};