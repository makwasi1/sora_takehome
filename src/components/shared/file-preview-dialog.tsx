"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileIcon } from "@/components/shared/file-icon";
import { formatDistanceToNow } from "date-fns";
import { Files } from "@/lib/types/files";
import { useState } from "react";
import Image from "next/image";

interface FilePreviewDialogProps {
  file: Files | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilePreviewDialog({
  file,
  open,
  onOpenChange,
}: FilePreviewDialogProps) {
  const [loading, setLoading] = useState(true);

  const renderPreview = () => {
    if (!file) return null;

    // Handle PDF files
    if (file.mime_type === "application/pdf") {
      return (
        <iframe
          src={file.storage_path}
          className="w-full h-[600px]"
          onLoad={() => setLoading(false)}
        />
      );
    }

    // Handle images
    if (file.mime_type.startsWith("image/")) {
      return (
        <Image
          src={file.storage_path}
          alt={file.name}
          className="max-w-full max-h-[600px] object-contain"
          onLoad={() => setLoading(false)}
        />
      );
    }

    // Default file info view
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileIcon mimeType={file.mime_type} className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{file.name}</h3>
            <p className="text-sm text-muted-foreground">
              {file.mime_type}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Size</p>
            <p>{(Number(file.size) / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <div>
            <p className="text-muted-foreground">Uploaded</p>
            <p>{formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file?.name}</DialogTitle>
        </DialogHeader>
        {loading && (
          <div className="flex items-center justify-center h-[600px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <div className={`${loading ? 'hidden' : ''}`}>
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
} 