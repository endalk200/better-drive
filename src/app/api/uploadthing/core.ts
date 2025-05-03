import { auth } from "@/server/auth";
import {
  MAX_STORAGE_LIMIT,
  UPLOADTHING_ACCEPTED_MIME_TYPES,
} from "@/server/config";
import { db } from "@/server/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fileUploader: f(UPLOADTHING_ACCEPTED_MIME_TYPES)
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const session = await auth();

      if (!session?.user) throw new Error("Unauthorized");

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { storageUsed: true },
      });

      if (!user || user.storageUsed >= MAX_STORAGE_LIMIT) {
        throw new Error("Storage limit exceeded");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileName: file.name,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
