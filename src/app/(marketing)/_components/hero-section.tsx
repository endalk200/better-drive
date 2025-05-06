import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="flex w-full items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Secure File Storage for Everyone
              </h1>
              <p className="text-muted-foreground max-w-[600px] md:text-xl">
                Store, organize, and share your files with ease. Our platform
                provides secure storage with intuitive management tools.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth/login" className="w-full min-[400px]:w-auto">
                <Button size="lg" className="w-full">
                  Get Started
                </Button>
              </Link>
              <Link href="/#features" className="w-full min-[400px]:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-3xl"></div>
              <div className="bg-background relative h-full w-full rounded-xl border p-4 shadow-xl">
                <div className="border-border flex h-full w-full flex-col rounded-lg border p-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs">Better Drive</div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-muted aspect-square rounded-md"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
