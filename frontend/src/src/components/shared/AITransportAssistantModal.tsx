import React, { useEffect, useState } from "react";
import { SparklesIcon, Loader2Icon } from "lucide-react";

import { Modal } from "./Modal";
import CreatableSelect from "react-select/creatable";
import Select from 'react-select';
import { Button } from "./Button";

import { searchTransportAI } from "../../api/ai";
import { AIRecommendation } from "../../types/ai";
import { AIRPORTS, SEAPORTS } from "../../constants";
import { PremiumUpgradeModal } from "./premium/PremiumUpgradeModal";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (
      recommendation: AIRecommendation,
      source: string,
      destination: string,
      transportType: "air" | "sea"
  ) => void;

  initialSource?: string;
  initialDestination?: string;
  initialTransportType?: "air" | "sea";
  actionLabel?: string
}

export const AITransportAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApply,
  initialSource,
  initialDestination,
  initialTransportType,
  actionLabel = "Apply",
}) => {
  const [source, setSource] = useState(initialSource ?? "");
  const [destination, setDestination] = useState(initialDestination ?? "");
  const [transportType, setTransportType] =
    useState<"air" | "sea">(initialTransportType ?? "air");

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<
    AIRecommendation[]
  >([]);

  const [showUpgradeModal, setShowUpgradeModal] =
      useState(false);

  const [upgradeMessage, setUpgradeMessage] =
      useState("");

  const locationOptions =
    transportType === "air"
        ? AIRPORTS
        : SEAPORTS;

  useEffect(() => {
    setSource("");
    setDestination("");
    }, [transportType]);

  useEffect(() => {
    if (!isOpen) return;

    setSource(initialSource ?? "");
    setDestination(initialDestination ?? "");
    setTransportType(initialTransportType ?? "air");
    }, [
    isOpen,
    initialSource,
    initialDestination,
    initialTransportType,
    ]);

  const handleSearch = async () => {
    try {
      setLoading(true);

      const res = await searchTransportAI({
        source,
        destination,
        transport_type: transportType,
      });

      setRecommendations([res.data]);
    } catch (error: any) {
            if (error.response?.status === 403) {

          onClose();

          setUpgradeMessage(
              error.response.data.detail
          );

          setShowUpgradeModal(true);

          return;
      }
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="AI Transport Assistant"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-medium">
                  Origin Airport / Port
              </label>

              <CreatableSelect
                  options={locationOptions}
                  value={
                  source
                      ? {
                          label: source,
                          value: source,
                      }
                      : null
                  }
                  onChange={(selected: any) => {
                  setSource(selected?.value || "");
                  }}
                  onCreateOption={(inputValue: string) => {
                  setSource(inputValue);
                  }}
                  placeholder="Select or type origin"
              />
              </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-medium">
                  Destination Airport / Port
              </label>

              <CreatableSelect
                  options={locationOptions}
                  value={
                  destination
                      ? {
                          label: destination,
                          value: destination,
                      }
                      : null
                  }
                  onChange={(selected: any) => {
                  setDestination(selected?.value || "");
                  }}
                  onCreateOption={(inputValue: string) => {
                  setDestination(inputValue);
                  }}
                  placeholder="Select or type destination"
              />
              </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Transport Type
              </label>

              <Select
                  options={[
                      { value: "air", label: "Air" },
                      { value: "sea", label: "Sea" },
                  ]}
                  value={{
                      value: transportType,
                      label: transportType === "air" ? "Air" : "Sea",
                  }}
                  onChange={(option) =>
                      setTransportType(option?.value as "air" | "sea")
                  }
              />
            </div>

          </div>

          <Button
            onClick={handleSearch}
            disabled={loading}
            icon={
              loading ? (
                <Loader2Icon className="animate-spin" size={16} />
              ) : (
                <SparklesIcon size={16} />
              )
            }
          >
            {loading ? "Searching..." : "Search with AI"}
          </Button>

          {recommendations.length > 0 && (
            <div className="space-y-4">

              {recommendations.map((item) => (
                <div
                  key={item.rank}
                  className="border rounded-xl p-4"
                >
                  <div className="flex justify-between items-start">

                    <div>

                      <h4 className="font-semibold text-lg">
                        {item.company}
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        {item.summary}
                      </p>

                      <div className="mt-3 space-y-1 text-sm">

                        <p>
                          <strong>Price:</strong>{" "}
                          {item.price ?? "-"}{" "}
                          {item.currency ?? ""}
                        </p>

                        <p>
                          <strong>Duration:</strong>{" "}
                          {item.duration ?? "-"}
                        </p>

                        <p>
                          <strong>Confidence:</strong>{" "}
                          {item.confidence}
                        </p>

                      </div>

                    </div>

                    <Button
                        size="sm"
                        onClick={() => {
                            onApply(
                                item,
                                source,
                                destination,
                                transportType
                            );

                            onClose();
                        }}
                    >
                        {actionLabel}
                    </Button>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </Modal>
      <PremiumUpgradeModal
      isOpen={showUpgradeModal}
      onClose={() => setShowUpgradeModal(false)}
      message={upgradeMessage}
  />
</>
  );
};