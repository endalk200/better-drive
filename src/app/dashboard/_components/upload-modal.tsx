"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomUploadDropzone } from "./custom-upload-dropzone";
import { parseAsBoolean, useQueryState } from "nuqs";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";

interface UploadModalProps {
  folderId?: string;
}

export function UploadModal({ folderId }: UploadModalProps) {
  const [isOpen, setIsOpen] = useQueryState(
    "uploadFileModal",
    parseAsBoolean.withDefault(false),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadIcon className="h-4 w-4" />
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        <CustomUploadDropzone
          onUploadComplete={() => {
            void setIsOpen(false);
          }}
          folderId={folderId}
        />
      </DialogContent>
    </Dialog>
  );
}
