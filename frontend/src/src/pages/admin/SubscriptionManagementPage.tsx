import React, { useState, useEffect } from 'react';
import { Card } from '../../components/shared/Card';
import { Input } from '../../components/shared/Input';
import { SearchIcon } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { format } from 'date-fns';
import { getAdminSubscriptions, getAdminSubscriptionsByUrl } from "../../api/subscription";

export const SubscriptionManagementPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  const fetchSubscriptions = async (
        url?: string
    ) => {

        try {
            let res;

            if (url) {
                res = await getAdminSubscriptionsByUrl(
                    url
                );

            } else {
                res = await getAdminSubscriptions({
                    search,
                    plan: planFilter,
                    status: statusFilter,
                });
            }
            setSubscriptions(
                res.data.results
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

  useEffect(() => {
      fetchSubscriptions();
  }, [search, planFilter, statusFilter]);

  if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center">
            Loading subscriptions...
        </div>
      );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-dark">
          Subscription Management
        </h1>
        <p className="text-sm text-text-light">
          Track and manage user premium plans and billing status.
        </p>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by user name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<SearchIcon size={18} />} />
            
          </div>
          <div className="w-full md:w-48">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm text-text-darker focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
              
              <option value="all">All Plans</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm text-text-darker focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
              
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
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
                  Plan
                </th>
                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Start Date
                </th>
                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {subscriptions.map((sub) =>
              <tr
                key={sub.id}
                className="hover:bg-bg-light/50 transition-colors">
                
                  <td className="p-4">
                    <p className="text-sm font-semibold text-text-dark">
                      {sub.user_name}
                    </p>
                    <p className="text-xs text-text-light">ID: {sub.user_id}</p>
                  </td>
                  <td className="p-4">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${sub.plan === 'premium' ? 'bg-warning-bg text-warning border border-yellow-200' : 'bg-bg-light text-text-medium border border-border-light'}`}>
                    
                      {sub.plan}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-medium">
                    {format(new Date(sub.start_date), 'MMM d, yyyy')}
                  </td>
                  <td className="p-4 text-sm text-text-medium">
                    {sub.expiry_date ?
                  format(new Date(sub.expiry_date), 'MMM d, yyyy') :
                  '-'}
                  </td>
                  <td className="p-4">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${sub.status === 'active' ? 'bg-success-bg text-success-dark border border-green-200' : sub.status === 'expired' ? 'bg-error-bg text-error border border-red-200' : 'bg-bg-light text-text-medium border border-border-light'}`}>
                    
                      {sub.status}
                    </span>
                  </td>
                </tr>
              )}
              {subscriptions.length === 0 &&
              <tr>
                  <td colSpan={5} className="p-8 text-center text-text-light">
                    No subscriptions found matching your filters.
                  </td>
                </tr>
              }
            </tbody>
          </table>
          <div className="flex justify-between p-4">
            <Button
                variant="outline"
                disabled={!prevPage}
                onClick={() => prevPage && fetchSubscriptions(prevPage)}
            >
                Previous
            </Button>

            <Button
                variant="outline"
                disabled={!nextPage}
                onClick={() => nextPage && fetchSubscriptions(nextPage)}
            >
                Next
            </Button>
          </div>
        </div>
      </Card>
    </div>);

};