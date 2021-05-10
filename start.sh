#/bin/bash

curl -fsSL https://deno.land/x/install/install.sh | sh

export DENO_INSTALL="/app/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

deno --version

deno run --lock=lock.json --allow-net --allow-env --allow-read=baseData.json ./server.ts
