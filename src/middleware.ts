import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  // Use Supabase's session management
  const response = await updateSession(request)
  
  // Get the user from the response
  const user = response.headers.get("x-user")
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                    request.nextUrl.pathname.startsWith("/signup")

  // If user is authenticated and trying to access auth pages, redirect to home
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  // If user is not authenticated and trying to access protected pages, redirect to signup
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
} 