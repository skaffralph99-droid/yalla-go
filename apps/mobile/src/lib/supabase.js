import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const supabase = createClient(
  'https://pxvuufpghdmcnctdecum.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4dnV1ZnBnaGRtY25jdGRlY3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTg0MzIsImV4cCI6MjA5NTE5NDQzMn0.ff6SYGB6WPnA7-pN73uoFcjqnYC3YXZF02j7J3SNrwU',
  { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } }
);
