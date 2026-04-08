import React from 'react';
import { Carrier } from '../../utils/mockData';
import {
  PlaneTakeoffIcon,
  ShipIcon,
  HeartIcon,
  BellIcon,
  ArrowUpRightIcon,
  GitCompareArrowsIcon,
  ArrowRightIcon,
  ClockIcon,
  CalendarIcon } from
'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleSavedRoute, toggleCompareItem } from '../../redux/transportSlice';
interface TransportCardProps {
  carrier: Carrier;
  onBook?: () => void;
  onTrack?: () => void;
  index?: number;
}
export const TransportCard: React.FC<TransportCardProps> = ({
  carrier,
  onBook,
  onTrack,
  index = 0
}) => {
  const dispatch = useAppDispatch();
  const savedRoutes = useAppSelector((state) => state.transport.savedRoutes);
  const compareItems = useAppSelector((state) => state.transport.compareItems);
  const isSaved = savedRoutes.some((r) => r.id === carrier.id);
  const isComparing = compareItems.some((c) => c.id === carrier.id);
  const isAir = carrier.type === 'air';
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };
  return (
    <article
      className="bg-white rounded-[28px] border border-slate-100 overflow-hidden shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(15,23,42,0.08)]"
      style={{
        animationDelay: `${index * 60}ms`
      }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isAir ? 'bg-sky-50 text-sky-600' : 'bg-teal-50 text-teal-700'}`}>
              {isAir ?
              <PlaneTakeoffIcon size={24} strokeWidth={2.2} /> :
              <ShipIcon size={24} strokeWidth={2.2} />
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-[15px] font-bold text-slate-900 truncate">
                  {carrier.name}
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${isAir ? 'bg-sky-50 text-sky-700' : 'bg-teal-50 text-teal-700'}`}>
                  {carrier.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{carrier.origin}</span>
                <ArrowRightIcon size={14} />
                <span>{carrier.destination}</span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-[17px] font-bold text-slate-900">$</span>
              <span className="text-[20px] font-bold text-slate-900">
                {formatPrice(carrier.price)}
              </span>
            </div>
            <span className="mt-1 block text-[11px] text-slate-400 uppercase tracking-[0.18em]">
              {carrier.currency}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-8 mt-6 text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <ClockIcon size={18} className="text-slate-400" />
            <span className="font-semibold text-slate-700">
              {carrier.durationDays} days
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <CalendarIcon size={18} className="text-slate-400" />
            <span className="font-semibold text-slate-700">
              {new Date(carrier.departureDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => dispatch(toggleCompareItem(carrier))}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${isComparing ? 'border-primary/20 bg-primary-light text-primary-dark' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
            <GitCompareArrowsIcon size={16} />
            {isComparing ? 'Comparing' : 'Compare'}
          </button>
          <button
            type="button"
            onClick={() => dispatch(toggleSavedRoute(carrier))}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${isSaved ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
            <HeartIcon size={16} className={isSaved ? 'fill-current' : ''} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onTrack}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
            <BellIcon size={16} />
            Track
          </button>
          <div className="ml-auto">
            <button
              type="button"
              onClick={onBook}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
              Book Now
              <ArrowUpRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>);

};
