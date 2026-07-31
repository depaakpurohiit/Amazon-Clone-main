import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";
const ADMIN_USER = "mainadmin@@1212";
const ADMIN_PASS = "adminadmin@@";
const AUTH = "Basic " + Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString("base64");

async function fetchMetric(name: string): Promise<number | null> {
  try {
    const res = await fetch(`${BACKEND}/actuator/metrics/${name}`, {
      headers: { Authorization: AUTH },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.measurements?.[0]?.value ?? null;
  } catch {
    return null;
  }
}

async function fetchHealth(): Promise<{ status: string; db: string; diskFree: number; diskTotal: number } | null> {
  try {
    const res = await fetch(`${BACKEND}/actuator/health`, {
      headers: { Authorization: AUTH },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      status: data.status ?? "UNKNOWN",
      db: data.components?.db?.status ?? "UNKNOWN",
      diskFree: data.components?.diskSpace?.details?.free ?? 0,
      diskTotal: data.components?.diskSpace?.details?.total ?? 0,
    };
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest) {
  const [
    jvmMemUsed,
    jvmMemMax,
    threadsLive,
    cpuSystem,
    cpuProcess,
    hikariActive,
    hikariMax,
    health,
  ] = await Promise.all([
    fetchMetric("jvm.memory.used"),
    fetchMetric("jvm.memory.max"),
    fetchMetric("jvm.threads.live"),
    fetchMetric("system.cpu.usage"),
    fetchMetric("process.cpu.usage"),
    fetchMetric("hikaricp.connections.active"),
    fetchMetric("hikaricp.connections.max"),
    fetchHealth(),
  ]);

  return NextResponse.json({
    jvmMemUsed,
    jvmMemMax,
    threadsLive,
    cpuSystem,
    cpuProcess,
    hikariActive,
    hikariMax,
    health,
  });
}
