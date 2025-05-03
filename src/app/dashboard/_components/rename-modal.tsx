import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RenameForm } from "./rename-form";

interface RenameFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: "file" | "folder";
  itemId: string;
  currentName: string;
}

export function RenameModal({
  isOpen,
  onClose,
  itemType,
  itemId,
  currentName,
}: RenameFolderModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Rename {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </DialogTitle>
          <DialogDescription>
            Enter a new name for &quot;{currentName}&quot;.
          </DialogDescription>
        </DialogHeader>
        <RenameForm
          itemType={itemType}
          itemId={itemId}
          currentName={currentName}
          onSuccess={onClose} // Close the modal on successful rename
        />
      </DialogContent>
    </Dialog>
  );
}
