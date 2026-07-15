import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { BellIcon } from 'lucide-react';
import type { Transport } from "../../../types/transport";
import { createPriceAlert } from "../../../api/priceAlerts";

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  transport: Transport | null;
}
export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  transport
}) => {

  const [targetPrice, setTargetPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const navigate = useNavigate()

  const handleCreatePriceAlert = async () => {

      if (!transport || !targetPrice) {
          return;
      }

      try {

          setLoading(true);
          setError("");

          await createPriceAlert({
              transport: transport.id,
              source: transport.source,
              destination: transport.destination,
              departure_date: transport.departure_date,
              transport_type: transport.transport_type,
              target_price: Number(targetPrice),
          });

          setTargetPrice("");
          onClose();

      } catch (error: any) {

          if (error.response?.status === 403) {

            onClose();

            setUpgradeMessage(
                error.response.data.detail
            );

            setIsUpgradeModalOpen(true);

            return;
        }

setError(
    error.response?.data?.detail ||
    "Failed to create price alert."
);

      } finally {

          setLoading(false);

      }

  };

  if (!transport) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Price Alert"
        maxWidth="max-w-[400px]">
        
        <div className="flex items-center gap-4 mb-6 bg-warning-bg p-4 rounded-xl border border-yellow-200">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-warning shadow-sm">
            <BellIcon size={20} />
          </div>
          <div>
              <h4 className="font-semibold text-text-dark">
                  {transport.company}
              </h4>

              <p className="text-xs text-text-light">
                  {transport.source} → {transport.destination}
              </p>

              <p className="text-xs text-text-lighter mt-1">
                  Departure: {transport.departure_date}
              </p>
          </div>
        </div>

        <div className="bg-bg-light p-4 rounded-xl border border-border-light mb-6">
          <p className="text-xs text-text-light mb-1">Current price</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-text-dark">AED</span>
            <span className="text-2xl font-bold text-text-dark">
              {new Intl.NumberFormat('en-US').format(transport.price)}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-medium mb-2">
              Alert me when price drops below
            </label>
            <Input
                className='pl-14'
                type="number"
                icon={
                    <span className="text-text-medium font-medium">
                        AED
                    </span>
                }
                placeholder={transport.price.toString()}
                value={targetPrice}
                onChange={(e) =>
                    setTargetPrice(e.target.value)
                }
            />
            {error && (
                <p className="text-sm text-red-500 mt-2">
                    {error}
                </p>
            )}
          </div>

          
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
          <Button
              fullWidth
              onClick={handleCreatePriceAlert}
              disabled={
                  loading ||
                  !targetPrice ||
                  Number(targetPrice) <= 0
              }
          >
              {loading
                  ? "Creating..."
                  : "Create Price Alert"}
          </Button>
          </div>
        </div>
      </Modal>
      <Modal
      isOpen={isUpgradeModalOpen}
      onClose={() => setIsUpgradeModalOpen(false)}
      title="Upgrade to Premium"
  >
      <div className="space-y-6">

          <p className="text-text-light">
              {upgradeMessage}
          </p>

          <div className="flex gap-3">

              <Button
                  variant="secondary"
                  fullWidth
                  onClick={() =>
                      setIsUpgradeModalOpen(false)
                  }
              >
                  Maybe Later
              </Button>

              <Button
                  fullWidth
                  onClick={() => navigate("/pricing")}
              >
                  Upgrade Now
              </Button>

          </div>

      </div>
  </Modal>
</>
  );

};