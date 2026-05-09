// src/regauth/types.ts

export type AuthIdentifier =
  | {
      type: "email";
      raw: string;
      normalized: string;
    }
  | {
      type: "phone";
      raw: string;
      normalized: string;
    };

export type RegAuthDraftPayload = {
  schemaVersion: 1;
  identifier?: string;
  email?: string;
  phone?: string;
  returnTo?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RegAuthUser = {
  id?: string;
  email?: string | null;
  phone?: string | null;
  email_verified?: boolean;
  phone_verified?: boolean;
  zip_code?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type RegAuthSession = {
  user?: RegAuthUser | null;
  authed?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type RegAuthStoragePayload = {
  schemaVersion: 1;
  draft?: RegAuthDraftPayload | null;
  session?: RegAuthSession | null;
  user?: RegAuthUser | null;
};

export type AuthMethod = "code";