import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/lib/auth";

// GET /api/folders - List folders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get("parent_id");

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const query = supabase
      .from("folders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (parentId) {
      query.eq("parent_id", parentId);
    } else {
      query.is("parent_id", null);
    }

    const { data: folders, error } = await query;

    if (error) throw error;

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

// POST /api/folders - Create a new folder
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { name, parent_id } = await request.json();

    const user = await supabase.auth.getUser();

    if (user.error) {
      return NextResponse.json({ error: user.error.message }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    const { data: folder, error } = await supabase
      .from("folders")
      .insert([
        {
          name,
          parent_id: parent_id || null,
          user_id: user.data.user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}

// PATCH /api/folders - Update a folder
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    const userId = user.data?.user?.id as string;

    const { id, name, parent_id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Folder ID is required" },
        { status: 400 }
      );
    }

    // First check if the folder belongs to the user
    const { data: existingFolder, error: fetchError } = await supabase
      .from("folders")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !existingFolder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const { data: folder, error } = await supabase
      .from("folders")
      .update({
        name: name || existingFolder.name,
        parent_id: parent_id || existingFolder.parent_id,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json(
      { error: "Failed to update folder" },
      { status: 500 }
    );
  }
}

// DELETE /api/folders - Delete a folder
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    const userId = user.data?.user?.id as string;
    const searchParams = request.nextUrl.searchParams;
    const folderId = searchParams.get("id");

    if (!folderId) {
      return NextResponse.json(
        { error: "Folder ID is required" },
        { status: 400 }
      );
    }

    // First check if the folder belongs to the user
    const { data: folder, error: fetchError } = await supabase
      .from("folders")
      .select("*")
      .eq("id", folderId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Check if folder has any files
    const { data: files, error: filesError } = await supabase
      .from("files")
      .select("id")
      .eq("folder_id", folderId)
      .limit(1);

    if (filesError) throw filesError;

    if (files && files.length > 0) {
      
      return NextResponse.json(
        { error: "Cannot delete folder with files" },
        { status: 400 }
      );
    }

    // Check if folder has any subfolders
    const { data: subfolders, error: subfoldersError } = await supabase
      .from("folders")
      .select("id")
      .eq("parent_id", folderId)
      .limit(1);

    if (subfoldersError) throw subfoldersError;

    if (subfolders && subfolders.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete folder with subfolders" },
        { status: 400 }
      );
    }

    // Delete the folder
    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", folderId)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json(
      { error: "Failed to delete folder" },
      { status: 500 }
    );
  }
}
