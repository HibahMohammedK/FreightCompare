import React, { useState } from "react";
import { Card } from "../../components/shared/Card";
import { Input } from "../../components/shared/Input";
import { Button } from "../../components/shared/Button";
import { useAppSelector } from "../../hooks/redux";
import {
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon
} from "lucide-react";

import { changePassword } from "../../api/auth";

export const AdminProfilePage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [errors, setErrors] = useState<{
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
    general?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const handleErrors = (err: any) => {
    const data = err?.response?.data;

    if (!data) {
      setErrors({ general: "Something went wrong" });
      return;
    }

    setErrors({
      current_password: data.current_password?.[0],
      new_password: data.new_password?.[0],
      confirm_password: data.confirm_password?.[0],
      general: data.error
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setErrors({});

    const newPassword = form.new_password.trim();
    const confirmPassword = form.confirm_password.trim();

    if (newPassword !== confirmPassword) {
      setErrors({
        confirm_password: "Passwords do not match"
      });
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        current_password: form.current_password,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      setErrors({
        general: "Password updated successfully"
      });

      setForm({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
    } catch (err: any) {
      handleErrors(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-bg-light p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-dark">
          Profile Settings
        </h1>
        <p className="text-sm text-text-light mt-1">
          Manage your account information and security.
        </p>
      </div>

      {/* User Info */}
      <Card className="shadow-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-lg">
            {user?.username?.charAt(0).toUpperCase() || <UserIcon size={20} />}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-dark">
              {user?.username}
            </h2>
            <p className="text-sm text-text-light">{user?.email}</p>
            <p className="text-xs text-primary mt-1 uppercase tracking-wide">
              Administrator
            </p>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
            <ShieldCheckIcon size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-dark">
              Change Password
            </h2>
            <p className="text-sm text-text-light">
              Update your admin login password.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <p
              className={`text-sm ${
                errors.general.includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {errors.general}
            </p>
          )}

          <PasswordInput
            label="Current Password"
            value={form.current_password}
            onChange={(value) =>
              setForm({ ...form, current_password: value })
            }
            show={showCurrent}
            setShow={setShowCurrent}
            error={errors.current_password}
          />

          <PasswordInput
            label="New Password"
            value={form.new_password}
            onChange={(value) =>
              setForm({ ...form, new_password: value })
            }
            show={showNew}
            setShow={setShowNew}
            error={errors.new_password}
          />

          <PasswordInput
            label="Confirm Password"
            value={form.confirm_password}
            onChange={(value) =>
              setForm({ ...form, confirm_password: value })
            }
            show={showConfirm}
            setShow={setShowConfirm}
            error={errors.confirm_password}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  error?: string;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  show,
  setShow,
  error
}) => (
  <div className="relative">
    <Input
      label={label}
      type={show ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />

    <button
      type="button"
      onClick={() => setShow(!show)}
      className="absolute right-3 top-[60%] -translate-y-1/2 text-text-lighter hover:text-text-medium"
    >
      {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
    </button>

    {error && (
      <p className="text-red-500 text-xs mt-1">
        {error}
      </p>
    )}
  </div>
);