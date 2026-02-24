"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowRight, Clock, Eye } from "lucide-react";

export default function BlogList() {
  const posts = useQuery(api.posts.list);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-display font-bold mb-4 text-neutral-900 tracking-tight">
            Latest Articles
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
            Insights, tutorials, and stories from our engineering team and
            community.
          </p>
        </header>

        {posts === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-neutral-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-24 bg-neutral-200 rounded" />
                  <div className="h-8 w-full bg-neutral-200 rounded" />
                  <div className="h-4 w-2/3 bg-neutral-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              No articles yet
            </h2>
            <p className="text-neutral-500 mb-8">
              Be the first to share your story.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
            >
              Write an Article
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {post.imageUrl ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-neutral-100 flex items-center justify-center text-neutral-300">
                    <span className="text-4xl font-display font-bold">
                      DevPulse
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-bold px-2 py-1 bg-neutral-100 rounded-md text-neutral-600 uppercase tracking-widest">
                      Article
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(post.createdAt, "MMM d")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-neutral-900 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-neutral-500 text-sm line-clamp-3 mb-6">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                        {/* @ts-ignore */}
                        {post.author?.name?.charAt(0) || "?"}
                      </div>
                      <span className="text-xs font-medium text-neutral-600">
                        {/* @ts-ignore */}
                        {post.author?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-400">
                      <span className="flex items-center gap-1 text-xs">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </span>
                      <ArrowRight className="w-4 h-4 text-neutral-900 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
