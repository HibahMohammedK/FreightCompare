import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Modal } from "../../components/shared/Modal";
import { getCurrentSubscription, createCheckoutSession, cancelSubscription, } from "../../api/subscription";


export const PricingPage: React.FC = () => {

  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<{
    status: string;
    start_date?: string;
    expiry_date?: string;
    cancel_at_period_end?: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const isPremium = subscription?.status === "active";

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await getCurrentSubscription();
        setSubscription(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleUpgrade = async () => {

      setIsProcessing(true);

      try {
          const res = await createCheckoutSession();
          window.location.href =
              res.data.checkout_url;

      } catch (err) {
          console.error(err);

      } finally {
          setIsProcessing(false);
      }
  };

  const handleCancel = async () => {

    setIsCancelling(true);
    try {
      await cancelSubscription();
      const res = await getCurrentSubscription();
      setSubscription(res.data);
      setIsCancelModalOpen(false);

    } catch (err) {
      console.error(err);

    } finally {
      setIsCancelling(false);

    }

  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading subscription...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <UserNavbar />

      <div className="max-w-7xl mx-auto w-full px-6 py-16 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-text-dark mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-text-light">
            Get access to premium features like priority support, direct chat
            with agents, and advanced tracking.
          </p>
        </div>

        {/* Subscription Status */}
        <Card className="max-w-4xl mx-auto mb-8 p-6 border-border-light">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-primary mb-2">
                Your subscription
              </p>
              <h2 className="text-2xl font-bold text-text-dark mb-2">
                {isPremium
                  ? 'Premium plan is active'
                  : 'You are on the Basic plan'}
              </h2>

              <p className="text-sm text-text-light">
                {isPremium ? (
                  subscription?.cancel_at_period_end ? (
                    <>
                      Your subscription has been scheduled for cancellation.
                      {subscription.expiry_date &&
                        ` You will continue to enjoy Premium features until ${new Date(
                          subscription.expiry_date
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}.`}
                    </>
                  ) : (
                    <>
                      Status: {subscription?.status}
                      {subscription?.expiry_date &&
                        ` • Renews on ${new Date(
                          subscription.expiry_date
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}`}
                    </>
                  )
                ) : (
                  "Upgrade here to unlock live agent chat, premium support, and advanced shipping tools."
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant={isPremium ? 'outline' : 'primary'}
                onClick={() => navigate('/chat')}
              >
                {isPremium ? 'Open Premium Chat' : 'Preview Chat Access'}
              </Button>

              {isPremium && (
                <Button
                      variant="secondary"
                      disabled={subscription?.cancel_at_period_end}
                      onClick={() => setIsCancelModalOpen(true)}
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
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic */}
          <Card className="p-8 border-2 border-transparent hover:border-border-medium transition-colors">
            <h3 className="text-xl font-bold text-text-dark mb-2">Basic</h3>
            <div className="text-4xl font-bold mb-4">$0</div>

            <Button
              variant="outline"
              fullWidth
              disabled={
                !isPremium || subscription?.cancel_at_period_end
              }
              onClick={() => setIsCancelModalOpen(true)}
            >
              {!isPremium
                ? "Current Plan"
                : subscription?.cancel_at_period_end
                  ? "Cancellation Scheduled"
                  : "Switch to Basic"}
            </Button>
          </Card>

          {/* Premium */}
          <Card className="p-8 border-2 border-primary shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-2">Premium</h3>
            <div className="text-4xl font-bold mb-4">$20</div>

            <Button
              fullWidth
              disabled={isPremium || isProcessing}
              onClick={handleUpgrade}
            >
              {isPremium ? 'Active Plan' : 'Upgrade to Premium'}
            </Button>
          </Card>
        </div>
      </div>
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => !isCancelling && setIsCancelModalOpen(false)}
        title="Cancel Premium Subscription"
      >

        <div className="space-y-6">

          <p className="text-text-light">
            Are you sure you want to cancel your Premium subscription?
          </p>

          <div className="rounded-lg bg-bg-light p-4">

            <p className="font-medium text-text-dark">
              What happens next?
            </p>

            <ul className="mt-3 space-y-2 text-sm text-text-light list-disc list-inside">

              <li>
                Your subscription will <strong>not renew</strong>.
              </li>

              <li>
                You will continue enjoying Premium features until{" "}
                <strong>
                  {subscription?.expiry_date
                    ? new Date(
                        subscription.expiry_date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </strong>.
              </li>

              <li>
                After that date your account will automatically return to the Basic plan.
              </li>

            </ul>

          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            <Button
              variant="outline"
              fullWidth
              disabled={isCancelling}
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep Subscription
            </Button>

            <Button
              fullWidth
              disabled={isCancelling}
              onClick={handleCancel}
            >
              {isCancelling
                ? "Scheduling..."
                : "Schedule Cancellation"}
            </Button>

          </div>

        </div>

      </Modal>
    </div>
  );
};