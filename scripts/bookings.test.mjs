import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Module, { createRequire } from "node:module";
import { BookingInputError, buildBooking, validateBookingRequest } from "../src/lib/booking-input.mjs";
import { sessionOptions } from "../src/lib/session-config.mjs";

const require = createRequire(import.meta.url);
async function load(file, mocks = {}) {
  const filename = path.resolve(file);
  const { code } = await require("next/dist/build/swc").transform(await readFile(filename, "utf8"), {
    filename, jsc: { parser: { syntax: "ecmascript" } }, module: { type: "commonjs" },
  });
  const mod = new Module(filename);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = mod.require.bind(mod);
  mod.require = name => name in mocks ? mocks[name] : originalRequire(name);
  mod._compile(code, filename);
  return mod.exports;
}

const userId = "507f1f77bcf86cd799439011";
const roomId = "507f1f77bcf86cd799439012";
const details = { roomId, guestName: "Test Guest", guestPhone: "03000000000", guestEmail: "test@example.com", checkInDate: "2027-01-01", checkOutDate: "2027-01-03", numberOfGuests: 2 };
const room = { _id: roomId, price: 12000, capacity: 3, isAvailable: true };

test("server calculates the price and owner and ignores privileged browser fields", () => {
  const booking = buildBooking({ ...details, userId: "attacker", totalAmount: 1, status: "approved", paymentStatus: "paid" }, userId, room);
  assert.equal(booking.userId, userId);
  assert.equal(booking.totalAmount, 24000);
  assert.equal(booking.status, undefined);
  assert.equal(booking.paymentStatus, undefined);
});

test("invalid room IDs, required fields, dates, and guest counts produce actionable validation errors", () => {
  for (const changed of [{ roomId: "invalid" }, { guestName: " " }, { guestEmail: "wrong" }, { checkInDate: "2027-02-30" }, { checkOutDate: details.checkInDate }, { numberOfGuests: 0 }, { numberOfGuests: 1.5 }, { specialRequests: {} }]) {
    assert.throws(() => validateBookingRequest({ ...details, ...changed }), BookingInputError);
  }
  assert.throws(() => buildBooking({ ...details, numberOfGuests: 4 }, userId, room), /up to 3 guests/);
});

async function routeHarness({ session = { user: { email: "test@example.com" } }, account = { _id: userId }, availableRoom = room } = {}) {
  const created = [], updates = [];
  const { POST } = await load("src/app/api/bookings/route.js", {
    "next-auth": { getServerSession: async () => session },
    "@/lib/auth": { authOptions: {} },
    "@/helper/db": { connectDb: async () => {} },
    "@/models/User": { findOne: () => ({ select: async () => account }) },
    "@/models/Room": { findById: async () => availableRoom, findByIdAndUpdate: async (...args) => updates.push(args) },
    "@/models/Booking": { create: async data => { created.push(data); return data; } },
    "@/lib/booking-input.mjs": { BookingInputError, buildBooking, validateBookingRequest },
  });
  return { POST, created, updates };
}
const request = body => new Request("http://localhost/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

test("booking succeeds with a session even when the browser omits userId", async () => {
  const harness = await routeHarness();
  const response = await harness.POST(request(details));
  assert.equal(response.status, 201);
  assert.equal(harness.created[0].userId, userId);
  assert.equal(harness.created[0].totalAmount, 24000);
  assert.deepEqual(harness.updates, [[roomId, { isAvailable: false }]]);
});

test("unauthenticated and deleted accounts return 401 without saving a booking", async () => {
  for (const options of [{ session: null }, { account: null }]) {
    const harness = await routeHarness(options);
    assert.equal((await harness.POST(request(details))).status, 401);
    assert.equal(harness.created.length, 0);
    assert.equal(harness.updates.length, 0);
  }
});

test("invalid requests return 400 and unavailable rooms return 409 without database writes", async () => {
  const harness = await routeHarness();
  assert.equal((await harness.POST(request({ ...details, roomId: "invalid" }))).status, 400);
  assert.equal((await harness.POST(new Request("http://localhost/api/bookings", { method: "POST", body: "{" }))).status, 400);
  const unavailable = await routeHarness({ availableRoom: { ...room, isAvailable: false } });
  assert.equal((await unavailable.POST(request(details))).status, 409);
  assert.equal(unavailable.created.length + harness.created.length, 0);
});

test("Google accounts validate without a credentials password or phone; regular accounts require both", async () => {
  const { default: User } = await load("src/models/User.js");
  const google = new User({ name: "Google Guest", email: "google@example.com", authProvider: "google", image: ["/placeholder.svg"] });
  assert.equal(google.validateSync(), undefined);
  const credentials = new User({ name: "Guest", email: "test@example.com" });
  const error = credentials.validateSync();
  assert.ok(error.errors.password);
  assert.ok(error.errors.phone);
});

test("legacy Google sessions recover a MongoDB user ID instead of keeping the Google subject", async () => {
  process.env.NEXTAUTH_SECRET ||= "booking-tests-only-secret";
  const created = [];
  const { authOptions } = await load("src/lib/auth.js", {
    "@/models/User": { findOne: async () => null, create: async data => { created.push(data); return { _id: userId }; } },
    "@/helper/db": { connectDb: async () => {} },
    "@/lib/image-storage.mjs": { localizeImage: async () => "/placeholder.svg" },
    "@/lib/session-config.mjs": { sessionOptions },
  });
  const token = await authOptions.callbacks.jwt({ token: { id: "123456789012345678901", sub: "123456789012345678901", name: "Google Guest", email: "google@example.com" } });
  assert.equal(token.id, userId);
  assert.equal(created[0].authProvider, "google");
  assert.equal(created[0].password, undefined);
});
