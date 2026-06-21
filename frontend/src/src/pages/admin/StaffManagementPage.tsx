import React, { useState, useEffect } from 'react';
import { Card } from '../../components/shared/Card';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { CreateStaffModal } from '../../components/shared/CreateStaffModal';
import { SearchIcon, TicketIcon, MessageSquareIcon } from 'lucide-react';
import {
  getStaff,
  getStaffByUrl,
  updateStaffStatus,
  toggleStaffBlock
} from '../../api/staff';

import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/redux';

import {
  setStaff,
  updateStaffStatus as updateStaffStatusAction,
  toggleStaffBlocked,
} from '../../redux/staffSlice';

export const StaffManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const staff = useAppSelector(
    state => state.staff.staff
  );

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [
    showCreateStaffModal,
    setShowCreateStaffModal
  ] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, [search, statusFilter]);

  const fetchStaff = async (
    url?: string
  ) => {

    try {
      let res;
      if (url) {
        res = await getStaffByUrl(url);
      } else {
        res = await getStaff(
          search,
          statusFilter
        );
      }

      dispatch(
        setStaff(
          res.data.results || []
        )
      );

      setNextPage(
        res.data.next
      );
      setPrevPage(
        res.data.previous
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
    
  

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

  const handleStatusChange = async (
    id: string,
    newStatus:
      "online" |
      "busy" |
      "offline"
  ) => {

    try {

      await updateStaffStatus(
        id,
        newStatus
      );

      dispatch(
        updateStaffStatusAction({
          id,
          status: newStatus
        })
      );

    } catch (err) {
      console.error(
        "Status update failed",
        err
      );
    }
  };

  const handleToggleBlock = async (
    id: string
  ) => {
    try {
      await toggleStaffBlock(id);

      dispatch(
        toggleStaffBlocked(id)
      );

    } catch (err) {

      console.error(
        "Block update failed",
        err
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading staff...
      </div>
    );
  }

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
          <div className="w-full md:w-auto">
            <Button
              className="whitespace-nowrap"
              onClick={() =>
                setShowCreateStaffModal(true)
              }
            >
              + Create Staff
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) =>
        <Card key={member.id} className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-bold text-lg">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                
                </div>
                <div>
                  <h3 className="font-bold text-text-dark">{member.username}</h3>
                  <p className="text-xs text-text-light">{member.email}</p>
                  {!member.is_active && (
                    <span className="text-xs font-medium text-error">
                      Blocked
                    </span>
                  )}
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
                  0
                </p>
              </div>
              <div className="bg-bg-light rounded-xl p-3 text-center border border-border-light">
                <div className="flex items-center justify-center gap-1 text-text-medium mb-1">
                  <MessageSquareIcon size={14} />
                  <span className="text-xs font-medium">Chats</span>
                </div>
                <p className="text-xl font-bold text-text-dark">
                  0
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-light block mb-2">
                Force Status Change
              </label>
              <select
              disabled={!member.is_active}
              value={member.status}
              onChange={(e) =>
              handleStatusChange(member.id, e.target.value as any)
              }
              className="w-full rounded-lg border border-border-light bg-white px-3 py-2 text-sm text-text-darker focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary capitalize">
              
                <option value="online">Online</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
              <Button
                variant={
                  member.is_active
                    ? "danger"
                    : "secondary"
                }
                size="sm"
                fullWidth
                className="mt-3"
                onClick={() =>
                  handleToggleBlock(member.id)
                }
              >
                {member.is_active
                  ? "Block Staff"
                  : "Unblock Staff"}
              </Button>
            </div>
          </Card>
        )}
        {staff.length === 0 &&
        <div className="col-span-full p-8 text-center text-text-light bg-white rounded-2xl border border-border-light">
            No staff members found matching your filters.
          </div>
        }
      </div>
      <div className="flex justify-between p-4">
        <Button
          disabled={!prevPage}
          onClick={() => prevPage && fetchStaff(prevPage)}
          >
          Previous
        </Button>
        
        <Button
          disabled={!nextPage}
          onClick={() => nextPage && fetchStaff(nextPage)}
          >
          Next
        </Button>
      </div>
      
      <CreateStaffModal
        isOpen={showCreateStaffModal}
        onClose={() =>
          setShowCreateStaffModal(false)
        }
        onSuccess={fetchStaff}
      />
    </div>);

};