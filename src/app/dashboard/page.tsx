import type { Metadata } from "next";
import { FileExplorer } from "./_components/file-explorer";

export const metadata: Metadata = {
  title: "Better Drive - dashboard",
  description: "A better way to manage your files",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function DashboardPage() {
  return (
    <>
      <FileExplorer />
    </>
  );
}
