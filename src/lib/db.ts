import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  userId: string;
  projectId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Database {
  users: User[];
  projects: Project[];
  tasks: Task[];
}

function ensureDbExists() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const initial: Database = { users: [], projects: [], tasks: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
}

export function readDb(): Database {
  ensureDbExists();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeDb(data: Database) {
  ensureDbExists();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function generateId() {
  return uuidv4();
}

export function now() {
  return new Date().toISOString();
}

// User operations
export const userDb = {
  findAll: () => readDb().users,
  findById: (id: string) => readDb().users.find((u) => u.id === id),
  findByEmail: (email: string) => readDb().users.find((u) => u.email === email),
  create: (data: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    const db = readDb();
    const user: User = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.users.push(user);
    writeDb(db);
    return user;
  },
  update: (id: string, data: Partial<User>) => {
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...data, updatedAt: now() };
    writeDb(db);
    return db.users[idx];
  },
  delete: (id: string) => {
    const db = readDb();
    db.users = db.users.filter((u) => u.id !== id);
    writeDb(db);
  },
};

// Project operations
export const projectDb = {
  findAll: (userId: string) => readDb().projects.filter((p) => p.userId === userId),
  findById: (id: string) => readDb().projects.find((p) => p.id === id),
  create: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const db = readDb();
    const project: Project = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.projects.push(project);
    writeDb(db);
    return project;
  },
  update: (id: string, data: Partial<Project>) => {
    const db = readDb();
    const idx = db.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    db.projects[idx] = { ...db.projects[idx], ...data, updatedAt: now() };
    writeDb(db);
    return db.projects[idx];
  },
  delete: (id: string) => {
    const db = readDb();
    db.projects = db.projects.filter((p) => p.id !== id);
    writeDb(db);
  },
};

// Task operations
export const taskDb = {
  findAll: (userId: string, filters?: { status?: string; priority?: string; projectId?: string }) => {
    let tasks = readDb().tasks.filter((t) => t.userId === userId);
    if (filters?.status) tasks = tasks.filter((t) => t.status === filters.status);
    if (filters?.priority) tasks = tasks.filter((t) => t.priority === filters.priority);
    if (filters?.projectId) tasks = tasks.filter((t) => t.projectId === filters.projectId);
    return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  findById: (id: string) => readDb().tasks.find((t) => t.id === id),
  create: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const db = readDb();
    const task: Task = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.tasks.push(task);
    writeDb(db);
    return task;
  },
  update: (id: string, data: Partial<Task>) => {
    const db = readDb();
    const idx = db.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    db.tasks[idx] = { ...db.tasks[idx], ...data, updatedAt: now() };
    writeDb(db);
    return db.tasks[idx];
  },
  delete: (id: string) => {
    const db = readDb();
    db.tasks = db.tasks.filter((t) => t.id !== id);
    writeDb(db);
  },
  stats: (userId: string) => {
    const tasks = readDb().tasks.filter((t) => t.userId === userId);
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      done: tasks.filter((t) => t.status === "done").length,
      cancelled: tasks.filter((t) => t.status === "cancelled").length,
      urgent: tasks.filter((t) => t.priority === "urgent").length,
      overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length,
    };
  },
};
