import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionValue,
} from "@/lib/admin-auth-shared";

function isAuthorized(request: NextRequest) {
  return (
    request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value ===
    getAdminSessionValue()
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authorized = isAuthorized(request);
  const isLoginRoute = pathname === "/admin/login";
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  if (!authorized && !isLoginRoute) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { error: "Unauthorized admin request." },
        { status: 401 },
      );
    }

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (authorized && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
