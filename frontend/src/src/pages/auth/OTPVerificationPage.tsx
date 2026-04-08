import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Button } from '../../components/shared/Button';
import { ShipIcon } from 'lucide-react';
import { Card } from '../../components/shared/Card';
export const OTPVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Move to next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (
  index: number,
  e: React.KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };
  return (
    <AuthLayout showSidebar={false}>
      <Card className="w-full max-w-[448px] mx-auto p-8 shadow-sm border-border-light flex flex-col items-center">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-6">
          <ShipIcon size={24} />
        </div>

        <h2 className="text-2xl font-bold text-text-dark mb-4">
          Verify your email
        </h2>

        <p className="text-sm text-text-light text-center mb-8 max-w-[340px]">
          We've sent a 6-digit verification code to your email address.
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, index) =>
            <input
              key={index}
              ref={(el) => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-semibold rounded-xl border border-border-light bg-bg-light focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />

            )}
          </div>

          <Button type="submit" fullWidth className="mb-4">
            Verify Account
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm font-medium text-text-lighter hover:text-text-light transition-colors">
              
              Resend code in 55s
            </button>
          </div>
        </form>
      </Card>
    </AuthLayout>);

};