import React, { useState } from 'react';
import { BellIcon } from 'lucide-react';
import { useAppSelector } from '../../../hooks/redux';
import { NotificationDropdown } from './NotificationDropdown';
interface NotificationBellProps {
  placement?: 'top' | 'bottom';
}
export const NotificationBell: React.FC<NotificationBellProps> = ({
  placement = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center text-text-medium-light hover:bg-bg-light hover:text-text-dark transition-colors relative">
        
        <BellIcon size={20} />
        {unreadCount > 0 &&
        <span className="absolute top-2 right-2 w-4 h-4 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        }
      </button>

      <NotificationDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement={placement} />
    </div>);

};
