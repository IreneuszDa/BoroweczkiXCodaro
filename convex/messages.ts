import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_createdAt")
            .order("asc")
            .collect();
    },
});

export const send = mutation({
    args: {
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        widgets: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("messages", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const clear = mutation({
    args: {},
    handler: async (ctx) => {
        const messages = await ctx.db.query("messages").collect();
        for (const msg of messages) {
            await ctx.db.delete(msg._id);
        }
    },
});
