"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadsTable } from "@/components/shared/uploads-table";
import { useCreateFolder } from "@/hooks/use-create-folder";
import { useEffect, useState } from "react";
import { Folder, ChevronDown, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Files } from "@/lib/types/files";
import { saveFilenameToLocalStorage } from "@/lib/utils";
import { UploadFolder } from "@/lib/types/folders";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState({
    quickAccess: true,
    recent: true,
    starred: true,
  });
  const [files, setFiles] = useState<Files[]>([]);
  const [searchResults, setSearchResults] = useState<Files[]>([]);
  const { getFolders, folders, loading: folderLoading } = useCreateFolder();

  useEffect(() => {
    getFolders();
  }, []);

  useEffect(() => {
    if (folders.length > 0) {
      fetchFiles();
    }
  }, [folders]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/files?folder_id=${folders[0]?.id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setFiles(data);
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFolderClick = (folder: UploadFolder) => {
    saveFilenameToLocalStorage(folder.name);
    router.push(`/folder/${folder.id}`);
  };

  const handleSimpleSearch = (query: string ) => {

    if(!query.trim()){
      setSearchResults(files);
      return
    }

    const filteredFiles = files.filter((file) =>
      file.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredFiles);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl mb-4 text-center">Welcome to Drive</h1>

      <div className="max-w-2xl mx-auto mb-8">
        <Input
          className="w-full"
          type="search"
          onChange={(e) => {
            handleSimpleSearch(e.target.value);
          }}
          placeholder="Search in Drive"
        />
      </div>

      <div className="">
        <Collapsible
          open={openSections.quickAccess}
          onOpenChange={() => toggleSection("quickAccess")}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                {openSections.quickAccess ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">Suggested Folders</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {folderLoading ? (
                <div className="text-center py-4">Loading folders...</div>
              ) : folders.length > 0 ? (
                folders.slice(0, 4).map((folder: UploadFolder) => (
                  <Card
                    key={folder.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-accent `}
                    onClick={() => handleFolderClick(folder)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Folder className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {folder.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(folder.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : null}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Suggested Files Section */}
        <Collapsible
          open={openSections.recent}
          onOpenChange={() => toggleSection("recent")}
          className="space-y-2 mt-5"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                {openSections.recent ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">Suggested Files</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="grid gap-2">
              {loading ? (
                <div className="text-center py-4">Loading files...</div>
              ) : searchResults.length > 0 ? (
                <UploadsTable
                  files={searchResults ?? files as Files[]}
                  onFileUpdate={fetchFiles}
                />
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No files yet. Upload some files to get started.
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
