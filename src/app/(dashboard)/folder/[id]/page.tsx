"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import { UploadProgress } from "@/components/shared/upload-progress";
import { UploadsTable } from "@/components/shared/uploads-table";
import { Files } from "@/lib/types/files";
import { getFilenameFromLocalStorage } from "@/lib/utils";

export default function FolderPage() {
  const params = useParams();
  const folderId = params.id as string;
  const [files, setFiles] = useState<Files[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleFileSelect, uploading, progress, uploadedFiles, totalFiles } = useUpload();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/files?folder_id=${folderId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [folderId, progress]);

  // Refresh files when all uploads are completed
  useEffect(() => {
    if (!uploading && uploadedFiles > 0 && uploadedFiles === totalFiles) {
      fetchFiles();
    }
  }, [uploading, uploadedFiles, totalFiles]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex gap-4 mb-6 justify-between">
        <h1 className="text-2xl mb-4 text-center">
          {getFilenameFromLocalStorage() || "My Drive"}
        </h1>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => handleFileSelect()}
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <div className="">
        {loading ? (
          <div className="col-span-full text-center py-4">Loading files...</div>
        ) : files.length > 0 ? (
          <UploadsTable files={files} onFileUpdate={fetchFiles} />
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-4">
            No files in this folder. Upload some files to get started.
          </div>
        )}
      </div>

      <UploadProgress progress={progress} uploading={uploading} />
    </div>
  );
} 