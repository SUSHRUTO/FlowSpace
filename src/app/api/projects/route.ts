import { NextRequest } from "next/server";
import { projectDb, taskDb } from "@/lib/db";
import { getSession, apiResponse, apiError } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const projects = projectDb.findAll(session.id);
    const withCounts = projects.map((p) => {
      const tasks = taskDb.findAll(session.id, { projectId: p.id });
      return { ...p, taskCount: tasks.length, doneCount: tasks.filter((t) => t.status === "done").length };
    });
    return apiResponse({ projects: withCounts, count: withCounts.length });
  } catch (e) {
    return apiError("Failed to fetch projects", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const body = await req.json();
    const { name, description, color = "#6366f1" } = body;
    if (!name?.trim()) return apiError("Project name is required", 400);
    const project = projectDb.create({ name: name.trim(), description, color, userId: session.id });
    return apiResponse({ project }, 201);
  } catch (e) {
    return apiError("Failed to create project", 500);
  }
}
