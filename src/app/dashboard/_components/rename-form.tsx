"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(255),
});

type FormValues = z.infer<typeof formSchema>;

interface RenameFormProps {
  itemType: "file" | "folder";
  itemId: string;
  currentName: string;
  onSuccess: () => void; // Callback to close modal on success
}

export function RenameForm({
  itemType,
  itemId,
  currentName,
  onSuccess,
}: RenameFormProps) {
  const utils = api.useUtils();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const renameFolder = api.folder.rename.useMutation({
    onSuccess: async () => {
      toast.success("Folder renamed successfully");
      await utils.folder.invalidate(); // Invalidate all folder queries
      await utils.file.invalidate(); // Potentially needed if folder structure affects file paths/views
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to rename folder", {
        description: error.message,
      });
    },
  });

  const renameFile = api.file.rename.useMutation({
    onSuccess: async () => {
      toast.success("File renamed successfully");
      await utils.file.invalidate(); // Invalidate all file queries
      await utils.folder.invalidate(); // Invalidate folder queries as file lists change
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to rename file", {
        description: error.message,
      });
    },
  });

  const isLoading = renameFolder.isPending || renameFile.isPending;

  const onSubmit = (data: FormValues) => {
    if (data.name === currentName) {
      onSuccess(); // Close modal if name hasn't changed
      return;
    }

    if (itemType === "folder") {
      renameFolder.mutate({ id: itemId, name: data.name });
    } else {
      renameFile.mutate({ id: itemId, name: data.name });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Name</FormLabel>
              <FormControl>
                <Input placeholder={`Enter new ${itemType} name`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Rename {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
        </Button>
      </form>
    </Form>
  );
}
