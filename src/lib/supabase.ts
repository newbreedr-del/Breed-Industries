import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zdpbkrrohdwohelsrvic.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcGJrcnJvaGR3b2hlbHNydmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDc4NzUsImV4cCI6MjA5MDA4Mzg3NX0.Hm_eQqBuBZoFO7AI6DUv7Xbov3Di0ilhqt7vTtadOe0';

// Public client — uses anon key, subject to RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Admin client — uses service role key, bypasses RLS
// Only import this in server-side code (API routes), never in client components
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : supabase; // fallback to anon if service key not configured

// Database table schemas
export interface Database {
  public: {
    Tables: {
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          quote_number: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          customer_address: string | null;
          items: any;
          one_time_total: number;
          monthly_total: number;
          deposit: number;
          balance: number;
          total_amount: number;
          status: string;
          payment_status: string;
          due_date: string;
          issue_date: string;
          paid_date: string | null;
          paid_amount: number;
          payment_date: string | null;
          stitch_payment_id: string | null;
          stitch_payment_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invoices']['Row']>;
      };
      quotes: {
        Row: {
          id: string;
          quote_number: string;
          customer_name: string;
          customer_email: string;
          project_name: string;
          contact_person: string;
          items: any;
          total: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quotes']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['quotes']['Row']>;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          author: string;
          date: string;
          read_time: string;
          category: string;
          tags: string[];
          featured_image: string | null;
          og_image: string | null;
          status: 'published' | 'draft';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['blog_posts']['Row']>;
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['faqs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['faqs']['Row']>;
      };
      tender_clients: {
        Row: {
          id: string; name: string; company_name: string; email: string;
          phone: string | null; cidb_grade: string | null; bee_level: number | null;
          csd_number: string | null; tax_pin: string | null;
          provinces: string[]; commodity_codes: string[]; service_categories: string[];
          max_tender_value: number; package: string;
          package_started_at: string; package_expires_at: string | null;
          is_active: boolean; notes: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tender_clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tender_clients']['Row']>;
      };
      tenders: {
        Row: {
          id: string; reference_number: string; title: string; description: string | null;
          department: string | null; province: string | null; category: string | null;
          commodity_codes: string[]; estimated_value: number | null;
          required_cidb_grade: string | null; required_bee_level: number | null;
          issue_date: string | null; closing_date: string;
          briefing_date: string | null; briefing_location: string | null;
          source_url: string | null; source: string; status: string;
          documents_required: boolean; document_fee: number;
          raw_data: Record<string, unknown> | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tenders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tenders']['Row']>;
      };
      tender_matches: {
        Row: {
          id: string; tender_id: string; client_id: string;
          match_score: number; match_reasons: string[]; status: string;
          admin_notes: string | null; notified_at: string | null;
          applied_at: string | null; outcome_at: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tender_matches']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tender_matches']['Row']>;
      };
      tender_applications: {
        Row: {
          id: string; match_id: string; tender_id: string; client_id: string;
          status: string; submitted_at: string | null; documents_submitted: string[];
          meeting_attended: boolean; meeting_date: string | null; meeting_location: string | null;
          extra_charges: number; extra_charges_description: string | null; notes: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tender_applications']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tender_applications']['Row']>;
      };
      tender_notifications: {
        Row: {
          id: string; client_id: string | null; tender_id: string | null;
          match_id: string | null; notification_type: string;
          sent_to: string; email_id: string | null; created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tender_notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tender_notifications']['Row']>;
      };
    };
  };
}
