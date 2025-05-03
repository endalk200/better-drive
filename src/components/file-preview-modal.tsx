"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import dynamic from "next/dynamic";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

const PDFViewerComponent = dynamic(
  () => import("./pdf-viewer-component").then((mod) => mod.PDFViewerComponent),
  {
    ssr: false,
    loading: () => <div>Loading PDF viewer...</div>,
  },
);

export function FilePreviewModal() {
  const [isOpen, setIsOpen] = useQueryState(
    "file-modal",
    parseAsBoolean.withDefault(false),
  );
  const [url, setUrl] = useQueryState("file-url", parseAsString);

  const handleOpenChange = (open: boolean) => {
    void setIsOpen(open);
    void setUrl(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[90vh] w-[90vw] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>File Preview</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {isOpen && url && <PDFViewerComponent pdfUrl={url} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
