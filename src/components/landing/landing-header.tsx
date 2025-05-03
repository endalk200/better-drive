"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export function LandingHeader() {
  const { data } = useSession();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex w-full items-center justify-center border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Better Drive</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/#features"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Features
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {data?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={async () => {
                  await signOut();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
