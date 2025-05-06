import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useStarFolder() {
  const utils = api.useUtils();

  const toggleStarFolder = api.folder.toggleStar.useMutation({
    onSuccess: () => {
      void utils.folder.getContents.invalidate();

      toast.success("Folder starred successfully");
    },
  });

  return { toggleStarFolder };
}
