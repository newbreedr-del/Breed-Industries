import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using Service Role Key to bypass RLS for admin actions
// IMPORTANT: This should ONLY be used in server-side code (API routes, Server Actions)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zdpbkrrohdwohelsrvic.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createServerClient() {
  // Use service key if available, otherwise fallback to anon key
  const key = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcGJrcnJvaGR3b2hlbHNydmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDc4NzUsImV4cCI6MjA5MDA4Mzg3NX0.Hm_eQqBuBZoFO7AI6DUv7Xbov3Di0ilhqt7vTtadOe0';
  
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
