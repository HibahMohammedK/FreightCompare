import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import {
  ArrowLeftRightIcon,
  ArrowLeftIcon,
  XIcon,
  TrophyIcon } from
'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import {
  toggleCompareItem,
  clearCompareItems } from'../../redux/transportSlice';
import { formatDuration } from '../../utils/formatters';


export const ComparePage: React.FC = () => {
  const compareItems = useAppSelector((state) => state.transport.compareItems);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasItems = compareItems.length > 0;
  // Find best values for highlighting
  const lowestPrice = hasItems ?
  Math.min(...compareItems.map((c) => c.price)) :
  0;
  const shortestDuration = hasItems ?
  Math.min(...compareItems.map((c) => c.duration)) :
  0;
  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-medium text-text-light hover:text-text-dark mb-4 transition-colors">
              
              <ArrowLeftIcon size={16} /> Back
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                <ArrowLeftRightIcon size={20} />
              </div>
              <h1 className="text-2xl font-bold text-text-dark">
                Compare Options
              </h1>
            </div>
            <p className="text-sm text-text-light">
              Comparing{' '}
              <span className="font-medium text-text-dark">
                {compareItems.length}
              </span>{' '}
              transport options
            </p>
          </div>

          {hasItems &&
          <Button
            variant="danger"
            icon={<XIcon size={16} />}
            onClick={() => dispatch(clearCompareItems())}
            className="bg-error-bg text-error border-red-200 hover:bg-red-100">
            
              Clear All
            </Button>
          }
        </div>

        {hasItems ?
        <div className="bg-white rounded-2xl border border-border-light overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-6 text-xs font-medium text-text-light w-48 border-b border-border-light">
                    Attribute
                  </th>
                  {compareItems.map((transport) =>
                <th
                  key={transport.id}
                  className="p-6 border-b border-border-light text-center relative">
                  
                      <button
                    onClick={() => dispatch(toggleCompareItem(transport))}
                    className="absolute top-4 right-4 w-6 h-6 rounded bg-bg-light flex items-center justify-center text-text-lighter hover:text-text-dark hover:bg-gray-200 transition-colors">
                    
                        <XIcon size={14} />
                      </button>
                      <div className="w-10 h-10 mx-auto rounded-lg mb-3 flex items-center justify-center font-bold text-lg bg-bg-light text-text-dark">
                        {transport.company.charAt(0).toUpperCase()}
                      </div>
                      <div className="font-semibold text-text-dark text-sm">
                        {transport.company}
                      </div>
                    </th>
                )}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="p-6 font-medium text-text-light border-b border-border-light">
                    Type
                  </td>
                  {compareItems.map((transport) =>
                <td
                  key={transport.id}
                  className="p-6 border-b border-border-light text-center">
                  
                      <Badge type={transport.transport_type} />
                    </td>
                )}
                </tr>
                <tr>
                  <td className="p-6 font-medium text-text-light border-b border-border-light">
                    Price
                  </td>
                  {compareItems.map((transport) => {
                  const isBest = transport.price === lowestPrice;
                  return (
                    <td
                      key={transport.id}
                      className={`p-6 border-b border-border-light text-center`}>
                      
                        <div
                        className={`inline-flex items-center justify-center gap-2 ${isBest ? 'text-success-dark font-bold' : 'text-text-dark font-semibold'}`}>
                        
                          {isBest &&
                        <TrophyIcon size={16} className="text-warning" />
                        }
                          <span className="text-lg">
                            $
                            {new Intl.NumberFormat('en-US').format(
                            transport.price
                          )}
                          </span>
                        </div>
                      </td>);

                })}
                </tr>
                <tr>
                  <td className="p-6 font-medium text-text-light border-b border-border-light">
                    Duration
                  </td>
                  {compareItems.map((transport) => {
                  const isBest = transport.duration === shortestDuration;
                  return (
                    <td
                      key={transport.id}
                      className="p-6 border-b border-border-light text-center"
                    >
                      <div
                        className={`inline-flex items-center justify-center gap-2 ${
                          isBest
                            ? "text-success-dark font-bold"
                            : "text-text-medium font-semibold"
                        }`}
                      >
                        {isBest && (
                          <TrophyIcon
                            size={16}
                            className="text-warning"
                          />
                        )}

                        {formatDuration(transport.duration)}
                      </div>
                    </td>
                    );
                })}
                </tr>
                <tr>
                  <td className="p-6 font-medium text-text-light border-b border-border-light">
                    Departure
                  </td>
                  {compareItems.map((transport) =>
                <td
                  key={transport.id}
                  className="p-6 border-b border-border-light text-center text-text-medium">
                  
                      {new Date(transport.departure_date).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }
                  )}
                    </td>
                )}
                </tr>
                <tr>
                  <td className="p-6 font-medium text-text-light border-b border-border-light">
                    Route
                  </td>
                  {compareItems.map((transport) =>
                <td
                  key={transport.id}
                  className="p-6 border-b border-border-light text-center text-text-medium">
                  
                      {transport.source} → {transport.destination}
                    </td>
                )}
                </tr>
                <tr>
                  <td className="p-6 font-medium text-text-light">Action</td>
                  {compareItems.map((transport) =>
                <td key={transport.id} className="p-6 text-center">
                      <Button size="sm" className="w-full max-w-[140px]">
                        Book Now
                      </Button>
                    </td>
                )}
                </tr>
              </tbody>
            </table>
          </div> :

        <div className="bg-white rounded-2xl border border-border-light p-16 flex flex-col items-center justify-center text-center mt-8">
            <div className="w-20 h-20 bg-bg-light rounded-full flex items-center justify-center text-border-dark mb-6">
              <ArrowLeftRightIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-dark mb-4">
              Nothing to compare
            </h3>
            <p className="text-sm text-text-light max-w-md leading-relaxed mb-8">
              You haven't selected any transport options to compare yet. Go back
              to your search results and click "Compare" on up to 4 options.
            </p>
            <Button onClick={() => navigate('/search')}>Go to Search</Button>
          </div>
        }
      </div>
    </div>);

};