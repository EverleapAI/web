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

// Base URL for the Azure Functions app (e.g. https://<func>.azurewebsites.net or .../api)
const API_BASE_RAW = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const API_BASE_HAS_API = /\/api$/i.test(API_BASE_RAW);
const API_BASE = API_BASE_RAW; // keep as-is (may or may not include /api)

// API routes that should be proxied directly to Azure Functions (from the browser)
const PROXY_PREFIXES = ["/session", "/webauthn", "/auth"] as const;

/**
 * Build an absolute URL from a path.
 * - Absolute http(s) URLs pass through.
 * - Paths that start with `/api/` are same-origin (Next.js BFF route handlers).
 * - Paths that start with one of PROXY_PREFIXES are sent to Functions:
 *     API_BASE + (ensure /api once) + normalized path
 * - Everything else stays same-origin.
 */
function toUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  if (path.startsWith("/api/")) return path; // Next.js route handler (same-origin)

  // If calling one of our backend endpoints, send to Functions
  if (PROXY_PREFIXES.some((p) => path.startsWith(p))) {
    if (!API_BASE) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is not set but a backend call was attempted."
      );
    }
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const baseWithApi = API_BASE_HAS_API ? API_BASE : `${API_BASE}/api`;
    return `${baseWithApi}${normalized}`;
  }

  // Anything else stays same-origin
  return path;
}

/** Decide whether to include cookies based on the final URL */
function credentialsFor(url: string): RequestCredentials {
  // Only include cookies for same-origin BFF calls (`/api/...`).
  // For absolute URLs (Functions), omit credentials — cookies there won’t help anyway.
  return url.startsWith("/api/") ? "include" : "omit";
}

/** Safe JSON parse (falls back to raw text) */
function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Extract a human message from a server error payload */
function extractMessage(info: unknown, fallback: string): string {
  if (typeof info === "string") return info;
  if (info && typeof info === "object" && "message" in info) {
    const m = (info as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

/** Build query string from an object (skips null/undefined) */
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

/** Public API */
export const api = {
  /** Compose a URL with query params */
  url(path: string, params?: Record<string, unknown>) {
    const qs = qsp(params);
    const withQs = qs ? `${path}${path.includes("?") ? "&" : "?"}${qs}` : path;
    return toUrl(withQs);
  },

  /** GET with optional query params */
  get: <T>(path: string, params?: Record<string, unknown>, timeout?: number) =>
    apiFetch<T>(
      params ? `${path}${path.includes("?") ? "&" : "?"}${qsp(params)}` : path,
      { method: "GET" },
      timeout
    ),

  /** POST JSON or FormData body (optional query params) */
  post: <T>(
    path: string,
    body: unknown,
    params?: Record<string, unknown>,
    timeout?: number
  ) =>
    apiFetch<T>(
      params ? `${path}${path.includes("?") ? "&" : "?"}${qsp(params)}` : path,
      { method: "POST", body: isFormData(body) ? (body as BodyInit) : JSON.stringify(body) },
      timeout
    ),

  /** PUT JSON or FormData body (optional query params) */
  put: <T>(
    path: string,
    body: unknown,
    params?: Record<string, unknown>,
    timeout?: number
  ) =>
    apiFetch<T>(
      params ? `${path}${path.includes("?") ? "&" : "?"}${qsp(params)}` : path,
      { method: "PUT", body: isFormData(body) ? (body as BodyInit) : JSON.stringify(body) },
      timeout
    ),

  /** DELETE with optional query params */
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
