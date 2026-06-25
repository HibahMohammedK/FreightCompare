import React, { useState } from 'react';
import { UserNavbar } from "../../components/shared/UserNavbar";
import { Card } from "../../components/shared/Card";
import { Button } from "../../components/shared/Button";

import { useAppSelector } from "../../hooks/redux";

import {
  PencilIcon,
  ShieldCheckIcon
} from "lucide-react";

import { ProfileEditModal } from "../../components/shared/ProfileEditModal";
import { ChangePasswordModal } from "../../components/shared/ChangePasswordModal";

export const ProfilePage = () => {

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

  console.log(user);

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
              {user?.username?.charAt(0)?.toUpperCase()}
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-lg font-semibold">
                  {user?.first_name || user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username}
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
                @{user?.username}
              </p>

              <p className="text-sm text-text-light">
                {user?.email}
              </p>

              <p className="text-xs text-primary mt-1 uppercase tracking-wide">
                {user?.role}
              </p>

            </div>

          </div>

        </Card>

        {/* Security */}
        <Card className="shadow-card">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                <ShieldCheckIcon size={20} />
              </div>

              <div>

                <h2 className="text-lg font-semibold">
                  Security
                </h2>

                <p className="text-sm text-text-light">
                  Change your password.
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

      </div>

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