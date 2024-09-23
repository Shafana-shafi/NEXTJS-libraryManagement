import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Define the list of routes you want to protect
const protectedRoutes = [
  "/dashboard",
  "/userBooks",
  "/transactions",
  "/adminBooks",
  "/requests",
  "/adminBooks/members",
  "/adminBooks/addMember",
];

const adminRoutes = [
  "/adminBooks",
  "/adminBooks/members",
  "/adminBooks/addBook",
];
const userRoutes = ["/userBooks"];

// Custom function to extract session-like data from token
const getSessionFromToken = (token: any) => {
  if (!token) return null;
  return {
    user: {
      id: token.id,
      email: token.email,
      role: token.role,
      membershipStatus: token.membershipStatus,
    },
  };
};

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  // First, extract the path and locale information
  const pathname = req.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/(?:en|kn)/, ""); // Assuming "kn" and "en" are your locales

  // Check for user or admin route protection before running the i18n middleware
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = getSessionFromToken(token);

  console.log("session", session);
  console.log(token, "token");

  // Check if the request is for a protected route
  if (
    protectedRoutes.some((route) => pathnameWithoutLocale.startsWith(route))
  ) {
    // If no session is present, redirect to the login page
    if (!session) {
      const loginUrl = new URL(`/${req.nextUrl.locale}/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check for admin routes
    if (adminRoutes.some((route) => pathnameWithoutLocale.startsWith(route))) {
      // If user is not an admin, redirect to unauthorized page
      if (session.user.role !== "admin") {
        const unauthorizedUrl = new URL(
          `/${req.nextUrl.locale}/unauthorized`,
          req.url
        );
        return NextResponse.redirect(unauthorizedUrl);
      }
    }

    // Check for user routes
    if (userRoutes.some((route) => pathnameWithoutLocale.startsWith(route))) {
      // If user is not a user, redirect to unauthorized page
      if (session.user.role !== "user") {
        const unauthorizedUrl = new URL(
          `/${req.nextUrl.locale}/unauthorized`,
          req.url
        );
        return NextResponse.redirect(unauthorizedUrl);
      }
    }

    // Ensure the user has the correct role for `/userBooks` routes
    if (pathnameWithoutLocale.startsWith("/userBooks")) {
      if (session.user.role !== "user" && session.user.role !== "admin") {
        const unauthorizedUrl = new URL(
          `/${req.nextUrl.locale}/unauthorized`,
          req.url
        );
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  // After handling route checks, run the internationalization middleware
  const intlResult = await intlMiddleware(req);

  // If the internationalization middleware redirected or responded, return that result
  if (intlResult instanceof NextResponse) {
    return intlResult;
  }

  // If all checks passed and no redirection happened, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
