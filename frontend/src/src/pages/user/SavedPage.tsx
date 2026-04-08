import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { TransportCard } from '../../components/shared/TransportCard';
import { PriceAlertModal } from '../../components/shared/PriceAlertModal';
import { BookmarkIcon } from 'lucide-react';
import { useAppSelector } from '../../hooks/redux';
import { Carrier } from '../../utils/mockData';
export const SavedPage: React.FC = () => {
  const savedRoutes = useAppSelector((state) => state.transport.savedRoutes);
  const navigate = useNavigate();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const handleTrack = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setIsAlertModalOpen(true);
  };
  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-error-bg text-error flex items-center justify-center">
              <BookmarkIcon size={20} />
            </div>
            <h1 className="text-2xl font-bold text-text-dark">Saved Routes</h1>
          </div>
          <p className="text-sm text-text-light">
            You have{' '}
            <span className="font-medium text-text-dark">
              {savedRoutes.length}
            </span>{' '}
            saved items
          </p>
        </div>

        {savedRoutes.length > 0 ?
        <div className="grid lg:grid-cols-2 gap-6">
            {savedRoutes.map((carrier) =>
          <TransportCard
            key={carrier.id}
            carrier={carrier}
            onTrack={() => handleTrack(carrier)} />
          )}
          </div> :

        <div className="bg-white rounded-2xl border border-border-light p-16 flex flex-col items-center justify-center text-center mt-8">
            <div className="w-20 h-20 bg-bg-light rounded-full flex items-center justify-center text-border-dark mb-6">
              <BookmarkIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-dark mb-4">
              No saved routes
            </h3>
            <p className="text-sm text-text-light max-w-md leading-relaxed">
              You haven't saved any transport options yet. Click the heart icon
              or "Save" button on any search result to save it for later.
            </p>
          </div>
        }
      </div>

      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        carrier={selectedCarrier} />
    </div>);

};
