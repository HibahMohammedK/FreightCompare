import React from 'react';
import { FileSpreadsheetIcon } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { CsvUploadCard } from '../../components/admin/CsvUploadCard';

export const CsvUploadPage: React.FC = () => {
  const handleUploadComplete = () => {
    console.log("CSV upload completed.");
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">
            CSV Upload
          </h1>

          <p className="mt-1 text-sm text-text-light">
            Import transport records in bulk without interrupting manual
            transport management.
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <FileSpreadsheetIcon size={20} />
        </div>
      </div>

      <Card className="mb-6 p-4">
        <div>
          <h2 className="text-lg font-bold text-text-dark">
            Bulk Upload via CSV
          </h2>

          <p className="mt-1 text-sm text-text-light">
            Upload a valid CSV file to import transport records in one action.
          </p>
        </div>
      </Card>

      <div className="max-w-3xl">
        <CsvUploadCard onUploadComplete={handleUploadComplete} />
      </div>
    </div>
  );
};