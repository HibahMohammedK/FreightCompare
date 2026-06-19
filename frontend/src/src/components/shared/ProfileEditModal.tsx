import React, { useEffect, useState } from "react";

import { Modal } from "./Modal";
import { Input } from "./Input";
import { Button } from "./Button";

import { useAppSelector } from "../../hooks/redux";
import { updateProfile } from "../../api/auth";

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

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {

    if (isOpen) {

      setUsername(
        user?.username || ""
      );

      setMessage("");

    }

  }, [isOpen, user]);

  const handleSave = async () => {

    try {

      setLoading(true);

      await updateProfile({
        username
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
        "Failed to update profile";

      setMessage(error);

    } finally {

      setLoading(false);

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
          <p className="text-sm text-primary">
            {message}
          </p>
        )}

        <Input
          label="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <Input
          label="Email"
          value={user?.email || ""}
          disabled
        />

        <Button
          onClick={handleSave}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </Button>

      </div>

    </Modal>
  );
};