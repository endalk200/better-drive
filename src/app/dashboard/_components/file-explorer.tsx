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
  FileIcon,
  MoreVerticalIcon,
  StarIcon,
  HomeIcon,
  ChevronRightIcon,
  MoreVertical,
  Star,
  Trash2,
  Pencil,
} from "lucide-react";
import { CreateNewFolderModal } from "./create-new-folder-modal";
import { api } from "@/trpc/react";
import { formatBytes } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { getFileIcon } from "./utils";
import { useQueryState, parseAsString } from "nuqs";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { UploadButton, UploadDropzone } from "@/lib/utils/uploadthing";
import { UploadModal } from "./upload-modal";

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export function FileExplorer() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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

  const [currentFolderId, setCurrentFolderId] = useQueryState(
    "folderId",
    parseAsString,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const deleteItem = api.folder.delete.useMutation({
    onSuccess: () => {
      toast.success(
        `${
          itemToDelete?.type === "folder" ? "Folder" : "File"
        } deleted successfully`,
      );
      setDeleteModalOpen(false);
      setItemToDelete(null);
      setFolderStats(null);
      void utils.folder.getContents.invalidate();
      void utils.folder.getStarred.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Add this function to handle delete clicks
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
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
          <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
            Upload Files
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>New Folder</Button>
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
                  <DropdownMenuItem>
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
                  <span>{formatFileSize(file.size)}</span>
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
                  <DropdownMenuItem>
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

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        folderId={currentFolderId ?? defaultFolder?.id}
      />

      {/* Empty State */}
      {folderData?.files.length === 0 &&
        folderData?.subFolders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            This folder is empty
          </div>
        )}

      <CreateNewFolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        parentId={currentFolderId ?? defaultFolder?.id}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
          setFolderStats(null);
        }}
        onConfirm={() => {
          if (itemToDelete) {
            deleteItem.mutate({
              id: itemToDelete.id,
              type: itemToDelete.type,
            });
          }
        }}
        isLoading={deleteItem.isPending}
        type={itemToDelete?.type ?? "file"}
        name={itemToDelete?.name ?? ""}
        folderStats={folderStats ?? undefined}
      />
    </div>
  );
}
