"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FolderIcon,
  StarIcon,
  HomeIcon,
  ChevronRightIcon,
  MoreVertical,
  Star,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";
import { CreateNewFolderModal } from "./create-new-folder-modal";
import { api } from "@/trpc/react";
import { Card, CardContent } from "@/components/ui/card";
import { getFileIcon } from "./utils";
import { useQueryState, parseAsString, parseAsBoolean } from "nuqs";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { UploadModal } from "./upload-modal";
import { formatBytes } from "@/lib/utils";
import { ImagePreviewModal } from "@/components/image-preview-modal";
import { FilePreviewModal } from "@/components/file-preview-modal";
import { RenameModal } from "./rename-modal";

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export function FileExplorer() {
  const [, setImagePreviewModalOpen] = useQueryState(
    "image-modal",
    parseAsBoolean.withDefault(false),
  );
  const [, setImagePreviewUrl] = useQueryState("image-url", parseAsString);

  const [, setFilePreviewModalOpen] = useQueryState(
    "file-modal",
    parseAsBoolean.withDefault(false),
  );
  const [, setFilePreviewUrl] = useQueryState("file-url", parseAsString);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
    type: "file" | "folder";
  } | null>(null);
  const [folderStats, setFolderStats] = useState<{
    subFolderCount: number;
    fileCount: number;
  } | null>(null);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<{
    id: string;
    name: string;
    type: "file" | "folder";
  } | null>(null);

  const handleRenameClick = (
    id: string,
    name: string,
    type: "file" | "folder",
  ) => {
    // Prevent renaming the root Home folder from the UI
    if (type === "folder" && name === "Home" && !currentFolderId) {
      toast.error("Cannot rename the root 'Home' folder.");
      return;
    }
    setItemToRename({ id, name, type });
    setRenameModalOpen(true);
  };

  const [currentFolderId, setCurrentFolderId] = useQueryState(
    "folderId",
    parseAsString,
  );
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: "Home" },
  ]);

  const utils = api.useUtils();

  const data = api.folder.getContents.useSuspenseQuery({
    folderId: currentFolderId ?? undefined,
  });
  const folderData = data[0];

  const { data: defaultFolder } = api.folder.getDefaultFolder.useQuery(
    undefined,
    {
      enabled: !currentFolderId,
    },
  );

  const toggleStarFolder = api.folder.toggleStar.useMutation({
    onSuccess: () => {
      void utils.folder.getContents.invalidate();

      toast.success("Folder starred successfully");
    },
  });

  const deleteFolder = api.folder.delete.useMutation({
    onSuccess: (result) => {
      toast.success(
        `Folder deleted successfully! Freed ${formatBytes(result.freedSpace)}`,
        {
          description: `Deleted ${result.deletedFiles} files and ${
            result.deletedFolders
          } folder${result.deletedFolders !== 1 ? "s" : ""}.`,
        },
      );

      // Invalidate queries to refresh the UI
      void utils.folder.getContents.invalidate();
      void utils.user.getStorageInfo.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete folder", {
        description: error.message,
      });
    },
  });

  const deleteFile = api.file.delete.useMutation({
    onSuccess: (result) => {
      toast.success(`File "${result.deletedFile.name}" deleted successfully!`, {
        description: `Freed ${formatBytes(result.deletedFile.size)} of storage space.`,
      });

      // Invalidate queries to refresh the UI
      void utils.folder.getContents.invalidate();
      void utils.user.getStorageInfo.invalidate();

      setDeleteModalOpen(false);
      setItemToDelete(null);
      setFolderStats(null);
    },
    onError: (error) => {
      toast.error("Failed to delete file", {
        description: error.message,
      });
    },
  });

  const handleDeleteClick = async (
    id: string,
    name: string,
    type: "file" | "folder",
  ) => {
    setItemToDelete({ id, name, type });

    if (type === "folder") {
      // Get folder stats before showing delete modal
      const stats = await utils.folder.getFolderStats.fetch({ folderId: id });
      setFolderStats(stats);
    }

    setDeleteModalOpen(true);
  };

  const toggleStarFile = api.file.toggleStar.useMutation({
    onSuccess: async () => {
      await utils.folder.getContents.invalidate();
    },
  });

  const handleFolderClick = async (folderId: string, folderName: string) => {
    if (currentFolderId === undefined) return;

    void setCurrentFolderId(folderId);

    setBreadcrumbs((prev) => [...prev, { id: folderId, name: folderName }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);

    setBreadcrumbs(newBreadcrumbs);

    void setCurrentFolderId(
      newBreadcrumbs[newBreadcrumbs.length - 1]?.id ?? null,
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id ?? "root"} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
              <Button
                variant="ghost"
                className="hover:bg-gray-100"
                onClick={() => handleBreadcrumbClick(index)}
              >
                {index === 0 ? <HomeIcon className="mr-2 h-4 w-4" /> : null}
                {crumb.name}
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <UploadModal folderId={currentFolderId ?? defaultFolder?.id} />
          <CreateNewFolderModal
            parentId={currentFolderId ?? defaultFolder?.id}
          />
        </div>
      </div>

      {/* Files and Folders List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Folders */}
        {folderData!.subFolders.map((folder) => (
          <Card
            key={folder.id}
            className="rounded-[0px] transition-colors hover:bg-gray-50"
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className="cursor-pointer rounded-lg bg-gray-100 p-2">
                <FolderIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <div
                className="min-w-0 flex-1 cursor-pointer"
                onClick={() => handleFolderClick(folder.id, folder.name)}
              >
                <div className="flex items-center gap-1">
                  <p className="truncate font-medium">
                    {folder.name ?? "Unnamed Folder"}
                  </p>
                  {folder.isStarred && (
                    <Star className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(folder.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      handleRenameClick(folder.id, folder.name, "folder")
                    }
                    disabled={folder.name === "Home" && !folder.parentId}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      toggleStarFolder.mutate({ id: folder.id });
                    }}
                  >
                    <StarIcon
                      className={`mr-2 h-4 w-4 ${
                        folder.isStarred
                          ? "fill-yellow-400 text-yellow-400"
                          : ""
                      }`}
                    />
                    {folder.isStarred ? "Unstar" : "Star"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() =>
                      handleDeleteClick(folder.id, folder.name, "folder")
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}

        {/* Files */}
        {folderData?.files.map((file) => (
          <Card
            key={file.id}
            className="rounded-[0px] transition-colors hover:bg-gray-50"
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-gray-100 p-2">
                {getFileIcon(file.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="truncate font-medium">{file.name}</p>
                  {file.isStarred && (
                    <Star className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatBytes(file.size)}</span>
                  <span>•</span>
                  <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      if (file.type.startsWith("image/")) {
                        // Open image preview modal
                        void setImagePreviewModalOpen(true);
                        void setImagePreviewUrl(file.url);
                      } else if (file.type.startsWith("application/pdf")) {
                        // Open file preview modal
                        void setFilePreviewModalOpen(true);
                        void setFilePreviewUrl(file.url);
                      }
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleRenameClick(file.id, file.name, "file")
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleStarFile.mutate({ id: file.id })}
                  >
                    <StarIcon
                      className={`mr-2 h-4 w-4 ${
                        file.isStarred ? "fill-yellow-400 text-yellow-400" : ""
                      }`}
                    />
                    {file.isStarred ? "Unstar" : "Star"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() =>
                      handleDeleteClick(file.id, file.name, "file")
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {folderData?.files.length === 0 &&
        folderData?.subFolders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            This folder is empty
          </div>
        )}

      {itemToRename && (
        <RenameModal
          isOpen={renameModalOpen}
          onClose={() => {
            setRenameModalOpen(false);
            setItemToRename(null); // Clear the item when closing
          }}
          itemType={itemToRename.type}
          itemId={itemToRename.id}
          currentName={itemToRename.name}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
          setFolderStats(null);
        }}
        onConfirm={() => {
          if (!itemToDelete) {
            setDeleteModalOpen(false);
            setItemToDelete(null);
            setFolderStats(null);

            return;
          }

          if (itemToDelete.type === "folder") {
            deleteFolder.mutate({ id: itemToDelete.id });
          } else {
            deleteFile.mutate({ id: itemToDelete.id });
          }
        }}
        isLoading={deleteFolder.isPending}
        type={itemToDelete?.type ?? "file"}
        name={itemToDelete?.name ?? ""}
        folderStats={folderStats ?? undefined}
      />

      <ImagePreviewModal />
      <FilePreviewModal />
    </div>
  );
}
