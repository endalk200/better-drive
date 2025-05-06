import { formatBytes } from "@/lib/utils/formatter";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useDeleteFile() {
  const utils = api.useUtils();

  const deleteFile = api.file.delete.useMutation({
    onSuccess: (result) => {
      toast.success(`File "${result.deletedFile.name}" deleted successfully!`, {
        description: `Freed ${formatBytes(result.deletedFile.size)} of storage space.`,
      });

      // Invalidate queries to refresh the UI
      void utils.folder.getContents.invalidate();
      void utils.user.getStorageInfo.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete file", {
        description: error.message,
      });
    },
  });

  return { deleteFile };
}
