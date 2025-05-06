import {
  parseAsBoolean,
  parseAsJson,
  parseAsString,
  useQueryState,
} from "nuqs";
import { z } from "zod";

export const breadcrumbSchema = z.array(
  z.object({
    id: z.string().nullable(),
    name: z.string(),
  }),
);

export function useFileExplorerBreadcrumb() {
  return useQueryState(
    "breadcrumbs",
    parseAsJson((v) => breadcrumbSchema.parse(v)).withDefault([
      { id: null, name: "Home" },
    ]),
  );
}

export function useCurrentFolderId() {
  return useQueryState("folderId", parseAsString);
}

const folderStatsSchema = z.object({
  subFolderCount: z.number(),
  fileCount: z.number(),
});

export function useFolderStats() {
  return useQueryState(
    "folderStats",
    parseAsJson((v) => folderStatsSchema.parse(v)),
  );
}

// ==== delete
const deleteItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["file", "folder"]),
});

export function useItemsToDelete() {
  return useQueryState(
    "itemToDelete",
    parseAsJson((v) => deleteItemSchema.parse(v)),
  );
}

// ==== rename
const renameItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["file", "folder"]),
});

export function useItemsToRename() {
  return useQueryState(
    "itemsToRename",
    parseAsJson((v) => renameItemSchema.parse(v)),
  );
}

// ==== folder
export function useDeleteFolderModal() {
  return useQueryState("isDeletingFolder", parseAsBoolean.withDefault(false));
}

export function useRenameFolderModal() {
  return useQueryState("isRenamingFolder", parseAsBoolean.withDefault(false));
}

// === file
export function useDeleteFileModal() {
  return useQueryState("isDeletingFile", parseAsBoolean.withDefault(false));
}

export function useRenameFileModal() {
  return useQueryState("isRenamingFile", parseAsBoolean.withDefault(false));
}
