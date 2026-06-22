import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { MailIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

import { registerUser } from '../../api/auth';

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    general: "",
  });

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    // clear old errors
    setFieldErrors({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      general: "",
    }); 

    try {
      setLoading(true);

      const res = await registerUser({
        username,
        email,
        password,
        confirm_password: confirmPassword,
      });

      navigate('/verify', {
        state: {
          verification_id: res.data.verification_id,
          email,
        },
      });

    } catch (err: any) {

      const errors = err.response?.data;

      setFieldErrors({
        username: errors?.username?.[0] || "",
        email: errors?.email?.[0] || "",
        password: errors?.password?.[0] || "",
        confirm_password: errors?.confirm_password?.[0] || "",
        general:
          errors?.non_field_errors?.[0] ||
          "Registration failed",
      });


        } finally {
          setLoading(false);
        }
      };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-dark mb-2">
          Create an account
        </h2>
        <p className="text-sm text-text-light">
          Enter your details to get started
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">

        <Input
          label="Full name"
          type="text"
          placeholder="John Doe"
          icon={<UserIcon size={18} />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {fieldErrors.username && (
          <p className="text-red-500 text-sm mt-1">
            {fieldErrors.username}
          </p>
        )}

        <Input
          label="Email address"
          type="email"
          placeholder="you@company.com"
          icon={<MailIcon size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {fieldErrors.email && (
          <p className="text-red-500 text-sm mt-1">
            {fieldErrors.email}
          </p>
        )}

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<LockIcon size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {fieldErrors.password && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.password}
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-text-lighter hover:text-text-medium"
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        </div>

        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<LockIcon size={18} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {fieldErrors.confirm_password && (
          <p className="text-red-500 text-sm mt-1">
            {fieldErrors.confirm_password}
          </p>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>

      </form>

      <p className="mt-8 text-center text-sm text-text-light">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};