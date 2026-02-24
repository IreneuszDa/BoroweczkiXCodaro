import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {
        status: v.optional(v.union(v.literal("active"), v.literal("resolved"), v.literal("false_alarm"))),
    },
    handler: async (ctx, args) => {
        if (args.status) {
            return await ctx.db.query("incidents")
                .withIndex("by_status", (q) => q.eq("status", args.status as any))
                .order("desc")
                .take(50);
        }
        return await ctx.db.query("incidents").order("desc").take(50);
    },
});

export const getStats = query({
    handler: async (ctx) => {
        const all = await ctx.db.query("incidents").collect();
        return {
            total: all.length,
            active: all.filter(i => i.status === "active").length,
            critical: all.filter(i => i.status === "active" && i.priority === "critical").length,
            resolved: all.filter(i => i.status === "resolved").length,
        };
    },
});

export const add = mutation({
    args: {
        title: v.string(),
        type: v.union(v.literal("lost"), v.literal("injury"), v.literal("avalanche"), v.literal("other")),
        priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
        lat: v.number(),
        lng: v.number(),
        alt: v.number(),
        description: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("incidents", {
            title: args.title,
            type: args.type,
            priority: args.priority,
            status: "active",
            location: {
                lat: args.lat,
                lng: args.lng,
                alt: args.alt
            },
            description: args.description,
            createdAt: Date.now(),
        });
    }
});
