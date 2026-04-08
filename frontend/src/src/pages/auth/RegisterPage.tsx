import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { MailIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/verify');
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
          required />
        

        <Input
          label="Email address"
          type="email"
          placeholder="you@company.com"
          icon={<MailIcon size={18} />}
          required />
        

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<LockIcon size={18} />}
            required />
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-text-lighter hover:text-text-medium">
            
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        </div>

        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<LockIcon size={18} />}
          required />
        

        <Button type="submit" fullWidth className="mt-4">
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-border-medium" />
        <span className="text-xs font-medium text-text-lighter">or</span>
        <div className="h-[1px] flex-1 bg-border-medium" />
      </div>

      <Button
        variant="secondary"
        fullWidth
        className="bg-white hover:bg-gray-50">
        
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4" />
          
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853" />
          
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05" />
          
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335" />
          
        </svg>
        Sign up with Google
      </Button>

      <p className="mt-8 text-center text-sm text-text-light">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>);

};