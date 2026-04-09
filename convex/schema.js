import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        subscriptionId: v.optional(v.string()),
    }),

    designs: defineTable({
        name: v.string(),
        width: v.number(),
        height: v.number(),
        uid: v.optional(v.id("users")),
        imagePreview: v.optional(v.string()),
        jsonTemplate: v.optional(v.any()),
        type: v.optional(v.string()),
    })
})