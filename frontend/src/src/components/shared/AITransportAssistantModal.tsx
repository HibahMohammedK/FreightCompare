import React, { useEffect, useState } from "react";
import {
  SparklesIcon,
  Loader2Icon,
  ExternalLinkIcon,
} from "lucide-react";

import { Modal } from "./Modal";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { Button } from "./Button";

import { searchTransportAI } from "../../api/ai";
import {
  AIRecommendation,
  AISearchResponse,
} from "../../types/ai";

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
  actionLabel?: string;
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
  const [destination, setDestination] = useState(
    initialDestination ?? ""
  );

  const [transportType, setTransportType] =
    useState<"air" | "sea">(
      initialTransportType ?? "air"
    );

  const [loading, setLoading] = useState(false);

  const [recommendations, setRecommendations] =
    useState<AIRecommendation[]>([]);

  const [searchSummary, setSearchSummary] =
    useState("");

  const [hasSearched, setHasSearched] =
    useState(false);

  const [showUpgradeModal, setShowUpgradeModal] =
    useState(false);

  const [upgradeMessage, setUpgradeMessage] =
    useState("");

  const locationOptions =
    transportType === "air"
      ? AIRPORTS
      : SEAPORTS;

  useEffect(() => {
    if (!isOpen) return;

    setSource(initialSource ?? "");
    setDestination(initialDestination ?? "");
    setTransportType(
      initialTransportType ?? "air"
    );

    setRecommendations([]);
    setSearchSummary("");
    setHasSearched(false);
  }, [
    isOpen,
    initialSource,
    initialDestination,
    initialTransportType,
  ]);

  const handleSearch = async () => {
    if (!source || !destination) {
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);

      setRecommendations([]);
      setSearchSummary("");

      const res = await searchTransportAI({
        source,
        destination,
        transport_type: transportType,
      });

      const data = res.data as AISearchResponse;

      setRecommendations(
        data.recommendations ?? []
      );

      setSearchSummary(
        data.summary ?? ""
      );

    } catch (error: any) {
      console.error(
        "AI transport search failed:",
        error
      );

      if (
        error.response?.status === 403
      ) {
        onClose();

        setUpgradeMessage(
          error.response.data.detail
        );

        setShowUpgradeModal(true);

        return;
      }

      setRecommendations([]);
      setSearchSummary("");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (
    item: AIRecommendation
  ) => {
    const currency =
      item.currency?.toUpperCase() ?? "";

    const unit = item.price_unit
      ? ` / ${item.price_unit}`
      : "";

    if (
      item.price_min != null &&
      item.price_max != null
    ) {
      return `${currency} ${item.price_min.toLocaleString()} – ${item.price_max.toLocaleString()}${unit}`;
    }

    if (item.price != null) {
      return `${currency} ${item.price.toLocaleString()}${unit}`;
    }

    return "Quote required";
  };

  const formatDuration = (
    item: AIRecommendation
  ) => {
    const min =
      item.duration_min_hours;

    const max =
      item.duration_max_hours;

    if (
      min != null &&
      max != null
    ) {
      const minDays = Math.round(min / 24);
      const maxDays = Math.round(max / 24);

      if (minDays === maxDays) {
        return `${minDays} days`;
      }

      return `${minDays}–${maxDays} days`;
    }

    if (item.duration != null) {
      const days = Math.round(
        item.duration / 24
      );

      return `${days} days`;
    }

    return "Not available";
  };

  const getConfidenceClasses = (
    confidence?: string | null
  ) => {
    switch (confidence) {
      case "high":
        return "bg-success-bg text-success-dark border-green-200";

      case "medium":
        return "bg-warning-bg text-warning border-yellow-200";

      default:
        return "bg-bg-light text-text-medium border-border-light";
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="AI Transport Assistant"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Source */}
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
                  setSource(
                    selected?.value || ""
                  );
                }}
                onCreateOption={(
                  inputValue: string
                ) => {
                  setSource(inputValue);
                }}
                placeholder="Select or type origin"
              />
            </div>

            {/* Destination */}
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
                  setDestination(
                    selected?.value || ""
                  );
                }}
                onCreateOption={(
                  inputValue: string
                ) => {
                  setDestination(inputValue);
                }}
                placeholder="Select or type destination"
              />
            </div>

            {/* Transport */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Transport Type
              </label>

              <Select
                options={[
                  {
                    value: "air",
                    label: "Air",
                  },
                  {
                    value: "sea",
                    label: "Sea",
                  },
                ]}
                value={{
                  value: transportType,
                  label:
                    transportType === "air"
                      ? "Air"
                      : "Sea",
                }}
                onChange={(option) => {
                  if (!option) return;

                  setTransportType(
                    option.value as
                      | "air"
                      | "sea"
                  );

                  setRecommendations([]);
                  setSearchSummary("");
                  setHasSearched(false);
                }}
              />
            </div>

          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={
              loading ||
              !source ||
              !destination
            }
            icon={
              loading ? (
                <Loader2Icon
                  className="animate-spin"
                  size={16}
                />
              ) : (
                <SparklesIcon size={16} />
              )
            }
          >
            {loading
              ? "Searching the web..."
              : "Search with AI"}
          </Button>

          {/* Loading */}
          {loading && (
            <div className="border border-border-light rounded-xl p-6 text-center">
              <Loader2Icon
                className="animate-spin mx-auto mb-3"
                size={28}
              />

              <p className="font-medium text-text-dark">
                AI is searching freight sources
              </p>

              <p className="text-sm text-text-light mt-1">
                Finding {transportType} freight
                services for your route...
              </p>
            </div>
          )}

          {/* AI Summary */}
          {!loading &&
            searchSummary && (
              <div className="rounded-xl bg-bg-light border border-border-light p-4">
                <p className="text-sm text-text-medium">
                  {searchSummary}
                </p>
              </div>
            )}

          {/* Recommendations */}
          {!loading &&
            recommendations.length > 0 && (
              <div className="space-y-4">

                <div>
                  <h3 className="text-lg font-semibold text-text-dark">
                    AI Freight Recommendations
                  </h3>

                  <p className="text-sm text-text-light mt-1">
                    Information gathered from
                    web sources for{" "}
                    <strong>
                      {source}
                    </strong>{" "}
                    →{" "}
                    <strong>
                      {destination}
                    </strong>
                  </p>
                </div>

                {recommendations.map(
                  (item, index) => (
                    <div
                      key={
                        item.rank ??
                        `${item.company}-${index}`
                      }
                      className="border border-border-light rounded-xl p-5 bg-white"
                    >

                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                        <div className="min-w-0">

                          <div className="flex items-center gap-2 flex-wrap">

                            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-bg-light text-text-medium">
                              {index === 0
                                ? "BEST MATCH"
                                : `OPTION ${
                                    index + 1
                                  }`}
                            </span>

                            {item.confidence && (
                              <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${getConfidenceClasses(
                                  item.confidence
                                )}`}
                              >
                                {item.confidence} confidence
                              </span>
                            )}

                          </div>

                          <h4 className="text-lg font-semibold text-text-dark mt-3">
                            {item.company ||
                              "Freight Service"}
                          </h4>

                          {item.summary && (
                            <p className="text-sm text-text-light mt-1">
                              {item.summary}
                            </p>
                          )}

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

                      {/* Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t border-border-light">

                        {/* Price */}
                        <div>
                          <p className="text-xs text-text-light uppercase tracking-wide">
                            Price
                          </p>

                          <p className="font-semibold text-text-dark mt-1">
                            {formatPrice(item)}
                          </p>
                        </div>

                        {/* Duration */}
                        <div>
                          <p className="text-xs text-text-light uppercase tracking-wide">
                            Transit Time
                          </p>

                          <p className="font-semibold text-text-dark mt-1">
                            {formatDuration(
                              item
                            )}
                          </p>
                        </div>

                        {/* Container */}
                        <div>
                          <p className="text-xs text-text-light uppercase tracking-wide">
                            Service
                          </p>

                          <p className="font-semibold text-text-dark mt-1">
                            {item.container_type ||
                              item.service_type ||
                              (transportType ===
                              "sea"
                                ? "Sea Freight"
                                : "Air Freight")}
                          </p>
                        </div>

                        {/* Price Type */}
                        <div>
                          <p className="text-xs text-text-light uppercase tracking-wide">
                            Pricing
                          </p>

                          <p className="font-semibold text-text-dark mt-1 capitalize">
                            {item.price_type ||
                              "Indicative"}
                          </p>
                        </div>

                      </div>

                      {/* Links */}
                      {(item.source_url ||
                        item.booking_url) && (
                        <div className="flex flex-wrap gap-3 mt-5">

                          {item.source_url && (
                            <a
                              href={
                                item.source_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                              View Source
                              <ExternalLinkIcon
                                size={14}
                              />
                            </a>
                          )}

                          {item.booking_url && (
                            <a
                              href={
                                item.booking_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                              Get Quote
                              <ExternalLinkIcon
                                size={14}
                              />
                            </a>
                          )}

                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <div className="mt-4 text-xs text-text-light">
                          {item.notes}
                        </div>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          {/* No Results */}
          {!loading &&
            hasSearched &&
            recommendations.length === 0 && (
              <div className="border border-border-light rounded-xl p-8 text-center">

                <SparklesIcon
                  size={28}
                  className="mx-auto mb-3 text-text-light"
                />

                <h3 className="font-semibold text-text-dark">
                  No suitable freight results found
                </h3>

                <p className="text-sm text-text-light mt-1">
                  Try another origin, destination,
                  or transport type.
                </p>

              </div>
            )}

        </div>
      </Modal>

      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() =>
          setShowUpgradeModal(false)
        }
        message={upgradeMessage}
      />
    </>
  );
};