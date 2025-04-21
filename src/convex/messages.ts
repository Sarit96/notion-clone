import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    await ctx.db.insert("messages", {
      text: args.text,
      userId,
    });
  },
}); 