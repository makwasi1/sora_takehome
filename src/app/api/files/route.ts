import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/lib/auth";


// GET /api/files - List files in a folder
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const searchParams = request.nextUrl.searchParams;
    const folderId = searchParams.get("folder_id");

    if (!folderId) {
      return NextResponse.json(
        { error: "Folder ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: files, error } = await supabase
      .from("files")
      .select("*")
      .eq("folder_id", folderId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

// POST /api/files - Create a new file record
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if (user.error) {
      return NextResponse.json({ error: user.error.message }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folderId = formData.get("folder_id") as string;
    const userId = user.data?.user.id as string;
    const pathString = formData.get("storage_path") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const { error: dbError } = await supabase.from("files").insert({
      name: file.name,
      user_id: userId,
      storage_path: pathString,
      mime_type: file.type,
      size: file.size,
      folder_id: folderId,
    });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// PATCH /api/files - Update a file
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { id, name, folder_id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // First check if the file belongs to the user
    const { data: existingFile, error: fetchError } = await supabase
      .from("files")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !existingFile) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const { data: file, error } = await supabase
      .from("files")
      .update({
        name: name || existingFile.name,
        folder_id: folder_id || existingFile.folder_id,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(file);
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 500 }
    );
  }
}

// DELETE /api/files - Delete a file
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get("id");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // First get the file to get its storage path
    const { data: file, error: fetchError } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("sora-drive")
      .remove([file.storage_path]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
    }

    // Delete from database
    const { error } = await supabase
      .from("files")
      .delete()
      .eq("id", fileId)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
} 