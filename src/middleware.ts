import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"


export function middleware(request: NextRequest) {
  const isAuthenticated = true
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                    request.nextUrl.pathname.startsWith("/signup")

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/signup", request.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
} 