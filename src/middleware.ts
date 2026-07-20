import { NextResponse, type NextRequest } from "next/server";
import { isReservedTopLevelSlug } from "@/lib/routes/reserved-slugs";

/**
 * Edge middleware foundation — extend with auth, geo, A/B when routes exist.
 */
const DEV_NO_CACHE = "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const doubled = pathname.match(/^\/([a-z0-9-]+)\/\1\/?$/);
  if (doubled && isReservedTopLevelSlug(doubled[1])) {
    return NextResponse.redirect(new URL(`/${doubled[1]}`, request.url));
  }

  if (pathname === "/sitemap" || pathname === "/sitemap/") {
    return NextResponse.redirect(new URL("/site-map", request.url));
  }

  if (pathname === "/sitemaps.xml" || pathname === "/sitemaps.xml/") {
    return NextResponse.redirect(new URL("/sitemap.xml", request.url));
  }

  if (pathname === "/contactus" || pathname === "/contactus/") {
    return NextResponse.redirect(new URL("/contact", request.url));
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const nextPath = pathname.replace(/^\/admin/, "/my-admin");
    return NextResponse.redirect(new URL(nextPath, request.url));
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  /* Local dev: always fetch fresh HTML/CSS so layout changes show on normal refresh */
  if (process.env.NODE_ENV === "development") {
    response.headers.set("Cache-Control", DEV_NO_CACHE);
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
