import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  incidents: defineTable({
    title: v.string(),
    type: v.union(
      v.literal("lost"),
      v.literal("injury"),
      v.literal("avalanche"),
      v.literal("other")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("resolved"),
      v.literal("false_alarm")
    ),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      alt: v.number()
    }),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_createdAt", ["createdAt"]),

  rescueUnits: defineTable({
    name: v.string(),
    type: v.union(
      v.literal("helicopter"),
      v.literal("quad"),
      v.literal("foot_patrol"),
      v.literal("dog_unit")
    ),
    status: v.union(
      v.literal("at_base"),
      v.literal("in_action"),
      v.literal("unavailable")
    ),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      alt: v.number()
    }),
    personnelCount: v.number(),
    assignedIncidentId: v.optional(v.id("incidents")),
    fuelLevel: v.optional(v.number()), // 0-100
    oxygenLevel: v.optional(v.number()), // 0-100
    medicalSupplies: v.optional(v.number()), // 0-100
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_incident", ["assignedIncidentId"]),

  communications: defineTable({
    unitId: v.optional(v.id("rescueUnits")),
    unitName: v.string(), // Fallback or explicit name
    message: v.string(),
    channel: v.union(v.literal("CH_1_EMERGENCY"), v.literal("CH_2_LOGISTICS"), v.literal("CH_3_AIR_TO_GROUND")),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"])
    .index("by_unit", ["unitId"]),

  weatherStations: defineTable({
    name: v.string(),
    location: v.object({ lat: v.number(), lng: v.number(), alt: v.number() }),
    windSpeed: v.number(),
    temperature: v.number(),
    visibility: v.number(),
    avalancheRisk: v.number(), // 1-5
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),

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
