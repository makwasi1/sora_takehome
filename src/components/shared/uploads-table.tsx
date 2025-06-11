import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Download, Share2, Star, Trash2 } from "lucide-react"

// Mock data - replace with actual data from your backend
const recentUploads = [
  {
    id: 1,
    name: "Project Proposal.docx",
    reason: "Recently edited",
    owner: "John Doe",
    location: "My Drive/Projects",
  },
  {
    id: 2,
    name: "Meeting Notes.pdf",
    reason: "Shared with you",
    owner: "Jane Smith",
    location: "Shared with me",
  },
  {
    id: 3,
    name: "Budget 2024.xlsx",
    reason: "Recently viewed",
    owner: "John Doe",
    location: "My Drive/Finance",
  },
]

export function UploadsTable() {
  return (
    <div className="rounded-md w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentUploads.map((upload) => (
            <TableRow key={upload.id}>
              <TableCell className="font-medium">{upload.name}</TableCell>
              <TableCell>{upload.reason}</TableCell>
              <TableCell>{upload.owner}</TableCell>
              <TableCell>{upload.location}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="mr-2 h-4 w-4" />
                      Add to starred
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Move to trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 