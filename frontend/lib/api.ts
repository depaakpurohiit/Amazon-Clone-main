export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseJsonSafely<T>(response: Response): Promise<T> {
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

function extractErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== "object") return fallback;
  const maybeBody = body as Record<string, unknown>;
  const message = maybeBody["message"];
  if (typeof message === "string") return message;
  if (Array.isArray(message)) {
    const first = message[0];
    if (first && typeof first === "object") {
      const msg = (first as Record<string, unknown>)["msg"];
      if (typeof msg === "string") return msg;
    }
  }
  return fallback;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const body = await parseJsonSafely<unknown>(response).catch(() => undefined);
    const message = extractErrorMessage(
      body,
      response.statusText || "Request failed"
    );
    throw new ApiError(response.status, message);
  }

  return parseJsonSafely<T>(response);
}

export type ProductDTO = {
  id: string;
  url: string;
  resUrl?: string;
  price: string;
  value?: string;
  accValue?: number;
  discount?: string;
  mrp?: string;
  name: string;
  category?: string;
  points?: string[];
};

export type CompatAuthUserDTO = {
  _id: string;
  name: string;
  number: string;
  email: string;
  cart: Array<{
    id: string;
    cartItem: { id: string; name: string; url: string; accValue?: number };
    qty: number;
  }>;
  orders: unknown[];
};

export function getProducts(params?: { category?: string; tag?: string }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.tag) qs.set("tag", params.tag);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<ProductDTO[]>(`/api/products${suffix}`, { method: "GET" });
}

export function getProduct(id: string) {
  return apiFetch<ProductDTO>(`/api/product/${encodeURIComponent(id)}`, {
    method: "GET",
  });
}

export function register(body: {
  name: string;
  number: string;
  email: string;
  password: string;
}) {
  return apiFetch<{ status: boolean; message: unknown }>(`/api/register`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function login(body: { email: string; password: string }) {
  return apiFetch<{ status: boolean; message: string }>(`/api/login`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getAuthUser(): Promise<CompatAuthUserDTO | null> {
  try {
    return await apiFetch<CompatAuthUserDTO>(`/api/getAuthUser`, {
      method: "GET",
    });
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
      return null;
    }
    throw e;
  }
}

export function logout() {
  return apiFetch<{ status: boolean; message: string }>(`/api/logout`, {
    method: "GET",
  });
}

export function addToCart(productId: string) {
  return apiFetch<{ status: boolean; message: string }>(
    `/api/addtocart/${encodeURIComponent(productId)}`,
    { method: "POST" }
  );
}

export function removeCartItem(cartItemId: string) {
  return apiFetch<{ status: boolean; message: string }>(
    `/api/delete/${encodeURIComponent(cartItemId)}`,
    { method: "DELETE" }
  );
}

export function updateCartQty(cartItemId: string, qty: number) {
  const qs = new URLSearchParams({ qty: String(qty) });
  return apiFetch<{ status: boolean; message: string }>(
    `/api/update-qty/${encodeURIComponent(cartItemId)}?${qs.toString()}`,
    { method: "PATCH" }
  );
}
