"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const chat = action({
    args: {
        message: v.string(),
    },
    handler: async (ctx, args) => {
        // Save user message
        await ctx.runMutation(api.messages.send, {
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
                throw new Error("No API key");
            }

            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `You are an intelligent CRM assistant. You have access to the following data about the business. Answer questions concisely and professionally. Use data from the context. Always answer in the same language the user uses.

${dataContext}

User question: ${args.message}`,
                            },
                        ],
                    },
                ],
            });

            aiResponse = response.text ?? "I couldn't generate a response. Please try again.";
        } catch {
            // Fallback: generate a smart response based on data
            aiResponse = generateFallbackResponse(args.message, stats, metrics, topLeads, recentInteractions);
        }

        // Save assistant response
        await ctx.runMutation(api.messages.send, {
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

    if (lower.includes("help") || lower.includes("pomoc") || lower.includes("what can")) {
        return `🤖 **I'm your CRM Assistant!**\n\nI can help you with:\n- 📊 **Revenue analysis** — Ask about revenue, trends, and growth\n- 👥 **Customer insights** — View leads, scores, and statuses\n- 📋 **Activity tracking** — See recent interactions\n- 📈 **Sales funnel** — Pipeline and conversion data\n- 📅 **Task overview** — Calendar and daily tasks\n\nTry asking: *"Show me revenue trends"* or *"Who are my top leads?"*`;
    }

    return `📊 **CRM Dashboard Summary**\n\n- **${stats.total}** total customers (${stats.active} active)\n- **$${metrics.totalRevenue.toLocaleString()}** revenue (30 days)\n- **${metrics.revenueGrowth > 0 ? "+" : ""}${metrics.revenueGrowth}%** growth\n- **${metrics.totalLeads}** new leads\n- **${metrics.totalConversions}** conversions\n\nAsk me about specific metrics for detailed insights!`;
}
