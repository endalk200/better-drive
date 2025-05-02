import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="flex w-full items-center justify-center border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">FileVault</span>
          </Link>
          <nav className="flex gap-4 md:gap-6">
            <Link
              href="/#features"
              className="text-xs underline-offset-4 hover:underline md:text-sm"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-xs underline-offset-4 hover:underline md:text-sm"
            >
              Pricing
            </Link>
            <Link
              href="/privacy"
              className="text-xs underline-offset-4 hover:underline md:text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs underline-offset-4 hover:underline md:text-sm"
            >
              Terms
            </Link>
          </nav>
        </div>
        <div className="text-center text-xs md:text-sm">
          © {new Date().getFullYear()} FileVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
