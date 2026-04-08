import React from 'react';
interface BadgeProps {
  type: 'air' | 'sea';
  className?: string;
}
export const Badge: React.FC<BadgeProps> = ({ type, className = '' }) => {
  const isAir = type === 'air';
  return (
    <span
      className={`
      inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
      ${isAir ? 'bg-air-bg text-air-text' : 'bg-sea-bg text-sea-text'}
      ${className}
    `}>
      
      {type}
    </span>);

};