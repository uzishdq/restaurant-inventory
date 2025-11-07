import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import {
  DEFAULT_API_URL,
  DEFAULT_AUTH,
  PUBLIC_API_URL,
  PUBLIC_ROUTES,
  ROUTES,
} from "./lib/constant";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const session = await auth();

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isApiAuth = nextUrl.pathname.startsWith(DEFAULT_AUTH);
  const isApiRoute = nextUrl.pathname.startsWith(DEFAULT_API_URL);
  const isPublicApi = nextUrl.pathname.startsWith(PUBLIC_API_URL);

  if (isPublicRoute) {
    if (session) {
      return NextResponse.redirect(new URL(ROUTES.AUTH.DASHBOARD, nextUrl));
    }
    return NextResponse.next();
  }

  if (isApiAuth || isPublicApi) {
    return NextResponse.next();
  } else if (!session && isApiRoute) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.DASHBOARD, nextUrl));
  }

  if (!session || !session.user) {
    return NextResponse.redirect(new URL(ROUTES.PUBLIC.LOGIN, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
