import {
  FolderIcon,
  ShieldCheckIcon,
  ShareIcon,
  CloudIcon,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <FolderIcon className="h-10 w-10" />,
      title: "Folder Management",
      description: "Create, rename, and organize your folders with ease.",
    },
    {
      icon: <ShieldCheckIcon className="h-10 w-10" />,
      title: "Secure Storage",
      description: "Your files are encrypted and stored securely in the cloud.",
    },
    {
      icon: <ShareIcon className="h-10 w-10" />,
      title: "Easy Sharing",
      description: "Share files and folders with anyone, anywhere.",
    },
    {
      icon: <CloudIcon className="h-10 w-10" />,
      title: "Cloud Access",
      description: "Access your files from any device, anytime.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-muted/50 flex w-full items-center justify-center py-12 md:py-24 lg:py-32"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform offers a range of features to help you manage your
              files efficiently.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm"
            >
              <div className="text-primary">{feature.icon}</div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
