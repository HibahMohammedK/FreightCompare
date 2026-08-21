import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavbar } from "../../components/shared/UserNavbar";
import { Button } from "../../components/shared/Button";
import { Card } from "../../components/shared/Card";
import {
  getSubscriptionPlans,
  createCheckoutSession,
  getCurrentSubscription,
} from "../../api/subscription";
import type { SubscriptionPlan } from "../../types/subscription";
import { CancelSubscriptionModal } from "../../components/shared/subscription/CancelSubscriptionModal";

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState<{
    plan?: SubscriptionPlan;
    status: string;
    start_date?: string;
    expiry_date?: string;
    cancel_at_period_end?: boolean;
  } | null>(null);

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const isSubscribed = subscription?.status === "active";
  const currentPlanId = subscription?.plan?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subscriptionRes, plansRes] =
          await Promise.all([
            getCurrentSubscription(),
            getSubscriptionPlans(),
          ]);

        setSubscription(subscriptionRes.data);
        setPlans(plansRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setPlansLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpgrade = async (planId: number) => {
    setIsProcessing(true);

    try {
      const res = await createCheckoutSession(planId);

      window.location.href = res.data.checkout_url;
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        Loading subscription...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      <div className="max-w-7xl mx-auto w-full px-6 py-16 flex-1">

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-text-dark mb-4">
            Choose the plan that works for you
          </h1>

          <p className="text-lg text-text-light">
            Get the features and support you need to manage
            your shipping more efficiently.
          </p>
        </div>

        {/* Current Subscription */}
        <Card className="max-w-6xl mx-auto mb-12 p-6 md:p-7 border-border-light">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Subscription Information */}
            <div className="flex items-start gap-4">

              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                  isSubscribed
                    ? "bg-primary/10 text-primary"
                    : "bg-bg-light text-text-light"
                }`}
              >
                <span className="text-lg">
                  {isSubscribed ? "✓" : "○"}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-text-light mb-1">
                  Your subscription
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-text-dark">
                  {isSubscribed
                    ? subscription?.plan?.name ??
                      "Active subscription"
                    : "Basic plan"}
                </h2>

                <p className="text-sm text-text-light mt-1">
                  {isSubscribed
                    ? subscription?.cancel_at_period_end
                      ? `Your plan will remain active until ${formatDate(
                          subscription.expiry_date
                        )}.`
                      : `Active • Renews ${formatDate(
                          subscription.expiry_date
                        )}`
                    : "You're currently using the free plan."}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">

              <Button
                variant={isSubscribed ? "outline" : "primary"}
                onClick={() => navigate("/support")}
              >
                {isSubscribed
                  ? "Go to Support"
                  : "Preview Support"}
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  navigate("/subscription/history")
                }
              >
                Subscription History
              </Button>

              {isSubscribed && (
                <Button
                  variant="secondary"
                  disabled={subscription?.cancel_at_period_end}
                  onClick={() =>
                    setIsCancelModalOpen(true)
                  }
                >
                  {subscription?.cancel_at_period_end
                    ? "Cancellation Scheduled"
                    : "Cancel Plan"}
                </Button>
              )}

            </div>
          </div>
        </Card>

        {/* Plans */}
        <div className="max-w-6xl mx-auto">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-dark">
              Plans
            </h2>

            <p className="text-sm text-text-light mt-1">
              Choose a plan based on the features you need.
            </p>
          </div>

          {plansLoading ? (
            <div className="text-center py-12 text-text-light">
              Loading plans...
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12 text-text-light">
              No subscription plans are currently available.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">

              {plans.map((plan) => {
                const isCurrentPlan =
                  isSubscribed &&
                  currentPlanId === plan.id;

                return (
                  <Card
                    key={plan.id}
                    className={`relative p-7 flex flex-col w-full sm:w-[360px] ${
                      isCurrentPlan
                        ? "border-2 border-primary shadow-lg"
                        : "border border-border-light hover:border-border-medium"
                    } transition-all duration-200`}
                  >

                    {/* Current Plan Badge */}
                    {isCurrentPlan && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          Current plan
                        </span>
                      </div>
                    )}

                    {/* Plan Name */}
                    <div className="mb-5 pr-24">
                      <h3
                        className={`text-xl font-bold ${
                          isCurrentPlan
                            ? "text-primary"
                            : "text-text-dark"
                        }`}
                      >
                        {plan.name}
                      </h3>

                      {plan.description && (
                        <p className="text-sm text-text-light mt-2 leading-6">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-medium text-text-light">
                          {plan.currency.toUpperCase()}
                        </span>

                        <span className="text-4xl font-bold text-text-dark">
                          {plan.price}
                        </span>
                      </div>

                      <p className="text-sm text-text-light mt-1">
                        per {plan.billing_interval}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="flex-1">
                      {plan.features.length > 0 && (
                        <ul className="space-y-3 mb-8">
                          {plan.features.map(
                            (feature, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-text-light"
                              >
                                <span className="text-primary font-semibold mt-0.5">
                                  ✓
                                </span>

                                <span>{feature}</span>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>

                    {/* Plan Button */}
                    <Button
                      fullWidth
                      variant={
                        isCurrentPlan
                          ? "outline"
                          : "primary"
                      }
                      disabled={
                        isCurrentPlan ||
                        isSubscribed ||
                        isProcessing
                      }
                      onClick={() =>
                        handleUpgrade(plan.id)
                      }
                    >
                      {isCurrentPlan
                        ? "Active Plan"
                        : isSubscribed
                          ? "Already Subscribed"
                          : `Subscribe to ${plan.name}`}
                    </Button>

                  </Card>
                );
              })}

            </div>
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() =>
          setIsCancelModalOpen(false)
        }
        expiryDate={subscription?.expiry_date}
        onCancelled={async () => {
          const res =
            await getCurrentSubscription();

          setSubscription(res.data);
        }}
      />
    </div>
  );
};