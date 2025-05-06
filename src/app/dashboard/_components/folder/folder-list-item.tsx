import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStarFolder } from "@/lib/data-layer/folder/use-star-folder";
import {
  FolderIcon,
  MoreVertical,
  Pencil,
  Star,
  StarIcon,
  Trash2,
} from "lucide-react";

export type FolderListItemProps = {
  id: string;
  name: string;
  isStarred: boolean;
  updatedAt: Date;
  createdAt: Date;
  parentId: string | null;

  onClick: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export function FolderListItem(props: FolderListItemProps) {
  const { toggleStarFolder } = useStarFolder();

  return (
    <Card className="rounded-[0px] transition-colors hover:bg-gray-50">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="cursor-pointer rounded-lg bg-gray-100 p-2">
          <FolderIcon className="h-8 w-8 text-yellow-500" />
        </div>
        <div className="min-w-0 flex-1 cursor-pointer" onClick={props.onClick}>
          <div className="flex items-center gap-1">
            <p className="truncate font-medium">
              {props.name ?? "Unnamed Folder"}
            </p>
            {props.isStarred && (
              <Star className="h-4 w-4 flex-shrink-0 text-yellow-400" />
            )}
          </div>
          <p className="text-xs text-gray-500">
            {new Date(props.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => props.onRename()}
              disabled={props.name === "Home" && !props.parentId}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toggleStarFolder.mutate({ id: props.id });
              }}
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
  );
}
