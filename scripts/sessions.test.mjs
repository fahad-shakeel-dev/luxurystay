import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { encode } from "next-auth/jwt";
import { sessionOptions, SESSION_MAX_AGE } from "../src/lib/session-config.mjs";

const require = createRequire(import.meta.url);
const { AuthHandler } = require(path.join(path.dirname(require.resolve("next-auth")), "core/index.js"));
const secret = randomBytes(32).toString("hex");

function request(action, { cookies = {}, method = "GET", body, secure = false } = {}) {
  const origin = secure ? "https://example.com" : "http://localhost:3000";
  // A fresh configuration per request simulates separate server instances.
  return AuthHandler({
    options: {
      ...sessionOptions(origin),
      secret,
      providers: [],
      logger: { error() {}, warn() {}, debug() {} },
    },
    req: {
      action, method, cookies, body, query: {},
      headers: { host: new URL(origin).host, "x-forwarded-proto": new URL(origin).protocol.slice(0, -1) },
    },
  });
}

for (const secure of [false, true]) {
  test(`session survives fresh requests and renews a persistent ${secure ? "HTTPS" : "HTTP"} cookie`, async () => {
    const config = sessionOptions(secure ? "https://example.com" : "http://localhost:3000");
    const name = config.cookies.sessionToken.name;
    const token = await encode({ secret, token: { name: "Session Test", email: "session@example.com" }, maxAge: SESSION_MAX_AGE });
    const first = await request("session", { secure, cookies: { [name]: token } });
    assert.equal(first.body.user.email, "session@example.com");
    const cookie = first.cookies.find(cookie => cookie.name === name && cookie.value);
    assert.ok(cookie, "session response renews the cookie");
    assert.equal(cookie.options.httpOnly, true);
    assert.equal(cookie.options.sameSite, "lax");
    assert.equal(cookie.options.secure, secure);
    assert.equal(cookie.options.path, "/");
    assert.ok(cookie.options.expires.getTime() > Date.now() + (SESSION_MAX_AGE - 60) * 1000);
    const second = await request("session", { secure, cookies: { [name]: cookie.value } });
    assert.equal(second.body.user.email, "session@example.com");
  });
}

test("logout clears the session cookie and subsequent requests are anonymous", async () => {
  const name = sessionOptions("http://localhost:3000").cookies.sessionToken.name;
  const token = await encode({ secret, token: { email: "session@example.com" }, maxAge: SESSION_MAX_AGE });
  const csrf = await request("csrf");
  const cookies = Object.fromEntries(csrf.cookies.map(cookie => [cookie.name, cookie.value]));
  cookies[name] = token;
  const logout = await request("signout", { cookies, method: "POST", body: { csrfToken: csrf.body.csrfToken } });
  const cleared = logout.cookies.find(cookie => cookie.name === name);
  assert.equal(cleared.value, "");
  assert.equal(cleared.options.maxAge, 0);
  delete cookies[name];
  const session = await request("session", { cookies });
  assert.deepEqual(session.body, {});
});

test("logout requires a valid CSRF token", async () => {
  const name = sessionOptions("http://localhost:3000").cookies.sessionToken.name;
  const token = await encode({ secret, token: { email: "session@example.com" }, maxAge: SESSION_MAX_AGE });
  const logout = await request("signout", { cookies: { [name]: token }, method: "POST", body: { csrfToken: "invalid" } });
  assert.ok(!logout.cookies?.some(cookie => cookie.name === name && cookie.options.maxAge === 0));
});

test("expired and tampered sessions are rejected and cleared", async () => {
  const name = sessionOptions("http://localhost:3000").cookies.sessionToken.name;
  const expired = await encode({ secret, token: { email: "session@example.com" }, maxAge: -60 });
  for (const token of [expired, "tampered-token"]) {
    const session = await request("session", { cookies: { [name]: token } });
    assert.deepEqual(session.body, {});
    assert.ok(session.cookies.some(cookie => cookie.name === name && cookie.options.maxAge === 0));
  }
});
