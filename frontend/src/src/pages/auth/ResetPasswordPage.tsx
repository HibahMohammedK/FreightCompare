import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { Input } from "../../components/shared/Input";
import { Button } from "../../components/shared/Button";
import { Card } from "../../components/shared/Card";
import { LockIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon } from "lucide-react";

import API from "../../api/axios";
import { validateResetToken } from "../../api/auth";

export const ResetPasswordPage: React.FC = () => {

  const [params] = useSearchParams();
  const token = params.get("token");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    new_password: "",
    confirm_password: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await validateResetToken(token!);

        setTokenValid(response.valid);
      } catch {
        setTokenValid(false);
      } finally {
        setChecking(false);
      }
    };

    if (token) {
      checkToken();
    } else {
      setChecking(false);
      setTokenValid(false);
    }
  }, [token]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await API.post("/users/reset-password/", {
        token,
        new_password: form.new_password,
        confirm_password: form.confirm_password
      });

      navigate("/login");

    } catch (err: any) {

      const data = err.response?.data;

      if (data?.new_password) {
        setError(data.new_password[0]);
      } else if (data?.confirm_password) {
        setError(data.confirm_password[0]);
      } else if (data?.token) {
        setError(data.token[0]);
      } else {
        setError("Password reset failed");
      }

    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <AuthLayout showSidebar={false}>
        <Card className="w-full max-w-[448px] mx-auto p-8">
          <p>Checking reset link...</p>
        </Card>
      </AuthLayout>
    );
  }

  if (!tokenValid) {
    return (
      <AuthLayout showSidebar={false}>
        <Card className="w-full max-w-[448px] mx-auto p-8">

          <h2 className="text-2xl font-bold mb-2">
            Link Expired
          </h2>

          <p className="text-sm text-text-light mb-6">
            This password reset link has expired or has already been used.
          </p>

          <Link
            to="/forgot-password"
            className="text-primary hover:underline"
          >
            Request New Reset Link
          </Link>

        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showSidebar={false}>
      <Card className="w-full max-w-[448px] mx-auto p-8">

        <Link
          to="/login"
          className="inline-flex items-center text-sm mb-6"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to login
        </Link>

        <h2 className="text-2xl font-bold mb-2">
          Reset Password
        </h2>

        <p className="text-sm text-text-light mb-6">
          Enter your new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              icon={<LockIcon size={18} />}
              value={form.new_password}
              onChange={(e) =>
                setForm({ ...form, new_password: e.target.value })
              }
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px]"
            >
              {showPassword ? <EyeOffIcon size={16}/> : <EyeIcon size={16}/>}
            </button>
          </div>

          <Input
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            icon={<LockIcon size={18} />}
            value={form.confirm_password}
            onChange={(e) =>
              setForm({ ...form, confirm_password: e.target.value })
            }
            required
          />

          {error && (
            <div className="space-y-2">
                <p className="text-red-500 text-sm">{error}</p>

                {error.includes("expired") && (
                <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                >
                    Request a new reset link
                </Link>
                )}
            </div>
            )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

        </form>

      </Card>
    </AuthLayout>
  );
};