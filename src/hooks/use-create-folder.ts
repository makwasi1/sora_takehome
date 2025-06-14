"use client";

import { UploadFolder } from "@/lib/types/folders";
import { useState } from "react";
import { toast } from "sonner";


export function useCreateFolder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folders, setFolders] = useState<UploadFolder[]>([]);

  const createFolder = async (folderName: string) => {
    setLoading(true);
    try {
      if (!folderName) throw new Error("Folder name is required");

      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: folderName }),
      });

      const data: any = await response.json();

      if (!response.ok) {
        toast.error("Failed to create folder");
        throw new Error(data.error || "Failed to create folder");
      }

      setFolders(prevFolders => [data, ...prevFolders]);
      toast.success(`${folderName} created successfully`);
      return data;
    } catch (error) {
      console.error("Failed to create folder:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //get users folder
  const getFolders = async () => {
    try {
      const response = await fetch("/api/folders");
      const data = await response.json();

      if (!response.ok) {
        setError("Failed to fetch folders");
        throw new Error(data.error || "Failed to fetch folders");
      }

      setFolders(data);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };

  return {
    createFolder,
    loading,
    error,
    folders,
    getFolders,
  };
}
