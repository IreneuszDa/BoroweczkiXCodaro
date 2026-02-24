import { mutation } from "./_generated/server";

export const reset = mutation({
    args: {},
    handler: async (ctx) => {
        const incidents = await ctx.db.query("incidents").collect();
        for (const i of incidents) await ctx.db.delete(i._id);

        const units = await ctx.db.query("rescueUnits").collect();
        for (const u of units) await ctx.db.delete(u._id);

        const weather = await ctx.db.query("weatherStations").collect();
        for (const w of weather) await ctx.db.delete(w._id);

        const comms = await ctx.db.query("communications").collect();
        for (const c of comms) await ctx.db.delete(c._id);

        return "Database wiped.";
    }
});
