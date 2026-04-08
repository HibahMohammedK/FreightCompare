import React, { useState } from 'react';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { TransportCard } from '../../components/shared/TransportCard';
import { PriceAlertModal } from '../../components/shared/PriceAlertModal';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import {
  ArrowRightIcon,
  SearchIcon,
  FilterIcon,
  PlaneIcon,
  ShipIcon } from
'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setFilters } from '../../redux/transportSlice';
import { Carrier } from '../../utils/mockData';
export const SearchResultsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchResults, filters } = useAppSelector((state) => state.transport);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  // Apply filters
  const filteredResults = searchResults.
  filter((carrier) => {
    if (filters.type !== 'all' && carrier.type !== filters.type) return false;
    if (carrier.price > filters.maxPrice) return false;
    if (carrier.durationDays * 24 > filters.maxDuration) return false;
    return true;
  }).
  sort((a, b) => {
    if (filters.sortBy === 'price') return a.price - b.price;
    if (filters.sortBy === 'duration') return a.durationDays - b.durationDays;
    return (
      new Date(a.departureDate).getTime() -
      new Date(b.departureDate).getTime());

  });
  const handleTrack = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setIsAlertModalOpen(true);
  };
  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      {/* Top Search Bar */}
      <div className="bg-white border-b border-border-light py-4 px-6 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex-1 flex items-center bg-white border border-border-light rounded-xl p-1 shadow-sm">
            <div className="flex-1 flex items-center px-3 border-r border-border-light">
              <span className="text-sm font-medium text-text-darker">
                Shanghai
              </span>
            </div>
            <div className="px-3 text-text-lighter">
              <ArrowRightIcon size={16} />
            </div>
            <div className="flex-1 flex items-center px-3">
              <span className="text-sm font-medium text-text-darker">
                Rotterdam
              </span>
            </div>
            <Button size="sm" className="ml-2">
              <SearchIcon size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-text-dark mb-1">
              Shanghai to Rotterdam
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
                    onClick={() =>
                    dispatch(
                      setFilters({
                        type: 'all'
                      })
                    )
                    }
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${filters.type === 'all' ? 'bg-primary-light text-primary-dark' : 'bg-bg-light text-text-medium-light hover:bg-gray-100'}`}>
                    
                    All Types
                  </button>
                  <button
                    onClick={() =>
                    dispatch(
                      setFilters({
                        type: 'air'
                      })
                    )
                    }
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${filters.type === 'air' ? 'bg-text-darker text-white' : 'bg-bg-light text-text-medium-light hover:bg-gray-100'}`}>
                    
                    <PlaneIcon size={16} /> Air Only
                  </button>
                  <button
                    onClick={() =>
                    dispatch(
                      setFilters({
                        type: 'sea'
                      })
                    )
                    }
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${filters.type === 'sea' ? 'bg-text-darker text-white' : 'bg-bg-light text-text-medium-light hover:bg-gray-100'}`}>
                    
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
                  dispatch(
                    setFilters({
                      maxPrice: Number(e.target.value)
                    })
                  )
                  }
                  className="w-full accent-primary" />
                
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
                  Max Duration (hours)
                </label>
                <input
                  type="range"
                  min="24"
                  max="720"
                  step="24"
                  value={filters.maxDuration}
                  onChange={(e) =>
                  dispatch(
                    setFilters({
                      maxDuration: Number(e.target.value)
                    })
                  )
                  }
                  className="w-full accent-primary" />
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-text-light">1 day</span>
                  <span className="text-xs font-semibold text-text-dark">
                    {filters.maxDuration === 720 ?
                    'Any' :
                    `${filters.maxDuration / 24} days`}
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
                    onClick={() =>
                    dispatch(
                      setFilters({
                        sortBy: 'price'
                      })
                    )
                    }
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${filters.sortBy === 'price' ? 'bg-primary-light text-primary-dark' : 'bg-bg-light text-text-medium-light hover:bg-gray-100'}`}>
                    
                    Lowest Price
                  </button>
                  <button
                    onClick={() =>
                    dispatch(
                      setFilters({
                        sortBy: 'duration'
                      })
                    )
                    }
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${filters.sortBy === 'duration' ? 'bg-text-darker text-white' : 'bg-bg-light text-text-medium-light hover:bg-gray-100'}`}>
                    
                    Shortest Duration
                  </button>
                  <button
                    onClick={() =>
                    dispatch(
                      setFilters({
                        sortBy: 'departure'
                      })
                    )
                    }
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${filters.sortBy === 'departure' ? 'bg-text-darker text-white' : 'bg-bg-light text-text-medium-light hover:bg-gray-100'}`}>
                    
                    Earliest Departure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 space-y-4">
          {filteredResults.length > 0 ?
          filteredResults.map((carrier) =>
          <TransportCard
            key={carrier.id}
            carrier={carrier}
            onTrack={() => handleTrack(carrier)} />

          ) :

          <div className="bg-white rounded-xl border border-border-light p-12 text-center">
              <h3 className="text-lg font-semibold text-text-dark mb-2">
                No options found
              </h3>
              <p className="text-sm text-text-light">
                Try adjusting your filters to see more results.
              </p>
              <Button
              variant="outline"
              className="mt-6"
              onClick={() =>
              dispatch(
                setFilters({
                  type: 'all',
                  maxPrice: 20000,
                  maxDuration: 720
                })
              )
              }>
              
                Clear Filters
              </Button>
            </div>
          }
        </div>
      </div>

      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        carrier={selectedCarrier} />
      
    </div>);

};
