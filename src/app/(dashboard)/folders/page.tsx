"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { useCreateFolder } from "@/hooks/use-create-folder";
import { toast } from "sonner";
import { CreateFolderDialog } from "@/components/shared/create-folder-dialog";
import { RenameDialog } from "@/components/shared/rename-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Folder as FolderIcon, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UploadFolder } from "@/lib/types/folders";
import { saveFilenameToLocalStorage } from "@/lib/utils";

export default function FoldersPage() {
  const router = useRouter();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [renameFolder, setRenameFolder] = useState<UploadFolder | null>(null);
  const { getFolders, createFolder, folders, loading } = useCreateFolder();

  useEffect(() => {
    getFolders();
  }, []);

  const handleCreateFolder = async (name: string) => {
    try {
     await createFolder(name);
      setShowCreateFolder(false);
      getFolders();
      toast.success("Folder created successfully");
    } catch (error) {
      console.error("Failed to create folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const handleRename = async (newName: string) => {
    if (!renameFolder) return;

    try {
      const response = await fetch(`/api/folders`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: renameFolder.id,
          name: newName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename folder");
      }

      toast.success("Folder renamed successfully");
      getFolders();
    } catch (error) {
      console.error("Error renaming folder:", error);
      toast.error("Failed to rename folder");
    }
  };

  const handleDelete = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/folders?id=${folderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if(response.status === 400) {
          throw new Error("Cannot delete folder with files");
        }
        throw new Error("Failed to delete folder");
      }

      toast.success("Folder deleted successfully");
      getFolders();
    } catch (error: any) {
      console.error("Error deleting folder:", error);
      toast.error(error.message);
    }
  };


  const handleFolderClick = (folder: UploadFolder) => {
    saveFilenameToLocalStorage(folder.name);
    router.push(`/folder/${folder.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Folders</h1>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowCreateFolder(true)}
        >
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
      </div>

      {/* Folders Table */}
      <div className="rounded-md w-full overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Loading folders...
                </TableCell>
              </TableRow>
            ) : folders.length > 0 ? (
              folders.map((folder) => (
                <TableRow key={folder.id}>
                  <TableCell>
                    <FolderIcon className="h-5 w-5 text-primary" />
                  </TableCell>
                  <TableCell
                    className="font-medium cursor-pointer hover:text-primary"
                    onClick={() => handleFolderClick(folder)}
                  >
                    {folder.name}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(folder.created_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/folder/${folder.id}`)}
                        >
                          <FolderIcon className="mr-2 h-4 w-4" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setRenameFolder(folder)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(folder.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-4"
                >
                  No folders yet. Create a folder to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        onSubmit={handleCreateFolder}
      />

      {/* Rename Dialog */}
      <RenameDialog
        open={!!renameFolder}
        onOpenChange={(open) => !open && setRenameFolder(null)}
        onSubmit={handleRename}
        currentName={renameFolder?.name || ""}
        type="folder"
      />
    </div>
  );
} 