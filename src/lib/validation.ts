// apps/web/src/lib/validation.ts
// npm i zod
import { z, ZodError } from "zod";

/* ----------------------- Shared helpers ----------------------- */

export function formatZodError(err: ZodError) {
  return err.issues
    .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("; ");
}

export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, status = 400): T {
  const res = schema.safeParse(data);
  if (!res.success) {
    const e = new Error(formatZodError(res.error));
    // attach HTTP status for route handlers to reuse
    // @ts-expect-error augmenting Error with status
    e.status = status;
    throw e;
  }
  return res.data;
}

/* ----------------------- Schemas: Auth / Session ----------------------- */

export const ContactSchema = z.object({
  method: z.enum(["phone", "email"]),
  value: z.string().min(1, "value required").max(256),
  display: z.string().min(1).max(256).optional(),
});
export type Contact = z.infer<typeof ContactSchema>;

export const RoleSchema = z.enum(["student", "supporter"]);
export type Role = z.infer<typeof RoleSchema>;

export const VerifyOtpRequestSchema = z.object({
  code: z
    .string()
    .min(4, "code too short")
    .max(10, "code too long")
    .regex(/^\d+$/, "code must be digits"),
  contact: ContactSchema,
  requestId: z.string().min(1).max(128).optional(),
  firstName: z.string().trim().min(1, "firstName required").max(100),
  lastName: z.string().trim().min(1, "lastName required").max(100),
  role: RoleSchema,
});
export type VerifyOtpRequest = z.infer<typeof VerifyOtpRequestSchema>;

export const VerifyOtpResponseSchema = z.object({
  ok: z.boolean(),
  userId: z.string().optional(),
  redirect: z.string().optional(),
  error: z.string().optional(),
  code: z.string().optional(), // e.g., "USER_EXISTS"
});
export type VerifyOtpResponse = z.infer<typeof VerifyOtpResponseSchema>;

export const SessionMeResponseSchema = z.object({
  ok: z.boolean(),
  verified: z.boolean(),
  userId: z.string().nullable().optional(),
  verifiedAtUtc: z.string().nullable().optional(),
});
export type SessionMeResponse = z.infer<typeof SessionMeResponseSchema>;

/* ----------------------- Schemas: Consent ----------------------- */

export const ConsentScope = z.enum(["voice", "analytics"]);
export type ConsentScopeType = z.infer<typeof ConsentScope>;

export const ConsentRecordSchema = z.object({
  version: z.number().int().nonnegative(),
  accepted: z.boolean(),
  scopes: z.array(ConsentScope).optional(),
  acceptedAtUtc: z.string().optional(), // ISO string (do a stricter check server-side if needed)
});
export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;

export const ConsentAcceptPayloadSchema = z.object({
  version: z.number().int().positive().optional(),
  scopes: z.array(ConsentScope).optional(),
  acceptedAtUtc: z.string().optional(),
});
export type ConsentAcceptPayload = z.infer<typeof ConsentAcceptPayloadSchema>;

export const ConsentStatusResponseSchema = z.object({
  ok: z.literal(true),
  accepted: z.boolean(),
  version: z.number().int().nonnegative(),
  scopes: z.array(ConsentScope).optional(),
  acceptedAtUtc: z.string().optional(),
});
export type ConsentStatusResponse = z.infer<typeof ConsentStatusResponseSchema>;

/* ----------------------- Schemas: Error envelope ----------------------- */

export const ErrorEnvelopeSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
});
export type ErrorEnvelope = z.infer<typeof ErrorEnvelopeSchema>;
