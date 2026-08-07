import { useNavigate } from "react-router-dom";

import { Modal } from "../Modal";
import { Button } from "../Button";

interface PremiumUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
}

export const PremiumUpgradeModal: React.FC<
    PremiumUpgradeModalProps
> = ({
    isOpen,
    onClose,
    title = "Upgrade to Premium",
    message,
}) => {

    const navigate = useNavigate();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >

            <div className="space-y-6">

                <p className="text-text-light">
                    {message}
                </p>

                <div className="flex gap-3">

                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={onClose}
                    >
                        Maybe Later
                    </Button>

                    <Button
                        fullWidth
                        onClick={() =>
                            navigate("/pricing")
                        }
                    >
                        Upgrade Now
                    </Button>

                </div>

            </div>

        </Modal>
    );

};