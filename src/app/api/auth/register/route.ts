import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    console.log(email, password, fullName)
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        message: "Registration successful. Please check your email to verify your account.",
        user: authData.user,
        emailSent: true
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 