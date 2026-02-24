import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

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
        const author = await authComponent.getAnyUserById(
          ctx,
          comment.authorId,
        );
        return { ...comment, author };
      }),
    );
  },
});
