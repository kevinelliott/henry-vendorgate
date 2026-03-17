import { createClient, SupabaseClient } from '@supabase/supabase-js'
function getUrl(): string { return process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co' }
function getAnonKey(): string { return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key' }
function getServiceKey(): string { return process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key' }
export function getSupabase(): SupabaseClient { return createClient(getUrl(), getAnonKey()) }
export function createServiceClient(): SupabaseClient { return createClient(getUrl(), getServiceKey()) }
let _supabase: SupabaseClient | null = null
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target: SupabaseClient, prop: string | symbol) {
    if (!_supabase) _supabase = createClient(getUrl(), getAnonKey())
    return (_supabase as any)[prop]
  }
})
