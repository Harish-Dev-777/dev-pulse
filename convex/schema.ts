import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(),
    emailVerified: v.optional(v.boolean()),
    updatedAt: v.optional(v.number()),
    userId: v.optional(v.string()),
  }).index("by_email", ["email"]),

  user: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(),
    emailVerified: v.optional(v.boolean()),
    updatedAt: v.optional(v.number()),
    userId: v.optional(v.string()),
  }).index("by_email", ["email"]),

  session: defineTable({
    userId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["token"]),

  account: defineTable({
    userId: v.string(),
    accountId: v.string(),
    providerId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.number()),
    refreshTokenExpiresAt: v.optional(v.number()),
    scope: v.optional(v.string()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_accountId", ["accountId"])
    .index("by_userId", ["userId"]),

  verification: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_identifier", ["identifier"]),

  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    authorId: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
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
    authorId: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_post", ["postId"]),

  presence: defineTable({
    key: v.string(),
    room: v.string(),
    updated: v.number(),
    data: v.any(),
  })
    .index("by_room_updated", ["room", "updated"])
    .index("by_key", ["key"]),
});
