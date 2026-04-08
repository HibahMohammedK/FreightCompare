import React, { useState } from 'react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { SearchIcon, ShieldIcon, UserIcon } from 'lucide-react';
import { mockAdminUsers } from '../../utils/mockData';
export const UserManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState(mockAdminUsers);
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const toggleBlockUser = (id: string) => {
  setUsers(
    users.map((u) =>
      u.id === id
        ? { ...u, isBlocked: !u.isBlocked }
        : u
    )
  );
};

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">User Management</h1>
          <p className="text-sm text-text-light">
            View and manage all platform users, staff, and admins.
          </p>
        </div>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<SearchIcon size={18} />} />
            
          </div>
          <div className="w-full md:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm text-text-darker focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
              
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="staff">Staff</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <Button
            variant="primary"
            size="md"
            onClick={() => console.log('Open create staff modal')}
          >
            + Create Staff
          </Button>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
           
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-light border-b border-border-light">
                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  User
                </th>
                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Role
                </th>
                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Premium
                </th>
                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredUsers.map((user) =>
              <tr
                key={user.id}
                className="hover:bg-bg-light/50 transition-colors">
                
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${user.role === 'admin' ? 'bg-error-bg text-error' : user.role === 'staff' ? 'bg-primary-light text-primary' : 'bg-bg-light text-text-medium'}`}>
                      
                        {user.role === 'admin' || user.role === 'staff' ?
                      <ShieldIcon size={18} /> :

                      <UserIcon size={18} />
                      }
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-dark">
                          {user.name}
                        </p>
                        <p className="text-xs text-text-light">{user.email}</p>
                        {user.isBlocked && (
                        <span className="ml-2 text-xs text-error font-medium">
                          Blocked
                        </span>
                      )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.role === 'admin' ? 'bg-error-bg text-error border border-red-200' : user.role === 'staff' ? 'bg-primary-light text-primary-dark border border-primary-lighter' : 'bg-bg-light text-text-medium border border-border-light'}`}>
                    
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.role === 'user' ?
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isPremium ? 'bg-warning-bg text-warning border border-yellow-200' : 'bg-bg-light text-text-medium border border-border-light'}`}>
                    
                        {user.isPremium ? 'Premium' : 'Free'}
                      </span> :

                  <span className="text-text-lighter text-xs">-</span>
                  }
                  </td>
                  <td className="p-4 text-right">
                   {user.role !== 'admin' && (
                    <Button
                      variant={user.isBlocked ? 'secondary' : 'danger'}
                      size="sm"
                      onClick={() => toggleBlockUser(user.id)}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                  )}
                  </td>
                </tr>
              )}
              
              {filteredUsers.length === 0 &&
              <tr>
                  <td colSpan={4} className="p-8 text-center text-text-light">
                    No users found matching your search.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

};