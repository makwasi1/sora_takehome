import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest} from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll(){
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse = NextResponse.next({
                                request
                            })
                        );

                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    } catch {
                        console.error("Failed to set cookie");
                    }
                }
            }
        }
    );

    const {data: {user},} = await supabase.auth.getUser();
    if (!user && !request.nextUrl.pathname.startsWith("/login") && !request.nextUrl.pathname.startsWith("/signup")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }
    
    // Add user information to response headers
    if (user) {
        supabaseResponse.headers.set("x-user", JSON.stringify(user));
    }

    return supabaseResponse;
}
