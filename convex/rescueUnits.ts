import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {
        type: v.optional(v.union(v.literal("helicopter"), v.literal("quad"), v.literal("foot_patrol"), v.literal("dog_unit"))),
    },
    handler: async (ctx, args) => {
        if (args.type) {
            return await ctx.db.query("rescueUnits")
                .withIndex("by_type", (q) => q.eq("type", args.type as any))
                .collect();
        }
        return await ctx.db.query("rescueUnits").collect();
    },
});

export const getStats = query({
    handler: async (ctx) => {
        const all = await ctx.db.query("rescueUnits").collect();
        return {
            total: all.length,
            available: all.filter(u => u.status === "at_base").length,
            deployed: all.filter(u => u.status === "in_action").length,
        };
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("rescueUnits"),
        status: v.union(v.literal("at_base"), v.literal("in_action"), v.literal("unavailable")),
        assignedIncidentId: v.optional(v.id("incidents"))
    },
    handler: async (ctx, args) => {
        const updates: any = { status: args.status };
        if (args.assignedIncidentId !== undefined) {
            updates.assignedIncidentId = args.assignedIncidentId;
        }
        return await ctx.db.patch(args.id, updates);
    }
});

export const updateLocation = mutation({
    args: {
        id: v.id("rescueUnits"),
        lat: v.number(),
        lng: v.number(),
        alt: v.number()
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, {
            location: {
                lat: args.lat,
                lng: args.lng,
                alt: args.alt
            }
        });
    }
});
