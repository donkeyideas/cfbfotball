// ============================================================
// Supabase Client Factories
// Three clients for different execution contexts
// ============================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient as createSSRBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr';

export type { SupabaseClient };

// Database type is available for progressively typed queries:
// import type { Database } from '@cfb-social/types';
// export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * 1. Browser Client - for client-side React components
 * Uses NEXT_PUBLIC_ env vars, respects RLS via user session
 */
export function createBrowserClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables'
    );
  }

  return createSSRBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Cookie store interface matching Next.js cookies() API
 */
interface CookieStore {
  getAll(): Array<{ name: string; value: string }>;
  set(name: string, value: string, options?: Record<string, unknown>): void;
}

/**
 * 2. Server Client - for Next.js Server Components, Route Handlers, Server Actions
 * Uses @supabase/ssr with cookie-based session management
 * Respects RLS using the user's session from cookies
 */
export function createServerClient(cookieStore: CookieStore): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables'
    );
  }

  return createSSRServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll can be called from a Server Component where cookies
          // cannot be set. This is expected and can be safely ignored
          // when the middleware refreshes the session.
        }
      },
    },
  });
}

/**
 * 3. Service Client - for admin operations, Edge Functions, cron jobs
 * Uses SERVICE_ROLE_KEY which bypasses RLS entirely.
 * NEVER expose this to the browser.
 */
export function createServiceClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
