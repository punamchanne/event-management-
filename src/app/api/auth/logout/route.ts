import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({
    message: "Logged out successfully",
    success: true,
  });
  response.headers.append(
    "Set-Cookie",
    "token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
  );
  return response;
}
