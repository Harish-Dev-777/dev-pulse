"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export function PresenceIndicator({ slug }: { slug: string }) {
  const { user } = useAuth();
  const presence = useQuery(api.presence.list, { room: slug });
  const heartbeat = useMutation(api.presence.heartbeat);

  const [anonymousId] = useState(() => "anonymous-" + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    const userId = user?._id ?? anonymousId;
    const name = user?.name ?? "Anonymous Reader";

    // Initial heartbeat
    heartbeat({
      room: slug,
      userId,
      name,
    });

    // Send heartbeat every 20 seconds
    const interval = setInterval(() => {
      heartbeat({
        room: slug,
        userId,
        name,
      });
    }, 20000);

    return () => clearInterval(interval);
  }, [slug, user, heartbeat, anonymousId]);

  if (!presence || presence.length === 0) return null;

  const count = presence.length;
  const names = presence.map((p: any) => p.name).slice(0, 3).join(", ");
  const others = count > 3 ? ` and ${count - 3} others` : "";

  return (
    <div className="flex items-center gap-2 text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full w-fit">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span>
        {count} {count === 1 ? "person" : "people"} reading now
        {/* <span className="hidden sm:inline">: {names}{others}</span> */}
      </span>
    </div>
  );
}
