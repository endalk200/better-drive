"use client";

import type React from "react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { StorageIndicator } from "@/components/dashboard/storage-indicator";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { data: session } = useSession({
    required: true,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background sticky top-0 z-40 flex items-center justify-center border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-xl font-bold">Better Drive</h1>
            </Link>
          </div>
          <UserNav />
        </div>
      </header>
      <div className="container mx-auto flex flex-1">
        <aside className="hidden w-[200px] flex-shrink-0 flex-col md:flex lg:w-[240px]">
          <DashboardNav />
          {session && (
            <div className="mt-auto pt-4 pb-8">
              <StorageIndicator />
            </div>
          )}
        </aside>
        <main className="flex flex-1 flex-col overflow-hidden px-4 py-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
