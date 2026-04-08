import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';

interface TransportDeleteDialogProps {
  isOpen: boolean;
  transportLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const TransportDeleteDialog: React.FC<TransportDeleteDialogProps> = ({
  isOpen,
  transportLabel,
  onClose,
  onConfirm
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Transport" maxWidth="max-w-md">
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-error-bg p-4">
          <div className="mt-0.5 rounded-full bg-white p-2 text-error">
            <AlertTriangleIcon size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-dark">Confirm deletion</p>
            <p className="mt-1 text-sm text-text-light">
              {transportLabel
                ? `Are you sure you want to remove ${transportLabel}? This action cannot be undone.`
                : 'Are you sure you want to remove this transport? This action cannot be undone.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
