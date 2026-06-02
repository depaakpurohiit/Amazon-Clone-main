export type AppRole = "ADMIN" | "SELLER" | "CUSTOMER";

export function normalizeRole(role?: string | null): AppRole {
  if (!role) return "CUSTOMER";

  const normalized = role.trim().toUpperCase().replace(/^ROLE_/, "");
  if (normalized === "ADMIN" || normalized === "SELLER") return normalized;
  if (normalized.includes("ADMIN")) return "ADMIN";
  if (normalized.includes("SELLER")) return "SELLER";
  if (normalized.includes("CUSTOMER")) return "CUSTOMER";
  return "CUSTOMER";
}

export function getRoleLandingPath(role?: string | null) {
  const normalized = normalizeRole(role);
  if (normalized === "ADMIN") return "/admin/dashboard";
  if (normalized === "SELLER") return "/seller/dashboard";
  return "/";
}

export function isPrivilegedRole(role?: string | null) {
  const normalized = normalizeRole(role);
  return normalized === "ADMIN" || normalized === "SELLER";
}
