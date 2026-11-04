
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { createToken } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());

    await connectDB();

    const email = body.email.toLowerCase();

    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email sudah digunakan" },
        { status: 409 }
      );
    }

    const password = await bcrypt.hash(body.password, 12);

    const user = await User.create({
      name: body.name,
      email,
      password,
      role: "admin",
      isActive: true,
    });

    const token = await createToken(user.id);

    const response = NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("rab_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Data registrasi tidak valid", errors: error.issues },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
