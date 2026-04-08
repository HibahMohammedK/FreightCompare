import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { ArrowLeftIcon, CheckCircle2Icon } from 'lucide-react';
import { Card } from '../../components/shared/Card';
export const EmailSentPage: React.FC = () => {
  return (
    <AuthLayout showSidebar={false}>
      <Card className="w-full max-w-[448px] mx-auto p-8 shadow-sm border-border-light">
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-medium text-text-light hover:text-text-dark mb-8 transition-colors">
          
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to login
        </Link>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center text-success mb-6">
            <CheckCircle2Icon size={32} />
          </div>

          <h2 className="text-2xl font-bold text-text-dark mb-4">
            Check your email
          </h2>

          <p className="text-sm text-text-light mb-6">
            We've sent a password reset link to <br />
            <span className="font-medium text-text-dark">
              hibah@example.com
            </span>
          </p>

          <p className="text-sm text-text-light">
            Didn't receive the email?{' '}
            <button className="text-primary font-medium hover:underline">
              Click to resend
            </button>
          </p>
        </div>
      </Card>
    </AuthLayout>);

};