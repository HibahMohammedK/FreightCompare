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
  CreditCardIcon } from
'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { upgradeToPremium } from '../../redux/authSlice';
import { cancelPlan, upgradePlan } from '../../redux/subscriptionSlice';
import { motion } from 'framer-motion';
export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const currentSubscription = useAppSelector((state) =>
  state.subscription.subscriptions.find((sub) => sub.userId === user?.id) ?? null
  );
  const isPremium = user?.isPremium;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleUpgrade = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      if (user) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        dispatch(upgradeToPremium());
        dispatch(
          upgradePlan({
            userId: user.id,
            expiryDate: expiryDate.toISOString()
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

        <Card className="max-w-4xl mx-auto mb-8 p-6 border-border-light">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-primary mb-2">
                Your subscription
              </p>
              <h2 className="text-2xl font-bold text-text-dark mb-2">
                {isPremium ? 'Premium plan is active' : 'You are on the Basic plan'}
              </h2>
              <p className="text-sm text-text-light">
                {isPremium ?
                `Status: ${currentSubscription?.status ?? 'active'}${currentSubscription?.expiryDate ? ` • Renews until ${new Date(currentSubscription.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}` :
                'Upgrade here to unlock live agent chat, premium support, and advanced shipping tools.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant={isPremium ? 'outline' : 'primary'}
                onClick={() => navigate('/chat')}>
                {isPremium ? 'Open Premium Chat' : 'Preview Chat Access'}
              </Button>
              {isPremium &&
              <Button variant="secondary" onClick={handleCancel}>
                  Cancel Plan
                </Button>
              }
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 border-2 border-transparent hover:border-border-medium transition-colors">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-text-dark mb-2">Basic</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-text-dark">$0</span>
                <span className="text-text-light">/month</span>
              </div>
              <p className="text-sm text-text-medium">
                Essential features for occasional shippers.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <CheckIcon size={18} className="text-success" />
                Search and compare routes
              </div>
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <CheckIcon size={18} className="text-success" />
                Save up to 10 routes
              </div>
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <CheckIcon size={18} className="text-success" />
                Basic price alerts
              </div>
              <div className="flex items-center gap-3 text-sm text-text-lighter">
                <div className="w-[18px] flex justify-center">-</div>
                No priority support
              </div>
              <div className="flex items-center gap-3 text-sm text-text-lighter">
                <div className="w-[18px] flex justify-center">-</div>
                No direct agent chat
              </div>
            </div>

            <Button
              variant="outline"
              fullWidth
              disabled={!isPremium}
              onClick={() => navigate('/')}>
              
              {isPremium ? 'Downgrade to Basic' : 'Current Plan'}
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 border-2 border-primary relative shadow-lg">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Most Popular
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-primary mb-2">Premium</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-text-dark">$49</span>
                <span className="text-text-light">/month</span>
              </div>
              <p className="text-sm text-text-medium">
                Advanced tools and priority support for frequent shippers.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-text-dark font-medium">
                <CheckIcon size={18} className="text-primary" />
                Everything in Basic, plus:
              </div>
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <ShieldIcon size={18} className="text-primary" />
                Priority ticket support
              </div>
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <MessageSquareIcon size={18} className="text-primary" />
                Direct chat with agents
              </div>
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <ZapIcon size={18} className="text-primary" />
                Unlimited saved routes
              </div>
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <CheckIcon size={18} className="text-primary" />
                Advanced analytics
              </div>
            </div>

            <Button
              fullWidth
              disabled={isPremium}
              onClick={() => setIsModalOpen(true)}>
              
              {isPremium ? 'Active Plan' : 'Upgrade to Premium'}
            </Button>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isProcessing && setIsModalOpen(false)}
        title="Upgrade to Premium">
        
        <div className="space-y-6">
          <div className="bg-primary-light/30 p-4 rounded-xl border border-primary-light flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-text-dark">Premium Plan</h4>
              <p className="text-xs text-text-medium">Billed monthly</p>
            </div>
            <span className="text-xl font-bold text-primary">$49.00</span>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-text-dark flex items-center gap-2">
              <CreditCardIcon size={16} /> Payment Details
            </h4>
            <Input label="Card Number" placeholder="0000 0000 0000 0000" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry Date" placeholder="MM/YY" />
              <Input label="CVC" placeholder="123" type="password" />
            </div>
            <Input label="Name on Card" placeholder="John Doe" />
          </div>

          <Button fullWidth onClick={handleUpgrade} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay $49.00'}
          </Button>

          <p className="text-[10px] text-center text-text-lighter">
            By confirming your subscription, you allow FreightCompare to charge
            your card for this payment and future payments in accordance with
            their terms.
          </p>
        </div>
      </Modal>
    </div>);

};
