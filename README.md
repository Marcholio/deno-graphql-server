# Deno GraphQL server

This no longer works because Heroku disabled free dynos.

This is a server that is done using [Deno](https://deno.land/) and [GraphQL](https://graphql.org/).
It acts as a backend for [Vue.js TODO Application](https://github.com/Marcholio/vue-todo).

`master` branch is automatically deploed to Heroku. The `package.json` tricks the Heroku deployment into relying on nodejs runtime, which installs and then starts the deno server.

## Project setup

[Install Deno](https://deno.land/manual/getting_started/installation)

Run local server `./dev.sh`
