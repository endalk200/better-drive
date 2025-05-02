import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

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

      if (!user || user.storageUsed + input.size > 50 * 1024 * 1024) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Storage limit exceeded",
        });
      }

      return ctx.db.file.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
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
      const file = await ctx.db.file.findUnique({
        where: { id: input.id },
      });

      if (!file || file.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      // Delete file from database
      await ctx.db.file.delete({
        where: { id: input.id },
      });

      // Update user's storage usage
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          storageUsed: {
            decrement: file.size,
          },
        },
      });

      return { success: true };
    }),
});
