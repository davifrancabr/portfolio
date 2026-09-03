import { getSession } from '#/lib/auth.function';
import {
  UploadThingError,
  createUploadthing,
  type FileRouter
} from 'uploadthing/server';

const f = createUploadthing();

export const uploadRouter = {
  userImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1
    }
  })
    .middleware(async ({ req }) => {
      const user = await getSession(req);

      if (!user?.session) throw new UploadThingError('Unauthorized');

      return { userId: user.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    })
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
