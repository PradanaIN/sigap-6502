#!/bin/sh
set -eu

: "${BACKEND_HOST:=backend}"
: "${BACKEND_PORT:=3301}"

envsubst '${BACKEND_HOST} ${BACKEND_PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

if [ "$#" -eq 0 ]; then
  set -- nginx -g 'daemon off;'
fi

exec "$@"
