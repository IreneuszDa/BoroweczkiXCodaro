import { query } from "./_generated/server";
import { v } from "convex/values";

export const getLatest = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("communications")
            .withIndex("by_timestamp")
            .order("desc")
            .take(args.limit || 20);
    },
});
