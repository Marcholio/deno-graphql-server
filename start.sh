#/bin/bash

curl -fsSL https://deno.land/x/install/install.sh | sh

export DENO_INSTALL="/app/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

deno run --lock=lock.json --allow-net --allow-env ./server.ts
