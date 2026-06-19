import React, { useEffect, useState } from "react";

import { Modal } from "./Modal";
import { Input } from "./Input";
import { Button } from "./Button";

import { useAppSelector } from "../../hooks/redux";

import {
  updateProfile,
  requestEmailChange,
  verifyEmailChange
} from "../../api/auth";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProfileEditModal: React.FC<Props> = ({
  isOpen,
  onClose
}) => {

  const user = useAppSelector(
    (state) => state.auth.user
  );

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [verificationId, setVerificationId] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {

    if (isOpen) {

      setUsername(user?.username || "");
      setEmail(user?.email || "");

      setOtp("");
      setOtpSent(false);
      setVerificationId("");

      setMessage("");
    }

  }, [isOpen, user]);

  const handleSave = async () => {

    try {

      setLoading(true);
      setMessage("");

      await updateProfile({
        username: username.trim()
      });

      setMessage(
        "Profile updated successfully"
      );

      setTimeout(() => {

        onClose();
        window.location.reload();

      }, 1000);

    } catch (err: any) {

      const error =
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.error ||
        "Failed to update profile";

      setMessage(error);

    } finally {

      setLoading(false);

    }
  };

  const handleEmailChange = async () => {

    if (email.trim() === user?.email) {

      setMessage(
        "Please enter a different email"
      );

      return;
    }

    try {

      setMessage("");

      const response =
        await requestEmailChange({
          new_email: email.trim()
        });

      setVerificationId(
        response.data.verification_id
      );

      setOtpSent(true);

      setMessage(
        "OTP sent to your new email"
      );

    } catch (err: any) {

      const error =
        err?.response?.data?.new_email?.[0] ||
        err?.response?.data?.error ||
        "Failed to send OTP";

      setMessage(error);
    }
  };

  const handleVerifyOTP = async () => {

    try {

      setMessage("");

      await verifyEmailChange({
        verification_id: verificationId,
        otp
      });

      setMessage(
        "Email updated successfully"
      );

      setTimeout(() => {

        onClose();
        window.location.reload();

      }, 1000);

    } catch (err: any) {

      const error =
        err?.response?.data?.error ||
        "Invalid OTP";

      setMessage(error);
    }
  };

  return (

    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
    >

      <div className="space-y-5">

        {message && (
          <p
            className={`text-sm ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Username */}

        <Input
          label="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <Button
          onClick={handleSave}
          disabled={loading}
        >
          {
            loading
              ? "Saving..."
              : "Save Username"
          }
        </Button>

        <hr />

        {/* Email */}

        <Input
          label="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Button
          type="button"
          onClick={handleEmailChange}
        >
          Change Email
        </Button>

        {otpSent && (

          <div className="space-y-4">

            <Input
              label="OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
            />

            <Button
              type="button"
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </Button>

          </div>

        )}

      </div>

    </Modal>
  );
};