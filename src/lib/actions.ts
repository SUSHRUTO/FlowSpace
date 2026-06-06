"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { taskDb, projectDb, userDb } from "./db";
import { hashPassword, verifyPassword, signToken, getSession } from "./auth";

// ── Auth Actions ──────────────────────────────────────────────────────────────

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const existing = userDb.findByEmail(email);
  if (existing) {
    return { error: "Email already registered" };
  }

  const hashed = await hashPassword(password);
  const user = userDb.create({ email, name, password: hashed });

  const token = signToken(user.id);
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // Seed demo data
  const project = projectDb.create({
    name: "My First Project",
    description: "A sample project to get you started",
    color: "#6366f1",
    userId: user.id,
  });
  taskDb.create({ title: "Review project requirements", status: "done", priority: "high", userId: user.id, projectId: project.id, tags: ["planning"] });
  taskDb.create({ title: "Set up development environment", status: "done", priority: "medium", userId: user.id, projectId: project.id, tags: ["setup"] });
  taskDb.create({ title: "Build the MVP", status: "in_progress", priority: "urgent", userId: user.id, projectId: project.id, tags: ["dev"] });
  taskDb.create({ title: "Write tests", status: "todo", priority: "medium", userId: user.id, projectId: project.id, tags: ["testing"] });
  taskDb.create({ title: "Deploy to production", status: "todo", priority: "high", userId: user.id, projectId: project.id, tags: ["devops"] });

  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = userDb.findByEmail(email);
  if (!user) {
    return { error: "Invalid email or password" };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  const token = signToken(user.id);
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/auth/login");
}

// ── Task Actions ──────────────────────────────────────────────────────────────

export async function createTaskAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = (formData.get("status") as string) || "todo";
  const priority = (formData.get("priority") as string) || "medium";
  const dueDate = formData.get("dueDate") as string;
  const projectId = formData.get("projectId") as string;
  const tagsRaw = formData.get("tags") as string;

  if (!title?.trim()) return { error: "Title is required" };

  taskDb.create({
    title: title.trim(),
    description: description?.trim() || undefined,
    status: status as Task["status"],
    priority: priority as Task["priority"],
    dueDate: dueDate || undefined,
    userId: session.id,
    projectId: projectId || undefined,
    tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  return { success: true };
}

export async function updateTaskStatusAction(taskId: string, status: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const task = taskDb.findById(taskId);
  if (!task || task.userId !== session.id) return { error: "Task not found" };

  taskDb.update(taskId, { status: status as Task["status"] });
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteTaskAction(taskId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const task = taskDb.findById(taskId);
  if (!task || task.userId !== session.id) return { error: "Task not found" };

  taskDb.delete(taskId);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  return { success: true };
}

// ── Project Actions ───────────────────────────────────────────────────────────

export async function createProjectAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const color = (formData.get("color") as string) || "#6366f1";

  if (!name?.trim()) return { error: "Project name is required" };

  projectDb.create({
    name: name.trim(),
    description: description?.trim() || undefined,
    color,
    userId: session.id,
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteProjectAction(projectId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const project = projectDb.findById(projectId);
  if (!project || project.userId !== session.id) return { error: "Project not found" };

  projectDb.delete(projectId);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { success: true };
}

// ── Profile Action ────────────────────────────────────────────────────────────

export async function updateProfileAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  if (!name?.trim()) return { error: "Name is required" };

  userDb.update(session.id, { name: name.trim() });
  revalidatePath("/profile");
  return { success: true };
}

type Task = import("./db").Task;
