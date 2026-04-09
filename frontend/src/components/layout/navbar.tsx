"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { useAccount } from "@/contexts/account";

export default function Navbar({
  showTrigger = false,
}: {
  showTrigger?: boolean;
}) {
  const { account } = useAccount();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between font-sans h-14 md:h-18 bg-background/80 backdrop-blur-md border-b border-border/80">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          {showTrigger && (
            <SidebarTrigger className="hover:bg-muted/80 transition-colors" />
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
            <span className="text-lg md:text-2xl font-bold text-foreground tracking-tight hidden sm:block">
              Codaptive
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-1 lg:gap-2 mr-2">
            <Link
              to="/"
              hash="path"
              className="text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-primary px-4 py-2 rounded-xl transition-all"
            >
              Path
            </Link>
            <Link
              to="/"
              hash="community"
              className="text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-primary px-4 py-2 rounded-xl transition-all"
            >
              Community
            </Link>
          </div>

          <div className="h-6 w-px bg-border hidden md:block mx-2" />

          {account ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-2xl ring-2 ring-transparent bg-muted/30 hover:bg-muted/50 hover:ring-primary/20 hover:shadow-sm transition-all p-1"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-primary overflow-hidden shrink-0 shadow-sm">
                {account.avatar ? (
                  <img
                    src={account.avatar}
                    alt={account.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {account.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-foreground hidden lg:inline px-1 max-w-[140px] truncate">
                {account.username}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl px-5 py-2.5 h-11 transition-all"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  type="button"
                  className="text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl px-6 py-2.5 h-11 shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
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
