"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, FolderPlus } from "lucide-react";

import { useState } from "react";
import { CreateFolderDialog } from "./create-folder-dialog";
import { useCreateFolder } from "@/hooks/use-create-folder";


export function UploadButton() {
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const { createFolder } = useCreateFolder();

  const handleCreateFolder = async (name: string) => {
    try {
      await createFolder(name);
      setShowCreateFolder(false);
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => setShowCreateFolder(true)}
            >
              <FolderPlus className="h-4 w-4" />
              Create folder
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        onSubmit={handleCreateFolder}
      />
    </>
  );
}
