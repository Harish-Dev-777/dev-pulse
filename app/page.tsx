"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const searchResults = useQuery(api.posts.search, debouncedQuery ? { query: debouncedQuery } : "skip");
  const allPosts = useQuery(api.posts.list, debouncedQuery ? "skip" : undefined);
  
  const posts = debouncedQuery ? searchResults : allPosts;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-20 pt-10">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tighter text-neutral-900 leading-[0.9]">
            Insights<span className="text-neutral-300">*</span><br />
            for Developers.
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl leading-relaxed mt-8 font-light">
            Thought leadership by DevPulse® and our best thinking on code, architecture, and career growth.
          </p>
        </section>

        {/* Search & Filter */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-24 z-40 bg-neutral-50/90 backdrop-blur-sm py-4 border-b border-neutral-200">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest border border-neutral-200 px-3 py-1 rounded-full">
              Latest Articles
            </span>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts === undefined ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-96 animate-pulse border border-neutral-100">
                <div className="h-4 bg-neutral-100 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-neutral-100 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-neutral-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-100 rounded w-2/3"></div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-neutral-500 text-lg">No articles found matching &quot;{debouncedQuery}&quot;.</p>
            </div>
          ) : (
            posts.map((post: any, index: number) => (
              // @ts-ignore
              <PostCard key={post._id} post={post} index={index} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
