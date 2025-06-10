import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Drive</h1>
        {/* Add upload button here */}
       
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Example file card */}
        <Card className="p-4 hover:bg-accent cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded bg-primary/10" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Example File</p>
              <p className="text-xs text-muted-foreground">Modified 2 days ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 