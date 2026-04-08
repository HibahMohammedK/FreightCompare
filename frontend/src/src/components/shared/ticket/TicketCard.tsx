import React from 'react';
import { Ticket } from '../../../utils/mockData';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquareIcon, ClockIcon } from 'lucide-react';
interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
  isActive?: boolean;
}
export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onClick,
  isActive = false
}) => {
  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-error-bg text-error border-red-200';
      case 'in-progress':
        return 'bg-warning-bg text-warning border-yellow-200';
      case 'resolved':
        return 'bg-success-bg text-success-dark border-green-200';
      case 'closed':
        return 'bg-bg-light text-text-medium border-border-light';
      default:
        return 'bg-bg-light text-text-medium border-border-light';
    }
  };
  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-error';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-primary';
      case 'low':
        return 'text-text-medium';
      default:
        return 'text-text-medium';
    }
  };
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-xl cursor-pointer transition-all ${isActive ? 'border-primary bg-primary-light/10 shadow-sm' : 'border-border-light bg-white hover:border-primary/50 hover:shadow-sm'}`}>
      
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-text-light">
          #{ticket.id.toUpperCase()}
        </span>
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusColor(ticket.status)}`}>
          
          {ticket.status.replace('-', ' ')}
        </span>
      </div>

      <h4 className="font-semibold text-text-dark text-sm mb-1 line-clamp-1">
        {ticket.subject}
      </h4>
      <p className="text-xs text-text-medium line-clamp-2 mb-4">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between text-xs text-text-light">
        <div className="flex items-center gap-3">
          <span
            className={`font-medium capitalize flex items-center gap-1 ${getPriorityColor(ticket.priority)}`}>
            
            <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
            {ticket.priority}
          </span>
          <div className="flex items-center gap-1">
            <MessageSquareIcon size={12} />
            <span>{ticket.messages.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon size={12} />
          <span>
            {formatDistanceToNow(new Date(ticket.updatedAt), {
              addSuffix: true
            })}
          </span>
        </div>
      </div>
    </div>);

};