import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  fileUploader: f({
    "image/png": { maxFileSize: "4MB" },
    "application/pdf": { maxFileSize: "4MB" },
    "application/msword": { maxFileSize: "4MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "4MB",
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const session = await auth();

      if (!session?.user) throw new Error("Unauthorized");

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { storageUsed: true },
      });

      if (!user || user.storageUsed >= 50 * 1024 * 1024) {
        throw new Error("Storage limit exceeded");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.user.update({
        where: { id: metadata.userId },
        data: {
          storageUsed: {
            increment: file.size,
          },
        },
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
