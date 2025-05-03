import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react"; // Import a loading icon
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

export function ImagePreviewModal() {
  const [isOpen, setIsOpen] = useQueryState(
    "image-modal",
    parseAsBoolean.withDefault(false),
  );
  const [url, setUrl] = useQueryState("image-url", parseAsString);

  const [isLoading, setIsLoading] = useState(true); // State to track image loading

  const handleOpenChange = (open: boolean) => {
    void setIsOpen(open);
    void setUrl(null);

    if (open) {
      setIsLoading(true); // Reset loading state when dialog opens
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Image Preview</DialogTitle>
        <div className="mt-2 flex min-h-[200px] items-center justify-center">
          {/* Added container for centering loader */}
          {isLoading && (
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          )}
          <img
            src={url ?? "/placeholder.svg"}
            alt="image-preview"
            // Apply 'hidden' class while loading to prevent showing broken image/alt text
            className={`h-auto w-full ${isLoading ? "hidden" : ""}`}
            onLoad={() => setIsLoading(false)} // Set loading to false when image loads
            onError={() => setIsLoading(false)} // Also handle loading errors
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
