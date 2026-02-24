import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { GenericQueryCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

async function getUserById(ctx: GenericQueryCtx<DataModel>, userId: string) {
  try {
    // Try the auth component (user table)
    const user = await authComponent.getAnyUserById(ctx, userId);
    if (user) return user;

    // Fallback to legacy users table
    return await ctx.db.get(userId as any);
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
}

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    authorId: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user || user._id !== args.authorId) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error("Slug already exists");
    }

    let imageUrl: string | undefined = undefined;
    if (args.imageStorageId) {
      imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }

    return await ctx.db.insert("posts", {
      ...args,
      imageUrl,
      views: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    content: v.string(),
    authorId: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user || user._id !== args.authorId) {
      throw new Error("Unauthorized");
    }

    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== args.authorId) throw new Error("Unauthorized");

    let imageUrl = post.imageUrl;
    if (args.imageStorageId && args.imageStorageId !== post.imageStorageId) {
      imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      content: args.content,
      imageStorageId: args.imageStorageId,
      imageUrl: imageUrl,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("posts"),
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user || user._id !== args.authorId) {
      throw new Error("Unauthorized");
    }

    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== args.authorId) throw new Error("Unauthorized");

    if (post.imageStorageId) {
      await ctx.storage.delete(post.imageStorageId);
    }

    await ctx.db.delete(args.id);
  },
});

export const list = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    // Join with author using the auth component
    return Promise.all(
      posts.map(async (post) => {
        const author = await getUserById(ctx, post.authorId);
        return { ...post, author };
      }),
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!post) return null;

    const author = await getUserById(ctx, post.authorId);
    return { ...post, author };
  },
});

export const listByAuthor = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();

    return posts;
  },
});

export const get = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const incrementViews = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (post) {
      await ctx.db.patch(args.id, { views: post.views + 1 });
    }
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query) return [];

    const posts = await ctx.db
      .query("posts")
      .withSearchIndex("search_title", (q) => q.search("title", args.query))
      .take(10);

    return Promise.all(
      posts.map(async (post) => {
        const author = await authComponent.getAnyUserById(ctx, post.authorId);
        return { ...post, author };
      }),
    );
  },
});
