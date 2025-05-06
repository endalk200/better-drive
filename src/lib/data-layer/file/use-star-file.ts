import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useStarFile() {
  const utils = api.useUtils();

  const toggleStarFile = api.file.toggleStar.useMutation({
    onSuccess: async () => {
      await utils.folder.getContents.invalidate();

      toast.success("File starred successfully");
    },
  });

  return { toggleStarFile };
}
