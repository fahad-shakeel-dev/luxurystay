export const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export function sessionOptions(siteUrl) {
  const secure = siteUrl?.startsWith("https://") ?? false;

  return {
    useSecureCookies: secure,
    session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
    jwt: { maxAge: SESSION_MAX_AGE },
    cookies: {
      sessionToken: {
        name: `${secure ? "__Secure-" : ""}next-auth.session-token`,
        // NextAuth sets and renews Expires and clears the cookie on signOut.
        // Leave maxAge unset here so it cannot override the logout expiry.
        options: { httpOnly: true, sameSite: "lax", path: "/", secure },
      },
    },
  };
}
