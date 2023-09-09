import { type NextApiRequest, type NextApiResponse } from "next";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";

const keepAlive = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  // check that it is a post request
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    const { content } = req.query;
    if (content !== "secret") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    } else {
      const dummy = await ctx.prisma.keepAlive.create({
        data: {},
      });
      res.status(200).json(dummy);
    }
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occured
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    // Another error occured
    console.error(cause);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default keepAlive;
