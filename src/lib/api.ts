// apps/web/src/lib/api.ts

export class ApiError extends Error {
  status: number;
  info: unknown;
  constructor(message: string, status: number, info: unknown) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

/**
 * Base URL for the Azure Functions app
 * Example: https://everleapfunctionsdev-f5hbhadhre9c8eqha.westus-01.azurewebsites.net
 */
const API_BASE_RAW = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const API_BASE_HAS_API = /\/api$/i.test(API_BASE_RAW);
const API_BASE = API_BASE_RAW;

// API routes that should be proxied directly to Azure Functions
const PROXY_PREFIXES = ["/session", "/webauthn", "/auth", "/passkey"] as const;

/**
 * Build an absolute URL from a path.
 * - Absolute URLs pass through
 * - `/api/...` routes are same-origin **unless** they match proxy prefixes
 * - `/session`, `/webauthn`, `/auth`, `/passkey` → sent to Azure Functions backend
 */
function toUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // Local Next.js API routes stay same-origin unless they match a proxied prefix
  if (path.startsWith("/api/") && !PROXY_PREFIXES.some((p) => path.startsWith(`/api${p}`))) {
    return path;
  }

  // Proxy known backend paths to Azure
  if (PROXY_PREFIXES.some((p) => path.startsWith(p) || path.startsWith(`/api${p}`))) {
    if (!API_BASE) {
      throw new Error("NEXT_PUBLIC_API_BASE is not set but a backend call was attempted.");
    }
    // Remove any leading /api for backend requests
    const normalized = path.replace(/^\/api/, "");
    const baseWithApi = API_BASE_HAS_API ? API_BASE : `${API_BASE}/api`;
    return `${baseWithApi}${normalized}`;
  }

  // Everything else stays same-origin
  return path;
}

/** Only send cookies to same-origin API calls */
function credentialsFor(url: string): RequestCredentials {
  return url.startsWith("/api/") ? "include" : "omit";
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(info: unknown, fallback: string): string {
  if (typeof info === "string") return info;
  if (info && typeof info === "object" && "message" in info) {
    const m = (info as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

export function qsp(params?: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      sp.set(k, String(v));
    }
  }
  return sp.toString();
}

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function getBody(init: RequestInit): BodyInit | undefined {
  const candidate = (init as unknown as { body?: BodyInit | null }).body;
  return candidate == null ? undefined : candidate;
}

async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = 15000
): Promise<T> {
  const url = toUrl(path);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const bodyCandidate = getBody(init);
  const isFD = isFormData(bodyCandidate);
  const baseHeaders: HeadersInit = isFD
    ? (init.headers ?? {})
    : { "Content-Type": "application/json", ...(init.headers ?? {}) };

  try {
    const res = await fetch(url, {
      cache: "no-store",
      credentials: credentialsFor(url),
      ...init,
      headers: baseHeaders,
      signal: controller.signal,
      redirect: init.redirect ?? "follow",
    });

    const raw = await res.text();
    const data = raw ? safeJson(raw) : null;

    if (!res.ok) {
      throw new ApiError(
        extractMessage(data, res.statusText || "Request failed"),
        res.status,
        data
      );
    }
    return data as T;
  } catch (err) {
    if ((err as { name?: string })?.name === "AbortError") {
      throw new ApiError("Request timed out", 0, null);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      (err as { message?: string })?.message || "Network error",
      -1,
      null
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Public API facade */
export const api = {
  url(path: string, params?: Record<string, unknown>) {
    const qs = qsp(params);
    const withQs = qs ? `${path}${path.includes("?") ? "&" : "?"}${qs}` : path;
    return toUrl(withQs);
  },

  get: <T>(path: string, params?: Record<string, unknown>, timeout?: number) =>
    apiFetch<T>(
      params ? `${path}${path.includes("?") ? "&" : "?"}${qsp(params)}` : path,
      { method: "GET" },
      timeout
    ),

  post: <T>(
    path: string,
    body: unknown,
    params?: Record<string, unknown>,
    timeout?: number
  ) =>
    apiFetch<T>(
      params ? `${path}${path.includes("?") ? "&" : "?"}${qsp(params)}` : path,
      {
        method: "POST",
        body: isFormData(body) ? (body as BodyInit) : JSON.stringify(body),
      },
      timeout
    ),

  put: <T>(
    path: string,
    body: unknown,
    params?: Record<string, unknown>,
    timeout?: number
  ) =>
    apiFetch<T>(
      params ? `${path}${path.includes("?") ? "&" : "?"}${qsp(params)}` : path,
      {
        method: "PUT",
        body: isFormData(body) ? (body as BodyInit) : JSON.stringify(body),
      },
      timeout
    ),

  del: <T = { ok: true }>(
    path: string,
    params?: Record<string, unknown>,
    timeout?: number
  ) =>
    apiFetch<T>(
      params ? `${path}${path.includes("?") ? "&" : "?"}${qsp(params)}` : path,
      { method: "DELETE" },
      timeout
    ),
};
