/**
 * Simple web server copied from Deno examples:
 * https://deno.land/manual/examples/http_server
 */

import { serve } from "./deps.ts";

const port = Number(Deno.env.get("PORT")) || 8080;

const hostname = "0.0.0.0";

const server = serve({ hostname, port });
console.log(
  `HTTP webserver running.  Access it at:  http://${hostname}:${port}/`
);

for await (const request of server) {
  let bodyContent = "Your user-agent is:\n\n";
  bodyContent += request.headers.get("user-agent") || "Unknown";

  request.respond({ status: 200, body: bodyContent });
}
