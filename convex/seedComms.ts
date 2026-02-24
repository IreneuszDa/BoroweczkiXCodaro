import { mutation } from "./_generated/server";

export const force = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();
        const units = await ctx.db.query("rescueUnits").collect();

        // 1. Add communications
        if (units.length >= 2) {
            await ctx.db.insert("communications", {
                unitId: units[0]._id,
                unitName: "Sokół-1",
                message: "Mamy kontakt wzrokowy z lawiniskiem. Rozpoczynamy desant ratowników i psa. Paliwo 45%.",
                channel: "CH_1_EMERGENCY",
                timestamp: now - 2 * 60000,
            });
            await ctx.db.insert("communications", {
                unitId: units[1]._id,
                unitName: "Patrol Pieszo-Pies",
                message: "Widoczność bliska zero, opóźnienie w marszu. Sprzęt trauma zabezpieczony.",
                channel: "CH_1_EMERGENCY",
                timestamp: now - 12 * 60000,
            });
        }

        await ctx.db.insert("communications", {
            unitName: "Centrala (TOPR)",
            message: "Uwaga wszystkie jednostki, prognozowany gwałtowny wzrost siły wiatru w ciągu godziny. Oszczędzać sprzęt tlenowy.",
            channel: "CH_2_LOGISTICS",
            timestamp: now - 25 * 60000,
        });

        // 2. Update units with logistics
        for (const u of units) {
            if (u.type === "helicopter") {
                await ctx.db.patch(u._id, { fuelLevel: 45, oxygenLevel: 80, medicalSupplies: 60 });
            } else if (u.type === "quad") {
                await ctx.db.patch(u._id, { fuelLevel: 100, medicalSupplies: 100 });
            } else {
                await ctx.db.patch(u._id, { medicalSupplies: 80 });
            }
        }

        return "Forced missing unit logistics and radio comms!";
    }
});
