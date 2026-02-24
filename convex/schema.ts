import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  customers: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.string(),
    status: v.union(
      v.literal("lead"),
      v.literal("prospect"),
      v.literal("active"),
      v.literal("churned")
    ),
    score: v.number(),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_score", ["score"])
    .index("by_createdAt", ["createdAt"]),

  interactions: defineTable({
    customerId: v.id("customers"),
    type: v.union(
      v.literal("call"),
      v.literal("email"),
      v.literal("meeting"),
      v.literal("chat"),
      v.literal("note")
    ),
    notes: v.string(),
    sentiment: v.optional(
      v.union(v.literal("positive"), v.literal("neutral"), v.literal("negative"))
    ),
    createdAt: v.number(),
  }).index("by_customer", ["customerId"])
    .index("by_type", ["type"])
    .index("by_createdAt", ["createdAt"]),

  metrics: defineTable({
    date: v.string(),
    revenue: v.number(),
    leads: v.number(),
    conversions: v.number(),
    tasks: v.number(),
    activeCases: v.number(),
  }).index("by_date", ["date"]),

  conversations: defineTable({
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_updatedAt", ["updatedAt"]),

  messages: defineTable({
    conversationId: v.optional(v.id("conversations")),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    widgets: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId", "createdAt"])
    .index("by_createdAt", ["createdAt"]),
});
