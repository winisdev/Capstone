FROM php:8.2-cli

# System deps + PHP extensions needed by Laravel
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip zip curl \
    libzip-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev libicu-dev libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql mbstring zip intl bcmath gd opcache \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy app code
COPY . /var/www

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Laravel writable dirs
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

# Render provides PORT at runtime
CMD sh -lc "php artisan key:generate --force || true; php artisan migrate --force; php artisan serve --host 0.0.0.0 --port ${PORT:-10000}"
