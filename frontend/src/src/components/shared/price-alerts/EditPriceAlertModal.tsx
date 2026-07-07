import React, {
    useEffect,
    useState,
} from "react";

import { Modal } from "../Modal";
import { Button } from "../Button";
import { Input } from "../Input";

import {
    BellIcon,
} from "lucide-react";

import type {
    PriceAlert,
} from "../../../types/priceAlert";

import {
    updatePriceAlert as updatePriceAlertApi,
} from "../../../api/priceAlerts";

import {
    useAppDispatch,
} from "../../../hooks/redux";

import {
    updatePriceAlert as updatePriceAlertState,
} from "../../../redux/transportSlice";


interface EditPriceAlertModalProps {

    isOpen: boolean;

    onClose: () => void;

    priceAlert: PriceAlert | null;

}


export const EditPriceAlertModal:
React.FC<EditPriceAlertModalProps> = ({

    isOpen,
    onClose,
    priceAlert,

}) => {

    const dispatch = useAppDispatch();

    const [targetPrice, setTargetPrice] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        if (priceAlert) {

            setTargetPrice(
                priceAlert.target_price.toString()
            );

            setError("");

        }

    }, [priceAlert]);


    const handleUpdatePriceAlert = async () => {

        if (
            !priceAlert ||
            !targetPrice ||
            Number(targetPrice) <= 0
        ) {
            return;
        }

        try {

            setLoading(true);

            setError("");

            const res =
                await updatePriceAlertApi(
                    priceAlert.id,
                    {
                        target_price:
                            Number(targetPrice),
                    }
                );

            dispatch(
                updatePriceAlertState(
                    res.data
                )
            );

            onClose();

        } catch (error: any) {

            setError(
                error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.detail ||
                "Failed to update price alert."
            );

        } finally {

            setLoading(false);

        }

    };


    if (!priceAlert) {

        return null;

    }


    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Price Alert"
            maxWidth="max-w-[400px]"
        >

            <div className="
                flex
                items-center
                gap-4
                mb-6
                bg-warning-bg
                p-4
                rounded-xl
                border
                border-yellow-200
            ">

                <div className="
                    w-10
                    h-10
                    bg-white
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    text-warning
                    shadow-sm
                ">

                    <BellIcon size={20} />

                </div>

                <div>

                    <p className="
                        text-sm
                        font-semibold
                        text-text-dark
                    ">

                        {priceAlert.source}
                        {" → "}
                        {priceAlert.destination}

                    </p>

                    <p className="
                        text-xs
                        text-text-lighter
                        mt-1
                    ">

                        Departure:{" "}

                        {new Date(
                            priceAlert.departure_date
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

            </div>


            <div className="space-y-6">

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-text-medium
                        mb-2
                    ">

                        Target Price

                    </label>

                    <Input
                        className="pl-14"
                        type="number"
                        icon={

                            <span className="
                                text-text-medium
                                font-medium
                            ">

                                AED

                            </span>

                        }
                        value={targetPrice}
                        onChange={(e) =>
                            setTargetPrice(
                                e.target.value
                            )
                        }
                    />

                    {error && (

                        <p className="
                            text-sm
                            text-red-500
                            mt-2
                        ">

                            {error}

                        </p>

                    )}

                </div>


                <div className="flex gap-3 pt-2">

                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={onClose}
                    >

                        Cancel

                    </Button>

                    <Button
                        fullWidth
                        onClick={
                            handleUpdatePriceAlert
                        }
                        disabled={
                            loading ||
                            !targetPrice ||
                            Number(targetPrice) <= 0
                        }
                    >

                        {loading
                            ? "Updating..."
                            : "Update Price Alert"
                        }

                    </Button>

                </div>

            </div>

        </Modal>

    );

};