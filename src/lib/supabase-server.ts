import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with hardcoded values as fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zdpbkrrohdwohelsrvic.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcGJrcnJvaGR3b2hlbHNydmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDc4NzUsImV4cCI6MjA5MDA4Mzg3NX0.Hm_eQqBuBZoFO7AI6DUv7Xbov3Di0ilhqt7vTtadOe0';

export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
