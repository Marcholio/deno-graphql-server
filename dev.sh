#!/bin/bash

deno run --allow-net --allow-env --lock=lock.json --lock-write --watch --unstable --allow-read=./baseData.json ./server.ts
