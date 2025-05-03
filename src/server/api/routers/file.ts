import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { MAX_STORAGE_LIMIT } from "@/server/config";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({});

export const fileRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
        url: z.string(),
        key: z.string(),
        folderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check storage limit
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { storageUsed: true },
      });

      if (!user || user.storageUsed + input.size > MAX_STORAGE_LIMIT) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Storage limit exceeded",
        });
      }

      const folder = await ctx.db.folder.findUnique({
        where: {
          id: input.folderId,
          userId: ctx.session.user.id,
        },
      });

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }

      const file = ctx.db.file.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          storageUsed: {
            increment: input.size,
          },
        },
      });

      return file;
    }),

  toggleStar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.file.findUnique({
        where: { id: input.id },
      });

      if (!file || file.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      return ctx.db.file.update({
        where: { id: input.id },
        data: { isStarred: !file.isStarred },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.$transaction(async (tx) => {
          // Get file details and verify ownership
          const file = await tx.file.findUnique({
            where: { id: input.id },
            select: {
              id: true,
              key: true,
              size: true,
              name: true,
              userId: true,
            },
          });

          if (!file) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "File not found",
            });
          }

          if (file.userId !== ctx.session.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You don't have permission to delete this file",
            });
          }

          // Delete file from UploadThing
          try {
            await utapi.deleteFiles([file.key]);
          } catch (error) {
            console.error("Error deleting file from UploadThing:", error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to delete file from storage",
            });
          }

          // Delete file from database
          await tx.file.delete({
            where: { id: input.id },
          });

          // Update user's storage usage
          await tx.user.update({
            where: { id: ctx.session.user.id },
            data: {
              storageUsed: {
                decrement: file.size,
              },
            },
          });

          return {
            success: true,
            deletedFile: {
              name: file.name,
              size: file.size,
            },
          };
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error in file deletion:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
        });
      }
    }),
});
