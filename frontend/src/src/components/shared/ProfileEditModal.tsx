import React, { useEffect, useState } from "react";

import { Modal } from "./Modal";
import { Input } from "./Input";
import { Button } from "./Button";
import { Trash2Icon } from "lucide-react";


import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { updateUser } from "../../redux/authSlice";

import {
  updateProfile,
  requestEmailChange,
  verifyEmailChange
} from "../../api/auth";
import { ConfirmationDialog } from "./ConfirmationDialog";

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
  const dispatch = useAppDispatch()

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] =
    useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = 
    useState(false);
  const [deletingImage, setDeletingImage] =
    useState(false);

  useEffect(() => {

    if (isOpen) {

      setFirstName(user?.first_name || "");
      setLastName(user?.last_name || "");
      setUsername(user?.username || "");
      setEmail(user?.email || "");

      setOtp("");
      setOtpSent(false);
      setVerificationId("");

      setMessage("");
      setProfileImage(null);
    }

  }, [isOpen]);

  const handleSave = async () => {

    try {

      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append(
          "first_name",
          firstName.trim()
      );

      formData.append(
          "last_name",
          lastName.trim()
      );

      formData.append(
          "username",
          username.trim()
      );

      if (profileImage) {
          formData.append(
              "profile_image",
              profileImage
          );
      }

      const response = await updateProfile(formData);

      dispatch(
          updateUser(response.data)
      );    

      setMessage(
        "Profile updated successfully"
      );

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err: any) {

      const data = err?.response?.data;

      const error =
          data?.first_name?.[0] ||
          data?.last_name?.[0] ||
          data?.username?.[0] ||
          data?.profile_image?.[0] ||
          data?.non_field_errors?.[0] ||
          data?.detail ||
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

      const response = await verifyEmailChange({
        verification_id: verificationId,
        otp
      });

      console.log("SUCCESS", response);

      setMessage(
        "Email updated successfully"
      );

      dispatch(
          updateUser({
              email: response.data.email,
          })
      );

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err: any) {
      
      console.log("ERROR", err);
      console.log("STATUS", err.response?.status);
      console.log("DATA", err.response?.data);

      const error =
        err?.response?.data?.error ||
        "Invalid OTP";

      setMessage(error);
    }
  };

  const handleDeleteProfileImage = async () => {

      try {

          setDeletingImage(true);

          const formData = new FormData();

          formData.append(
              "remove_profile_image",
              "true"
          );

          await updateProfile(formData);

          dispatch(
              updateUser({
                  profile_image: null,
              })
          );

          setProfileImage(null);

          setIsDeleteImageModalOpen(false);

      } catch (err: any) {

          setMessage(
              "Failed to delete profile image."
          );

      } finally {

          setDeletingImage(false);

      }

  };

  return (
    <>

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

            <div className="flex flex-col items-center gap-4">
              <div className="relative w-24 h-24">
                <div
                    className="
                        w-full
                        h-full
                        rounded-full
                        bg-bg-light
                        border-2
                        border-dashed
                        border-border-medium
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                    "
                >

                    {(profileImage || user?.profile_image) ? (

                        <img
                            src={
                                profileImage
                                    ? URL.createObjectURL(profileImage)
                                    : user!.profile_image!
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />

                    ) : (

                        <span className="text-3xl font-bold text-primary">
                            {user?.username?.charAt(0).toUpperCase()}
                        </span>

                    )}

                </div>

                {(profileImage || user?.profile_image) && (

                    <button
                        type="button"
                        onClick={() =>
                            setIsDeleteImageModalOpen(true)
                        }
                        className="
                            absolute
                            bottom-0
                            right-0
                            w-8
                            h-8
                            rounded-full
                            bg-red-250
                            text-white
                            flex
                            items-center
                            justify-center
                            shadow-md
                            transition-colors
                            hover:bg-red-500
                        "
                    >
                        <Trash2Icon size={16} />
                    </button>

                )}

            </div>
              <label
                  className="
                      cursor-pointer
                      rounded-lg
                      border
                      border-border-medium
                      px-4
                      py-2
                      text-sm
                      hover:bg-bg-light
                  "
              >
                  Choose Profile Image

                  <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                          setProfileImage(
                              e.target.files?.[0] ?? null
                          )
                      }
                  />
              </label>

              <p className="text-xs text-text-light">
                  JPG, PNG or WEBP
              </p>
                    <div className="grid grid-cols-2 gap-4">

              <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) =>
                      setFirstName(e.target.value)
                  }
              />

              <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) =>
                      setLastName(e.target.value)
                  }
              />

          </div>
          </div>

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
                : "Save Profile"
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
      <ConfirmationDialog
      isOpen={isDeleteImageModalOpen}
      title="Delete Profile Picture"
      message="Are you sure you want to remove your profile picture?"
      confirmText="Delete"
      confirmVariant="danger"
      loading={deletingImage}
      onClose={() =>
          setIsDeleteImageModalOpen(false)
      }
      onConfirm={handleDeleteProfileImage}
  />
</>
  );
};