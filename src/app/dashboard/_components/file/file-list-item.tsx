import { Card, CardContent } from "@/components/ui/card";
import { getFileIcon } from "../utils";
import {
  Eye,
  MoreVertical,
  Pencil,
  Star,
  StarIcon,
  Trash2,
} from "lucide-react";
import { formatBytes } from "@/lib/utils/formatter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ImagePreviewModal } from "@/components/image-preview-modal";
import { FilePreviewModal } from "@/components/file-preview-modal";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useStarFile } from "@/lib/data-layer/file/use-star-file";

export type FileListItemProps = {
  id: string;
  type: string;
  name: string;
  isStarred: boolean;
  size: number;
  updatedAt: Date;
  url: string;
  folderId: string;

  onRename: () => void;
  onDelete: () => void;
};

export function FileListItem(props: FileListItemProps) {
  const { toggleStarFile } = useStarFile();

  const [, setImagePreviewModalOpen] = useQueryState(
    "image-modal",
    parseAsBoolean.withDefault(false),
  );
  const [, setImagePreviewUrl] = useQueryState("image-url", parseAsString);

  const [, setFilePreviewModalOpen] = useQueryState(
    "file-modal",
    parseAsBoolean.withDefault(false),
  );
  const [, setFilePreviewUrl] = useQueryState("file-url", parseAsString);

  return (
    <>
      <Card className="rounded-[0px] transition-colors hover:bg-gray-50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-gray-100 p-2">
            {getFileIcon(props.type)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="truncate font-medium">{props.name}</p>
              {props.isStarred && (
                <Star className="h-4 w-4 flex-shrink-0 text-yellow-400" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formatBytes(props.size)}</span>
              <span>•</span>
              <span>{new Date(props.updatedAt).toLocaleDateString()}</span>
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
              <DropdownMenuItem
                onClick={() => {
                  if (props.type.startsWith("image/")) {
                    // Open image preview modal
                    void setImagePreviewModalOpen(true);
                    void setImagePreviewUrl(props.url);
                  } else if (props.type.startsWith("application/pdf")) {
                    // Open file preview modal
                    void setFilePreviewModalOpen(true);
                    void setFilePreviewUrl(props.url);
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  props.onRename();
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleStarFile.mutate({ id: props.id })}
              >
                <StarIcon
                  className={`mr-2 h-4 w-4 ${
                    props.isStarred ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
                {props.isStarred ? "Unstar" : "Star"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  props.onDelete();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <ImagePreviewModal />
      <FilePreviewModal />
    </>
  );
}
