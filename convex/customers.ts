import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("customers").order("desc").collect();
    },
});

export const listByStatus = query({
    args: { status: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("customers")
            .withIndex("by_status", (q) =>
                q.eq("status", args.status as "lead" | "prospect" | "active" | "churned")
            )
            .collect();
    },
});

export const getById = query({
    args: { id: v.id("customers") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getTopLeads = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const all = await ctx.db.query("customers").collect();
        return all
            .sort((a, b) => b.score - a.score)
            .slice(0, args.limit ?? 10);
    },
});

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("customers").collect();
        const total = all.length;
        const active = all.filter((c) => c.status === "active").length;
        const leads = all.filter((c) => c.status === "lead").length;
        const prospects = all.filter((c) => c.status === "prospect").length;
        const churned = all.filter((c) => c.status === "churned").length;
        const avgScore = total > 0 ? Math.round(all.reduce((s, c) => s + c.score, 0) / total) : 0;
        return { total, active, leads, prospects, churned, avgScore };
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        company: v.string(),
        status: v.union(
            v.literal("lead"),
            v.literal("prospect"),
            v.literal("active"),
            v.literal("churned")
        ),
        score: v.number(),
        phone: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("customers", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("customers"),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        company: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("lead"),
                v.literal("prospect"),
                v.literal("active"),
                v.literal("churned")
            )
        ),
        score: v.optional(v.number()),
        phone: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const filtered = Object.fromEntries(
            Object.entries(updates).filter(([, v]) => v !== undefined)
        );
        await ctx.db.patch(id, filtered);
    },
});
