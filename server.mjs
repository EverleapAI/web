// apps/web/server.mjs

import next from "next";
import http from "http";

const port = parseInt(process.env.PORT || "8080", 10);
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();

const server = http.createServer((req, res) => {
  handle(req, res);
});

server.listen(port, () => {
  console.log(`> Server running on http://localhost:${port}`);
});