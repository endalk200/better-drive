"use client";

import { Button } from "@/components/ui/button";
import { HomeIcon, ChevronRightIcon } from "lucide-react";
import { CreateNewFolderModal } from "./create-new-folder-modal";
import { api } from "@/trpc/react";
import { UploadModal } from "./upload-modal";
import { FolderList } from "./folder/folder-list";
import { FileList } from "./file/file-list";
import { useCurrentFolderId, useFileExplorerBreadcrumb } from "../_lib";

export function FileExplorer() {
  const [currentFolderId, setCurrentFolderId] = useCurrentFolderId();
  const [breadcrumbs, setBreadcrumbs] = useFileExplorerBreadcrumb();

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

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);

    void setBreadcrumbs(newBreadcrumbs);

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
        {folderData && folderData?.subFolders && (
          <FolderList folders={folderData.subFolders} />
        )}

        {/* Files */}
        {folderData && folderData?.files && (
          <FileList files={folderData.files} />
        )}
      </div>

      {/* Empty State */}
      {folderData?.files.length === 0 &&
        folderData?.subFolders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            This folder is empty
          </div>
        )}
    </div>
  );
}
