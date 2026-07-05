import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setAccessToken,
  setUser,
  loginStart,
  loginFailure,
  setAuthLoading,
} from '../../redux/authSlice';

import { loginUser, getProfile, loginWithGoogle  } from '../../api/auth';
import { GoogleLogin } from "@react-oauth/google";
import { notificationSocket } from '../../websocket/notificationSocket';


export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const authError = useAppSelector(
    (state) => state.auth.error
  );
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await loginWithGoogle({
        token: credentialResponse.credential,
      });

      dispatch(setAccessToken(res.data.access));

      notificationSocket.connect(
          res.data.access
      );

      const profileRes = await getProfile();
      const user = profileRes.data;

      dispatch(setUser(user));

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "staff") navigate("/staff");
      else navigate("/");

    } catch (err: any) {
      dispatch(loginFailure("Google login failed"));
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    if (!email.trim() || !password.trim()) return;

    dispatch(loginFailure(""));
    setLoading(true);
    dispatch(loginStart());

    try {
      const res = await loginUser({ email, password });

      dispatch(setAccessToken(res.data.access));

      notificationSocket.connect(
          res.data.access
      );

      const profileRes = await getProfile();
      const user = profileRes.data;

      dispatch(setUser(user));

      dispatch(setAuthLoading(false));

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "staff") {
        navigate("/staff");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      const data = err.response?.data;

      dispatch(
        loginFailure(
          data?.error || "Invalid email or password"
        )
      );
    } finally {
      setLoading(false);
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
          onChange={(e) => {
            setEmail(e.target.value);
             dispatch(loginFailure(""));
          }}
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
              onChange={(e) => {
                setPassword(e.target.value);
                dispatch(loginFailure(""));
              }}
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

        {/* ✅ Proper error placement */}
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
            {authError}
          </div>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

      </form>

      <p className="mt-8 text-center text-sm text-text-light">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-light"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-text-light">Or continue with</span>
        </div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() =>
            dispatch(loginFailure("Google login failed"))
          }
        />
      </div>
    </AuthLayout>
  );
};