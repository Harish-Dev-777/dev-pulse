import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const HEARTBEAT_PERIOD = 30000; // 30 seconds

export const heartbeat = mutation({
  args: {
    room: v.string(),
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_key", (q) => q.eq("key", `${args.room}:${args.userId}`))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        updated: Date.now(),
        data: { userId: args.userId, name: args.name },
      });
    } else {
      await ctx.db.insert("presence", {
        key: `${args.room}:${args.userId}`,
        room: args.room,
        updated: Date.now(),
        data: { userId: args.userId, name: args.name },
      });
    }
  },
});

export const list = query({
  args: { room: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const active = await ctx.db
      .query("presence")
      .withIndex("by_room_updated", (q) => q.eq("room", args.room).gt("updated", now - HEARTBEAT_PERIOD))
      .collect();

    return active.map((p: any) => p.data);
  },
});
