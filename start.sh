#/bin/bash

curl -fsSL https://deno.land/x/install/install.sh | sh

export DENO_INSTALL="/app/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

deno run --allow-net --allow-env ./server.ts
