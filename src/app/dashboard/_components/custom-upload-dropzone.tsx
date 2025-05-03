"use client";

import { useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { File, FileText, ImageIcon, UploadCloud, X } from "lucide-react";
import { api } from "@/trpc/react";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils";
import {
  CLIENT_ACCEPTED_MIME_TYPES,
  getSupportedFileTypesDescription,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from "@/server/config";

interface CustomUploadDropzoneProps {
  onUploadComplete: () => void;
  folderId?: string;
}

export function CustomUploadDropzone({
  onUploadComplete,
  folderId,
}: CustomUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);

  const utils = api.useUtils();

  const { data: defaultFolder } = api.folder.getDefaultFolder.useQuery(
    undefined,
    {
      enabled: !folderId,
    },
  );

  const registerUploadedFile = api.file.create.useMutation({
    onSuccess: () => {
      toast.success("File uploaded successfully");
      setFiles([]);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to save file information");
    },
  });

  const { startUpload } = useUploadThing("fileUploader", {
    onClientUploadComplete: async (res) => {
      if (res) {
        // Create file records in the database
        try {
          for (const file of res) {
            registerUploadedFile.mutate({
              name: file.name,
              size: file.size,
              type: file.type,
              url: file.url,
              key: file.key,
              folderId: folderId ?? defaultFolder?.id ?? "",
            });
          }

          setFiles([]);
          // Invalidate queries to refresh the file list
          await utils.folder.getContents.invalidate();
          await utils.folder.getDefaultFolder.invalidate();
          await utils.user.getStorageInfo.invalidate();

          onUploadComplete();
        } catch (error) {
          console.log(error);
          toast.error("Failed to save file information");
        }
      }
    },
    onUploadError: (error) => {
      toast.error(error.message);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    // Check file size
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(
          `${file.name} is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`,
        );
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(CLIENT_ACCEPTED_MIME_TYPES),
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    } else if (
      type === "application/pdf" ||
      type === "application/msword" ||
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    }
    return <File className="h-4 w-4 text-blue-500" />;
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      await startUpload(files);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud
          className={`mx-auto h-12 w-12 ${
            isDragActive ? "text-blue-500" : "text-gray-400"
          }`}
        />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the files here"
            : "Drag & drop files here, or click to select files"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported files: {getSupportedFileTypesDescription()}
          Max file size: {MAX_FILE_SIZE_MB}MBjk
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                {getFileIcon(file.type)}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={isUploading}
                className="ml-2 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {isUploading ? (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-center text-sm text-gray-500">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setFiles([])}
              >
                Clear all
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpload}
                disabled={files.length === 0}
              >
                Upload {files.length} file{files.length !== 1 ? "s" : ""}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
