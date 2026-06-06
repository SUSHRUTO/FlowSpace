import { NextRequest } from "next/server";
import { taskDb } from "@/lib/db";
import { getSession, apiResponse, apiError } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const { id } = await params;
    const task = taskDb.findById(id);
    if (!task || task.userId !== session.id) return apiError("Task not found", 404);
    return apiResponse({ task });
  } catch (e) {
    return apiError("Failed to fetch task", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const { id } = await params;
    const task = taskDb.findById(id);
    if (!task || task.userId !== session.id) return apiError("Task not found", 404);
    const body = await req.json();
    const updated = taskDb.update(id, body);
    return apiResponse({ task: updated });
  } catch (e) {
    return apiError("Failed to update task", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const { id } = await params;
    const task = taskDb.findById(id);
    if (!task || task.userId !== session.id) return apiError("Task not found", 404);
    const body = await req.json();
    const updated = taskDb.update(id, body);
    return apiResponse({ task: updated });
  } catch (e) {
    return apiError("Failed to update task", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const { id } = await params;
    const task = taskDb.findById(id);
    if (!task || task.userId !== session.id) return apiError("Task not found", 404);
    taskDb.delete(id);
    return apiResponse({ message: "Task deleted successfully" });
  } catch (e) {
    return apiError("Failed to delete task", 500);
  }
}
