import { NextRequest } from "next/server";
import { userDb } from "@/lib/db";
import { verifyPassword, signToken, apiResponse, apiError } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) return apiError("Email and password required", 400);
    const user = userDb.findByEmail(email);
    if (!user) return apiError("Invalid credentials", 401);
    const valid = await verifyPassword(password, user.password);
    if (!valid) return apiError("Invalid credentials", 401);
    const token = signToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: 604800, path: "/" });
    const { password: _p, ...safe } = user;
    return apiResponse({ user: safe, token });
  } catch (e) {
    return apiError("Internal server error", 500);
  }
}
