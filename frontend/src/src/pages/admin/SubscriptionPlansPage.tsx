import React, { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Card } from "../../components/shared/Card";
import { Button } from "../../components/shared/Button";
import {
  getAdminSubscriptionPlans,
} from "../../api/subscription";
import type { SubscriptionPlan } from "../../types/subscription";
import { SubscriptionPlanModal } from "../../components/shared/subscription/SubscriptionPlanModal";
export const SubscriptionPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const fetchPlans = async () => {
    try {
      const res = await getAdminSubscriptionPlans();
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading subscription plans...
      </div>
    );
  }

  return (
    <>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-2xl font-bold text-text-dark">
            Subscription Plans
          </h1>

          <p className="text-sm text-text-light mt-1">
            Create and manage the subscription plans available to customers.
          </p>
        </div>

        <Button
            onClick={() => {
                setEditingPlan(null);
                setIsPlanModalOpen(true);
            }}
            >
            <Plus size={18} />
            Add Plan
        </Button>

      </div>

      {/* Plans */}
      <Card className="p-0 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-bg-light border-b border-border-light">

                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Plan
                </th>

                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Price
                </th>

                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Billing
                </th>

                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Status
                </th>

                <th className="p-4 text-xs font-semibold text-text-medium uppercase tracking-wider">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-border-light">

              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className="hover:bg-bg-light/50 transition-colors"
                >

                  {/* Plan */}
                  <td className="p-4">

                    <p className="text-sm font-semibold text-text-dark">
                      {plan.name}
                    </p>

                    {plan.description && (
                      <p className="text-xs text-text-light mt-1 max-w-md">
                        {plan.description}
                      </p>
                    )}

                  </td>

                  {/* Price */}
                  <td className="p-4 text-sm text-text-medium">
                    {plan.currency.toUpperCase()} {plan.price}
                  </td>

                  {/* Billing */}
                  <td className="p-4 text-sm text-text-medium capitalize">
                    {plan.billing_interval}
                  </td>

                  {/* Status */}
                  <td className="p-4">

                    <span
                      className={`
                        inline-flex
                        items-center
                        px-2.5
                        py-0.5
                        rounded-full
                        text-xs
                        font-medium
                        ${
                          plan.is_active
                            ? "bg-success-bg text-success-dark border border-green-200"
                            : "bg-bg-light text-text-medium border border-border-light"
                        }
                      `}
                    >
                      {plan.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  {/* Actions */}
                  <td className="p-4">

                    <Button
                        variant="outline"
                        onClick={() => {
                            setEditingPlan(plan);
                            setIsPlanModalOpen(true);
                        }}
                        >
                        <Pencil size={16} />
                        Edit
                    </Button>

                  </td>

                </tr>
              ))}

              {plans.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-text-light"
                  >
                    No subscription plans found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </Card>
    
        <SubscriptionPlanModal
            isOpen={isPlanModalOpen}
            onClose={() => {
                setIsPlanModalOpen(false);
                setEditingPlan(null);
            }}
            plan={editingPlan}
            onSaved={fetchPlans}
        />
    </>
  );
};