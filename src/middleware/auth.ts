import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const username = process.env.BASIC_AUTH_USERNAME || "admin";
const password = process.env.BASIC_AUTH_PASSWORD || "passwort";

export function authMiddleware(request: NextRequest) {
  const basicAuth = request.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = Buffer.from(authValue, "base64").toString().split(":");

    if (user === username && pwd === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentifizierung erforderlich", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Geschützter Bereich"',
    },
  });
}
