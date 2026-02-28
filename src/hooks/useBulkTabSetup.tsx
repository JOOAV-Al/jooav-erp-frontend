"use client";

import CSVUpload from "@/features/uploads/components/CSVUpload";
import { useFileObjectUpload } from "@/features/uploads/hooks/useFileObjectUpload";
import { FileSpreadsheet, Trash2 } from "lucide-react";

export const BULK_FORM_ID = "bulk-upload-form";

interface UseBulkTabSetupOptions {
  catalog: string;
  /** Called when the user clicks "Download template" */
  onDownload?: () => void;
  /** The actual upload API call — receives the ready FormData */
  onUpload: (formData: FormData) => Promise<void>;
  /** Called after a successful upload (e.g. close drawer) */
  onSuccess?: () => void;
}

/**
 * useBulkTabSetup
 *
 * Drop this into any page that has a "Bulk Import" drawer tab.
 * It gives you back:
 *  - `bulkTabContent`  — the JSX to use as tab.content
 *  - `isBulkUploading` — loading state for the footer button
 *
 * The hidden <form id={BULK_FORM_ID}> inside `bulkTabContent` is what the
 * drawer footer targets when the active tab is "bulk".
 */
export function useBulkTabSetup({
  catalog,
  onDownload,
  onUpload,
  onSuccess,
}: UseBulkTabSetupOptions) {
  const {
    files,
    inputRef,
    openFileDialog,
    handleFileChange,
    removeFile,
    clearFiles,
  } = useFileObjectUpload(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!files.length) return;

    const formData = new FormData();
    if (files[0]) formData.append("file", files[0].file);

    await onUpload(formData);
    clearFiles();
    onSuccess?.();
  };

  const bulkTabContent = (
    <>
      {/*
        Hidden form — has no visible fields.
        The footer's submit button fires this via form={BULK_FORM_ID}.
        onSubmit calls handleBulkUpload which reads `files` from the hook.
      */}
      <form id={BULK_FORM_ID} onSubmit={handleSubmit} />

      {/* Selected files list */}
      {files.length > 0 ? (
        <div className="flex flex-col gap-main">
          <div className={`flex flex-col gap-5 py-main`}>
            <h4 className="leading-[1.2] tracking-[0.01em]">File Uploaded</h4>
            <p className="text-body-passive text-[15px] font-medium leading-normal tracking-[0.03em]">
              The list shows files you selected
            </p>
          </div>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex justify-between items-center bg-[#F7F7F7] shadow-input rounded-lg p-md gap-5"
            >
              <div className="flex justify-center items-center h-[24px] w-[24px] p-3">
                <FileSpreadsheet
                  className="text-brand-primary"
                  strokeWidth={2}
                  width={20}
                  height={20}
                />
              </div>
              <p className="flex-1 text-[14px] font-medium leading-[1.5] tracking-[0.04em] pb-3">
                {file?.name}
              </p>
              <div
                onClick={() => removeFile(file.id)}
                className="cursor-pointer flex justify-center items-center h-[24px] w-[24px] p-3"
              >
                <Trash2
                  className="text-outline-passive"
                  strokeWidth={2}
                  width={20}
                  height={20}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <CSVUpload
            catalog={catalog}
            onCTAClick={openFileDialog} // opens the file picker
            onDownload={onDownload}
          />

          {/* Hidden file input wired to the hook */}
          <input
            type="file"
            accept=".csv, .xlsx"
            multiple
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}
    </>
  );

  return { bulkTabContent, clearFiles };
}
