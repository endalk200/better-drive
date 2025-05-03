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

const formSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(255),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateNewFolderFormProps {
  parentId?: string;
  onSuccess: () => void;
}

export function CreateNewFolderForm({
  parentId,
  onSuccess,
}: CreateNewFolderFormProps) {
  const utils = api.useUtils();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data: defaultFolder } = api.folder.getDefaultFolder.useQuery(
    undefined,
    {
      enabled: !parentId, // Only fetch if we don't have a parentId
    },
  );

  const createFolder = api.folder.create.useMutation({
    onSuccess: async () => {
      toast.success("Folder created successfully");
      form.reset();

      // Invalidate both queries to ensure fresh data
      await utils.folder.getContents.invalidate();
      await utils.folder.getDefaultFolder.invalidate();

      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: FormValues) => {
    // If no parentId is provided, use the default folder's ID
    const effectiveParentId = parentId ?? defaultFolder?.id;

    if (!parentId && !effectiveParentId) {
      toast.error("Error", {
        description: "Default folder not found",
      });
      return;
    }

    createFolder.mutate({
      name: data.name,
      parentId: effectiveParentId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder Name</FormLabel>
              <FormControl>
                <Input placeholder="My Folder" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={createFolder.isPending}
        >
          Create Folder
        </Button>
      </form>
    </Form>
  );
}
