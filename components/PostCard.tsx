"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Eye, MessageSquare, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl?: string;
    createdAt: number;
    views: number;
    author: {
      name: string;
      image?: string;
    } | null;
  };
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100"
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium px-3 py-1 bg-neutral-100 rounded-full text-neutral-600 uppercase tracking-wider">
              Article
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="block group-hover:opacity-90 transition-opacity"
          >
            {post.imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden aspect-video">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-neutral-600 transition-colors">
              {post.title}
            </h3>
          </Link>

          <p className="text-neutral-500 line-clamp-3 mb-6 text-sm leading-relaxed">
            {post.content}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
              {post.author?.name?.charAt(0) || "?"}
            </div>
            <span className="text-sm font-medium text-neutral-700">
              {post.author?.name || "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 text-xs font-mono">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{post.views}</span>
            </div>
            {/* Comment count would go here if we fetched it in the list query */}
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 duration-300">
        <ArrowUpRight className="w-5 h-5 text-indigo-600" />
      </div>
    </motion.div>
  );
}
