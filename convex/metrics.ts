import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("metrics")
            .withIndex("by_date")
            .order("asc")
            .collect();
    },
});

export const getRevenue = query({
    args: {},
    handler: async (ctx) => {
        const metrics = await ctx.db
            .query("metrics")
            .withIndex("by_date")
            .order("asc")
            .collect();
        return metrics.map((m) => ({
            date: m.date,
            revenue: m.revenue,
        }));
    },
});

export const getLeads = query({
    args: {},
    handler: async (ctx) => {
        const metrics = await ctx.db
            .query("metrics")
            .withIndex("by_date")
            .order("asc")
            .collect();
        return metrics.map((m) => ({
            date: m.date,
            leads: m.leads,
            conversions: m.conversions,
        }));
    },
});

export const getAggregated = query({
    args: {},
    handler: async (ctx) => {
        const metrics = await ctx.db.query("metrics").collect();
        if (metrics.length === 0) {
            return {
                totalRevenue: 0,
                totalLeads: 0,
                totalConversions: 0,
                avgTasks: 0,
                avgActiveCases: 0,
                revenueGrowth: 0,
            };
        }
        const totalRevenue = metrics.reduce((s, m) => s + m.revenue, 0);
        const totalLeads = metrics.reduce((s, m) => s + m.leads, 0);
        const totalConversions = metrics.reduce((s, m) => s + m.conversions, 0);
        const avgTasks = Math.round(metrics.reduce((s, m) => s + m.tasks, 0) / metrics.length);
        const avgActiveCases = Math.round(
            metrics.reduce((s, m) => s + m.activeCases, 0) / metrics.length
        );

        const sorted = [...metrics].sort((a, b) => a.date.localeCompare(b.date));
        const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
        const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
        const firstRevenue = firstHalf.reduce((s, m) => s + m.revenue, 0);
        const secondRevenue = secondHalf.reduce((s, m) => s + m.revenue, 0);
        const revenueGrowth =
            firstRevenue > 0
                ? Math.round(((secondRevenue - firstRevenue) / firstRevenue) * 100)
                : 0;

        return {
            totalRevenue,
            totalLeads,
            totalConversions,
            avgTasks,
            avgActiveCases,
            revenueGrowth,
        };
    },
});

export const getByDateRange = query({
    args: { start: v.string(), end: v.string() },
    handler: async (ctx, args) => {
        const metrics = await ctx.db
            .query("metrics")
            .withIndex("by_date")
            .order("asc")
            .collect();
        return metrics.filter((m) => m.date >= args.start && m.date <= args.end);
    },
});
