"use client";

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
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Eye, Pencil } from "lucide-react";
import { Files } from "@/lib/types/files";
import { FileIcon } from "@/components/shared/file-icon";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { FilePreviewDialog } from "./file-preview-dialog";
import { RenameDialog } from "./rename-dialog";
import { toast } from "sonner";

interface uploadTableProps {
  files: Files[];
  onFileUpdate: () => void;
}

export function UploadsTable({ files, onFileUpdate }: uploadTableProps) {
  const [previewFile, setPreviewFile] = useState<Files | null>(null);
  const [renameFile, setRenameFile] = useState<Files | null>(null);

  const handleRename = async (newName: string) => {
    if (!renameFile) return;

    try {
      const response = await fetch(`/api/files`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: renameFile.id,
          name: newName,
          folderid: renameFile.folder_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename file");
      }

      toast.success("File renamed successfully");
      onFileUpdate();
    } catch (error) {
      console.error("Error renaming file:", error);
      toast.error("Failed to rename file");
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(`/api/files?id=${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      toast.success("File deleted successfully");
      onFileUpdate();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <>
      <div className="rounded-md w-full overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date Uploaded</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files?.map((upload) => (
              <TableRow key={upload.id}>
                <TableCell>
                  <FileIcon mimeType={upload.mime_type} className="mr-2" />
                </TableCell>
                <TableCell className="font-medium">{upload.name}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(upload.created_at), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>{`${(Number(upload.size) / 1024 / 1024).toFixed(
                  2
                )} MB`}</TableCell>
                <TableCell>{upload.mime_type.split('/').pop()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setPreviewFile(upload)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRenameFile(upload)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDelete(upload.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FilePreviewDialog
        file={previewFile}
        open={!!previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      />

      <RenameDialog
        open={!!renameFile}
        onOpenChange={(open) => !open && setRenameFile(null)}
        onSubmit={handleRename}
        currentName={renameFile?.name || ""}
        type="file"
      />
    </>
  );
}
