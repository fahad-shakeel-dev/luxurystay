import { createHash, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

function matches(value, expected) {
  const hash = text => createHash("sha256").update(text).digest()
  return timingSafeEqual(hash(value), hash(expected))
}

export async function POST(request) {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SECRET_CODE } = process.env
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_SECRET_CODE) {
    return NextResponse.json({ message: "Admin sign-in is currently unavailable." }, { status: 503 })
  }
  try {
    const { email, password, secretCode } = await request.json()
    if (![email, password, secretCode].every(value => typeof value === "string" && value.length <= 256)) {
      return NextResponse.json({ message: "Enter your admin login details." }, { status: 400 })
    }
    const validEmail = matches(email.trim().toLowerCase(), ADMIN_EMAIL.trim().toLowerCase())
    const validPassword = matches(password, ADMIN_PASSWORD)
    const validSecret = matches(secretCode, ADMIN_SECRET_CODE)
    if (!validEmail || !validPassword || !validSecret) {
      return NextResponse.json({ message: "Invalid email, password, or secret code." }, { status: 401 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: "Invalid sign-in request." }, { status: 400 })
  }
}
