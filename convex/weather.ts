import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLatest = query({
    handler: async (ctx) => {
        return await ctx.db.query("weatherStations")
            .withIndex("by_timestamp")
            .order("desc")
            .first();
    },
});

export const add = mutation({
    args: {
        name: v.string(),
        lat: v.number(),
        lng: v.number(),
        alt: v.number(),
        windSpeed: v.number(),
        temperature: v.number(),
        visibility: v.number(),
        avalancheRisk: v.number()
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("weatherStations", {
            name: args.name,
            location: {
                lat: args.lat,
                lng: args.lng,
                alt: args.alt
            },
            windSpeed: args.windSpeed,
            temperature: args.temperature,
            visibility: args.visibility,
            avalancheRisk: args.avalancheRisk,
            timestamp: Date.now()
        });
    }
});
