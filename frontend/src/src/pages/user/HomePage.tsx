import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Card } from '../../components/shared/Card';
import {
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowRightIcon,
  ShipIcon,
  PlaneIcon,
  TrendingDownIcon,
  ZapIcon,
  ClockIcon,
  BookmarkIcon,
  CreditCardIcon,
  MessageSquareIcon,
  ShieldCheckIcon } from
'lucide-react';
import { useAppSelector } from '../../hooks/redux';
import { motion } from 'framer-motion';
export const HomePage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const searchHistory = useAppSelector((state) => state.transport.searchHistory);
  const savedRoutes = useAppSelector((state) => state.transport.savedRoutes);
  const navigate = useNavigate();
  const [transportType, setTransportType] = useState<'all' | 'air' | 'sea'>(
    'all'
  );
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();

    queryParams.set("source", origin.trim());
    queryParams.set("destination", destination.trim());

    if (date) {
      queryParams.set("date", date);  // ✅ optional
    }

    queryParams.set("type", transportType);

    navigate(`/search?${queryParams.toString()}`);
  };
  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      {/* Hero Section */}
      <div className="bg-primary-dark pt-12 pb-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="mb-8">
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user?.username}
            </h1>
            <p className="text-primary-lighter text-lg">
              Find and compare the best air and sea freight options.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4 min-w-[240px]">
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center text-white">
                <TrendingDownIcon size={20} />
              </div>
              <div>
                <p className="text-primary-lighter text-xs font-medium">
                  Cheapest Route
                </p>
                <p className="text-white font-semibold text-sm">
                  Shanghai → Rotterdam (Sea)
                </p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4 min-w-[240px]">
              <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center text-white">
                <ZapIcon size={20} />
              </div>
              <div>
                <p className="text-primary-lighter text-xs font-medium">
                  Fastest Route
                </p>
                <p className="text-white font-semibold text-sm">
                  LA → Tokyo (Air)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-6 -mt-24 relative z-20 flex-1 pb-12">
        {/* Search Form */}
        <Card className="mb-12 shadow-card border-border-light">
          {/* Transport Type Tabs */}
          <div className="flex p-1 bg-bg-light rounded-xl w-fit mb-6 border border-border-light">
            <button
              onClick={() => setTransportType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${transportType === 'all' ? 'bg-white text-primary shadow-sm' : 'text-text-medium-light hover:text-text-dark'}`}>
              
              All
            </button>
            <button
              onClick={() => setTransportType('air')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${transportType === 'air' ? 'bg-text-darker text-white shadow-sm' : 'text-text-medium-light hover:text-text-dark'}`}>
              
              <PlaneIcon size={16} /> Air
            </button>
            <button
              onClick={() => setTransportType('sea')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${transportType === 'sea' ? 'bg-text-darker text-white shadow-sm' : 'text-text-medium-light hover:text-text-dark'}`}>
              
              <ShipIcon size={16} /> Sea
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 items-end">
            
            <div className="flex-1 w-full relative">
              <Input
                label="Origin"
                placeholder="City or port"
                icon={<MapPinIcon size={18} />}
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
              
            </div>

            <div className="hidden md:flex w-10 h-10 rounded-xl bg-bg-light border border-border-light items-center justify-center text-text-lighter shrink-0 mb-1">
              <ArrowRightIcon size={18} />
            </div>

            <div className="flex-1 w-full">
              <Input
                label="Destination"
                placeholder="City or port"
                icon={<MapPinIcon size={18} />}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
              
            </div>

            <div className="flex-1 w-full">
              <Input
                label="Date"
                type="date"
                icon={<CalendarIcon size={18} />}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              
            </div>

            <Button
              type="submit"
              size="lg"
              icon={<SearchIcon size={18} />}
              className="w-full md:w-auto shrink-0 mb-1">
              
              Search
            </Button>
          </form>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Searches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
                <ClockIcon size={20} className="text-primary" />
                Recent Searches
              </h2>
              <button
                onClick={() => navigate('/history')}
                className="text-sm font-medium text-primary hover:underline">
                
                View all
              </button>
            </div>

            <div className="space-y-3">
              {searchHistory.slice(0, 3).map((history) =>
              <Card
                key={history.id}
                className="p-4 hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate('/search')}>
                
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-bg-light flex items-center justify-center text-text-darker">
                        {history.transportType === 'air' ?
                      <PlaneIcon size={18} /> :
                      history.transportType === 'sea' ?
                      <ShipIcon size={18} /> :

                      <SearchIcon size={18} />
                      }
                      </div>
                      <div>
                        <div className="flex items-center gap-2 font-semibold text-sm text-text-dark mb-1">
                          <span>{history.origin}</span>
                          <ArrowRightIcon
                          size={14}
                          className="text-text-lighter" />
                        
                          <span>{history.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-light">
                          <span>{history.date}</span>
                          <span>•</span>
                          <span className="capitalize">
                            {history.transportType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Saved Routes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
                <BookmarkIcon size={20} className="text-primary" />
                Saved Routes
              </h2>
              <button
                onClick={() => navigate('/saved')}
                className="text-sm font-medium text-primary hover:underline">
                
                View all
              </button>
            </div>

            {savedRoutes.length > 0 ?
            <div className="space-y-3">
                {savedRoutes.slice(0, 3).map((route) =>
              <Card
                key={route.id}
                className="p-4 hover:border-primary transition-colors cursor-pointer">
                
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${route.type === 'air' ? 'bg-air-bg text-air-border' : 'bg-sea-bg text-sea-border'}`}>
                      
                          {route.type === 'air' ?
                      <PlaneIcon size={18} /> :

                      <ShipIcon size={18} />
                      }
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-text-dark mb-1">
                            {route.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text-light">
                            <span>{route.origin}</span>
                            <ArrowRightIcon size={12} />
                            <span>{route.destination}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-text-dark">
                          ${new Intl.NumberFormat('en-US').format(route.price)}
                        </div>
                        <div className="text-[10px] text-text-lighter uppercase">
                          {route.currency}
                        </div>
                      </div>
                    </div>
                  </Card>
              )}
              </div> :

            <Card className="p-8 flex flex-col items-center justify-center text-center h-[280px]">
                <div className="w-12 h-12 bg-bg-light rounded-full flex items-center justify-center text-text-lighter mb-4">
                  <BookmarkIcon size={24} />
                </div>
                <p className="text-sm text-text-light max-w-[200px]">
                  Save routes to track prices and compare later.
                </p>
              </Card>
            }
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-10">
          <Card className="p-6 border-border-light">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4">
                  <CreditCardIcon size={22} />
                </div>
                <h2 className="text-xl font-bold text-text-dark mb-2">
                  Subscription
                </h2>
                <p className="text-sm text-text-light max-w-md">
                  {user?.isPremium ?
                  'Your premium access is active. Review benefits, billing, and plan details.' :
                  'Unlock premium support, direct chat, and advanced tools from your account area.'}
                </p>
              </div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${user?.isPremium ? 'bg-success-bg text-success-dark' : 'bg-bg-light text-text-medium'}`}>
                <ShieldCheckIcon size={14} />
                {user?.isPremium ? 'Premium Active' : 'Basic Plan'}
              </span>
            </div>
            <Button onClick={() => navigate('/pricing')}>
              {user?.isPremium ? 'Manage Subscription' : 'View Plans'}
            </Button>
          </Card>

          <Card className="p-6 border-border-light">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-bg-light flex items-center justify-center text-text-darker mb-4">
                  <MessageSquareIcon size={22} />
                </div>
                <h2 className="text-xl font-bold text-text-dark mb-2">
                  Support Chat
                </h2>
                <p className="text-sm text-text-light max-w-md">
                  {user?.isPremium ?
                  'Open the live chat workspace and talk directly with a support agent.' :
                  'Live chat is part of Premium. You can still open the chat page and upgrade when you are ready.'}
                </p>
              </div>
            </div>
            <Button
              variant={user?.isPremium ? 'primary' : 'outline'}
              onClick={() => navigate('/chat')}>
              {user?.isPremium ? 'Open Chat' : 'See Chat Access'}
            </Button>
          </Card>
        </div>
      </div>
    </div>);

};
