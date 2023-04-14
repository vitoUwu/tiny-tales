import type { Badge, Post as PostSchema } from "@prisma/client";

export type Post = PostSchema & {
  author: {
    badges: Badge[];
    name: string | null;
    image: string | null;
  };
  likes: {
    authorId: string;
  }[];
};
