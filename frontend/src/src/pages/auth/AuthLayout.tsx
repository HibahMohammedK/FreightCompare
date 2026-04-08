import React from 'react';
import { ShipIcon, CheckCircle2Icon } from 'lucide-react';
import { motion } from 'framer-motion';
interface AuthLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  showSidebar = true
}) => {
  return (
    <div className="min-h-screen flex w-full bg-bg-dark">
      {showSidebar &&
      <div className="hidden lg:flex w-[432px] bg-primary flex-col justify-between p-8 relative overflow-hidden shrink-0">
          {/* Decorative Circles */}
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"/>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary">
                <ShipIcon size={20} />
              </div>
              <span className="font-bold text-white text-lg">
                FreightCompare
              </span>
            </div>

            <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.2
            }}>
            
              <h1 className="text-[32px] font-bold text-white leading-tight mb-4">
                Find the best
                <br />
                freight rates
                <br />
                in seconds.
              </h1>
              <p className="text-primary-lighter text-sm max-w-[280px] leading-relaxed">
                Compare air and sea transport options from top carriers
                worldwide.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-light rounded-full" />
              <span className="text-xs text-primary-lighter">
                200+ carriers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-light rounded-full" />
              <span className="text-xs text-primary-lighter">
                Real-time pricing
              </span>
            </div>
          </div>
        </div>
      }

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          className="w-full max-w-[400px]">
          
          {children}
        </motion.div>
      </div>
    </div>);

};
