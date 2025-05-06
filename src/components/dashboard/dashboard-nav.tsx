"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/formatter";
import { Button } from "@/components/ui/button";
import { HomeIcon, StarIcon } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Home",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Starred",
      href: "/dashboard/starred",
      icon: StarIcon,
    },
  ];

  return (
    <nav className="grid items-start gap-2 py-4">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link key={index} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-muted font-medium",
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
