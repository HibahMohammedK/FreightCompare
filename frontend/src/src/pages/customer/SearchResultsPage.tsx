import React, { useEffect, useState } from 'react';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { TransportCard } from '../../components/shared/TransportCard';
import { PriceAlertModal } from '../../components/shared/price-alerts/PriceAlertModal';
import { Button } from '../../components/shared/Button';
import { AIRecommendation } from "../../types/ai";
import {
  ArrowLeftRightIcon,
  ArrowRightIcon,
  SearchIcon,
  FilterIcon,
  PlaneIcon,
  ShipIcon
} from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setFilters, setSearchResults, removeSavedRoute, addSavedRoute } from '../../redux/transportSlice';

import { getTransports, getLocations, saveSearchHistory } from '../../api/transport';
import { useLocation, useNavigate } from "react-router-dom";
import { saveTransport, unsaveTransport } from "../../api/saved";
import type { Transport } from '../../types/transport';
import { AITransportAssistantModal } from '../../components/shared/AITransportAssistantModal';

export const SearchResultsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { filters } = useAppSelector((state) => state.transport);
  const searchResults = useAppSelector(
    state => state.transport.searchResults
  );
  const savedRoutes = useAppSelector(
    state => state.transport.savedRoutes
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const source = params.get("source") || "";
  const destination = params.get("destination") || "";
  const date = params.get("date") || "";
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [searchTransportType, setSearchTransportType] = useState<
      "all" | "air" | "sea"
  >("all");
  
  useEffect(() => {

    const fetchLocations = async () => {

      try {

        const res =
          await getLocations();

        setLocations(
          res.data.locations || []
        );

      } catch (err) {

        console.error(
          "Failed to load locations",
          err
        );

      }

    };

    fetchLocations();

  }, []);
  

  const handleSaveToggle = async (transport: Transport) => {
    try {
      const saved = savedRoutes.find(
        (route) => route.id === transport.id
      );

      if (saved) {
        await unsaveTransport(saved.saved_id!);

        dispatch(removeSavedRoute(transport.id));
      } else {
        const res = await saveTransport(transport.id);

        dispatch(
          addSavedRoute({
            ...transport,
            saved_id: res.data.id,
          })
        );
      }
    } catch (err) {
      console.error("Save toggle failed", err);
    }
  };

  // 🔥 Editable state
  const [searchSource, setSearchSource] = useState(source);
  const [searchDestination, setSearchDestination] = useState(destination);
  const [searchDate, setSearchDate] = useState(date);
  const [locations, setLocations] = useState<string[]>([]);

  const [showSourceSuggestions, setShowSourceSuggestions] =
    useState(false);

  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  const filteredSources =
    locations.filter(location =>
      location
        .toLowerCase()
        .includes(
          searchSource.toLowerCase()
        )
    );

  const filteredDestinations =
    locations.filter(location =>
      location
        .toLowerCase()
        .includes(
          searchDestination.toLowerCase()
        )
    );

 const handleSearch = async (
    source = searchSource,
    destination = searchDestination,
    transportType = searchTransportType,
    date = searchDate
  ) => {
    const query = new URLSearchParams();

    if (source.trim()) {
      query.set("source", source.trim());
    }

    if (destination.trim()) {
      query.set("destination", destination.trim());
    }

    if (date) {
      query.set("date", date);
    }

    query.set("type", transportType);

    try {
      await saveSearchHistory({
        source: source.trim(),
        destination: destination.trim(),
        transport_type: transportType,
      });
    } catch (err) {
      console.error("Failed to save search history", err);
    }

    navigate(`/search?${query.toString()}`);
  };

  const handleAISearch = (
    recommendation: AIRecommendation,
    source: string,
    destination: string,
    transportType: "air" | "sea"
  ) => {
    setSearchSource(source);
    setSearchDestination(destination);
    setSearchTransportType(transportType);

    handleSearch(source, destination, transportType);
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

       dispatch(
          setSearchResults(
            data.map((t: any) => ({
              ...t,
              price: Number(t.price),
              duration: Number(t.duration),
            }))
          )
        );
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
  const filteredResults = searchResults
    .filter((transport) => {
      if (filters.type !== 'all' && transport.transport_type !== filters.type) return false;
      if (transport.price > filters.maxPrice) return false;
      if (transport.duration > filters.maxDuration) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price') return a.price - b.price;
      if (filters.sortBy === 'duration') return a.duration - b.duration;
      return (
        new Date(a.departure_date).getTime() -
        new Date(b.departure_date).getTime()
      );
    });

  const handleTrack = (transport: any) => {
    setSelectedTransport(transport);
    setIsAlertModalOpen(true);
  };

  const compareItems = useAppSelector(
    state => state.transport.compareItems
  );

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      {/* 🔥 TOP SEARCH BAR */}
      <div className="bg-white border-b border-border-light py-4 px-6 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex-1 flex items-center bg-white border border-border-light rounded-xl p-1 shadow-sm">

            <div className="flex-1 relative">

              <input
                value={searchSource}
                onChange={(e) => {
                  setSearchSource(
                    e.target.value
                  );
                  setShowSourceSuggestions(
                    true
                  );
                }}
                onFocus={() =>
                  setShowSourceSuggestions(
                    true
                  )
                }
                placeholder="Source"
                className="w-full px-3 text-sm outline-none"
              />

              {showSourceSuggestions &&
                searchSource &&
                filteredSources.length > 0 && (

                  <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-[9999] max-h-48 overflow-y-auto">

                    {filteredSources.map(
                      location => (

                        <button
                          key={location}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setSearchSource(
                              location
                            );
                            setShowSourceSuggestions(
                              false
                            );
                          }}
                        >
                          {location}
                        </button>

                      )
                    )}

                  </div>

              )}

            </div>

            <div className="px-2 text-text-lighter">
              <ArrowRightIcon size={16} />
            </div>

            <div className="flex-1 relative">

              <input
                value={searchDestination}
                onChange={(e) => {
                  setSearchDestination(
                    e.target.value
                  );
                  setShowDestinationSuggestions(
                    true
                  );
                }}
                onFocus={() =>
                  setShowDestinationSuggestions(
                    true
                  )
                }
                placeholder="Destination"
                className="w-full px-3 text-sm outline-none"
              />

              {showDestinationSuggestions &&
                searchDestination &&
                filteredDestinations.length > 0 && (

                  <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-[9999] max-h-48 overflow-y-auto">

                    {filteredDestinations.map(
                      location => (

                        <button
                          key={location}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setSearchDestination(
                              location
                            );
                            setShowDestinationSuggestions(
                              false
                            );
                          }}
                        >
                          {location}
                        </button>

                      )
                    )}

                  </div>

              )}

            </div>

            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="px-3 text-sm border-l"
            />

            <Button size="sm" className="ml-2" onClick={()=> handleSearch}>
              <SearchIcon size={16} />
            </Button>
            <Button
                size="sm"
                variant="outline"
                className="ml-2"
                onClick={() => setIsAIModalOpen(true)}
            >
                ✨ Ask AI
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
                  <span className="text-xs text-text-light">AED 500</span>
                  <span className="text-xs font-semibold text-text-dark">
                    AED {new Intl.NumberFormat('en-US').format(filters.maxPrice)}
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
            filteredResults.map((transport) => (
              <TransportCard
                  key={transport.id}
                  transport={transport}
                  isSaved={
                    savedRoutes.some(route => route.id === transport.id)
                  }
                  onSaveToggle={() => handleSaveToggle(transport)}
                  onTrack={() => handleTrack(transport)}
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

      {compareItems.length > 0 && (
        <button
          onClick={() => navigate("/compare")}
          className="fixed bottom-6 right-6 z-50 bg-primary text-white px-5 py-3 rounded-full shadow-lg hover:bg-primary-dark transition flex items-center gap-2"
        >
          <ArrowLeftRightIcon size={18} />
          Compare ({compareItems.length})
        </button>
      )}

      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        transport={selectedTransport}
      />
      <AITransportAssistantModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          initialSource={searchSource}
          initialDestination={searchDestination}
          initialTransportType={
              searchTransportType === "all"
                  ? "air"
                  : searchTransportType
          }
          actionLabel="Search Routes"
          onApply={handleAISearch}
      />
    </div>
  );
};