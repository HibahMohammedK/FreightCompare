import React, { useEffect, useState } from "react";
import { SparklesIcon, Loader2Icon } from "lucide-react";

import { Modal } from "../shared/Modal";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";

import { searchTransportAI } from "../../api/ai";
import { AIRecommendation } from "../../types/ai";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (recommendation: AIRecommendation) => void;

  initialSource?: string;
  initialDestination?: string;
  initialTransportType?: "air" | "sea";
}

export const AITransportAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApply,
  initialSource,
  initialDestination,
  initialTransportType,
}) => {
  const [source, setSource] = useState(initialSource ?? "");
  const [destination, setDestination] = useState(initialDestination ?? "");
  const [transportType, setTransportType] =
    useState<"air" | "sea">(initialTransportType ?? "air");

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<
    AIRecommendation[]
  >([]);

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
    } catch (err) {
      console.error(err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Transport Assistant"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Input
            label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Dubai"
          />

          <Input
            label="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="London"
          />

          <div>
            <label className="block mb-2 text-sm font-medium">
              Transport Type
            </label>

            <select
              value={transportType}
              onChange={(e) =>
                setTransportType(e.target.value as "air" | "sea")
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="air">Air</option>
              <option value="sea">Sea</option>
            </select>
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
                      onApply(item);
                      onClose();
                    }}
                  >
                    Apply
                  </Button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </Modal>
  );
};