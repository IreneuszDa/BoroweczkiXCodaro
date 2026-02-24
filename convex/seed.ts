import { mutation } from "./_generated/server";

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // 1. Weather Stations
        await ctx.db.insert("weatherStations", {
            name: "Morskie Oko (Schronisko)",
            location: { lat: 49.2003, lng: 20.0716, alt: 1395 },
            windSpeed: 45,
            temperature: -4,
            visibility: 800,
            avalancheRisk: 3,
            timestamp: now,
        });
        await ctx.db.insert("weatherStations", {
            name: "Kasprowy Wierch",
            location: { lat: 49.2325, lng: 19.9818, alt: 1987 },
            windSpeed: 85,
            temperature: -12,
            visibility: 150,
            avalancheRisk: 4,
            timestamp: now,
        });

        // 2. Rescue Units
        const u1 = await ctx.db.insert("rescueUnits", {
            name: "Helikopter Sokół-1",
            type: "helicopter",
            status: "in_action",
            location: { lat: 49.1895, lng: 20.0811, alt: 2150 },
            personnelCount: 4,
            fuelLevel: 45,
            oxygenLevel: 80,
            medicalSupplies: 60,
            createdAt: now,
        });
        const u2 = await ctx.db.insert("rescueUnits", {
            name: "Grupa Szybka Q-1",
            type: "quad",
            status: "at_base",
            location: { lat: 49.2991, lng: 19.9494, alt: 850 },
            personnelCount: 2,
            fuelLevel: 100,
            medicalSupplies: 100,
            createdAt: now,
        });
        const u3 = await ctx.db.insert("rescueUnits", {
            name: "Patrol Pieszo-Pies",
            type: "dog_unit",
            status: "in_action",
            location: { lat: 49.2155, lng: 20.0055, alt: 1600 },
            personnelCount: 3,
            medicalSupplies: 40,
            createdAt: now,
        });
        const u4 = await ctx.db.insert("rescueUnits", {
            name: "Patrol Interwencyjny",
            type: "foot_patrol",
            status: "at_base",
            location: { lat: 49.2991, lng: 19.9494, alt: 850 },
            personnelCount: 5,
            medicalSupplies: 90,
            createdAt: now,
        });

        // 3. Incidents
        const i1 = await ctx.db.insert("incidents", {
            title: "Podejrzenie zejścia lawiny - Rysy",
            type: "avalanche",
            priority: "critical",
            status: "active",
            location: { lat: 49.1893, lng: 20.0814, alt: 2200 },
            description: "Zgłoszenie od turystów o zejściu dużej lawiny śnieżnej w rejonie Rysów. Brak kontaktu z dwoma osobami.",
            createdAt: now - 15 * 60000,
        });

        const i2 = await ctx.db.insert("incidents", {
            title: "Zabłądzenie w śnieżycy",
            type: "lost",
            priority: "high",
            status: "active",
            location: { lat: 49.2151, lng: 20.0051, alt: 1650 },
            description: "3 osoby straciły orientację w rejonie Doliny Pięciu Stawów przy widoczności poniżej 10m.",
            createdAt: now - 45 * 60000,
        });

        const i3 = await ctx.db.insert("incidents", {
            title: "Uwięziony taternik",
            type: "injury",
            priority: "medium",
            status: "resolved",
            location: { lat: 49.2215, lng: 20.0354, alt: 1850 },
            description: "Lekki uraz kostki, ewakuacja zrealizowana pomyślnie wczoraj.",
            createdAt: now - 86400000,
        });

        // Link assigned incidents
        await ctx.db.patch(u1, { assignedIncidentId: i1 });
        await ctx.db.patch(u3, { assignedIncidentId: i2 });

        // 4. Communications (Radio Log)
        await ctx.db.insert("communications", {
            unitId: u1,
            unitName: "Sokół-1",
            message: "Mamy kontakt wzrokowy z lawiniskiem. Rozpoczynamy desant ratowników i psa.",
            channel: "CH_1_EMERGENCY",
            timestamp: now - 2 * 60000,
        });
        await ctx.db.insert("communications", {
            unitId: u3,
            unitName: "Patrol Pieszo-Pies",
            message: "Złe warunki pogodowe opóźniają marsz. Szacowany czas dotarcia do doliny +20 minut.",
            channel: "CH_1_EMERGENCY",
            timestamp: now - 12 * 60000,
        });
        await ctx.db.insert("communications", {
            unitName: "Centrala (TOPR)",
            message: "Uwaga wszystkie jednostki, prognozowany gwałtowny wzrost siły wiatru w ciągu godziny.",
            channel: "CH_2_LOGISTICS",
            timestamp: now - 25 * 60000,
        });

        return "Seeded Mountain Rescue scenarios (Incidents, Units, Weather, Communications)";
    },
});
