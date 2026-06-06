import { taskDb, projectDb } from "@/lib/db";
import { getSession, apiResponse, apiError } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return apiError("Unauthorized", 401);
    const stats = taskDb.stats(session.id);
    const projects = projectDb.findAll(session.id);
    return apiResponse({ stats, projectCount: projects.length });
  } catch (e) {
    return apiError("Failed to fetch stats", 500);
  }
}
