import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';
import {
  CheckIcon,
  ShieldIcon,
  ZapIcon,
  MessageSquareIcon,
  CreditCardIcon,
} from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { cancelPlan, upgradePlan } from '../../redux/subscriptionSlice';
import { motion } from 'framer-motion';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const currentSubscription = useAppSelector((state) =>
    state.subscription.subscriptions.find(
      (sub) => sub.userId === user?.id
    ) ?? null
  );

  // ✅ FIXED: derive premium from subscription
  const isPremium = currentSubscription?.status === 'active';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = () => {
    setIsProcessing(true);

    setTimeout(() => {
      if (user) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        dispatch(
          upgradePlan({
            userId: user.id,
            expiryDate: expiryDate.toISOString(),
          })
        );
      }

      setIsProcessing(false);
      setIsModalOpen(false);
    }, 1500);
  };

  const handleCancel = () => {
    if (!user) return;
    dispatch(cancelPlan(user.id));
  };

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
                {isPremium
                  ? `Status: ${
                      currentSubscription?.status ?? 'active'
                    }${
                      currentSubscription?.expiryDate
                        ? ` • Renews until ${new Date(
                            currentSubscription.expiryDate
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}`
                        : ''
                    }`
                  : 'Upgrade here to unlock live agent chat, premium support, and advanced shipping tools.'}
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
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel Plan
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
              disabled={!isPremium}
              onClick={() => navigate('/')}
            >
              {isPremium ? 'Downgrade to Basic' : 'Current Plan'}
            </Button>
          </Card>

          {/* Premium */}
          <Card className="p-8 border-2 border-primary shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-2">Premium</h3>
            <div className="text-4xl font-bold mb-4">$49</div>

            <Button
              fullWidth
              disabled={isPremium}
              onClick={() => setIsModalOpen(true)}
            >
              {isPremium ? 'Active Plan' : 'Upgrade to Premium'}
            </Button>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isProcessing && setIsModalOpen(false)}
        title="Upgrade to Premium"
      >
        <div className="space-y-4">
          <Input label="Card Number" placeholder="0000 0000 0000 0000" />
          <Input label="Expiry Date" placeholder="MM/YY" />
          <Input label="CVC" placeholder="123" type="password" />

          <Button fullWidth onClick={handleUpgrade} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay $49.00'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};