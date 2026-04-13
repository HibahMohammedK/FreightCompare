import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

import { useAppDispatch } from '../../hooks/redux';
import {
  setAccessToken,
  setUser,
  loginStart,
  loginFailure,
} from '../../redux/authSlice';

import { loginUser, getProfile } from '../../api/auth';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(loginStart());

    try {
      // 1. Login
      const res = await loginUser({ email, password });

      // 2. Store access token
      dispatch(setAccessToken(res.data.access));

      // 3. Fetch profile
      const profileRes = await getProfile();

      // 4. Store user
      dispatch(setUser(profileRes.data));

      // 5. Navigate
      const user = profileRes.data;

      dispatch(setUser(user));

      // 🔥 ROLE BASED REDIRECT
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "staff") {
        navigate("/staff");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      dispatch(loginFailure("Invalid email or password"));
      console.error(err);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-dark mb-2">Welcome back</h2>
        <p className="text-sm text-text-light">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@company.com"
          icon={<MailIcon size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-text-medium">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<LockIcon size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter hover:text-text-medium"
            >
              {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" fullWidth className="mt-2">
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-light">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};