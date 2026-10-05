import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login"];
const REDIRECT_IF_AUTHENTICATED = ["/login", "/"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const pathname = req.nextUrl.pathname;

  if (token) {
    if (REDIRECT_IF_AUTHENTICATED.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard/overview", req.url));
    }
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _not-found (404 pages)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};