// apps/web/types/env.d.ts

// Minimal Node env typing for client code so `process.env.*` is recognized.
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL?: string;
    // add other NEXT_PUBLIC_* keys here if you want strict typing
  }
}

// Declare the global `process` so TS doesn't complain in the browser bundle.
declare var process: {
  env: NodeJS.ProcessEnv;
};
