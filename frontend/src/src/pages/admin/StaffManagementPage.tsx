import React, { useState } from 'react';
import { Card } from '../../components/shared/Card';
import { Input } from '../../components/shared/Input';
import { SearchIcon, TicketIcon, MessageSquareIcon } from 'lucide-react';
import { mockStaffMembers } from '../../utils/mockData';
export const StaffManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [staff, setStaff] = useState(mockStaffMembers);
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-success';
      case 'busy':
        return 'bg-warning';
      case 'offline':
        return 'bg-text-lighter';
      default:
        return 'bg-text-lighter';
    }
  };
  const handleStatusChange = (
  id: string,
  newStatus: 'online' | 'busy' | 'offline') =>
  {
    setStaff(
      staff.map((s) =>
      s.id === id ?
      {
        ...s,
        status: newStatus
      } :
      s
      )
    );
  };
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-dark">Staff Management</h1>
        <p className="text-sm text-text-light">
          Monitor support team availability and workload.
        </p>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search staff by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<SearchIcon size={18} />} />
            
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm text-text-darker focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
              
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) =>
        <Card key={member.id} className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-bold text-lg">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                
                </div>
                <div>
                  <h3 className="font-bold text-text-dark">{member.name}</h3>
                  <p className="text-xs text-text-light">{member.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-bg-light rounded-xl p-3 text-center border border-border-light">
                <div className="flex items-center justify-center gap-1 text-text-medium mb-1">
                  <TicketIcon size={14} />
                  <span className="text-xs font-medium">Tickets</span>
                </div>
                <p className="text-xl font-bold text-text-dark">
                  {member.activeTickets}
                </p>
              </div>
              <div className="bg-bg-light rounded-xl p-3 text-center border border-border-light">
                <div className="flex items-center justify-center gap-1 text-text-medium mb-1">
                  <MessageSquareIcon size={14} />
                  <span className="text-xs font-medium">Chats</span>
                </div>
                <p className="text-xl font-bold text-text-dark">
                  {member.activeChats}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-light block mb-2">
                Force Status Change
              </label>
              <select
              value={member.status}
              onChange={(e) =>
              handleStatusChange(member.id, e.target.value as any)
              }
              className="w-full rounded-lg border border-border-light bg-white px-3 py-2 text-sm text-text-darker focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary capitalize">
              
                <option value="online">Online</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </Card>
        )}
        {filteredStaff.length === 0 &&
        <div className="col-span-full p-8 text-center text-text-light bg-white rounded-2xl border border-border-light">
            No staff members found matching your filters.
          </div>
        }
      </div>
    </div>);

};