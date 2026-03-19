#!/bin/bash
NAME="${1:?Usage: create-event.sh <event-name>}"
curl -s -X POST http://localhost:4000/ \
  -H 'Content-Type: application/json' \
  -d "{\"query\":\"mutation { createEvent(name: \\\"$NAME\\\") { id name } }\"}" \
  | cat
echo
