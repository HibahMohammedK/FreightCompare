import React, { useState } from "react";
import { UserNavbar } from "../../components/shared/UserNavbar";
import { Card } from "../../components/shared/Card";
import { Input } from "../../components/shared/Input";
import { Button } from "../../components/shared/Button";
import { useAppSelector } from "../../hooks/redux";
import {
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon
} from "lucide-react";

import { changePassword } from "../../api/auth";

export const ProfilePage = () => {

  const user = useAppSelector(
    (state) => state.auth.user
  );

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

  // 🔥 Backend error mapping
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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (loading) return;

    setErrors({}); // clear previous errors

    const newPassword = form.new_password.trim();
    const confirmPassword = form.confirm_password.trim();

    // ✅ frontend validation
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

      // ✅ success (inline feedback)
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

    <div className="min-h-screen bg-bg-light flex flex-col">

      <UserNavbar />

      {/* Hero */}
      <div className="bg-primary-dark pt-10 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Account Settings
          </h1>
          <p className="text-primary-lighter">
            Manage your profile security.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 -mt-16 pb-12">

        {/* User Info */}
        <Card className="mb-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary">
              {user?.username?.charAt(0)}
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                {user?.username}
              </h2>

              <p className="text-sm text-text-light">
                {user?.email}
              </p>
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="shadow-card">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
              <ShieldCheckIcon size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Change Password
              </h2>
              <p className="text-sm text-text-light">
                Update your login password.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Global message */}
            {errors.general && (
              <p className={`text-sm ${
                errors.general.includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}>
                {errors.general}
              </p>
            )}

            {/* Current Password */}
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

            {/* New Password */}
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

            {/* Confirm Password */}
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

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>

          </form>
        </Card>
      </div>
    </div>
  );
};


// 🔥 Reusable component (typed properly)
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
      {show
        ? <EyeOffIcon size={18} />
        : <EyeIcon size={18} />
      }
    </button>

    {/* Inline error */}
    {error && (
      <p className="text-red-500 text-xs mt-1">
        {error}
      </p>
    )}

  </div>
);