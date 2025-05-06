import type React from "react";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Analytics } from "@vercel/analytics/react";

import { TRPCReactProvider } from "@/trpc/react";

import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Better Drive",
  description: "A better way to manage your files",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <SessionProvider>
            <NuqsAdapter>
              {children}
              <Analytics />
            </NuqsAdapter>
          </SessionProvider>
          <Toaster position="bottom-right" richColors />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
