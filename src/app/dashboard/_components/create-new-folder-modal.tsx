import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateNewFolderForm } from "./create-new-folder-form";

interface CreateNewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId?: string;
}

export function CreateNewFolderModal({
  isOpen,
  onClose,
  parentId,
}: CreateNewFolderModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <CreateNewFolderForm parentId={parentId} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
