
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import Material from "@/models/Material";
import {
  successResponse,
  errorResponse,
} from "@/lib/response";

const schema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  category: z.string().min(2),
  unit: z.string().min(1),
  price: z.number().min(0),
  supplier: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) return errorResponse("Unauthorized", 401);

    await connectDB();

    const search = request.nextUrl.searchParams.get("search");

    const filter: Record<string, unknown> = {
      ownerId: user._id,
      isActive: true,
    };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const materials = await Material.find(filter)
      .sort({ name: 1 })
      .limit(100)
      .lean();

    return successResponse(materials);
  } catch {
    return errorResponse("Gagal mengambil material", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) return errorResponse("Unauthorized", 401);

    const body = schema.parse(await request.json());

    await connectDB();

    const material = await Material.create({
      ...body,
      ownerId: new mongoose.Types.ObjectId(user._id.toString()),
    });

    return successResponse(
      material,
      "Material berhasil ditambahkan",
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Data material tidak valid", 422);
    }

    if (
      error instanceof Error &&
      "code" in error &&
      error.code === 11000
    ) {
      return errorResponse("Kode material sudah digunakan", 409);
    }

    return errorResponse("Gagal menambahkan material", 500);
  }
}
