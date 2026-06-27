import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import {
  ClockIcon,
  ArrowRightIcon,
  ShipIcon,
  PlaneIcon,
  SearchIcon,
  XIcon,
 } from
'lucide-react';
import { getSearchHistory,deleteSearchHistory, clearSearchHistory } from "../../api/transport";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setSearchHistory,
  removeSearchHistory,
  clearSearchHistory as clearSearchHistoryState,
} from "../../redux/transportSlice";
import type { SearchHistory } from "../../types/searchHistory";

export const HistoryPage: React.FC = () => {
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const searchHistory = useAppSelector(
    (state) => state.transport.searchHistory
  );

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getSearchHistory();
        dispatch(setSearchHistory(res.data));
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);
  

  // Group history by date
  const groupedHistory = searchHistory.reduce(
    (acc, curr) => {
      const date = new Date(curr.searched_at).toLocaleDateString();

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(curr);

      return acc;
    },
    {} as Record<string, SearchHistory[]>
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteSearchHistory(id);

      dispatch(removeSearchHistory(id));
    } catch (err) {
      console.error("Failed to delete history", err);
    }
  };

  const handleClearHistory = async () => {
      await clearSearchHistory();
      dispatch(clearSearchHistoryState());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        Loading search history...
      </div>
    );
  }

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

        {searchHistory.length === 0 && (
          <Card className="p-10 text-center">
            <ClockIcon
              size={36}
              className="mx-auto mb-4 text-text-light"
            />

            <h3 className="text-lg font-semibold">
              No search history yet
            </h3>

            <p className="text-sm text-text-light mt-2">
              Your recent searches will appear here.
            </p>
          </Card>
        )}

        <div className="space-y-8">
          {searchHistory.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="
              text-sm
              font-medium
              text-red-600
              hover:text-red-700
            "
          >
            Clear all
          </button>)}
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
                          {item.transport_type === 'air' ?
                      <PlaneIcon size={20} /> :
                      item.transport_type === 'sea' ?
                      <ShipIcon size={20} /> :

                      <SearchIcon size={20} />
                      }
                        </div>
                        <div>
                          <div className="flex items-center gap-3 font-semibold text-text-dark mb-2">
                            <span className="text-base">{item.source}</span>
                            <ArrowRightIcon
                          size={16}
                          className="text-text-lighter" />
                        
                            <span className="text-base">
                              {item.destination}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-text-light">
                            <div className="w-1 h-1 rounded-full bg-border-dark" />
                            <span className="capitalize">
                              {item.transport_type}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-border-dark" />
                            <span>
                              {new Date(item.searched_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            navigate(
                              `/search?source=${encodeURIComponent(item.source)}&destination=${encodeURIComponent(item.destination)}&type=${item.transport_type}`
                            )
                          }
                        >
                          Search Again
                        </Button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="
                            p-2
                            rounded-full
                            text-text-light
                            hover:bg-red-50
                            hover:text-red-600
                            transition-colors
                          "
                          title="Delete search"
                        >
                          <XIcon size={18} />
                        </button>
                      </div>
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