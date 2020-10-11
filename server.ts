import { Application, applyGraphQL, Router } from "./deps.ts";

import { typeDefs, resolvers} from './graphql.ts';

const port = Number(Deno.env.get("PORT")) || 8080;

const hostname = "0.0.0.0";

const app = new Application();

const GraphQLService = await applyGraphQL<Router>({ Router, typeDefs, resolvers })

app.use(GraphQLService.routes(), GraphQLService.allowedMethods())

console.log(
  `GraphQL server running. Access it at:  http://${hostname}:${port}/`,
);

await app.listen({ port })