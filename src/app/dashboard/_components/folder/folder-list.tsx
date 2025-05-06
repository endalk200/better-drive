import { FolderListItem } from "./folder-list-item";
import { RenameModal } from "../rename-modal";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { DeleteConfirmationModal } from "../delete-confirmation-modal";
import { useDeleteFolder } from "@/lib/data-layer/folder/use-delete-folder";
import {
  useCurrentFolderId,
  useDeleteFolderModal,
  useFileExplorerBreadcrumb,
  useFolderStats,
  useItemsToDelete,
  useItemsToRename,
  useRenameFolderModal,
} from "../../_lib";

export type FolderListProps = {
  folders: {
    id: string;
    name: string;
    isStarred: boolean;
    createdAt: Date;
    updatedAt: Date;
    parentId: string | null;
  }[];
};

export function FolderList(props: FolderListProps) {
  const utils = api.useUtils();

  const [, setBreadcrumbs] = useFileExplorerBreadcrumb();
  const [currentFolderId, setCurrentFolderId] = useCurrentFolderId();

  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] =
    useRenameFolderModal();
  const [itemToRename, setItemToRename] = useItemsToRename();

  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] =
    useDeleteFolderModal();
  const [itemToDelete, setItemToDelete] = useItemsToDelete();

  const [folderStats, setFolderStats] = useFolderStats();

  const { deleteFolder } = useDeleteFolder();

  return (
    <>
      {props.folders.map((folder) => (
        <FolderListItem
          key={folder.id}
          id={folder.id}
          name={folder.name}
          isStarred={folder.isStarred}
          createdAt={folder.createdAt}
          updatedAt={folder.updatedAt}
          parentId={folder.parentId}
          onClick={() => {
            // onClick={() => handleFolderClick(folder.id, folder.name)}
            void setCurrentFolderId(folder.id);
            void setBreadcrumbs((prev) => {
              return [...prev, { id: folder.id, name: folder.name }];
            });
          }}
          onRename={() => {
            if (folder.name === "Home" && !currentFolderId) {
              toast.error("Cannot rename the root 'Home' folder.");
              return;
            }
            void setItemToRename({
              id: folder.id,
              name: folder.name,
              type: "folder",
            });
            void setIsRenameFolderModalOpen(true);
          }}
          onDelete={async () => {
            void setItemToDelete({
              id: folder.id,
              name: folder.name,
              type: "folder",
            });

            const stats = await utils.folder.getFolderStats.fetch({
              folderId: folder.id,
            });
            void setFolderStats(stats);

            void setIsDeleteFolderModalOpen(true);
          }}
        />
      ))}

      {itemToRename && (
        <RenameModal
          isOpen={isRenameFolderModalOpen}
          onClose={() => {
            void setIsRenameFolderModalOpen(false);
            void setItemToRename(null); // Clear the item when closing
          }}
          itemType={itemToRename.type}
          itemId={itemToRename.id}
          currentName={itemToRename.name}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteFolderModalOpen}
        onClose={() => {
          void setIsDeleteFolderModalOpen(false);
          void setItemToDelete(null);
          void setFolderStats(null);
        }}
        onConfirm={() => {
          if (!itemToDelete) {
            void setIsDeleteFolderModalOpen(false);
            void setItemToDelete(null);
            void setFolderStats(null);

            return;
          }

          deleteFolder.mutate(
            { id: itemToDelete.id },
            {
              onSuccess: () => {
                void setIsDeleteFolderModalOpen(false);
                void setItemToDelete(null);
                void setFolderStats(null);
              },
            },
          );
        }}
        isLoading={deleteFolder.isPending}
        type={itemToDelete?.type ?? "file"}
        name={itemToDelete?.name ?? ""}
        folderStats={folderStats ?? undefined}
      />
    </>
  );
}
