// apps/web/server.mjs
// (kept temporarily; no auth, no env logic)

import express from "express";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();

const server = express();

server.all("*", (req, res) => {
  return handle(req, res);
});

server.listen(port, () => {
  console.log(`> Everleap server wrapper listening on http://localhost:${port}`);
});
