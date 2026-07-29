import React, { useEffect, useState, useRef } from 'react';
import type { TicketDetail } from "../../../types/ticket";
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { updateTicket } from "../../../redux/ticketSlice";
import { Button } from '../Button';
import { format } from 'date-fns';
import { SendIcon, UserIcon, ShieldIcon, CheckCircleIcon } from 'lucide-react';
import { toast } from "sonner";


interface TicketDetailsProps {
  ticket: TicketDetail | null;
  role: "admin" | "staff" | "customer";
}
export const TicketDetails: React.FC<TicketDetailsProps> = ({
  ticket,
  role
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [reply, setReply] = useState('');
  // const messagesEndRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({
  //     behavior: 'smooth'
  //   });
  // }, [ticket?.messages]);
  if (!ticket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-light p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-text-lighter mb-4 shadow-sm">
          <ShieldIcon size={32} />
        </div>
        <h3 className="text-lg font-semibold text-text-dark mb-2">
          Select a Ticket
        </h3>
        <p className="text-sm text-text-light max-w-sm">
          Choose a ticket from the list to view details and respond.
        </p>
      </div>);

  }
  // const handleReply = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!reply.trim() || !currentUser) return;
  //   dispatch(
  //     addTicketMessage({
  //       ticketId: ticket.id,
  //       role: currentUser.role,
  //       message: {
  //         id: `tm-${Date.now()}`,
  //         senderId: currentUser.id,
  //         senderName: currentUser.name,
  //         senderRole: currentUser.role,
  //         content: reply.trim(),
  //         createdAt: new Date().toISOString()
  //       }
  //     })
  //   );
  //   setReply('');
  // };
  const isClosed = ticket.status === 'closed' || ticket.status === 'resolved';



  const handleCloseTicket = async () => {
  if (!ticket) return;

  try {
    await dispatch(
      updateTicket({
        id: ticket.id,
        data: {
          status: "closed",
        },
      })
    ).unwrap();

    toast.success("Ticket closed successfully.");
  } catch (error) {
    toast.error("Failed to close ticket.");
  }
};
  return (
    <div className="flex-1 flex flex-col bg-bg-light min-w-0">
      {/* Header */}
      <div className="bg-white border-b border-border-light p-6 shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-bold text-text-dark">
                {ticket.subject}
              </h2>
              <span className="text-xs font-medium text-text-light">
                #{ticket.ticket_number}
              </span>
            </div>
            <p className="text-sm text-text-medium">{ticket.description}</p>
          </div>
          {(role === "staff" || role === "admin") && !isClosed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseTicket}
              icon={<CheckCircleIcon size={16} />}
            >
              Close Ticket
            </Button>
          )}
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-text-light">
            <span className="font-medium text-text-dark">Status:</span>
            <span className="capitalize">
              {ticket.status.replace('-', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-text-light">
            <span className="font-medium text-text-dark">Priority:</span>
            <span className="capitalize">{ticket.priority}</span>
          </div>
          <div className="flex items-center gap-2 text-text-light">
            <span className="font-medium text-text-dark">Created:</span>
            <span>{format(new Date(ticket.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {/* <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {ticket.messages.map((msg) => {
          const isOwn = msg.senderId === currentUser?.id;
          const isStaffMsg =
          msg.senderRole === 'staff' || msg.senderRole === 'admin';
          return (
            <div
              key={msg.id}
              className={`flex gap-4 max-w-[80%] ${isOwn ? 'ml-auto flex-row-reverse' : ''}`}>
              
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isStaffMsg ? 'bg-primary text-white' : 'bg-bg-light text-text-medium border border-border-light'}`}>
                
                {isStaffMsg ? <ShieldIcon size={20} /> : <UserIcon size={20} />}
              </div>
              <div
                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-text-dark">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-text-lighter">
                    {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                  </span>
                </div>
                <div
                  className={`p-4 rounded-2xl text-sm ${isOwn ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-border-light text-text-dark rounded-tl-sm'}`}>
                  
                  {msg.content}
                </div>
              </div>
            </div>);

        })}
        <div ref={messagesEndRef} />
      </div> */}

      {/* Reply Box */}
      {/* <div className="bg-white border-t border-border-light p-4 shrink-0">
        {isClosed ? (
          <div className="text-center p-4 bg-bg-light rounded-xl border border-border-light text-text-medium text-sm">
            This ticket is closed. If you need further assistance, please open a new ticket.
          </div>

        ) : role === 'admin' ? (
          <div className="text-center p-4 bg-bg-light rounded-xl border border-border-light text-text-medium text-sm">
            Read-only view (Admin Monitoring)
          </div>

        ) : (
          <form onSubmit={handleReply} className="flex gap-3">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 bg-bg-light border border-border-light focus:border-primary focus:ring-1 focus:ring-primary text-sm px-4 py-3 rounded-xl text-text-dark placeholder:text-text-lighter"
            />

            <Button
              type="submit"
              disabled={!reply.trim()}
              icon={<SendIcon size={18} />}
              className="px-6"
            >
              Reply
            </Button>
          </form>
        )}
      </div> */}
    </div>);

};
