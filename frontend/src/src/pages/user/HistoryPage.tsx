import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import {
  ClockIcon,
  ArrowRightIcon,
  ShipIcon,
  PlaneIcon,
  SearchIcon } from
'lucide-react';
import { useAppSelector } from '../../hooks/redux';
export const HistoryPage: React.FC = () => {
  const searchHistory = useAppSelector((state) => state.transport.searchHistory);
  const navigate = useNavigate();
  // Group history by date
  const groupedHistory = searchHistory.reduce(
    (acc, curr) => {
      if (!acc[curr.searchDate]) {
        acc[curr.searchDate] = [];
      }
      acc[curr.searchDate].push(curr);
      return acc;
    },
    {} as Record<string, typeof searchHistory>
  );
  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      <div className="max-w-4xl mx-auto w-full px-6 py-8 flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <ClockIcon size={20} />
            </div>
            <h1 className="text-2xl font-bold text-text-dark">
              Search History
            </h1>
          </div>
          <p className="text-sm text-text-light">
            View and rerun your past searches
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedHistory).map(([date, items]) =>
          <div key={date}>
              <h3 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-4 ml-2">
                {date}
              </h3>
              <div className="space-y-4">
                {items.map((item) =>
              <Card key={item.id} className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-full bg-bg-light flex items-center justify-center text-text-medium shrink-0">
                          {item.transportType === 'air' ?
                      <PlaneIcon size={20} /> :
                      item.transportType === 'sea' ?
                      <ShipIcon size={20} /> :

                      <SearchIcon size={20} />
                      }
                        </div>
                        <div>
                          <div className="flex items-center gap-3 font-semibold text-text-dark mb-2">
                            <span className="text-base">{item.origin}</span>
                            <ArrowRightIcon
                          size={16}
                          className="text-text-lighter" />
                        
                            <span className="text-base">
                              {item.destination}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-text-light">
                            <span>{item.date}</span>
                            <div className="w-1 h-1 rounded-full bg-border-dark" />
                            <span className="capitalize">
                              {item.transportType}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-border-dark" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                    variant="secondary"
                    onClick={() => navigate('/search')}
                    className="bg-primary-light text-primary-dark border-none hover:bg-primary-lighter w-full sm:w-auto">
                    
                        Search Again
                      </Button>
                    </div>
                  </Card>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

};