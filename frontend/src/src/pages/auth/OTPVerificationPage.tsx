import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Button } from '../../components/shared/Button';
import { ShipIcon } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import API from '../../api/axios';
import { useAppDispatch } from '../../hooks/redux';
import { setAccessToken, setUser } from '../../redux/authSlice';
import { getProfile } from '../../api/auth';

export const OTPVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [verificationId, setVerificationId] = useState(
    location.state?.verification_id
  );
  const email = location.state?.email;

  // 🔐 redirect if accessed directly
  useEffect(() => {
    if (!verificationId) {
      navigate('/register');
    }
  }, [verificationId, navigate]);

  // ⏱️ timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 📩 resend OTP
  const handleResend = async () => {
    try {
      setError(null);

      const res = await API.post('/users/resend-otp/', { email });

      setVerificationId(res.data.verification_id); // ✅ correct way
      setTimer(60);

    } catch (err: any) {
      setError("Failed to resend OTP");
    }
  };

  // 🔢 input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ⌫ backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 📋 paste support
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData('text').trim();

    if (!/^\d{6}$/.test(pasted)) return;

    const newOtp = pasted.split('');
    setOtp(newOtp);

    inputRefs.current[5]?.focus();
  };

  // 🚀 submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.includes('')) {
      setError("Enter full OTP");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await API.post('/users/verify-otp/', {
        verification_id: verificationId,
        otp: otp.join(''),
      });

      // ✅ store access token
      dispatch(setAccessToken(res.data.access));

      // ❌ DO NOT set cookie manually

      // ✅ fetch profile
      const profileRes = await getProfile();
      dispatch(setUser(profileRes.data));

      setMessage("Account verified. Logging you in...");

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err: any) {
      const msg =
        err.response?.data?.error || "Invalid or expired OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
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
          We've sent a 6-digit code to{' '}
          <span className="font-medium text-text-dark">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="w-full">

          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-14 text-center text-xl font-semibold rounded-xl border border-border-light bg-bg-light focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            ))}
          </div>

          {message && (
            <p className="text-green-600 text-sm text-center mb-2">
              {message}
            </p>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center mb-2">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth className="mb-4" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Account'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              disabled={timer > 0}
              onClick={handleResend}
              className="text-sm font-medium text-text-lighter hover:text-text-light transition-colors"
            >
              {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
            </button>
          </div>

        </form>
      </Card>
    </AuthLayout>
  );
};