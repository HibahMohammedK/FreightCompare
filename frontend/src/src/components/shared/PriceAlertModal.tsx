import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { BellIcon } from 'lucide-react';
import { Carrier } from '../../utils/mockData';
interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrier: Carrier | null;
}
export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  carrier
}) => {
  const [threshold, setThreshold] = useState('');
  const [enabled, setEnabled] = useState(true);
  if (!carrier) return null;
  const defaultThreshold = Math.floor(carrier.price * 0.9);
  return (
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
          <h4 className="font-semibold text-text-dark">{carrier.name}</h4>
          <p className="text-xs text-text-light">
            {carrier.origin} → {carrier.destination}
          </p>
        </div>
      </div>

      <div className="bg-bg-light p-4 rounded-xl border border-border-light mb-6">
        <p className="text-xs text-text-light mb-1">Current price</p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-text-dark">$</span>
          <span className="text-2xl font-bold text-text-dark">
            {new Intl.NumberFormat('en-US').format(carrier.price)}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-medium mb-2">
            Alert me when price drops below
          </label>
          <Input
            type="number"
            icon={<span className="text-text-medium font-medium">$</span>}
            placeholder={defaultThreshold.toString()}
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)} />
          
          <p className="text-xs text-text-lighter mt-2">
            10% below current price
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-bg-light rounded-xl border border-border-light">
          <span className="text-sm font-medium text-text-medium">
            Enable notifications
          </span>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-border-dark'}`}>
            
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={onClose}>
            Set Alert
          </Button>
        </div>
      </div>
    </Modal>);

};