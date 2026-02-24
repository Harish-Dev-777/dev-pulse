"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Fetch posts by author
  const myPosts = useQuery(api.posts.listByAuthor, user ? { authorId: user._id } : "skip") ?? [];
  const deletePost = useMutation(api.posts.remove);

  if (isLoading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="mb-8">You must be signed in to view the dashboard.</p>
          <Link href="/" className="text-indigo-600 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost({ id, authorId: user._id });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display font-bold">Dashboard</h1>
          <Link 
            href="/create" 
            className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Post
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 font-medium text-neutral-500 text-sm uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 font-medium text-neutral-500 text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-medium text-neutral-500 text-sm uppercase tracking-wider">Views</th>
                  <th className="px-6 py-4 font-medium text-neutral-500 text-sm uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 font-medium text-neutral-500 text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {myPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      You haven&apos;t created any posts yet.
                    </td>
                  </tr>
                ) : (
                  myPosts.map((post: any) => (
                    <tr key={post._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/blog/${post.slug}`} className="font-medium text-neutral-900 hover:text-indigo-600">
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-500 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link 
                            href={`/edit/${post._id}`}
                            className="text-neutral-400 hover:text-neutral-900 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(post._id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
