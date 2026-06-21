import React, { useState,useEffect } from 'react';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { TransportCard } from '../../components/shared/TransportCard';
import { PriceAlertModal } from '../../components/shared/PriceAlertModal';
import { BookmarkIcon } from 'lucide-react';
import { getSavedTransports, unsaveTransport } from '../../api/saved';

import { Carrier } from '../../utils/mockData';
export const SavedPage: React.FC = () => {
  const [savedRoutes, setSavedRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const handleTrack = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setIsAlertModalOpen(true);
  };

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);

        const res = await getSavedTransports();

        const mapped = res.data.map((item: any) => ({
          id: item.transport_details.id,
          name: item.transport_details.company,
          type: item.transport_details.transport_type,
          price: Number(item.transport_details.price),
          durationText: Math.ceil(item.transport_details.duration / 24),
          departureDate: item.transport_details.departure_date,
          origin: item.transport_details.source,
          destination: item.transport_details.destination,

          savedId: item.id // 🔥 IMPORTANT for delete
        }));

        setSavedRoutes(mapped);
      } catch (err) {
        console.error("Failed to fetch saved transports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  const handleUnsave = async (carrier: any) => {
    try {
      await unsaveTransport(carrier.savedId);

      setSavedRoutes((prev) =>
        prev.filter((item) => item.savedId !== carrier.savedId)
      );
    } catch (err) {
      console.error("Unsave failed", err);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex flex-col">
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center text-sm text-text-light">
          Loading saved routes...
        </div>
      </div>
    );
  }
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
            onTrack={() => handleTrack(carrier)}
            isSaved={true} // always true here
            onSaveToggle={() => handleUnsave(carrier)}
             />
            
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
