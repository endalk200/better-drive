import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { MAX_STORAGE_LIMIT } from "@/server/config";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getStorageInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { storageUsed: true },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return {
      usedBytes: user.storageUsed,
      totalBytes: MAX_STORAGE_LIMIT,
    };
  }),
});
