import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth-server";

export async function POST() {
  await clearSession();
  return NextResponse.redirect(new URL("/login", "http://localhost:3000"));
}
