
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nrpajydxcpeiafkpoyoz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycGFqeWR4Y3BlaWFma3BveW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4MTI1MzksImV4cCI6MjA1MjM4ODUzOX0.X1lhg233j18TWx-a6EifSlTKIt-umn4SJ8UoRsB03Ms";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
