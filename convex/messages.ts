import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ─── Conversations ───

export const listConversations = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("conversations")
            .withIndex("by_updatedAt")
            .order("desc")
            .collect();
    },
});

export const createConversation = mutation({
    args: {
        title: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        return await ctx.db.insert("conversations", {
            title: args.title ?? "Nowa rozmowa",
            createdAt: now,
            updatedAt: now,
        });
    },
});

export const deleteConversation = mutation({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        // Delete all messages in the conversation
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .collect();
        for (const msg of messages) {
            await ctx.db.delete(msg._id);
        }
        // Delete the conversation
        await ctx.db.delete(args.conversationId);
    },
});

export const updateConversationTitle = mutation({
    args: {
        conversationId: v.id("conversations"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.conversationId, { title: args.title });
    },
});

// ─── Messages ───

export const list = query({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .order("asc")
            .collect();
    },
});

export const send = mutation({
    args: {
        conversationId: v.id("conversations"),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        widgets: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const msgId = await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            role: args.role,
            content: args.content,
            widgets: args.widgets,
            createdAt: Date.now(),
        });

        // Update conversation timestamp and auto-title from first user message
        const conversation = await ctx.db.get(args.conversationId);
        if (conversation) {
            const updates: { updatedAt: number; title?: string } = { updatedAt: Date.now() };
            if (args.role === "user" && conversation.title === "Nowa rozmowa") {
                // Auto-title: use first 40 chars of first user message
                updates.title = args.content.length > 40
                    ? args.content.slice(0, 40) + "…"
                    : args.content;
            }
            await ctx.db.patch(args.conversationId, updates);
        }

        return msgId;
    },
});

export const clear = mutation({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .collect();
        for (const msg of messages) {
            await ctx.db.delete(msg._id);
        }
        // Reset title
        await ctx.db.patch(args.conversationId, {
            title: "Nowa rozmowa",
            updatedAt: Date.now(),
        });
    },
});
