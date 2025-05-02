"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  type: "file" | "folder";
  name: string;
  folderStats?: {
    subFolderCount: number;
    fileCount: number;
  };
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  type,
  name,
  folderStats,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete {type}
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>{name}</strong>? This
              action cannot be undone.
            </p>
            {type === "folder" && folderStats && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                <p>This folder contains:</p>
                <ul className="list-inside list-disc">
                  <li>{folderStats.subFolderCount} subfolder(s)</li>
                  <li>{folderStats.fileCount} file(s)</li>
                </ul>
                <p className="mt-2 font-medium">
                  All contents will be permanently deleted.
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete {type}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
