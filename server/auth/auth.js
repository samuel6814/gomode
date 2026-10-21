const { betterAuth } = require('better-auth');
const { prismaAdapter } = require('better-auth/adapters/prisma');
const { PrismaClient } = require('@prisma/client');
const { redisStorage } = require('@better-auth/redis-storage');
const Redis = require('ioredis');

const prisma = new PrismaClient();

function resolveAuthBaseUrl() {
  const fallback = 'http://localhost:5000/api/auth';
  const url = (process.env.BETTER_AUTH_URL || fallback).replace(/\/$/, '');
  if (url.endsWith('/api/auth')) return url;
  if (url.endsWith('/api')) return `${url}/auth`;
  return `${url}/api/auth`;
}

function trustedOrigins() {
  const origins = ['http://localhost:5173'];
  for (const value of [process.env.FRONTEND_URL, process.env.CLIENT_URL]) {
    const origin = value?.replace(/\/$/, '');
    if (origin && !origins.includes(origin)) origins.push(origin);
  }
  return origins;
}

const isProd = process.env.NODE_ENV === 'production';

// Only use Redis if explicitly configured with a remote URL
const useRedis = process.env.REDIS_URL && process.env.REDIS_URL !== 'redis://localhost:6379';
const redis = useRedis ? new Redis(process.env.REDIS_URL) : null;

const auth = betterAuth({
    baseURL: resolveAuthBaseUrl(),
    trustedOrigins: trustedOrigins(),

    // The shop proxies /api, so the browser and the cookie share one host.
    advanced: {
        defaultCookieAttributes: {
            sameSite: 'lax',
            secure: isProd,
        }
    },

    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),

    // Offload session caching and rate limits to Redis if available
    ...(redis ? {
        secondaryStorage: redisStorage({
            client: redis,
            keyPrefix: "gf-auth:"
        })
    } : {}),

    rateLimit: {
        window: 60, // 1 minute window
        max: 1000,  // Allow 1,000 attempts per minute during development
    },
    
    emailAndPassword: {
        enabled: true,
        autoSignIn: true, 
    },

    // This tells better-auth to skip the strict cross-domain CSRF check 
    // so Google Auth will work across Vercel and Render.
    account: {
        skipStateCookieCheck: true,
    },

    // --GOOGLE AUTH CONFIGURATION ---
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }
    },
    // -----------------------------------------

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 
        }
    },
    
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "CUSTOMER"
            }
        }
    }
});

module.exports = { auth };