import React from 'react';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  noPadding = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}
      {...props}>
      
      {children}
    </div>);

};