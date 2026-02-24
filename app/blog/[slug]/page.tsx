"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PresenceIndicator } from "@/components/PresenceIndicator";
import { CommentSection } from "@/components/CommentSection";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;

  const post = useQuery(api.posts.getBySlug, { slug });
  const incrementViews = useMutation(api.posts.incrementViews);

  const hasViewed = useRef(false);

  useEffect(() => {
    if (post && !hasViewed.current) {
      incrementViews({ id: post._id });
      hasViewed.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?._id, incrementViews]); // Only run when post ID is available

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-4 w-20 bg-neutral-200 rounded mb-8"></div>
          <div className="h-12 w-3/4 bg-neutral-200 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-neutral-200 rounded mb-12"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-neutral-200 rounded"></div>
            <div className="h-4 w-full bg-neutral-200 rounded"></div>
            <div className="h-4 w-2/3 bg-neutral-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Post not found</h1>
          <Link href="/" className="text-indigo-600 hover:underline">
            Return home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>

        <article>
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-medium px-3 py-1 bg-neutral-100 rounded-full text-neutral-600 uppercase tracking-wider">
                Article
              </span>
              <PresenceIndicator slug={slug} />
            </div>

            {post.imageUrl && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg aspect-video">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight text-neutral-900">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 border-b border-neutral-200 pb-8">
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-lg text-neutral-600">
                {post.author?.name?.charAt(0) || "?"}
              </div>
              <div>
                <div className="font-bold text-neutral-900">
                  {post.author?.name || "Unknown"}
                </div>
                <div className="text-sm text-neutral-500">
                  {format(post.createdAt, "MMMM d, yyyy")} • {post.views} views
                </div>
              </div>
            </div>
          </header>

          <div className="prose prose-neutral prose-lg max-w-none">
            <div className="whitespace-pre-wrap font-serif text-neutral-800 leading-relaxed">
              {post.content}
            </div>
          </div>
        </article>

        <CommentSection postId={post._id} />
      </main>
    </div>
  );
}
