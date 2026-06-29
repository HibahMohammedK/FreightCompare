import React, { useRef, useState } from "react";
import {
  FileUpIcon,
  LoaderCircleIcon,
  UploadCloudIcon,
} from "lucide-react";
import axios from "axios";

import { Card } from "../shared/Card";
import { Button } from "../shared/Button";
import { uploadTransportCsv } from "../../api/transport";

interface CsvUploadCardProps {
  onUploadComplete: () => void;
}

export const CsvUploadCard: React.FC<CsvUploadCardProps> = ({
  onUploadComplete,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
    created?: number;
    skipped?: number;
    reason?: string;
  } | null>(null);

  const helperText =
    "Upload a valid CSV file containing transport records.";

  const validateFile = (file: File) => {
    const isCsv =
      file.type === "text/csv" ||
      file.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      setSelectedFile(null);
      setStatus({
        type: "error",
        message: "Please select a valid CSV file.",
      });
      return false;
    }

    setSelectedFile(file);
    setStatus(null);
    return true;
  };

  const handleFileSelection = (fileList: FileList | null) => {
    const file = fileList?.[0];

    if (!file) return;

    validateFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({
        type: "error",
        message: "Select a CSV file before uploading.",
      });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      const response = await uploadTransportCsv(selectedFile);

      onUploadComplete();

      setStatus({
        type: "success",
        message: response.data.message,
        created: response.data.created,
        skipped: response.data.skipped,
        reason: response.data.reason,
      });

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setStatus({
          type: "error",
          message:
            error.response?.data?.detail ??
            "Upload failed.",
        });
      } else {
        setStatus({
          type: "error",
          message: "Upload failed.",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="h-full p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-text-dark">
            Bulk Upload via CSV
          </h2>

          <p className="mt-1 text-sm text-text-light">
            Upload transport records using a CSV file.
          </p>
        </div>

        <div className="rounded-xl bg-bg-light p-3 text-primary">
          <FileUpIcon size={20} />
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFileSelection(event.dataTransfer.files);
        }}
        className={`mt-6 rounded-2xl border border-dashed p-6 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary-light"
            : "border-border-light bg-bg-light/40 hover:border-primary"
        }`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
          <UploadCloudIcon size={22} />
        </div>

        <p className="mt-4 text-sm font-semibold text-text-dark">
          Drag and drop a CSV file here
        </p>

        <p className="mt-1 text-xs text-text-light">
          or click to browse your local files
        </p>

        <p className="mt-3 text-xs text-text-lighter">
          {helperText}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(event) =>
            handleFileSelection(event.target.files)
          }
        />
      </div>

      <div className="mt-4 min-h-6">
        {selectedFile && (
          <p className="text-sm text-text-medium">
            Selected file: {selectedFile.name}
          </p>
        )}

        {status && (
          <div
            className={`rounded-lg p-3 text-sm ${
              status.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <p>{status.message}</p>

            {status.type === "success" && (
              <>
                <p>Created: {status.created}</p>
                <p>Skipped: {status.skipped}</p>
                {status.reason && <p>{status.reason}</p>}
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          icon={
            isUploading ? (
              <LoaderCircleIcon
                className="animate-spin"
                size={16}
              />
            ) : undefined
          }
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </div>
    </Card>
  );
};