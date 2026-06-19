import React, { useState } from "react";

import { Card } from "../../components/shared/Card";
import { Button } from "../../components/shared/Button";

import { useAppSelector } from "../../hooks/redux";

import {
  UserIcon,
  PencilIcon,
  ShieldCheckIcon
} from "lucide-react";

import { ProfileEditModal } from "../../components/shared/ProfileEditModal";
import { ChangePasswordModal } from "../../components/shared/ChangePasswordModal";

export const StaffProfilePage: React.FC = () => {

  const user = useAppSelector(
    (state) => state.auth.user
  );

  const [
    isEditProfileOpen,
    setIsEditProfileOpen
  ] = useState(false);

  const [
    isPasswordOpen,
    setIsPasswordOpen
  ] = useState(false);

  return (

    <div className="flex-1 overflow-y-auto p-8 bg-bg-light space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-text-dark">
          Staff Profile
        </h1>

        <p className="text-sm text-text-light">
          Manage your account and security settings.
        </p>
      </div>

      {/* User Info */}
      <Card className="p-6">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-bold text-lg">
            {user?.username?.charAt(0)?.toUpperCase() ||
              <UserIcon size={20} />}
          </div>

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-lg font-semibold text-text-dark">
                {user?.username}
              </h2>

              <button
                onClick={() =>
                  setIsEditProfileOpen(true)
                }
                className="text-text-light hover:text-primary transition-colors"
              >
                <PencilIcon size={16} />
              </button>

            </div>

            <p className="text-sm text-text-light">
              {user?.email}
            </p>

            <p className="text-xs text-primary mt-1 uppercase tracking-wide">
              Staff Member
            </p>

          </div>

        </div>

      </Card>

      {/* Security */}
      <Card className="p-6">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
              <ShieldCheckIcon size={20} />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-text-dark">
                Security
              </h2>

              <p className="text-sm text-text-light">
                Change your account password.
              </p>

            </div>

          </div>

          <Button
            onClick={() =>
              setIsPasswordOpen(true)
            }
          >
            Open
          </Button>

        </div>

      </Card>

      <ProfileEditModal
        isOpen={isEditProfileOpen}
        onClose={() =>
          setIsEditProfileOpen(false)
        }
      />

      <ChangePasswordModal
        isOpen={isPasswordOpen}
        onClose={() =>
          setIsPasswordOpen(false)
        }
      />

    </div>
  );
};