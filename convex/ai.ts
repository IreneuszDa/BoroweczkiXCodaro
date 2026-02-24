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
        const customers = await ctx.runQuery(api.customers.list, {});
        const stats = await ctx.runQuery(api.customers.getStats, {});
        const metrics = await ctx.runQuery(api.metrics.getAggregated, {});
        const recentInteractions = await ctx.runQuery(api.interactions.listRecent, { limit: 10 });
        const topLeads = await ctx.runQuery(api.customers.getTopLeads, { limit: 5 });
        const revenueData = await ctx.runQuery(api.metrics.getRevenue, {});

        const dataContext = `
CURRENT CRM DATA CONTEXT:
- Total customers: ${stats.total} (Active: ${stats.active}, Leads: ${stats.leads}, Prospects: ${stats.prospects}, Churned: ${stats.churned})
- Average customer score: ${stats.avgScore}/100
- Total revenue (30 days): $${metrics.totalRevenue.toLocaleString()}
- Revenue growth: ${metrics.revenueGrowth}%
- Total leads (30 days): ${metrics.totalLeads}
- Total conversions: ${metrics.totalConversions}
- Average daily tasks: ${metrics.avgTasks}

TOP 5 LEADS:
${topLeads.map((c) => `  - ${c.name} (${c.company}) — Score: ${c.score}, Status: ${c.status}`).join("\n")}

RECENT INTERACTIONS:
${recentInteractions.map((i) => `  - ${i.customerName}: ${i.type} — ${i.notes}`).join("\n")}

LATEST REVENUE TREND:
${revenueData.slice(-7).map((r) => `  ${r.date}: $${r.revenue.toLocaleString()}`).join("\n")}

ALL CUSTOMERS:
${customers.map((c) => `  - ${c.name} | ${c.email} | ${c.company} | Status: ${c.status} | Score: ${c.score}`).join("\n")}
`;

        // Determine which widgets to show
        const widgets: string[] = [];
        const lowerMsg = args.message.toLowerCase();
        if (lowerMsg.includes("revenue") || lowerMsg.includes("przychod") || lowerMsg.includes("pieniądz") || lowerMsg.includes("money") || lowerMsg.includes("sales")) {
            widgets.push("revenue-chart");
        }
        if (lowerMsg.includes("lead") || lowerMsg.includes("customer") || lowerMsg.includes("klient") || lowerMsg.includes("top")) {
            widgets.push("leads-table");
        }
        if (lowerMsg.includes("task") || lowerMsg.includes("calendar") || lowerMsg.includes("zadani") || lowerMsg.includes("kalendarz")) {
            widgets.push("task-calendar");
        }
        if (lowerMsg.includes("funnel") || lowerMsg.includes("lejek") || lowerMsg.includes("pipeline") || lowerMsg.includes("sprzedaż")) {
            widgets.push("sales-funnel");
        }
        if (lowerMsg.includes("activity") || lowerMsg.includes("interaction") || lowerMsg.includes("aktywność")) {
            widgets.push("activity-stats");
        }
        if (lowerMsg.includes("all") || lowerMsg.includes("dashboard") || lowerMsg.includes("overview") || lowerMsg.includes("przegląd") || lowerMsg.includes("pokaż wszystko")) {
            widgets.push("revenue-chart", "leads-table", "sales-funnel");
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

            const systemPrompt = `You are ScaleFlow AI Assistant — a helpful, professional, and friendly CRM assistant.
You work inside the ScaleFlow CRM platform. You have full access to all customer, revenue, sales funnel, and activity data.
Your job is to:
- Answer questions about business metrics, customers, revenue, leads, and the sales pipeline
- Provide actionable insights and advice based on the data
- Be conversational and professional like a real business analyst
- Use markdown formatting (bold, bullet points, headers) to make responses clear and scannable
- Use emojis sparingly for visual clarity (📊 📈 👥 etc.)
- Always respond in the SAME LANGUAGE the user writes in (Polish → Polish, English → English)
- Keep responses concise but informative — max 3-4 short paragraphs
- Reference specific data numbers from the context when relevant

Here is the live CRM data you have access to:
${dataContext}`;

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: args.message }] }],
                systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
            });

            const response = result.response;
            aiResponse = response.text() ?? "I couldn't generate a response. Please try again.";
        } catch (error) {
            console.error("Gemini API error:", error);
            // Fallback: generate a smart response based on data
            aiResponse = generateFallbackResponse(args.message, stats, metrics, topLeads, recentInteractions);
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

function generateFallbackResponse(
    message: string,
    stats: { total: number; active: number; leads: number; prospects: number; churned: number; avgScore: number },
    metrics: { totalRevenue: number; totalLeads: number; totalConversions: number; revenueGrowth: number; avgTasks: number; avgActiveCases: number },
    topLeads: { name: string; company: string; score: number; status: string }[],
    recentInteractions: { customerName: string; type: string; notes: string }[]
) {
    const lower = message.toLowerCase();

    if (lower.includes("revenue") || lower.includes("przychod")) {
        return `📊 **Revenue Overview (Last 30 Days)**\n\nTotal revenue: **$${metrics.totalRevenue.toLocaleString()}**\nGrowth trend: **${metrics.revenueGrowth > 0 ? "+" : ""}${metrics.revenueGrowth}%**\n\nThe revenue shows a ${metrics.revenueGrowth > 0 ? "positive" : "declining"} trend over the period. ${metrics.revenueGrowth > 5 ? "Great momentum!" : "Consider reviewing sales strategy."}`;
    }

    if (lower.includes("lead") || lower.includes("customer") || lower.includes("klient")) {
        return `👥 **Customer Overview**\n\n- Total: **${stats.total}** customers\n- Active: **${stats.active}** | Leads: **${stats.leads}** | Prospects: **${stats.prospects}** | Churned: **${stats.churned}**\n- Average Score: **${stats.avgScore}/100**\n\n**Top Leads:**\n${topLeads.map((l, i) => `${i + 1}. **${l.name}** (${l.company}) — Score: ${l.score}`).join("\n")}`;
    }

    if (lower.includes("activity") || lower.includes("interaction") || lower.includes("aktywność")) {
        return `📋 **Recent Activity**\n\n${recentInteractions.slice(0, 5).map((i) => `• **${i.customerName}** — ${i.type}: ${i.notes}`).join("\n")}`;
    }

    if (lower.includes("help") || lower.includes("pomoc") || lower.includes("what can") || lower.includes("co potrafisz")) {
        return `🤖 **Jestem ScaleFlow AI Assistant!**\n\nMogę pomóc z:\n- 📊 **Analiza przychodów** — pytaj o revenue, trendy, wzrost\n- 👥 **Klienci i leady** — wyświetl leady, oceny, statusy\n- 📋 **Aktywność** — ostatnie interakcje\n- 📈 **Lejek sprzedaży** — pipeline i konwersje\n- 📅 **Zadania** — kalendarz i podsumowania\n\nPo prostu zapytaj np. *"Pokaż mi trendy przychodów"* lub *"Kim są moi najlepsi klienci?"*`;
    }

    return `📊 **ScaleFlow Dashboard Summary**\n\n- **${stats.total}** total customers (${stats.active} active)\n- **$${metrics.totalRevenue.toLocaleString()}** revenue (30 days)\n- **${metrics.revenueGrowth > 0 ? "+" : ""}${metrics.revenueGrowth}%** growth\n- **${metrics.totalLeads}** new leads\n- **${metrics.totalConversions}** conversions\n\nAsk me about specific metrics for detailed insights!`;
}
