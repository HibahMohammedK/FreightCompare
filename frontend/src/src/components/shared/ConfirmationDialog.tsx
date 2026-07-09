import React from "react";

import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;

  confirmText: string;
  cancelText?: string;

  confirmVariant?: "primary" | "danger";

  loading?: boolean;

  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationDialog: React.FC<
  ConfirmationDialogProps
> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  confirmVariant = "danger",
  loading = false,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="space-y-6">

        <p className="text-sm text-text-medium">
          {message}
        </p>

        <div className="flex justify-end gap-3">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={
              confirmVariant === "danger"
                ? "danger"
                : "primary"
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </Button>

        </div>

      </div>
    </Modal>
  );
};