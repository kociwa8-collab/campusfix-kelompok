#!/bin/sh
set -e

php artisan config:clear
php artisan route:clear
mkdir -p public/uploads
php artisan migrate --force
php artisan db:seed --force

php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
