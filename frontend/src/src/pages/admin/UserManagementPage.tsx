import React, { useState, useEffect } from 'react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { SearchIcon, ShieldIcon, UserIcon } from 'lucide-react';
import {
  getAdminUsers,
  getUsersByUrl,
  toggleBlockUser,
  createStaff
} from "../../api/adminUsers";

import { Modal } from "../../components/shared/Modal";
import {
 EyeIcon,
 EyeOffIcon
} from "lucide-react";

export const UserManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    username:"",
    email:"",
    password:""
  });

  const handleCreateStaff = async (
    e: React.FormEvent
    ) => {

    e.preventDefault();

    try {

      await createStaff(staffForm);
      setStaffForm({
        username:"",
        email:"",
        password:""
      });

      setShowCreateStaffModal(false);

      fetchUsers(); // refresh list

    } catch(err) {

      console.error(err);

    }

    };

  const handleToggleBlock = async (id: string) => {
    try {
        await toggleBlockUser(id);

        setUsers(prev =>
          prev.map(user =>
              user.id === id
              ? {
                  ...user,
                  is_active: !user.is_active
                }
              : user
          )
        );

    } catch (err) {
        console.error("Block failed", err);
    }
  };

  const fetchUsers = async (
    url?: string,
    role?: string,
    searchTerm?: string
  ) => {

    try {

      let res;

      if (url) {

        res = await getUsersByUrl(url);

      } else {

        res = await getAdminUsers(
          role || roleFilter,
          searchTerm || search
        );

      }

      setUsers(res.data.results || []);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);

    } catch (err) {

      console.error("Failed loading users", err);

    } finally {

      setLoading(false);

    }
  };

 useEffect(() => {

    fetchUsers(
      undefined,
      roleFilter,
      search
    );

  }, [roleFilter, search]);

  if (loading) {
    return <div className="p-8">Loading users...</div>;
  }

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
              <option value="customer">Users</option>
              <option value="staff">Staff</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <Button
            variant="primary"
            size="md"
            onClick={() => setShowCreateStaffModal(true)}
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
              {users.map((user) =>
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
                          {user.username}
                        </p>
                        <p className="text-xs text-text-light">{user.email}</p>
                        {!user.is_active && (
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
                    {user.role === 'customer' ?
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
                      variant={!user.is_active ? 'secondary' : 'danger'}
                      size="sm"
                      onClick={() => handleToggleBlock(user.id)}
                    >
                      {!user.is_active ? 'Unblock' : 'Block'}
                    </Button>
                  )}
                  </td>
                </tr>
              )}
              
              {users.length === 0 &&
              <tr>
                  <td colSpan={4} className="p-8 text-center text-text-light">
                    No users found matching your search.
                  </td>
                </tr>
              }
            </tbody>
          </table>
          <div className="flex justify-between p-4">
        <Button
        disabled={!prevPage}
        onClick={() => prevPage && fetchUsers(prevPage)}
        >
        Previous
        </Button>

        <Button
        disabled={!nextPage}
        onClick={() => nextPage && fetchUsers(nextPage)}
        >
        Next
        </Button>
        </div>
        </div>
      </Card>
      <Modal
        isOpen={showCreateStaffModal}
        onClose={() => setShowCreateStaffModal(false)}
        title="Create Staff Account"
        maxWidth="max-w-md"
      >

    <form onSubmit={handleCreateStaff} className="space-y-4">

      <Input
        label="Username"
        value={staffForm.username}
        onChange={(e) =>
          setStaffForm({
            ...staffForm,
            username: e.target.value
          })
        }
      />

      <Input
        label="Email"
        value={staffForm.email}
        onChange={(e) =>
          setStaffForm({
            ...staffForm,
            email: e.target.value
          })
        }
      />

      <div className="relative">

        <Input
          label="Temporary Password"
          type={showPassword ? "text" : "password"}
          value={staffForm.password}
          onChange={(e) =>
            setStaffForm({
              ...staffForm,
              password: e.target.value
            })
          }
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="
            absolute
            right-3
            top-[68%]
            -translate-y-1/2
            p-1
            text-text-lighter
            hover:text-text-medium
          "
        >

        {showPassword
            ? <EyeOffIcon size={20} />
            : <EyeIcon size={20} />
        }

        </button>
      </div>

      <Button type="submit" fullWidth>
        Create Staff
      </Button>

    </form>

  </Modal>
  </div>);
};