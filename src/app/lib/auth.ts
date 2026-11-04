
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("JWT_SECRET minimal 32 karakter");
}

const SECRET_KEY = new TextEncoder().encode(secret);

export async function createToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("rab_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userId = payload.userId;

    if (
      typeof userId !== "string" ||
      !mongoose.isValidObjectId(userId)
    ) {
      return null;
    }

    await connectDB();

    const user = await User.findOne({
      _id: userId,
      isActive: true,
    })
      .select("-password")
      .lean();

    return user;
  } catch {
    return null;
  }
}
