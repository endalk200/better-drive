import { formatBytes } from "@/lib/utils/formatter";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useDeleteFolder() {
  const utils = api.useUtils();

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

  return { deleteFolder };
}
