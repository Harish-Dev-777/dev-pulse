import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { GenericQueryCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

async function getUserById(ctx: GenericQueryCtx<DataModel>, userId: string) {
  if (!userId) return null;

  try {
    // 1. Try modern 'user' table
    const modernUser = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("_id"), userId as any))
      .unique()
      .catch(() => null);
    if (modernUser) return modernUser;

    // 2. Try legacy 'users' table
    const legacyUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), userId as any))
      .unique()
      .catch(() => null);
    if (legacyUser) return legacyUser;

    return await ctx.db.get(userId as any).catch(() => null);
  } catch (error) {
    return null;
  }
}

export const create = mutation({
  args: {
    postId: v.id("posts"),
    authorId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user || user._id !== args.authorId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("comments", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("comments")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .order("desc")
        .collect();

      return await Promise.all(
        comments.map(async (comment) => {
          const author = await getUserById(ctx, comment.authorId);
          return { ...comment, author };
        }),
      );
    } catch (err) {
      console.error("Error in comments:list:", err);
      return [];
    }
  },
});
