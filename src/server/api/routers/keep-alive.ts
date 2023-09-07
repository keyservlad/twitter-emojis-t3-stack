import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const keepAliveRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.content !== "secret") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      const dummy = await ctx.prisma.keepAlive.create({
        data: {},
      });
      return dummy;
    }),
});
