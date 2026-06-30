import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "lucide-react";

import { UserNavbar } from "../../components/shared/UserNavbar";
import { Card } from "../../components/shared/Card";
import { Button } from "../../components/shared/Button";

import { getCurrentSubscription } from "../../api/subscription";

interface SubscriptionResponse {
  status: string;
  start_date?: string;
  expiry_date?: string;
}

export const SubscriptionSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const [subscription, setSubscription] =
    useState<SubscriptionResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchSubscription = async () => {

      try {

        const res =
          await getCurrentSubscription();

        setSubscription(res.data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    };

    fetchSubscription();

  }, []);

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      <div className="flex-1 flex items-center justify-center px-6 py-12">

        <Card className="max-w-xl w-full p-8 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-bg text-success">
            <CheckCircleIcon size={44} />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-text-dark">
            Premium Activated
          </h1>

          <p className="mt-3 text-text-light">
            Thank you for subscribing. Your premium membership is now active.
          </p>

          {!loading && subscription && (

            <div className="mt-8 rounded-xl bg-bg-light p-5 text-left">

              <h2 className="font-semibold text-text-dark mb-4">
                Subscription Details
              </h2>

              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-text-light">Status</span>
                  <span className="font-medium capitalize">
                    {subscription.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-text-light">
                    Valid Until
                  </span>

                  <span className="font-medium">
                    {subscription.expiry_date
                      ? new Date(
                          subscription.expiry_date
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "-"}
                  </span>

                </div>

              </div>

            </div>

          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">

            <Button
              fullWidth
              onClick={() => navigate("/")}
            >
              Go to Dashboard
            </Button>

            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate("/price-alerts")}
            >
              Explore Premium Features
            </Button>

          </div>

        </Card>

      </div>

    </div>
  );
};