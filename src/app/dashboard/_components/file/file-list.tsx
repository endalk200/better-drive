import { FileListItem } from "./file-list-item";
import { RenameModal } from "../rename-modal";
import { DeleteConfirmationModal } from "../delete-confirmation-modal";
import { useDeleteFile } from "@/lib/data-layer/file/use-delete-file";
import {
  useDeleteFileModal,
  useItemsToRename,
  useRenameFileModal,
} from "../../_lib";

export type FileListProps = {
  files: {
    id: string;
    type: string;
    name: string;
    isStarred: boolean;
    size: number;
    updatedAt: Date;
    url: string;
    folderId: string;
  }[];
};

export function FileList(props: FileListProps) {
  const { deleteFile } = useDeleteFile();

  const [isRenameFileModalOpen, setIsRenameFileModalOpen] =
    useRenameFileModal();
  const [itemToRename, setItemToRename] = useItemsToRename();

  const [isDeleteFileModalOpen, setIsDeleteFileModalOpen] =
    useDeleteFileModal();
  const [itemToDelete, setItemToDelete] = useItemsToRename();

  return (
    <>
      {props.files.map((file) => (
        <FileListItem
          key={file.id}
          id={file.id}
          type={file.type}
          name={file.name}
          isStarred={file.isStarred}
          size={file.size}
          updatedAt={file.updatedAt}
          url={file.url}
          folderId={file.folderId}
          onRename={() => {
            void setItemToRename({
              id: file.id,
              name: file.name,
              type: "file",
            });

            void setIsRenameFileModalOpen(true);
          }}
          onDelete={async () => {
            void setItemToDelete({
              id: file.id,
              name: file.name,
              type: "file",
            });

            void setIsDeleteFileModalOpen(true);
          }}
        />
      ))}

      {itemToRename && (
        <RenameModal
          isOpen={isRenameFileModalOpen}
          onClose={() => {
            void setIsRenameFileModalOpen(false);
            void setItemToRename(null); // Clear the item when closing
          }}
          itemType={itemToRename.type}
          itemId={itemToRename.id}
          currentName={itemToRename.name}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteFileModalOpen}
        onClose={() => {
          void setIsDeleteFileModalOpen(false);
          void setItemToDelete(null);
        }}
        onConfirm={() => {
          if (!itemToDelete) {
            void setIsDeleteFileModalOpen(false);
            void setItemToDelete(null);

            return;
          }

          deleteFile.mutate(
            { id: itemToDelete?.id },
            {
              onSuccess: () => {
                void setIsDeleteFileModalOpen(false);
                void setItemToDelete(null);
              },
            },
          );
        }}
        isLoading={deleteFile.isPending}
        type="file"
        name={itemToDelete?.name ?? ""}
        folderStats={undefined}
      />
    </>
  );
}
