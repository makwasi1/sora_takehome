"use client";

import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  progress: number;
  uploading: boolean;
}

export function UploadProgress({ progress, uploading }: UploadProgressProps) {
  if (!uploading) return null;

  return (
    <div className="fixed bottom-4 right-4 w-64 rounded-lg border bg-background p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">Uploading...</span>
        <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
} 