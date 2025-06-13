"use client";

import {
  FileText,
  Image,
  Music,
  Video,
  Archive,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileIconProps {
  mimeType: string;
  className?: string;
}

export function FileIcon({ mimeType, className }: FileIconProps) {
  const icon = getIconForMimeType(mimeType);
  return <icon.component className={cn("h-5 w-5", className)} />;
}

function getIconForMimeType(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return { component: Image, color: "text-blue-500" };
  }
  if (mimeType.startsWith("video/")) {
    return { component: Video, color: "text-purple-500" };
  }
  if (mimeType.startsWith("audio/")) {
    return { component: Music, color: "text-green-500" };
  }
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("7z")) {
    return { component: Archive, color: "text-orange-500" };
  }
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("word") ||
    mimeType.includes("excel") ||
    mimeType.includes("powerpoint") ||
    mimeType.includes("text")
  ) {
    return { component: FileText, color: "text-red-500" };
  }
  return { component: File, color: "text-gray-500" };
} 