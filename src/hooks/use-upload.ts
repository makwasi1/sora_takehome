"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { validateFile } from "@/lib/file-validation";
import { useCurrentFolder } from "./use-current-folder";
import { Files } from "@/lib/types/files";
import { useParams } from "next/navigation";

export function useUpload() {
  const params = useParams();
  const folderId = params.id as string;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<Files[]>([]);
  const [progress, setProgress] = useState(0);
  const { currentFolder } = useCurrentFolder();
  

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files?.length) return;

      setUploading(true);
      setProgress(0);

      try {
        const supabase = createClient();

        const user = await supabase.auth.getUser();

        if (user.error) {
          console.error(user.error);
          toast.error(user.error.message);
          return;
        }

        if (!currentFolder) {
          console.info("No current folder");
        }

        for (const file of Array.from(files)) {
          const validationError = validateFile(file);
          if (validationError) {
            toast.error(validationError.message);
            continue;
          }

          const storagePath = `${user.data.user.id}/${Date.now()}-${file.name}`;

          const { error: uploadError } = await supabase.storage
            .from("sora-drive")
            .upload(storagePath, file);

          if (uploadError) {
            console.error("Upload failed:", uploadError);
            toast.error(`Failed to upload ${file.name}`);
            continue;
          }

          const { data: publicUrl } = await supabase.storage
            .from("sora-drive")
            .getPublicUrl(storagePath);

          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder_id", folderId);
          formData.append("storage_path", publicUrl.publicUrl);
          formData.append("mime_type", file.type);
          formData.append("size", file.size.toString());

          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/files");

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              setProgress(percentComplete);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              toast.success(`${file.name} uploaded successfully`);
            } else if (xhr.status === 401) {
              toast.error("Please sign in to upload files");
            } else {
              toast.error(`Failed to upload ${file.name}`);
            }
          };

          xhr.onerror = () => {
            toast.error(`Failed to upload ${file.name}`);
          };

          xhr.send(formData);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    };

    input.click();
  };

  const handleQueryUserFiles = async () => {
    try {
      const response = await fetch(
        `/api/files?folder_id=${currentFolder?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError("Failed to fetch files");
        throw new Error(data.error || "Failed to fetch files");
      }
      setFiles(data);
    } catch (error) {
      setError("Failed to fetch files");
      console.error("Failed to fetch folders:", error);
    }
  };

  return {
    handleFileSelect,
    handleQueryUserFiles,
    error,
    files,
    uploading,
    progress,
  };
}
