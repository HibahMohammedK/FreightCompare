import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavbar } from "../../components/shared/UserNavbar";
import { Card } from "../../components/shared/Card";
import { Button } from "../../components/shared/Button";
import {
  getSubscriptionHistory,
  getCurrentSubscription,
} from "../../api/subscription";
import type { SubscriptionHistory } from "../../types/subscription";
import { CancelSubscriptionModal } from "../../components/shared/subscription/CancelSubscriptionModal";

export const SubscriptionHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState<SubscriptionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subscription, setSubscription] = useState<{
    status: string;
    expiry_date?: string;
    cancel_at_period_end?: boolean;
  } | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, subscriptionRes] =
          await Promise.all([
            getSubscriptionHistory(),
            getCurrentSubscription(),
          ]);

        setHistory(historyRes.data);
        setSubscription(subscriptionRes.data);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load your subscription history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPrice = (
    price: string,
    currency: string
  ) => {
    return `${currency.toUpperCase()} ${price}`;
  };

  const getStatusLabel = (
    status: SubscriptionHistory["status"]
  ) => {
    switch (status) {
      case "active":
        return "Active";

      case "cancelled":
        return "Cancelled";

      case "expired":
        return "Expired";

      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light">
        <UserNavbar />

        <div className="flex items-center justify-center py-20">
          <p className="text-text-light">
            Loading subscription history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <UserNavbar />

      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text-dark">
            Subscription History
          </h1>

          <p className="mt-2 text-text-light">
            View your current and previous subscription plans.
          </p>
        </div>

        {/* Error */}
        {error && (
          <Card className="p-6 mb-6 border-border-light">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </Card>
        )}

        {/* Empty State */}
        {!error && history.length === 0 && (
          <Card className="p-10 text-center border-border-light">
            <h2 className="text-xl font-semibold text-text-dark">
              No subscription history
            </h2>

            <p className="mt-2 text-text-light">
              You have not subscribed to any plan yet.
            </p>

            <div className="mt-6">
              <Button
                onClick={() => navigate("/pricing")}
              >
                View Plans
              </Button>
            </div>
          </Card>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-5">
            {history.map((item) => {

              const isCurrentSubscription =
                item.status === "active" &&
                subscription?.status === "active";

              const displayEndDate =
                item.status === "active"
                  ? subscription?.expiry_date ?? null
                  : item.end_date;

              return (
                <Card
                  key={item.id}
                  className="p-6 border-border-light"
                >
                  <div className="flex flex-col gap-6">

                    {/* Top */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                      {/* Plan */}
                      <div>
                        <h2 className="text-xl font-bold text-text-dark">
                          {item.plan_name}
                        </h2>

                        <p className="mt-1 text-text-light">
                          {formatPrice(
                            item.price,
                            item.currency
                          )}{" "}
                          /{" "}
                          {item.billing_interval === "month"
                            ? "month"
                            : "year"}
                        </p>
                      </div>

                      {/* Status + Action */}
                      <div className="flex items-center gap-3">

                        <span
                          className={`
                            inline-flex
                            items-center
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium
                            ${
                              item.status === "active"
                                ? "bg-green-100 text-green-700"
                                : item.status === "cancelled"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-600"
                            }
                          `}
                        >
                          {getStatusLabel(item.status)}
                        </span>

                        {isCurrentSubscription && (
                          <Button
                            variant="secondary"
                            disabled={
                              subscription?.cancel_at_period_end
                            }
                            onClick={() =>
                              setIsCancelModalOpen(true)
                            }
                          >
                            {subscription?.cancel_at_period_end
                              ? "Cancellation Scheduled"
                              : "Cancel Subscription"}
                          </Button>
                        )}

                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border-light pt-5">

                      <div>
                        <p className="text-sm text-text-light">
                          Started
                        </p>

                        <p className="mt-1 font-medium text-text-dark">
                          {formatDate(item.start_date)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-text-light">
                          {item.status === "active"
                            ? "Renews / Ends"
                            : "Ended"}
                        </p>

                        <p className="mt-1 font-medium text-text-dark">
                          {formatDate(displayEndDate)}
                        </p>
                      </div>

                    </div>

                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Cancellation Modal */}
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() =>
          setIsCancelModalOpen(false)
        }
        expiryDate={subscription?.expiry_date}
        onCancelled={async () => {
          const res = await getCurrentSubscription();
          setSubscription(res.data);
        }}
      />
    </div>
  );
};