"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { validateFile } from "@/lib/file-validation";
import { useParams } from "next/navigation";

export function useUpload() {
  const params = useParams();
  const folderId = params.id as string;
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<number>(0);
  const [totalFiles, setTotalFiles] = useState<number>(0);

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files?.length) return;

      setUploading(true);
      setProgress(0);
      setUploadedFiles(0);
      setTotalFiles(files.length);

      try {
        const supabase = createClient();

        const user = await supabase.auth.getUser();

        if (user.error) {
          console.error(user.error);
          toast.error(user.error.message);
          return;
        }

        const uploadPromises = Array.from(files).map(async (file) => {
          const validationError = validateFile(file);
          if (validationError) {
            toast.error(validationError.message);
            return;
          }

          const storagePath = `${user.data.user.id}/${Date.now()}-${file.name}`;

          const { error: uploadError } = await supabase.storage
            .from("sora-drive")
            .upload(storagePath, file);

          if (uploadError) {
            console.error("Upload failed:", uploadError);
            toast.error(`Failed to upload ${file.name}`);
            return;
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

          return new Promise((resolve, reject) => {
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
                setUploadedFiles(prev => prev + 1);
                resolve(true);
              } else if (xhr.status === 401) {
                toast.error("Please sign in to upload files");
                reject(new Error("Authentication required"));
              } else {
                toast.error(`Failed to upload ${file.name}`);
                reject(new Error("Upload failed"));
              }
            };

            xhr.onerror = () => {
              toast.error(`Failed to upload ${file.name}`);
              reject(new Error("Upload failed"));
            };

            xhr.send(formData);
          });
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
        setUploadedFiles(0);
        setTotalFiles(0);
      }
    };

    input.click();
  };

  return {
    handleFileSelect,
    uploading,
    progress,
    uploadedFiles,
    totalFiles,
  };
}
