import { mutation } from "./_generated/server";

const COMPANIES = [
    "TechFlow", "DataSync", "CloudNine", "QuantumLeap", "NexGen",
    "ByteForge", "CyberVault", "PulseTech", "VertexAI", "OmniCore",
    "StreamLine", "CodeCraft", "InnoWave", "SkyBridge", "AeroLogic",
];

const FIRST_NAMES = [
    "Anna", "Marcin", "Katarzyna", "Piotr", "Agnieszka",
    "Tomasz", "Magdalena", "Jakub", "Natalia", "Paweł",
    "Aleksandra", "Michał", "Joanna", "Krzysztof", "Marta",
    "Jan", "Ewa", "Adam", "Barbara", "Łukasz",
    "Karolina", "Marek", "Monika", "Rafał", "Dorota",
    "Kamil", "Izabela", "Grzegorz", "Weronika", "Sebastian",
];

const LAST_NAMES = [
    "Kowalski", "Nowak", "Wiśniewski", "Dąbrowski", "Lewandowski",
    "Wójcik", "Kamiński", "Kowalczyk", "Zieliński", "Szymański",
    "Woźniak", "Kozłowski", "Jankowski", "Mazur", "Kwiatkowski",
    "Krawczyk", "Piotrowski", "Grabowski", "Nowakowski", "Pawłowski",
    "Michalski", "Adamczyk", "Dudek", "Górski", "Jaworski",
    "Kaczmarek", "Stępień", "Król", "Wieczorek", "Sikora",
];

const STATUSES: ("lead" | "prospect" | "active" | "churned")[] = [
    "lead", "lead", "lead", "prospect", "prospect", "active", "active", "active", "active", "churned",
];

const INTERACTION_TYPES: ("call" | "email" | "meeting" | "chat" | "note")[] = [
    "call", "email", "meeting", "chat", "note",
];

const SENTIMENTS: ("positive" | "neutral" | "negative")[] = [
    "positive", "positive", "neutral", "neutral", "neutral", "negative",
];

const INTERACTION_NOTES = [
    "Discussed project timeline and deliverables",
    "Follow-up on pricing proposal",
    "Demo of new features scheduled",
    "Quarterly review completed",
    "Onboarding session finished",
    "Escalation resolved successfully",
    "New requirements gathered",
    "Contract renewal discussion",
    "Technical integration planning",
    "Feedback session — positive outcome",
    "Budget approval pending",
    "Partnership opportunity explored",
    "Support ticket resolved",
    "Product roadmap presentation",
    "Migration planning session",
];

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if already seeded
        const existing = await ctx.db.query("customers").first();
        if (existing) return "Already seeded";

        const now = Date.now();
        const DAY = 86400000;

        // Create 30 customers
        const customerIds = [];
        for (let i = 0; i < 30; i++) {
            const id = await ctx.db.insert("customers", {
                name: `${FIRST_NAMES[i]} ${LAST_NAMES[i]}`,
                email: `${FIRST_NAMES[i].toLowerCase()}.${LAST_NAMES[i].toLowerCase()}@${COMPANIES[i % COMPANIES.length].toLowerCase()}.pl`,
                company: COMPANIES[i % COMPANIES.length],
                status: STATUSES[i % STATUSES.length],
                score: Math.floor(Math.random() * 60) + 40,
                phone: `+48 ${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
                createdAt: now - DAY * Math.floor(Math.random() * 90),
            });
            customerIds.push(id);
        }

        // Create 90 interactions
        for (let i = 0; i < 90; i++) {
            await ctx.db.insert("interactions", {
                customerId: customerIds[i % customerIds.length],
                type: INTERACTION_TYPES[Math.floor(Math.random() * INTERACTION_TYPES.length)],
                notes: INTERACTION_NOTES[Math.floor(Math.random() * INTERACTION_NOTES.length)],
                sentiment: SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)],
                createdAt: now - DAY * Math.floor(Math.random() * 30),
            });
        }

        // Create 30 days of metrics
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now - DAY * i);
            const dateStr = date.toISOString().split("T")[0];
            const baseRevenue = 12000 + Math.floor(Math.random() * 8000);
            const trend = Math.floor((30 - i) * 150);

            await ctx.db.insert("metrics", {
                date: dateStr,
                revenue: baseRevenue + trend,
                leads: Math.floor(Math.random() * 15) + 5,
                conversions: Math.floor(Math.random() * 8) + 2,
                tasks: Math.floor(Math.random() * 12) + 3,
                activeCases: Math.floor(Math.random() * 20) + 10,
            });
        }

        return "Seeded 30 customers, 90 interactions, 30 days metrics";
    },
});
