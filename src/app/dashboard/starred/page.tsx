"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderIcon, MoreVertical, Star, Trash2, Pencil } from "lucide-react";
import { api } from "@/trpc/react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getFileIcon } from "../_components/utils";
import { formatBytes } from "@/lib/utils";

export default function StaredFileExplorer() {
  const router = useRouter();
  const utils = api.useUtils();

  const { data, isLoading } = api.folder.getStarred.useQuery();

  const toggleStarFolder = api.folder.toggleStar.useMutation({
    onSuccess: () => {
      void utils.folder.getStarred.invalidate();
      toast.success("Folder unstarred successfully");
    },
  });

  const toggleStarFile = api.file.toggleStar.useMutation({
    onSuccess: async () => {
      await utils.folder.getStarred.invalidate();
      toast.success("File unstarred successfully");
    },
  });

  const handleFolderClick = (folderId: string) => {
    router.push(`/dashboard?folderId=${folderId}`);
  };

  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Starred Items</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Starred Folders */}
        {data.starredFolders?.map((folder) => (
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
                onClick={() => handleFolderClick(folder.id)}
              >
                <div className="flex items-center gap-1">
                  <p className="truncate font-medium">
                    {folder.name ?? "Unnamed Folder"}
                  </p>
                  <Star className="h-4 w-4 flex-shrink-0 text-yellow-400" />
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
                    onClick={() => toggleStarFolder.mutate({ id: folder.id })}
                  >
                    <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    Unstar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}

        {/* Starred Files */}
        {data.starredFiles.map((file) => (
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
                  <Star className="h-4 w-4 flex-shrink-0 text-yellow-400" />
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
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleStarFile.mutate({ id: file.id })}
                  >
                    <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    Unstar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
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
      {!data.starredFiles.length && !data.starredFolders.length && (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          No starred items yet
        </div>
      )}
    </div>
  );
}
