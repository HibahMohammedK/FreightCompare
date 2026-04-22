import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { MailIcon, ArrowLeftIcon } from 'lucide-react';
import { Card } from '../../components/shared/Card';

import API from '../../api/axios';

export const ForgotPasswordPage: React.FC = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || sent) return;
    if (!email.trim()) return;

    setMessage(null);

    try {
      setLoading(true);

      await API.post("/users/forgot-password/", {
        email
      });

      // 🔐 Always same message (security)
      setMessage("If an account exists, a reset link has been sent.");
      setSent(true);

    } catch (err) {
      setMessage("If an account exists, a reset link has been sent.");
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showSidebar={false}>
      <Card className="w-full max-w-[448px] mx-auto p-8 shadow-sm border-border-light">

        <Link
          to="/login"
          className="inline-flex items-center text-sm font-medium text-text-light hover:text-text-dark mb-6 transition-colors"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to login
        </Link>

        <h2 className="text-2xl font-bold text-text-dark mb-2">
          Forgot password?
        </h2>

        <p className="text-sm text-text-light mb-8">
          No worries, we'll send you reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            icon={<MailIcon size={18} />}
            disabled={sent}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage(null);
            }}
            required
          />

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
              {message}
            </div>
          )}

          <Button type="submit" fullWidth disabled={loading || sent}>
            {sent
              ? "Email Sent"
              : loading
              ? "Sending..."
              : "Send reset link"}
          </Button>

        </form>

      </Card>
    </AuthLayout>
  );
};