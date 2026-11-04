
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import Project from "@/models/Project";
import {
  successResponse,
  errorResponse,
} from "@/lib/response";

const projectSchema = z.object({
  name: z.string().min(2).max(150),
  code: z.string().min(2).max(50),
  description: z.string().optional(),
  location: z.string().optional(),
  buildingType: z.string().default("custom"),
  landArea: z.number().min(0).default(0),
  buildingArea: z.number().min(0).default(0),
  floors: z.number().int().min(1).default(1),
  budget: z.number().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    await connectDB();

    const search = request.nextUrl.searchParams.get("search");
    const page = Math.max(
      1,
      Number(request.nextUrl.searchParams.get("page")) || 1
    );
    const limit = Math.min(
      50,
      Math.max(
        1,
        Number(request.nextUrl.searchParams.get("limit")) || 10
      )
    );

    const filter: Record<string, unknown> = {
      ownerId: user._id,
    };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Project.countDocuments(filter),
    ]);

    return successResponse({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return errorResponse("Gagal mengambil data proyek", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = projectSchema.parse(await request.json());

    await connectDB();

    const project = await Project.create({
      ...body,
      ownerId: new mongoose.Types.ObjectId(user._id.toString()),
    });

    return successResponse(
      project,
      "Proyek berhasil dibuat",
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Data proyek tidak valid", 422);
    }

    if (
      error instanceof Error &&
      "code" in error &&
      error.code === 11000
    ) {
      return errorResponse("Kode proyek sudah digunakan", 409);
    }

    return errorResponse("Gagal membuat proyek", 500);
  }
}
