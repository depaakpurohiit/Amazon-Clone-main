export type AppRole = "ADMIN" | "MANAGER" | "USER";

export function normalizeRole(role?: string | null): AppRole {
  if (!role) return "USER";

  const normalized = role.trim().toUpperCase().replace(/^ROLE_/, "");
  if (normalized === "ADMIN") return "ADMIN";
  if (normalized === "MANAGER" || normalized === "SELLER") return "MANAGER";
  if (normalized.includes("ADMIN")) return "ADMIN";
  if (normalized.includes("MANAGER") || normalized.includes("SELLER")) return "MANAGER";
  if (normalized.includes("USER") || normalized.includes("CUSTOMER")) return "USER";
  return "USER";
}

export function getRoleLandingPath(role?: string | null) {
  const normalized = normalizeRole(role);
  if (normalized === "ADMIN") return "/admin/dashboard";
  if (normalized === "MANAGER") return "/seller/dashboard"; // Keeping the URL as /seller/dashboard for now
  return "/";
}

export function isPrivilegedRole(role?: string | null) {
  const normalized = normalizeRole(role);
  return normalized === "ADMIN" || normalized === "MANAGER";
}
