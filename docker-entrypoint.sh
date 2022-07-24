#!/bin/sh
set -e

if [ "$1" == "start" ]; then
  node index.js frontend
  nginx -g "daemon off;"
elif [ "$1" == "start-dev" ]; then
  node index.js frontend --webpack-proxy
  nginx -g "daemon off;"
else
  echo "Invalid command provided."
  exit 1
fi