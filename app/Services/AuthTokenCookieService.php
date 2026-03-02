<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;

class AuthTokenCookieService
{
    public const COOKIE_NAME = 'auth_token';
    private const DEFAULT_COOKIE_LIFETIME_MINUTES = 0;

    public function attachTokenCookie(JsonResponse $response, string $token): JsonResponse
    {
        $configuredSanctumExpiration = config('sanctum.expiration');
        $cookieMinutes = $configuredSanctumExpiration !== null
            ? (int) $configuredSanctumExpiration
            : (int) env('AUTH_TOKEN_COOKIE_MINUTES', self::DEFAULT_COOKIE_LIFETIME_MINUTES);
        $minutes = max(0, $cookieMinutes);

        return $response->withCookie(cookie(
            self::COOKIE_NAME,
            $token,
            $minutes,
            '/',
            null,
            !app()->environment('local'),
            true,
            false,
            'strict',
        ));
    }

    public function clearTokenCookie(JsonResponse $response): JsonResponse
    {
        return $response->withCookie(cookie()->forget(self::COOKIE_NAME, '/', null));
    }
}
