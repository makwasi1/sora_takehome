"use client";

import { Folder, useCurrentFolder } from "@/hooks/use-current-folder";
import { FolderBreadcrumb } from "./folder-breadcrumb";
import { Button } from "@/components/ui/button";
import { FolderIcon, FileIcon } from "lucide-react";
import { useState } from "react";
import { CreateFolderDialog } from "./create-folder-dialog";
import { toast } from "sonner";

interface File {
  id: string;
  name: string;
  mime_type: string;
  size: number;
  storage_path: string;
  folder_id: string;
  user_id: string;
  created_at: string;
}

export function FolderNavigation() {
  const {
    currentFolder,
    folderHistory,
    loading,
    error,
    navigateToFolder,
    createFolder,
  } = useCurrentFolder();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleCreateFolder = async (name: string) => {
    try {
      await createFolder(name);
      toast.success("Folder created successfully");
      setShowCreateFolder(false);
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentFolder) {
    return <div>No folder selected</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FolderBreadcrumb
          folders={folderHistory}
          onFolderClick={navigateToFolder}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateFolder(true)}
        >
          New Folder
        </Button>
      </div>

      <div className="grid gap-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent"
          >
            <FileIcon type={file.mime_type} />
            <span className="flex-1 truncate">{file.name}</span>
            <span className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        ))}
      </div>

      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        onSubmit={handleCreateFolder}
      />
    </div>
  );
} 