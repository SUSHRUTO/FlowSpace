import { NextRequest } from "next/server";
import { userDb } from "@/lib/db";
import { hashPassword, signToken, apiResponse, apiError } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) return apiError("All fields required", 400);
    if (password.length < 6) return apiError("Password must be at least 6 characters", 400);
    if (userDb.findByEmail(email)) return apiError("Email already registered", 409);
    const hashed = await hashPassword(password);
    const user = userDb.create({ email, name, password: hashed });
    const token = signToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: 604800, path: "/" });
    const { password: _p, ...safe } = user;
    return apiResponse({ user: safe, token }, 201);
  } catch (e) {
    return apiError("Internal server error", 500);
  }
}
