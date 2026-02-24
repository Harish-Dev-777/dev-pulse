"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Menu, X, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const { user, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-neutral-50/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-tighter"
          >
            DevPulse.
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/blog"
              className="text-sm font-medium hover:text-neutral-600 transition-colors"
            >
              Articles
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-neutral-600 transition-colors"
            >
              Dashboard
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-500">{user.name}</span>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 border border-neutral-300 rounded-full text-sm font-medium hover:bg-neutral-100 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-neutral-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              <Link
                href="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium"
              >
                Articles
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium"
              >
                Dashboard
              </Link>
              <div className="pt-4 border-t border-neutral-100">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <span className="text-sm text-neutral-500">
                      Signed in as {user.name}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium text-center"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
