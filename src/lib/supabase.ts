import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zdpbkrrohdwohelsrvic.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcGJrcnJvaGR3b2hlbHNydmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NzY4OTgsImV4cCI6MjA1ODU1Mjg5OH0.uY8t5kj14Bk_Tdc-Kre4_Q__FC5wtJXrKWEhcvNcGiI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    };
  };
}
