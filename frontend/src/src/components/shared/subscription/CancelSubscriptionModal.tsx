import React, { useState } from "react";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { cancelSubscription } from "../../../api/subscription";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  expiryDate?: string;
  onCancelled?: () => void;
}

export const CancelSubscriptionModal: React.FC<
  CancelSubscriptionModalProps
> = ({
  isOpen,
  onClose,
  expiryDate,
  onCancelled,
}) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);

    try {
      await cancelSubscription();

      onCancelled?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCancelling(false);
    }
  };

  const formattedExpiryDate = expiryDate
    ? new Date(expiryDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() =>
        !isCancelling && onClose()
      }
      title="Cancel Subscription"
    >
      <div className="space-y-6">

        <p className="text-text-light">
          Are you sure you want to cancel your
          subscription?
        </p>

        <div className="rounded-lg bg-bg-light p-4">
          <p className="font-medium text-text-dark">
            What happens next?
          </p>

          <ul className="mt-3 space-y-2 text-sm text-text-light list-disc list-inside">

            <li>
              Your subscription will{" "}
              <strong>not renew</strong>.
            </li>

            <li>
              You will continue enjoying your
              subscription features until{" "}
              <strong>
                {formattedExpiryDate}
              </strong>.
            </li>

            <li>
              After that date your account will
              automatically return to the Basic plan.
            </li>

          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">

          <Button
            variant="outline"
            fullWidth
            disabled={isCancelling}
            onClick={onClose}
          >
            Keep Subscription
          </Button>

          <Button
            fullWidth
            disabled={isCancelling}
            onClick={handleCancel}
          >
            {isCancelling
              ? "Scheduling..."
              : "Schedule Cancellation"}
          </Button>

        </div>

      </div>
    </Modal>
  );
};