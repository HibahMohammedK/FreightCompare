import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';
import { TicketList } from '../../components/shared/ticket/TicketList';
import { TicketDetails } from '../../components/shared/ticket/TicketDetails';
import { ShieldIcon, PlusIcon } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { createTicket, setActiveTicket } from '../../redux/ticketSlice';
import { Ticket } from '../../utils/mockData';
export const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { tickets, activeTicket } = useAppSelector((state) => state.ticket);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Ticket['priority']>('medium');
  const [filter, setFilter] = useState('all');
  const userTickets = tickets.filter((t) => t.createdBy === user?.id);
  const filteredTickets = userTickets.filter(
    (t) => filter === 'all' || t.status === filter
  );
  useEffect(() => {
    if (userTickets.length > 0 && !activeTicket) {
      dispatch(setActiveTicket(userTickets[0]));
    }
  }, [userTickets, activeTicket, dispatch]);
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || !user) return;
    const newTicket: Ticket = {
      id: `t${Date.now()}`,
      subject: subject.trim(),
      description: description.trim(),
      status: 'open',
      priority,
      createdBy: user.id,
      assignedTo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    dispatch(createTicket(newTicket));
    dispatch(setActiveTicket(newTicket));
    setIsModalOpen(false);
    setSubject('');
    setDescription('');
    setPriority('medium');
  };
  if (!user?.isPremium) {
    return (
      <div className="min-h-screen bg-bg-light flex flex-col">
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <ShieldIcon size={32} />
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-3">
              Premium Feature
            </h2>
            <p className="text-text-medium mb-8">
              Priority support ticketing is available exclusively for Premium
              members. Upgrade your account to get fast, dedicated assistance
              from our team.
            </p>
            <Button fullWidth onClick={() => navigate('/pricing')}>
              Upgrade to Premium
            </Button>
          </Card>
        </div>
      </div>);

  }
  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-dark">
              My Support Tickets
            </h1>
            <p className="text-sm text-text-light">
              Manage your support requests and communicate with our team
            </p>
          </div>
          <Button
            icon={<PlusIcon size={18} />}
            onClick={() => setIsModalOpen(true)}>
            
            Create Ticket
          </Button>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-border-light overflow-hidden flex shadow-sm min-h-[600px]">
          <TicketList
            tickets={filteredTickets}
            activeTicketId={activeTicket?.id ?? null}
            onTicketClick={(ticket) => dispatch(setActiveTicket(ticket))}
            onFilterChange={setFilter}
            currentFilter={filter} />
          
          <TicketDetails ticket={activeTicket} />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Support Ticket">
        
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Subject"
            placeholder="Brief summary of your issue"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-medium">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
              setPriority(e.target.value as Ticket['priority'])
              }
              className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm text-text-darker focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
              
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about your issue..."
              rows={4}
              className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm text-text-darker placeholder:text-text-lighter focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              required />
            
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setIsModalOpen(false)}>
              
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              disabled={!subject.trim() || !description.trim()}>
              
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>);

};