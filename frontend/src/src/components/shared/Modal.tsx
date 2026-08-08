import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  headerAction?: React.ReactNode;
  disableClose?: boolean;
}
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  headerAction,
  
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]`}>
            
              {title &&
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
                  <h3 className="text-lg font-semibold text-text-dark">
                    {title}
                  </h3>
                  <div className="flex items-center gap-3">

                    {headerAction}

                    <button
                      onClick={onClose}
                      className="p-1 text-text-lighter hover:text-text-medium transition-colors rounded-lg hover:bg-bg-light"
                    >
                      <XIcon size={20} />
                    </button>

                  </div>
                </div>
            }
              <div className="p-6 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

};