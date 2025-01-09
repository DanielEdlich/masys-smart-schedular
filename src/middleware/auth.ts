import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const username = process.env.BASIC_AUTH_USERNAME;
const password = process.env.BASIC_AUTH_PASSWORD;

if (!username || !password) {
  throw new Error("BASIC_AUTH_USERNAME or BASIC_AUTH_PASSWORD is not set");
}

export function authMiddleware(request: NextRequest) {
  const basicAuth = request.headers.get("Authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = Buffer.from(authValue, "base64").toString().split(":");

    if (user === username && pwd === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected Area"',
    },
  });
}
