"use client";

import { CloudUpload } from "lucide-react";

interface FileDropzoneProps {
  accept?: string;
  maxSize?: string;
  description?: string;
}

export function FileDropzone({
  accept = ".xlsx,.csv",
  maxSize = "10MB",
  description = "XLSX or CSV",
}: FileDropzoneProps) {
  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-[#e5e0e7] border-dashed rounded-lg cursor-pointer bg-[#f7f6f8] hover:bg-[#f0eef1] transition-colors"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <CloudUpload className="h-10 w-10 text-[#7c6b80] mb-2" />
          <p className="mb-2 text-sm text-[#7c6b80]">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-[#7c6b80]">
            {description} (MAX. {maxSize})
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={accept}
        />
      </label>
    </div>
  );
}
