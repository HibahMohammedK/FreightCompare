import React, { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { Button } from "../Button";
import { Input } from "../Input";

import {
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from "../../../api/subscription";

import type { SubscriptionPlan } from "../../../types/subscription";

interface SubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: SubscriptionPlan | null;
  onSaved: () => void;
}

const AVAILABLE_FEATURES = [
  {
    key: "ai_search",
    label: "AI Transport Search",
    description:
      "Allow customers to use the AI-powered transport search assistant.",
  },
  {
    key: "support_tickets",
    label: "Support Tickets",
    description:
      "Allow customers to create support tickets and contact support staff.",
  },
];

export const SubscriptionPlanModal: React.FC<
  SubscriptionPlanModalProps
> = ({
  isOpen,
  onClose,
  plan,
  onSaved,
}) => {
  const isEditing = !!plan;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("aed");

  const [billingInterval, setBillingInterval] = useState<
    "month" | "year"
  >("month");

  /*
   * Machine-readable feature keys.
   *
   * Example:
   *
   * [
   *   "ai_search",
   *   "support_tickets"
   * ]
   */
  const [features, setFeatures] = useState<string[]>([]);

  /*
   * Machine-readable usage limits.
   *
   * -1 means unlimited.
   */
  const [limits, setLimits] = useState({
    price_alerts: 1,
  });

  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /*
   * Load existing plan when editing.
   */
  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setDescription(plan.description);
      setPrice(plan.price);
      setCurrency(plan.currency);
      setBillingInterval(plan.billing_interval);

      setFeatures(
        Array.isArray(plan.features)
          ? plan.features
          : []
      );

      setLimits({
        price_alerts:
          plan.limits?.price_alerts ?? 1,
      });

      setSortOrder(
        String(plan.sort_order)
      );

      setIsActive(plan.is_active);
    } else {
      /*
       * Reset form for new plan.
       */
      setName("");
      setDescription("");
      setPrice("");
      setCurrency("aed");
      setBillingInterval("month");

      setFeatures([]);

      setLimits({
        price_alerts: 1,
      });

      setSortOrder("0");
      setIsActive(true);
    }

    setError("");
  }, [plan, isOpen]);

  /*
   * Toggle a machine-readable feature.
   */
  const toggleFeature = (
    featureKey: string
  ) => {
    setFeatures((current) => {
      if (current.includes(featureKey)) {
        return current.filter(
          (feature) =>
            feature !== featureKey
        );
      }

      return [
        ...current,
        featureKey,
      ];
    });
  };

  /*
   * Submit subscription plan.
   */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Plan name is required."
      );
      return;
    }

    if (
      !price ||
      Number(price) < 0
    ) {
      setError(
        "Please enter a valid price."
      );
      return;
    }

    if (
      limits.price_alerts < -1
    ) {
      setError(
        "Price alert limit must be -1 or greater."
      );
      return;
    }

    const data = {
      name: name.trim(),

      description:
        description.trim(),

      price,

      currency:
        currency.toLowerCase(),

      billing_interval:
        billingInterval,

      /*
       * Machine-readable feature keys.
       */
      features,

      /*
       * Machine-readable limits.
       */
      limits: {
        price_alerts:
          Number(
            limits.price_alerts
          ),
      },

      sort_order:
        Number(sortOrder) || 0,

      is_active:
        isActive,
    };

    try {
      setSaving(true);

      if (
        isEditing &&
        plan
      ) {
        await updateSubscriptionPlan(
          plan.id,
          data
        );
      } else {
        await createSubscriptionPlan(
          data
        );
      }

      onSaved();
      onClose();

    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
        "Unable to save subscription plan."
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!saving) {
          onClose();
        }
      }}
      title={
        isEditing
          ? "Edit Subscription Plan"
          : "Create Subscription Plan"
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-error-bg border border-red-200 px-4 py-3">
            <p className="text-sm text-error">
              {error}
            </p>
          </div>
        )}

        {/* Plan Name */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Plan Name
          </label>

          <Input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="e.g. Premium"
            disabled={saving}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Describe what this plan offers..."
            disabled={saving}
            rows={3}
            className="
              w-full
              rounded-xl
              border
              border-border-light
              bg-white
              px-4
              py-3
              text-sm
              text-text-dark
              placeholder:text-text-light
              focus:border-primary
              focus:outline-none
              focus:ring-1
              focus:ring-primary
              resize-none
            "
          />
        </div>

        {/* Price + Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Price
            </label>

            <Input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              placeholder="39.00"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Currency
            </label>

            <Input
              value={currency}
              onChange={(e) =>
                setCurrency(
                  e.target.value
                )
              }
              placeholder="AED"
              disabled={saving}
            />
          </div>

        </div>

        {/* Billing Interval */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Billing Interval
          </label>

          <select
            value={billingInterval}
            onChange={(e) =>
              setBillingInterval(
                e.target.value as
                  | "month"
                  | "year"
              )
            }
            disabled={saving}
            className="
              w-full
              rounded-xl
              border
              border-border-light
              bg-white
              px-4
              py-2.5
              text-sm
              text-text-dark
              focus:border-primary
              focus:outline-none
              focus:ring-1
              focus:ring-primary
            "
          >
            <option value="month">
              Monthly
            </option>

            <option value="year">
              Yearly
            </option>
          </select>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Features
          </label>

          <div className="rounded-xl border border-border-light p-4 space-y-4">

            {AVAILABLE_FEATURES.map(
              (feature) => {
                const enabled =
                  features.includes(
                    feature.key
                  );

                return (
                  <label
                    key={
                      feature.key
                    }
                    className="
                      flex
                      items-start
                      gap-3
                      cursor-pointer
                    "
                  >
                    <input
                      type="checkbox"
                      checked={
                        enabled
                      }
                      onChange={() =>
                        toggleFeature(
                          feature.key
                        )
                      }
                      disabled={
                        saving
                      }
                      className="
                        mt-1
                        h-4
                        w-4
                        rounded
                        border-gray-300
                        text-primary
                        focus:ring-primary
                      "
                    />

                    <div>
                      <p className="text-sm font-medium text-text-dark">
                        {
                          feature.label
                        }
                      </p>

                      <p className="text-xs text-text-light mt-0.5">
                        {
                          feature.description
                        }
                      </p>
                    </div>
                  </label>
                );
              }
            )}

          </div>

          <p className="text-xs text-text-light mt-2">
            These settings control which functionality customers can access.
          </p>
        </div>

        {/* Usage Limits */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Usage Limits
          </label>

          <div className="rounded-xl border border-border-light p-4">

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">
                Price Alerts
              </label>

              <Input
                type="number"
                min="-1"
                value={
                  limits.price_alerts
                }
                onChange={(e) =>
                  setLimits({
                    ...limits,
                    price_alerts:
                      Number(
                        e.target.value
                      ),
                  })
                }
                disabled={saving}
              />

              <p className="text-xs text-text-light mt-1">
                Maximum active price
                alerts allowed for
                this plan.
              </p>

              <p className="text-xs text-primary mt-1">
                Use -1 for unlimited.
              </p>
            </div>

          </div>
        </div>

        {/* Display Order */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Display Order
          </label>

          <Input
            type="number"
            min="0"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(
                e.target.value
              )
            }
            disabled={saving}
          />

          <p className="text-xs text-text-light mt-1">
            Lower numbers appear first.
          </p>
        </div>

        {/* Active */}
        <div className="flex items-center justify-between rounded-xl border border-border-light p-4">

          <div>
            <p className="text-sm font-medium text-text-dark">
              Active Plan
            </p>

            <p className="text-xs text-text-light mt-1">
              Active plans are visible to customers.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              setIsActive(
                (current) =>
                  !current
              )
            }
            className={`
              relative
              inline-flex
              h-6
              w-11
              items-center
              rounded-full
              transition-colors
              ${
                isActive
                  ? "bg-primary"
                  : "bg-gray-300"
              }
            `}
          >
            <span
              className={`
                inline-block
                h-5
                w-5
                transform
                rounded-full
                bg-white
                transition-transform
                ${
                  isActive
                    ? "translate-x-5"
                    : "translate-x-0.5"
                }
              `}
            />
          </button>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">

          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Plan"}
          </Button>

        </div>

      </form>
    </Modal>
  );
};