import React, { useState } from "react";

import { Modal } from "../shared/Modal";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";

import {
  EyeIcon,
  EyeOffIcon
} from "lucide-react";

import { createStaff } from "../../api/staff";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const CreateStaffModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess
}) => {

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [staffForm, setStaffForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);
      setMessage("");

      await createStaff(staffForm);

      setMessage(
        "Staff account created successfully"
      );

      setStaffForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: ""
      });

      onSuccess?.();

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err: any) {

      const error =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.password?.[0] ||
        err?.response?.data?.error ||
        "Failed to create staff";

      setMessage(error);

    } finally {

      setLoading(false);

    }

  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Staff Account"
      maxWidth="max-w-md"
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {message && (
          <p
            className={`text-sm ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">

          <Input
            label="First Name"
            value={staffForm.first_name}
            onChange={(e) =>
              setStaffForm({
                ...staffForm,
                first_name: e.target.value
              })
            }
          />

          <Input
            label="Last Name"
            value={staffForm.last_name}
            onChange={(e) =>
              setStaffForm({
                ...staffForm,
                last_name: e.target.value
              })
            }
          />

        </div>

        <Input
          label="Username"
          value={staffForm.username}
          onChange={(e) =>
            setStaffForm({
              ...staffForm,
              username: e.target.value
            })
          }
        />

        <Input
          label="Email"
          type="email"
          value={staffForm.email}
          onChange={(e) =>
            setStaffForm({
              ...staffForm,
              email: e.target.value
            })
          }
        />

        <div className="relative">

          <Input
            label="Temporary Password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={staffForm.password}
            onChange={(e) =>
              setStaffForm({
                ...staffForm,
                password: e.target.value
              })
            }
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
              absolute
              right-3
              top-[68%]
              -translate-y-1/2
              text-text-lighter
              hover:text-text-medium
            "
          >
            {showPassword
              ? <EyeOffIcon size={18} />
              : <EyeIcon size={18} />
            }
          </button>

        </div>

        <Button
          type="submit"
          disabled={loading}
          fullWidth
        >
          {loading
            ? "Creating..."
            : "Create Staff"}
        </Button>

      </form>

    </Modal>
  );
};