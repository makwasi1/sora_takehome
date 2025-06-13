"use client";

import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Folder } from "@/hooks/use-current-folder";
import { cn } from "@/lib/utils";

interface FolderBreadcrumbProps {
  folders: Folder[];
  onFolderClick: (folder: Folder) => void;
  className?: string;
}

export function FolderBreadcrumb({
  folders,
  onFolderClick,
  className,
}: FolderBreadcrumbProps) {
  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => onFolderClick(folders[0])}
      >
        <Home className="h-4 w-4" />
      </Button>
      {folders.slice(1).map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => onFolderClick(folder)}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
} 