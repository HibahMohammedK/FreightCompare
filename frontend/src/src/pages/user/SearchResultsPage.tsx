import React, { useEffect, useState } from 'react';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { TransportCard } from '../../components/shared/TransportCard';
import { PriceAlertModal } from '../../components/shared/PriceAlertModal';
import { Button } from '../../components/shared/Button';
import {
  ArrowRightIcon,
  SearchIcon,
  FilterIcon,
  PlaneIcon,
  ShipIcon
} from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setFilters } from '../../redux/transportSlice';

import { getTransports } from '../../api/transport';
import { useLocation, useNavigate } from "react-router-dom";

export const SearchResultsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { filters } = useAppSelector((state) => state.transport);

  const [transports, setTransports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<any | null>(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const source = params.get("source") || "";
  const destination = params.get("destination") || "";
  const date = params.get("date") || "";

  // 🔥 Editable state
  const [searchSource, setSearchSource] = useState(source);
  const [searchDestination, setSearchDestination] = useState(destination);
  const [searchDate, setSearchDate] = useState(date);

  // 🔥 SEARCH ACTION
  const handleSearch = () => {
    const query = new URLSearchParams();

    if (searchSource.trim()) query.set("source", searchSource.trim());
    if (searchDestination.trim()) query.set("destination", searchDestination.trim());
    if (searchDate) query.set("date", searchDate);

    query.set("type", "all");

    navigate(`/search?${query.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getTransports();

        let data = res.data;

        // 🔍 SOURCE FILTER
        if (source) {
          data = data.filter((t: any) =>
            t.source.toLowerCase().includes(source.toLowerCase())
          );
        }

        // 🔍 DESTINATION FILTER
        if (destination) {
          data = data.filter((t: any) =>
            t.destination.toLowerCase().includes(destination.toLowerCase())
          );
        }

        // 🔥 DATE LOGIC (YOUR REQUIREMENT)
        const today = new Date().toISOString().split("T")[0];

        if (date) {
          data = data.filter((t: any) => t.departure_date === date);
        } else {
          data = data.filter((t: any) => t.departure_date >= today);
        }

        // ✅ MAP DATA
        const mapped = data.map((t: any) => ({
          id: t.id,
          name: t.company,
          origin: t.source,
          destination: t.destination,
          type: t.transport_type,
          price: Number(t.price),
          duration: t.duration,

          durationText: Math.ceil(t.duration / 24),
            // t.duration < 24
            //   ? `${t.duration} hrs`
            //   : `${Math.ceil(t.duration / 24)} days`,

          departureDate: t.departure_date,
        }));

        setTransports(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load transports");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  // 🔍 FILTER + SORT
  const filteredResults = transports
    .filter((carrier) => {
      if (filters.type !== 'all' && carrier.type !== filters.type) return false;
      if (carrier.price > filters.maxPrice) return false;
      if (carrier.duration > filters.maxDuration) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price') return a.price - b.price;
      if (filters.sortBy === 'duration') return a.duration - b.duration;
      return (
        new Date(a.departureDate).getTime() -
        new Date(b.departureDate).getTime()
      );
    });

  const handleTrack = (carrier: any) => {
    setSelectedCarrier(carrier);
    setIsAlertModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      {/* 🔥 TOP SEARCH BAR */}
      <div className="bg-white border-b border-border-light py-4 px-6 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex-1 flex items-center bg-white border border-border-light rounded-xl p-1 shadow-sm">

            <input
              value={searchSource}
              onChange={(e) => setSearchSource(e.target.value)}
              placeholder="Source"
              className="flex-1 px-3 text-sm outline-none"
            />

            <div className="px-2 text-text-lighter">
              <ArrowRightIcon size={16} />
            </div>

            <input
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              placeholder="Destination"
              className="flex-1 px-3 text-sm outline-none"
            />

            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="px-3 text-sm border-l"
            />

            <Button size="sm" className="ml-2" onClick={handleSearch}>
              <SearchIcon size={16} />
            </Button>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex gap-8">

        {/* SIDEBAR */}
        <div className="w-64 shrink-0">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-text-dark mb-1">
              {source || "All"} to {destination || "All"}
            </h1>
            <p className="text-sm text-text-light">
              {filteredResults.length} options found
            </p>
          </div>

          <div className="bg-white rounded-xl border border-border-light p-5 sticky top-40">
            <div className="flex items-center gap-2 mb-6 text-text-dark font-semibold text-sm">
              <FilterIcon size={16} /> Filters
            </div>

            <div className="space-y-6">

              {/* Transport Type */}
              <div>
                <label className="text-xs font-medium text-text-light block mb-3">
                  Transport Type
                </label>

                <div className="space-y-2">
                  <button
                    onClick={() => dispatch(setFilters({ type: 'all' }))}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      filters.type === 'all'
                        ? 'bg-primary-light text-primary-dark'
                        : 'bg-bg-light text-text-medium-light hover:bg-gray-100'
                    }`}
                  >
                    All Types
                  </button>

                  <button
                    onClick={() => dispatch(setFilters({ type: 'air' }))}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      filters.type === 'air'
                        ? 'bg-text-darker text-white'
                        : 'bg-bg-light text-text-medium-light hover:bg-gray-100'
                    }`}
                  >
                    <PlaneIcon size={16} /> Air Only
                  </button>

                  <button
                    onClick={() => dispatch(setFilters({ type: 'sea' }))}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      filters.type === 'sea'
                        ? 'bg-text-darker text-white'
                        : 'bg-bg-light text-text-medium-light hover:bg-gray-100'
                    }`}
                  >
                    <ShipIcon size={16} /> Sea Only
                  </button>
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="text-xs font-medium text-text-light block mb-3">
                  Max Price
                </label>

                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="100"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    dispatch(setFilters({ maxPrice: Number(e.target.value) }))
                  }
                  className="w-full accent-primary"
                />

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-text-light">$500</span>
                  <span className="text-xs font-semibold text-text-dark">
                    ${new Intl.NumberFormat('en-US').format(filters.maxPrice)}
                  </span>
                </div>
              </div>

              {/* Max Duration */}
              <div>
                <label className="text-xs font-medium text-text-light block mb-3">
                  Max Duration (days)
                </label>

                <input
                  type="range"
                  min="24"
                  max="720"
                  step="24"
                  value={filters.maxDuration}
                  onChange={(e) =>
                    dispatch(setFilters({ maxDuration: Number(e.target.value) }))
                  }
                  className="w-full accent-primary"
                />

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-text-light">1 day</span>
                  <span className="text-xs font-semibold text-text-dark">
                    {filters.maxDuration === 720
                      ? 'Any'
                      : `${filters.maxDuration / 24} days`}
                  </span>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-xs font-medium text-text-light block mb-3">
                  Sort By
                </label>

                <div className="space-y-2">
                  <button
                    onClick={() => dispatch(setFilters({ sortBy: 'price' }))}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      filters.sortBy === 'price'
                        ? 'bg-primary-light text-primary-dark'
                        : 'bg-bg-light text-text-medium-light hover:bg-gray-100'
                    }`}
                  >
                    Lowest Price
                  </button>

                  <button
                    onClick={() => dispatch(setFilters({ sortBy: 'duration' }))}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      filters.sortBy === 'duration'
                        ? 'bg-text-darker text-white'
                        : 'bg-bg-light text-text-medium-light hover:bg-gray-100'
                    }`}
                  >
                    Shortest Duration
                  </button>

                  <button
                    onClick={() => dispatch(setFilters({ sortBy: 'departure' }))}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      filters.sortBy === 'departure'
                        ? 'bg-text-darker text-white'
                        : 'bg-bg-light text-text-medium-light hover:bg-gray-100'
                    }`}
                  >
                    Earliest Departure
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="flex-1 space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && filteredResults.length > 0 ? (
            filteredResults.map((carrier) => (
              <TransportCard
                key={carrier.id}
                carrier={carrier}
                onTrack={() => handleTrack(carrier)}
              />
            ))
          ) : (
            !loading && (
              <div className="bg-white rounded-xl border p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  No options found
                </h3>
                <p className="text-sm text-text-light">
                  Try adjusting your filters.
                </p>
              </div>
            )
          )}
        </div>
      </div>

      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        carrier={selectedCarrier}
      />
    </div>
  );
};