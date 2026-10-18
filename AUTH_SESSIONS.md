User sessions use NextAuth's encrypted JWT cookies. Users stay signed in for 30 days after the last session renewal, including across page reloads and browser restarts. Active tabs refresh the session every five minutes and on focus. Booking checkout dates do not end account sessions.

Set `NEXTAUTH_SECRET` to a permanent random secret in `.env` and use the same value on every deployment instance. Changing it invalidates existing sessions. Generate it once with:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set `NEXTAUTH_URL` to the site's canonical URL and use HTTPS in production. Session cookies use HttpOnly, SameSite=Lax, and Path=/; HTTPS also enables Secure and the __Secure- cookie prefix. NextAuth manages cookie expiration, renewal, CSRF protection, and deletion during logout.

The dashboard, booking, and food ordering pages require a valid session. Signed-in users visiting the login page return to their requested destination or dashboard. Both logout controls use NextAuth signOut to clear the cookie and return home; protected pages require login again afterward.

Run `npm run test:sessions` to verify cookie persistence and renewal, HTTP/HTTPS cookie flags, logout and CSRF protection, and rejection of expired or altered sessions. These tests use synthetic sessions and do not need database access.
