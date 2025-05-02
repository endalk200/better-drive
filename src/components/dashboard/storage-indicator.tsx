"use client";

import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HardDriveIcon } from "lucide-react";
import { api } from "@/trpc/react";

export function StorageIndicator() {
  const { data: storageInfo, isLoading } = api.user.getStorageInfo.useQuery(
    undefined,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  );

  const usedPercentage = storageInfo
    ? (storageInfo.usedBytes / storageInfo.totalBytes) * 100
    : 0;

  // Determine color based on usage
  const getProgressColor = () => {
    if (usedPercentage >= 90) return "bg-red-500";
    if (usedPercentage >= 75) return "bg-yellow-500";

    return "bg-green-500";
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex animate-pulse items-center gap-2 text-sm">
        <HardDriveIcon className="h-4 w-4" />
        <span>Loading storage info...</span>
      </div>
    );
  }

  if (!storageInfo) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex w-full max-w-[200px] flex-col gap-1.5 px-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <HardDriveIcon className="h-4 w-4" />
                <span>Storage</span>
              </div>
              <span className="text-xs font-medium">
                {formatBytes(storageInfo.usedBytes)} /{" "}
                {formatBytes(storageInfo.totalBytes)}
              </span>
            </div>
            <Progress value={usedPercentage} className="bg-muted h-2" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="text-center">
            <p className="font-medium">Storage Usage</p>
            <p className="text-sm">
              {formatBytes(storageInfo.usedBytes)} used of{" "}
              {formatBytes(storageInfo.totalBytes)}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {usedPercentage >= 90
                ? "Storage almost full! Delete some files."
                : usedPercentage >= 75
                  ? "Storage usage is high."
                  : "Storage usage is good."}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
