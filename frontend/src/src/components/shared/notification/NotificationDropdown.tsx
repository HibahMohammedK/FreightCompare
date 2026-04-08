import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationList } from './NotificationList';
interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  placement?: 'top' | 'bottom';
}
export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  placement = 'bottom'
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node))
      {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`absolute w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-border-light overflow-hidden z-50
          left-1/2 -translate-x-1/2
          ${placement === 'top'
            ? 'bottom-full mb-3 origin-bottom'
            : 'top-full mt-3 origin-top'
          }
        `}
      >
        {/* Pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-border-light rotate-45"></div>

        <NotificationList onItemClick={onClose} />
      </motion.div>
      }
    </AnimatePresence>);

};
