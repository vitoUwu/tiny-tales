import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRoutes = createTRPCRouter({
  find: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
