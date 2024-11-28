import type { NextRequest } from "next/server";
import { authMiddleware } from "./middleware/auth";

export function middleware(request: NextRequest) {
  // Auth Middleware
  const authResponse = authMiddleware(request);
  if (authResponse) return authResponse;
}

export const config = {
  matcher: ["/", "/:path*"],
};
