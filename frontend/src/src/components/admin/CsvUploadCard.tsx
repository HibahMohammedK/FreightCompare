import React, { useMemo, useRef, useState } from 'react';
import { FileUpIcon, LoaderCircleIcon, UploadCloudIcon } from 'lucide-react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { AdminTransport } from '../../utils/mockData';

interface CsvUploadCardProps {
  onUploadComplete: (records: AdminTransport[]) => void;
}

const requiredHeaders = [
  'company',
  'transportType',
  'source',
  'destination',
  'price',
  'duration',
  'departureDate',
  'bookingUrl'
] as const;

const parseCsvLine = (line: string) => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const buildTransportFromRow = (row: Record<string, string>, index: number): AdminTransport => {
  const transportType = row.transportType?.trim().toUpperCase();
  const price = Number(row.price);

  if (transportType !== 'AIR' && transportType !== 'SEA') {
    throw new Error(`Row ${index + 2}: transportType must be AIR or SEA.`);
  }

  if (!row.company || !row.source || !row.destination || !row.duration || !row.departureDate || !row.bookingUrl) {
    throw new Error(`Row ${index + 2}: missing required values.`);
  }

  if (Number.isNaN(price) || price <= 0) {
    throw new Error(`Row ${index + 2}: price must be a valid number.`);
  }

  if (!/^https?:\/\//i.test(row.bookingUrl.trim())) {
    throw new Error(`Row ${index + 2}: bookingUrl must start with http:// or https://.`);
  }

  return {
    id: `csv-${Date.now()}-${index}`,
    company: row.company.trim(),
    transportType,
    source: row.source.trim(),
    destination: row.destination.trim(),
    price,
    duration: row.duration.trim(),
    departureDate: row.departureDate.trim(),
    bookingUrl: row.bookingUrl.trim()
  };
};

export const CsvUploadCard: React.FC<CsvUploadCardProps> = ({ onUploadComplete }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const helperText = useMemo(
    () => 'Headers: company, transportType, source, destination, price, duration, departureDate, bookingUrl',
    []
  );

  const validateFile = (file: File) => {
    const isCsv = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');

    if (!isCsv) {
      setSelectedFile(null);
      setStatus({ type: 'error', message: 'Invalid CSV format' });
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
      setStatus({ type: 'error', message: 'Select a CSV file before uploading.' });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      const rawText = await selectedFile.text();
      const rows = rawText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (rows.length < 2) {
        throw new Error('Invalid CSV format');
      }

      const headers = parseCsvLine(rows[0]).map((header) => header.trim());
      const hasValidHeaders = requiredHeaders.every((header) => headers.includes(header));

      if (!hasValidHeaders) {
        throw new Error('Invalid CSV format');
      }

      const dataRows = rows.slice(1).map((line) => parseCsvLine(line));
      const records = dataRows.map((values, index) => {
        if (values.length !== headers.length) {
          throw new Error(`Row ${index + 2}: column count does not match headers.`);
        }

        const row = headers.reduce<Record<string, string>>((result, header, headerIndex) => {
          result[header] = values[headerIndex] ?? '';
          return result;
        }, {});

        return buildTransportFromRow(row, index);
      });

      await new Promise((resolve) => setTimeout(resolve, 900));
      onUploadComplete(records);
      setStatus({ type: 'success', message: 'Upload successful' });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Invalid CSV format'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="h-full p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-text-dark">Bulk Upload via CSV</h2>
          <p className="mt-1 text-sm text-text-light">Upload transport rows in one pass using the admin import template.</p>
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
          if (event.key === 'Enter' || event.key === ' ') {
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
          isDragging ? 'border-primary bg-primary-light' : 'border-border-light bg-bg-light/40 hover:border-primary'
        }`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
          <UploadCloudIcon size={22} />
        </div>
        <p className="mt-4 text-sm font-semibold text-text-dark">Drag and drop a CSV file here</p>
        <p className="mt-1 text-xs text-text-light">or click to browse your local files</p>
        <p className="mt-3 text-xs text-text-lighter">{helperText}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(event) => handleFileSelection(event.target.files)}
        />
      </div>

      <div className="mt-4 min-h-6">
        {selectedFile && <p className="text-sm text-text-medium">Selected file: {selectedFile.name}</p>}
        {status && (
          <p className={`text-sm ${status.type === 'success' ? 'text-success-dark' : 'text-error'}`}>
            {status.message}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="button" onClick={handleUpload} disabled={isUploading} icon={isUploading ? <LoaderCircleIcon className="animate-spin" size={16} /> : undefined}>
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </div>
    </Card>
  );
};
