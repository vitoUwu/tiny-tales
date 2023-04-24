import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedRatelimitedProcedure,
  publicProcedure,
} from "../trpc";

export const postRoutes = createTRPCRouter({
  create: protectedRatelimitedProcedure
    .input(z.object({ content: z.string().max(256).min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: {
          authorId: ctx.session.user.id,
          content: input.content,
        },
        include: {
          author: {
            select: {
              badges: true,
              name: true,
              image: true,
            },
          },
          likes: {
            select: {
              authorId: true,
              postId: true,
            },
          },
        },
      });
    }),
  fetch: publicProcedure
    .input(
      z.object({
        limit: z.number().nullish(),
        cursor: z.string().cuid().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const itemsPerPage = input?.limit ?? 20;
      const cursor = input?.cursor;

      const posts = await ctx.prisma.post.findMany({
        orderBy: { id: "desc" },
        take: itemsPerPage + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          author: {
            select: {
              name: true,
              image: true,
              badges: true,
            },
          },
          likes: {
            select: {
              authorId: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (posts.length > itemsPerPage) {
        const nextPost = posts.pop()!;
        nextCursor = nextPost.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
  delete: protectedRatelimitedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post was not found",
        });
      }

      const isUserAllowed =
        ctx.session.user.roles.includes("admin") ||
        ctx.session.user.id === post.authorId;

      if (!isUserAllowed) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have no permission to delete this post",
        });
      }

      await ctx.prisma.post.delete({
        where: {
          id: input.id,
        },
      });
    }),
  edit: protectedRatelimitedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        content: z.string().max(256),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post was not found",
        });
      }

      const isUserAllowed = ctx.session.user.id === post.authorId;

      if (!isUserAllowed) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have no permission to edit this post",
        });
      }

      await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });
    }),
  setLikeState: protectedRatelimitedProcedure
    .input(z.object({ postId: z.string().cuid(), liked: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const postExists = Boolean(
        await ctx.prisma.post.count({
          where: {
            id: input.postId,
          },
        })
      );

      if (!postExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const likeExists = Boolean(
        await ctx.prisma.like.count({
          where: {
            AND: {
              authorId: ctx.session.user.id,
              postId: input.postId,
            },
          },
        })
      );

      if (likeExists) {
        if (input.liked) {
          return;
        }

        await ctx.prisma.like.delete({
          where: {
            authorId_postId: {
              authorId: ctx.session.user.id,
              postId: input.postId,
            },
          },
        });
        return;
      }

      if (!likeExists) {
        if (!input.liked) {
          return;
        }

        await ctx.prisma.like.create({
          data: {
            authorId: ctx.session.user.id,
            postId: input.postId,
          },
        });
        return;
      }
    }),
  fetchById: publicProcedure
    .input(z.string().cuid())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findUnique({
        where: { id: input },
        include: {
          likes: true,
          author: {
            select: {
              name: true,
              image: true,
              badges: true,
            },
          },
        },
      });
    }),
});
