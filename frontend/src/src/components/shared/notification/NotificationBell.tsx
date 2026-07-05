import React, { useEffect, useState } from "react";
import { motion, useAnimationControls, } from "framer-motion";
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
  const controls = useAnimationControls();
  const latestNotification = useAppSelector(
      (state) => state.notification.latestNotification
  );
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);

  useEffect(() => {

      if (!latestNotification) {
          return;
      }

      controls.start({
          rotate: [
              0,
              -18,
              18,
              -14,
              14,
              -8,
              8,
              0,
          ],
          scale: [
              1,
              1.08,
              1.08,
              1,
          ],
          transition: {
              duration: 0.6,
          },
      });

  }, [latestNotification, controls]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center text-text-medium-light hover:bg-bg-light hover:text-text-dark transition-colors relative">
        
        <motion.div animate={controls}>
            <BellIcon size={20} />
        </motion.div>
        
        {unreadCount > 0 &&
        <span className="absolute top-2 right-2 w-4 h-4 bg-primary-dark text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
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

