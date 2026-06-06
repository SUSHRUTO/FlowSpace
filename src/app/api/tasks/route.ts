import { NextRequest } from "next/server";
import { taskDb } from "@/lib/db";
import { getSession, apiResponse, apiError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const { searchParams } = new URL(req.url);
    const filters = {
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      projectId: searchParams.get("projectId") || undefined,
    };
    const tasks = taskDb.findAll(session.id, filters);
    return apiResponse({ tasks, count: tasks.length });
  } catch (e) {
    return apiError("Failed to fetch tasks", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const body = await req.json();
    const { title, description, status = "todo", priority = "medium", dueDate, projectId, tags = [] } = body;
    if (!title?.trim()) return apiError("Title is required", 400);
    const task = taskDb.create({ title: title.trim(), description, status, priority, dueDate, userId: session.id, projectId, tags });
    return apiResponse({ task }, 201);
  } catch (e) {
    return apiError("Failed to create task", 500);
  }
}
