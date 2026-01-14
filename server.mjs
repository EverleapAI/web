// apps/web/server.mjs
import "dotenv/config";
import express from "express";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

function unauthorized(res) {
  res.statusCode = 401;
  res.setHeader("WWW-Authenticate", 'Basic realm="Everleap Private Beta"');
  res.end("Authentication required");
}

function parseBasicAuth(header) {
  if (!header || !header.startsWith("Basic ")) return null;

  const b64 = header.slice("Basic ".length).trim();

  let decoded = "";
  try {
    decoded = Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return null;
  }

  const i = decoded.indexOf(":");
  if (i < 0) return null;

  return {
    user: decoded.slice(0, i),
    pass: decoded.slice(i + 1),
  };
}

await app.prepare();

const server = express();

/* 🔐 SYSTEM-WIDE BASIC AUTH */
server.use((req, res, nextFn) => {
  const user = (process.env.SITE_BASIC_USER || "").trim();
  const pass = process.env.SITE_BASIC_PASS || "";

  // Fail closed
  if (!user || !pass) return unauthorized(res);

  const creds = parseBasicAuth(req.headers.authorization);
  if (!creds) return unauthorized(res);

  if (creds.user !== user || creds.pass !== pass) {
    return unauthorized(res);
  }

  return nextFn();
});

/* Hand off everything else to Next */
server.all("*", (req, res) => handle(req, res));

server.listen(port, () => {
  console.log(`> Everleap running on http://localhost:${port} (dev=${dev})`);
});
