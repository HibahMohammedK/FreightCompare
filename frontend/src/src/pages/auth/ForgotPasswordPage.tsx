import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { MailIcon, ArrowLeftIcon } from 'lucide-react';
import { Card } from '../../components/shared/Card';
export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/email-sent');
  };
  return (
    <AuthLayout showSidebar={false}>
      <Card className="w-full max-w-[448px] mx-auto p-8 shadow-sm border-border-light">
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-medium text-text-light hover:text-text-dark mb-6 transition-colors">
          
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
            required />
          

          <Button type="submit" fullWidth>
            Send reset link
          </Button>
        </form>
      </Card>
    </AuthLayout>);

};