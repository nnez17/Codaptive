"use client";

import { Button } from "@/src/components/ui/button";
import { SidebarTrigger } from "@/src/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { useAccount } from "@/src/contexts/account";

export default function Navbar({ showTrigger = false }: { showTrigger?: boolean }) {
  const { account } = useAccount();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between font-sans h-14 md:h-18 bg-white/80 backdrop-blur-md border-b border-gray-100/80">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          {showTrigger && (
            <SidebarTrigger className="hover:bg-gray-100/80 transition-colors" />
          )}
          <Link
            to="/"
            className="flex items-center gap-2.5"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src="/icons.png"
              alt="Codaptive Logo"
              width={28}
              height={28}
              className="md:w-8 md:h-8 drop-shadow-sm"
            />
            <span className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight hidden sm:block">
              Codaptive
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-1 lg:gap-2 mr-2">
            <Link
              to="/"
              hash="path"
              className="text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-blue-600 px-4 py-2 rounded-xl transition-all"
            >
              Path
            </Link>
            <Link
              to="/"
              hash="community"
              className="text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-blue-600 px-4 py-2 rounded-xl transition-all"
            >
              Community
            </Link>
          </div>

          <div className="h-6 w-px bg-gray-100 hidden md:block mx-2" />

          {account ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-2xl ring-2 ring-transparent bg-gray-50/50 hover:bg-white hover:ring-blue-100 hover:shadow-sm transition-all p-1"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-blue-600 overflow-hidden shrink-0 shadow-sm">
                {account.avatar ? (
                  <img
                    src={account.avatar}
                    alt={account.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                    {account.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-gray-800 hidden lg:inline px-1 max-w-[140px] truncate">
                {account.name}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl px-5 py-2.5 h-11 transition-all"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  type="button"
                  className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-2.5 h-11 shadow-md shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
