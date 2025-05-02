"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomUploadDropzone } from "./custom-upload-dropzone";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
}

export function UploadModal({ isOpen, onClose, folderId }: UploadModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        <CustomUploadDropzone
          onUploadComplete={() => {
            onClose();
          }}
          folderId={folderId}
        />
      </DialogContent>
    </Dialog>
  );
}
