import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangleIcon } from "lucide-react";

import { UserNavbar } from "../../components/shared/UserNavbar";
import { Card } from "../../components/shared/Card";
import { Button } from "../../components/shared/Button";

export const SubscriptionCancelPage: React.FC = () => {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-bg-light flex flex-col">

      <UserNavbar />

      <div className="flex-1 flex items-center justify-center px-6 py-12">

        <Card className="max-w-xl w-full p-8 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-warning-bg text-warning">

            <AlertTriangleIcon size={44} />

          </div>

          <h1 className="mt-6 text-3xl font-bold text-text-dark">
            Payment Cancelled
          </h1>

          <p className="mt-3 text-text-light">
            No payment was processed. Your subscription has not changed.
          </p>

          <p className="mt-2 text-sm text-text-lighter">
            You can upgrade to Premium at any time to unlock advanced
            features.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">

            <Button
              fullWidth
              onClick={() => navigate("/pricing")}
            >
              Back to Pricing
            </Button>

            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate("/")}
            >
              Return Home
            </Button>

          </div>

        </Card>

      </div>

    </div>

  );
};