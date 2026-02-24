import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { GenericQueryCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

async function getUserById(ctx: GenericQueryCtx<DataModel>, userId: string) {
  try {
    const user = await authComponent.getAnyUserById(ctx, userId);
    if (user) return user;
    return await ctx.db.get(userId as any);
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
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
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    return Promise.all(
      comments.map(async (comment) => {
        const author = await getUserById(ctx, comment.authorId);
        return { ...comment, author };
      }),
    );
  },
});
