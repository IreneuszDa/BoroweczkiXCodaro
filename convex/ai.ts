"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const chat = action({
    args: {
        conversationId: v.id("conversations"),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        // Save user message
        await ctx.runMutation(api.messages.send, {
            conversationId: args.conversationId,
            role: "user",
            content: args.message,
        });

        // Gather context from Convex data
        const incidents = await ctx.runQuery(api.incidents.list, {});
        const incidentStats = await ctx.runQuery(api.incidents.getStats, {});
        const units = await ctx.runQuery(api.rescueUnits.list, {});
        const unitStats = await ctx.runQuery(api.rescueUnits.getStats, {});
        const weather = await ctx.runQuery(api.weather.getLatest, {});
        const recentComms = await ctx.runQuery(api.communications.getLatest, { limit: 5 });

        const dataContext = `
CURRENT MOUNTAIN RESCUE DATA:
- Total Incidents: ${incidentStats.total} (Active: ${incidentStats.active}, Critical: ${incidentStats.critical}, Resolved: ${incidentStats.resolved})
- Rescue Units: ${unitStats.total} (Available: ${unitStats.available}, Deployed: ${unitStats.deployed})

WEATHER TELEMETRY (Latest):
${weather ? `- Location: ${weather.name}
- Wind Speed: ${weather.windSpeed} km/h
- Temperature: ${weather.temperature}°C
- Visibility: ${weather.visibility}m
- Avalanche Risk (1-5): ${weather.avalancheRisk}` : "No weather data available."}

ACTIVE INCIDENTS:
${incidents.filter(i => i.status === "active").map(i => {
            // Find units assigned to this incident
            const assigned = units.filter(u => u.assignedIncidentId === i._id);
            const assignedStr = assigned.length > 0
                ? `[JEDNOSTKI W DRODZE: ${assigned.map(u => u.name).join(", ")}]`
                : `[BRAK PRZYPISANYCH JEDNOSTEK - WYMAGA DYSPONOWANIA!]`;

            return `  - [${i.priority.toUpperCase()}] ${i.title} (${i.type}) - ${i.description || "Brak opisu"} ${assignedStr}`;
        }).join("\n")}

RESCUE UNITS & LOGISTICS:
${units.map(u => {
            const assignedIncident = u.assignedIncidentId ? incidents.find(i => i._id === u.assignedIncidentId) : null;
            const destStr = assignedIncident ? ` -> W trasie do: ${assignedIncident.title}` : ``;
            const logStr = (u.fuelLevel !== undefined) ? ` [Paliwo: ${u.fuelLevel}%, Tlen: ${u.oxygenLevel}%, Leki: ${u.medicalSupplies}%]` : '';
            return `  - ${u.name} (${u.type}): ${u.status.toUpperCase()}${destStr}${logStr}`;
        }).join("\n")}

RECENT RADIO LOG (Last 5 messages):
${recentComms?.map(c => `  - [${c.unitName}]: "${c.message}"`).join("\n") || "Brak nasłuchu."}
`;

        // Determine which widgets to show based on user query
        const widgets: string[] = [];
        const lowerMsg = args.message.toLowerCase();
        if (lowerMsg.includes("map") || lowerMsg.includes("teren") || lowerMsg.includes("gdzie") || lowerMsg.includes("3d")) {
            widgets.push("revenue-chart"); // Will be 3D Map Widget
        }
        if (lowerMsg.includes("incydent") || lowerMsg.includes("zgłoszen") || lowerMsg.includes("wypadek") || lowerMsg.includes("lawina")) {
            widgets.push("leads-table"); // Will be Incidents Table
        }
        if (lowerMsg.includes("zespół") || lowerMsg.includes("ratownik") || lowerMsg.includes("status") || lowerMsg.includes("liczba ratowników")) {
            widgets.push("stats-cards"); // Will be Rescue Stats
        }
        if (lowerMsg.includes("pogoda") || lowerMsg.includes("wiatr") || lowerMsg.includes("temperatura") || lowerMsg.includes("warunki")) {
            widgets.push("sales-funnel"); // Will be Weather Telemetry
        }
        if (lowerMsg.includes("alert") || lowerMsg.includes("rcb") || lowerMsg.includes("turyst") || lowerMsg.includes("ostrzeżeni")) {
            widgets.push("activity-feed"); // Will be RCB Alerts
        }
        if (lowerMsg.includes("logistyk") || lowerMsg.includes("paliwo") || lowerMsg.includes("tlen") || lowerMsg.includes("śmigłowc") || lowerMsg.includes("leki") || lowerMsg.includes("helikopter")) {
            widgets.push("logistics-widget"); // New LPR Logistics
        }
        if (lowerMsg.includes("radio") || lowerMsg.includes("nasłuch") || lowerMsg.includes("komunikat") || lowerMsg.includes("meldunek")) {
            widgets.push("comms-widget"); // New Comms Log
        }
        if (lowerMsg.includes("all") || lowerMsg.includes("dashboard") || lowerMsg.includes("przegląd") || lowerMsg.includes("wszystko")) {
            widgets.push("revenue-chart", "leads-table", "stats-cards", "logistics-widget", "comms-widget");
        }

        // Try to call Gemini AI
        let aiResponse: string;
        try {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("No GEMINI_API_KEY configured");
            }

            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const systemPrompt = `You are MRI (Mountain Rescue Intelligence) AI Dispatcher — an advanced, high-stakes crisis management assistant.
You work inside the Command & Control system for mountain rescue operations. You have full telemetry, incident logs, and weather data.
Your job is to:
- Act as a digital dispatcher and operations coordinator.
- Analyze incoming reports and determine life-threat levels.
- Suggest actions, matching available units to incidents.
- Be extremely extremely concise, professional, and military/tactical in tone. No fluff.
- Use markdown formatting and emojis for spatial awareness (🚁 🆘 🏔️ 🌨️ ⚠️).
- Always respond in the SAME LANGUAGE the user writes in (usually Polish).
- Reference specific data (wind speeds, avalanche risk, helicopter availability) to make calculated decisions.

Here is the live telemetry data:
${dataContext}`;

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: args.message }] }],
                systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
            });

            const response = result.response;
            aiResponse = response.text() ?? "I couldn't generate a response. Please try again.";
        } catch (error) {
            console.error("Gemini API error:", error);
            // Tactical fallback
            aiResponse = `⚠️ **Błąd Połączenia z Centrale (Gemini API Error)**\n\nNiestety nie mogę nawiązać połączenia z serwerem analitycznym. Poniżej znajduje się zrzut bezpośrednich danych telemetrycznych:\n\n- Aktywne zgłoszenia: **${incidentStats.active}** (Krytyczne: ${incidentStats.critical})\n- Zespoły w akcji: **${unitStats.deployed}**\n- Zespoły gotowe w bazie: **${unitStats.available}**\n\nPrzejdź na sterowanie ręczne.`;
        }

        // Auto-title generation if this is a new conversation
        try {
            const conversations = await ctx.runQuery(api.messages.listConversations, {});
            const currentConv = conversations.find((c) => c._id === args.conversationId);

            if (currentConv && currentConv.title === "Nowa rozmowa") {
                const apiKey = process.env.GEMINI_API_KEY;
                if (apiKey) {
                    const { GoogleGenerativeAI } = await import("@google/generative-ai");
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                    const titlePrompt = `Write a very brief, tactical title (max 3-4 words) for this mountain rescue log based on the user request. Output ONLY the title. Request: "${args.message}"`;
                    const titleResult = await model.generateContent({
                        contents: [{ role: "user", parts: [{ text: titlePrompt }] }]
                    });

                    const newTitle = titleResult.response.text()?.trim() ?? "Log Operacyjny";
                    const cleanTitle = newTitle.replace(/^["']|["']$/g, "");

                    await ctx.runMutation(api.messages.updateConversationTitle, {
                        conversationId: args.conversationId,
                        title: cleanTitle
                    });
                }
            }
        } catch (error) {
            console.error("Failed to generate title:", error);
        }

        // Save assistant response
        await ctx.runMutation(api.messages.send, {
            conversationId: args.conversationId,
            role: "assistant",
            content: aiResponse,
            widgets: widgets.length > 0 ? widgets : undefined,
        });

        return { content: aiResponse, widgets };
    },
});
