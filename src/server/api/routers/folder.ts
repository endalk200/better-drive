import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({});

const folderInput = z.object({
  name: z.string().min(1).max(255),
  parentId: z.string().optional(),
});

const folderIdInput = z.object({
  id: z.string(),
});

export const folderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(folderInput)
    .mutation(async ({ ctx, input }) => {
      const existingFolder = await ctx.db.folder.findFirst({
        where: {
          name: input.name,
          parentId: input.parentId ?? null,
          userId: ctx.session.user.id,
        },
      });

      if (existingFolder) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A folder with this name already exists in this location",
        });
      }

      return ctx.db.folder.create({
        data: {
          name: input.name,
          parentId: input.parentId,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Get all folders for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.folder.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        files: true,
        subFolders: true,
      },
    });
  }),

  getDefaultFolder: protectedProcedure.query(async ({ ctx }) => {
    const defaultFolder = await ctx.db.folder.findFirst({
      where: {
        userId: ctx.session.user.id,
        name: "Home", // or whatever name you use for the default folder
      },
    });

    if (!defaultFolder) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Default folder not found",
      });
    }

    return defaultFolder;
  }),

  // Get folder contents (files and subfolders)
  getContents: protectedProcedure
    .input(
      z.object({
        folderId: z.string().optional(), // optional for root folder
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.folder.findFirst({
        where: {
          id: input.folderId ?? undefined,
          userId: ctx.session.user.id,
        },
        include: {
          files: {
            orderBy: { name: "asc" },
          },
          subFolders: {
            orderBy: { name: "asc" },
          },
        },
      });
    }),

  // Rename a folder
  rename: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(255),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const folder = await ctx.db.folder.findUnique({
        where: { id: input.id },
      });

      if (!folder || folder.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }

      // Check for naming conflicts
      const existingFolder = await ctx.db.folder.findFirst({
        where: {
          name: input.name,
          parentId: folder.parentId,
          userId: ctx.session.user.id,
          id: { not: input.id }, // Exclude current folder
        },
      });

      if (existingFolder) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A folder with this name already exists in this location",
        });
      }

      return ctx.db.folder.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),

  getFolderStats: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const stats = await ctx.db.$transaction(async (tx) => {
        // Get all subfolder IDs recursively
        const getSubFolderIds = async (
          folderId: string,
          collected: Set<string> = new Set(),
        ): Promise<Set<string>> => {
          const subFolders = await tx.folder.findMany({
            where: { parentId: folderId },
            select: { id: true },
          });

          for (const { id } of subFolders) {
            collected.add(id);
            await getSubFolderIds(id, collected);
          }

          return collected;
        };

        const subFolderIds = await getSubFolderIds(input.folderId);

        // Count all files in the folder and subfolders
        const fileCount = await tx.file.count({
          where: {
            folderId: {
              in: [input.folderId, ...subFolderIds],
            },
          },
        });

        return {
          subFolderCount: subFolderIds.size,
          fileCount,
        };
      });

      return stats;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First, verify folder ownership
      const folder = await ctx.db.folder.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!folder || folder.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }

      try {
        // Use a transaction to ensure data consistency
        return await ctx.db.$transaction(async (tx) => {
          // Recursive function to get all subfolder IDs
          const getAllSubFolderIds = async (
            folderId: string,
            collected: Set<string> = new Set(),
          ): Promise<Set<string>> => {
            const subFolders = await tx.folder.findMany({
              where: { parentId: folderId },
              select: { id: true },
            });

            for (const { id } of subFolders) {
              collected.add(id);
              await getAllSubFolderIds(id, collected);
            }

            return collected;
          };

          // Get all subfolder IDs including the target folder
          const folderIds = await getAllSubFolderIds(input.id);
          folderIds.add(input.id);

          // Get all files in these folders
          const files = await tx.file.findMany({
            where: {
              folderId: {
                in: Array.from(folderIds),
              },
            },
            select: {
              id: true,
              key: true,
              size: true,
            },
          });

          // Calculate total size to be freed
          const totalSize = files.reduce((acc, file) => acc + file.size, 0);

          // Delete files from UploadThing
          if (files.length > 0) {
            try {
              await utapi.deleteFiles(files.map((file) => file.key));
            } catch (error) {
              console.error("Error deleting files from UploadThing:", error);
              // Continue with database cleanup even if UploadThing deletion fails
            }
          }

          // Delete the folder (this will cascade delete subfolders and files)
          await tx.folder.delete({
            where: { id: input.id },
          });

          // Update user's storage usage
          await tx.user.update({
            where: { id: ctx.session.user.id },
            data: {
              storageUsed: {
                decrement: totalSize,
              },
            },
          });

          return {
            success: true,
            deletedFiles: files.length,
            deletedFolders: folderIds.size,
            freedSpace: totalSize,
          };
        });
      } catch (error) {
        console.error("Error in folder deletion:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete folder",
        });
      }
    }),

  // Toggle star status
  toggleStar: protectedProcedure
    .input(folderIdInput)
    .mutation(async ({ ctx, input }) => {
      const folder = await ctx.db.folder.findUnique({
        where: { id: input.id },
      });

      if (!folder || folder.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }

      return ctx.db.folder.update({
        where: { id: input.id },
        data: { isStarred: !folder.isStarred },
      });
    }),

  // Get starred folders
  getStarred: protectedProcedure.query(async ({ ctx }) => {
    const [starredFolders, starredFiles] = await Promise.all([
      // Get starred folders
      ctx.db.folder.findMany({
        where: {
          userId: ctx.session.user.id,
          isStarred: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      // Get starred files
      ctx.db.file.findMany({
        where: {
          userId: ctx.session.user.id,
          isStarred: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

    return {
      starredFolders,
      starredFiles,
    };
  }),
});
