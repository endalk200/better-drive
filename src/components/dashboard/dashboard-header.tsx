"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, HomeIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StorageIndicator } from "@/components/dashboard/storage-indicator";
import type { Folder } from "@/lib/types";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  currentFolder: Folder | null;
  folderPath: Folder[];
  onFolderClick: (folderId: string | null) => void;
  onCreateFolder?: (name: string) => Promise<void>;
  userId: string;
}

export function DashboardHeader({
  heading,
  text,
  children,
  currentFolder,
  folderPath,
  onFolderClick,
  onCreateFolder,
  userId,
}: DashboardHeaderProps) {
  const [newFolderName, setNewFolderName] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleCreateFolder = async () => {
    if (newFolderName.trim() && onCreateFolder) {
      await onCreateFolder(newFolderName);
      setNewFolderName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold md:text-4xl">{heading}</h1>
          {text && <p className="text-muted-foreground">{text}</p>}
        </div>
        {children}
      </div>

      {/* Mobile storage indicator - only visible on small screens */}
      <div className="mb-4 md:hidden">
        <StorageIndicator />
      </div>

      {/* Breadcrumb navigation with New Folder button */}
      <div className="flex items-center justify-between">
        <nav className="text-muted-foreground flex items-center space-x-1 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 font-normal"
            onClick={() => onFolderClick(null)}
          >
            <HomeIcon className="mr-1 h-4 w-4" />
            Home
          </Button>

          {folderPath.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <ChevronRight className="h-4 w-4" />
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-normal"
                onClick={() => onFolderClick(folder.id)}
              >
                {folder.name}
              </Button>
            </React.Fragment>
          ))}

          {currentFolder && folderPath.length === 0 && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span>{currentFolder.name}</span>
            </>
          )}
        </nav>

        {onCreateFolder && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Enter a name for your new folder.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Folder Name</Label>
                  <Input
                    id="name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="My Folder"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateFolder}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
