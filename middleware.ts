export { auth as middleware } from "@/auth";

export const config = {
  // Run on every route except Next.js internals and static assets.
  // /login is included so the authorized callback can redirect logged-in users away from it.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
