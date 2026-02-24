import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    views: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_author", ["authorId"])
    .searchIndex("search_title", {
      searchField: "title",
    }),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_post", ["postId"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),

  presence: defineTable({
    key: v.string(),
    room: v.string(),
    updated: v.number(),
    data: v.any(),
  })
    .index("by_room_updated", ["room", "updated"])
    .index("by_key", ["key"]),
});
