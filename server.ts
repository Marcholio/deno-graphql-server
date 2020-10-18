import { Application, applyGraphQL, Router } from "./deps.ts";

import { resolvers, typeDefs } from "./graphql.ts";

const port = Number(Deno.env.get("PORT")) || 8000;

const hostname = "0.0.0.0";

const app = new Application();

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs,
  resolvers,
});

// CORS headers
app.use(async (ctx, next) => {
  ctx.response.headers.set(
    "Access-Control-Allow-Origin",
    Deno.env.get("MODE") === "production"
      ? "https://marcholio.github.io/vue-todo"
      : "http://localhost:8080",
  );
  ctx.response.headers.set("Content-Type", "application/json");
  ctx.response.headers.set("Access-Control-Allow-Headers", "*");
  await next();
});

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log(
  `GraphQL server running. Access it at:  http://${hostname}:${port}/`,
);

await app.listen({ port });
