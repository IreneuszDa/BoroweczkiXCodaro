import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByCustomer = query({
    args: { customerId: v.id("customers") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("interactions")
            .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
            .order("desc")
            .collect();
    },
});

export const listRecent = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const interactions = await ctx.db
            .query("interactions")
            .order("desc")
            .take(args.limit ?? 20);

        const withCustomers = await Promise.all(
            interactions.map(async (interaction) => {
                const customer = await ctx.db.get(interaction.customerId);
                return { ...interaction, customerName: customer?.name ?? "Unknown" };
            })
        );
        return withCustomers;
    },
});

export const getActivityStats = query({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("interactions").collect();
        const calls = all.filter((i) => i.type === "call").length;
        const emails = all.filter((i) => i.type === "email").length;
        const meetings = all.filter((i) => i.type === "meeting").length;
        const chats = all.filter((i) => i.type === "chat").length;
        return { calls, emails, meetings, chats, total: all.length };
    },
});

export const create = mutation({
    args: {
        customerId: v.id("customers"),
        type: v.union(
            v.literal("call"),
            v.literal("email"),
            v.literal("meeting"),
            v.literal("chat"),
            v.literal("note")
        ),
        notes: v.string(),
        sentiment: v.optional(
            v.union(v.literal("positive"), v.literal("neutral"), v.literal("negative"))
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("interactions", {
            ...args,
            createdAt: Date.now(),
        });
    },
});
