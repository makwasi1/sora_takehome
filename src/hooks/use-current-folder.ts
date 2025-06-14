"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  user_id: string;
  created_at: string;
}

export function useCurrentFolder() {
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folderHistory, setFolderHistory] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadRootFolder() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setError("Not authenticated");
          return;
        }

        const { data: folders, error: fetchError } = await supabase
          .from("folders")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("name", "My Drive")
          .is("parent_id", null)
          .limit(1);

        if (fetchError) throw fetchError;

        if (folders && folders.length > 0) {
          setCurrentFolder(folders[0]);
          setFolderHistory([folders[0]]);
        } else {
          const { data: existingRootFolders, error: rootError } = await supabase
            .from("folders")
            .select("*")
            .eq("user_id", session.user.id)
            .is("parent_id", null)
            .limit(1);

          if (rootError) throw rootError;

          if (existingRootFolders && existingRootFolders.length > 0) {
            setCurrentFolder(existingRootFolders[0]);
            setFolderHistory([existingRootFolders[0]]);
          } else {
            const { data: newFolder, error: createError } = await supabase
              .from("folders")
              .insert([
                {
                  name: "My Drive",
                  user_id: session.user.id,
                  parent_id: null,
                },
              ])
              .select()
              .single();

            if (createError) throw createError;
            setCurrentFolder(newFolder);
            setFolderHistory([newFolder]);
          }
        }
      } catch (err) {
        console.error("Error loading folder:", err);
        setError(err instanceof Error ? err.message : "Failed to load folder");
      } finally {
        setLoading(false);
      }
    }

    loadRootFolder();
  }, [supabase]);

  const navigateToFolder = async (folder: Folder) => {
    try {
      setLoading(true);
      setError(null);

      // If the folder is in our history, navigate to it
      const folderIndex = folderHistory.findIndex(f => f.id === folder.id);
      if (folderIndex !== -1) {
        setCurrentFolder(folder);
        setFolderHistory(folderHistory.slice(0, folderIndex + 1));
        return;
      }

      // Otherwise, fetch the folder and its parents
      const { data: folderWithParents, error: fetchError } = await supabase
        .from("folders")
        .select("*")
        .eq("id", folder.id)
        .single();

      if (fetchError) throw fetchError;

      setCurrentFolder(folderWithParents);
      setFolderHistory([...folderHistory, folderWithParents]);
    } catch (err) {
      console.error("Error navigating to folder:", err);
      setError(err instanceof Error ? err.message : "Failed to navigate to folder");
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (name: string) => {
    try {
      if (!currentFolder) throw new Error("No current folder");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const { data: newFolder, error: createError } = await supabase
        .from("folders")
        .insert([
          {
            name,
            user_id: session.user.id,
            parent_id: currentFolder.id,
          },
        ])
        .select()
        .single();

      if (createError) throw createError;

      return newFolder;
    } catch (err) {
      console.error("Error creating folder:", err);
      throw err;
    }
  };

  return {
    currentFolder,
    folderHistory,
    loading,
    error,
    navigateToFolder,
    createFolder,
  };
} 