import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === "/_not-found") {
    return NextResponse.next();
  }
  // Simulate 404 check (customize based on your app's routing)
  return NextResponse.rewrite(new URL("/_not-found", request.url));
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
