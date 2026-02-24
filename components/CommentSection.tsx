"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export function CommentSection({ postId }: { postId: Id<"posts"> }) {
  const { user, login } = useAuth();
  const comments = useQuery(api.comments.list, { postId });
  const createComment = useMutation(api.comments.create);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to comment");
      return;
    }
    if (!newComment.trim()) return;

    await createComment({
      postId,
      authorId: user._id,
      content: newComment,
    });
    setNewComment("");
  };

  return (
    <div className="mt-16 border-t border-neutral-200 pt-10">
      <h3 className="text-2xl font-bold mb-8 font-display">Discussion ({comments?.length ?? 0})</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12 relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Share your thoughts..." : "Sign in to share your thoughts..."}
          className="w-full p-4 pr-12 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 min-h-[100px] resize-y"
          disabled={!user}
        />
        <button
          type="submit"
          disabled={!user || !newComment.trim()}
          className="absolute bottom-4 right-4 p-2 bg-neutral-900 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        {comments === undefined ? (
          <div className="text-center py-10 text-neutral-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-neutral-400 bg-neutral-50 rounded-xl">
            No comments yet. Be the first to start the conversation.
          </div>
        ) : (
          comments.map((comment: any) => (
            <div key={comment._id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-600">
                  {comment.author?.name?.charAt(0) || "?"}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{comment.author?.name || "Unknown"}</span>
                  <span className="text-xs text-neutral-400">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
