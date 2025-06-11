import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { UploadsTable } from "@/components/shared/uploads-table"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col justify-center items-center space-y-4">
          <h1 className="text-3xl font-semibold">Welcome to Drive</h1>
          <Input
            className="w-3/4 max-w-4xl"
            type="search"
            placeholder="Search in Google Drive"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Example file card */}
          <Card className="p-4 hover:bg-accent cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded bg-primary/10" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Example File</p>
                <p className="text-xs text-muted-foreground">
                  Modified 2 days ago
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 hover:bg-accent cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded bg-primary/10" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Example File</p>
                <p className="text-xs text-muted-foreground">
                  Modified 2 days ago
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 hover:bg-accent cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded bg-primary/10" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Example File</p>
                <p className="text-xs text-muted-foreground">
                  Modified 2 days ago
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recent Uploads</h1>
      </div>

      <UploadsTable />
    </div>
  );
} 