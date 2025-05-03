import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateNewFolderForm } from "./create-new-folder-form";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

interface CreateNewFolderModalProps {
  parentId?: string;
}

export function CreateNewFolderModal({ parentId }: CreateNewFolderModalProps) {
  const [isOpen, setIsOpen] = useQueryState(
    "createNewFolderModal",
    parseAsBoolean.withDefault(false),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <CreateNewFolderForm
          parentId={parentId}
          onSuccess={() => {
            void setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
