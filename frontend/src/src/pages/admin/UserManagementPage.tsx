import React, { useState, useEffect } from 'react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { SearchIcon } from 'lucide-react';
import { ConfirmationDialog } from "../../components/shared/ConfirmationDialog";
import {
  getAdminUsers,
  getUsersByUrl,
  toggleBlockUser,
} from "../../api/adminUsers";



export const UserManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [userToToggle, setUserToToggle] = useState<any | null>(null);

  const [premiumFilter, setPremiumFilter] = useState<
      "all" | "premium" | "free"
  >("all");

  const handleToggleBlock = async () => {
    if (!userToToggle) return;
    try {
      await toggleBlockUser(userToToggle.id);

      setUsers(prev =>
        prev.map(user =>
          user.id === userToToggle.id
            ? {
                ...user,
                is_active: !user.is_active,
              }
            : user
        )
      );

      setUserToToggle(null);

    } catch (err) {
      console.error("Block failed", err);

    }
  };

  const fetchUsers = async (
    url?: string,
    searchTerm?: string,
    premium?: "all" | "premium" | "free"
  ) => {

    try {

      let res;

      if (url) {

        res = await getUsersByUrl(url);

      } else {

        res = await getAdminUsers(
          searchTerm || search,
          premium ?? premiumFilter

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
      search,
      premiumFilter
    );

  }, [search, premiumFilter]);

  if (loading) {
    return <div className="p-8">Loading customers...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Customer Management</h1>
          <p className="text-sm text-text-light">
            View and manage all registered customers.
          </p>
        </div>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <Input
                    placeholder="Search customers by name or email..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    icon={<SearchIcon size={18} />}
                />
            </div>

            <select
                value={premiumFilter}
                onChange={(e) =>
                    setPremiumFilter(
                        e.target.value as
                            | "all"
                            | "premium"
                            | "free"
                    )
                }
                className="h-10 rounded-lg border border-border-light bg-white px-3 text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                  <option value="all">
                      All Customers
                  </option>

                  <option value="premium">
                      Premium
                  </option>

                  <option value="free">
                      Free
                  </option>
              </select>
          </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
           
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-light border-b border-border-light">
                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Customer
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
                      <div>
                        <p className="text-sm font-semibold text-text-dark">
                          {user.first_name || user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.username}
                        </p>

                        <p className="text-xs text-text-medium">
                          @{user.username}
                        </p>

                        <p className="text-xs text-text-light">
                          {user.email}
                        </p>
                        {!user.is_active && (
                        <span className="ml-2 text-xs text-error font-medium">
                          Blocked
                        </span>
                      )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_premium
                          ? 'bg-warning-bg text-warning border border-yellow-200'
                          : 'bg-bg-light text-text-medium border border-border-light'
                      }`}
                    >
                      {user.is_premium ? 'Premium' : 'Free'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      variant={!user.is_active ? 'secondary' : 'danger'}
                      size="sm"
                      onClick={() => setUserToToggle(user)}
                    >
                      {!user.is_active ? 'Unblock' : 'Block'}
                    </Button>
                  </td>
                </tr>
              )}
              
              {users.length === 0 &&
              <tr>
                  <td colSpan={3} className="p-8 text-center text-text-light">
                    No customers found .
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
      <ConfirmationDialog
        isOpen={!!userToToggle}
        title={
          userToToggle?.is_active
            ? "Block User"
            : "Unblock User"
        }
        message={
          userToToggle?.is_active
            ? `Are you sure you want to block "${userToToggle?.username}"?`
            : `Are you sure you want to unblock "${userToToggle?.username}"?`
        }
        confirmText={
          userToToggle?.is_active
            ? "Block"
            : "Unblock"
        }
        confirmVariant={
          userToToggle?.is_active
            ? "danger"
            : "primary"
        }
        onClose={() => setUserToToggle(null)}
        onConfirm={handleToggleBlock}
      />
  </div>);
};