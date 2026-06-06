import { NextRequest } from "next/server";
import { projectDb } from "@/lib/db";
import { getSession, apiResponse, apiError } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const { id } = await params;
    const project = projectDb.findById(id);
    if (!project || project.userId !== session.id) return apiError("Project not found", 404);
    return apiResponse({ project });
  } catch (e) {
    return apiError("Failed to fetch project", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const { id } = await params;
    const project = projectDb.findById(id);
    if (!project || project.userId !== session.id) return apiError("Project not found", 404);
    const body = await req.json();
    const updated = projectDb.update(id, body);
    return apiResponse({ project: updated });
  } catch (e) {
    return apiError("Failed to update project", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const { id } = await params;
    const project = projectDb.findById(id);
    if (!project || project.userId !== session.id) return apiError("Project not found", 404);
    projectDb.delete(id);
    return apiResponse({ message: "Project deleted" });
  } catch (e) {
    return apiError("Failed to delete project", 500);
  }
}
