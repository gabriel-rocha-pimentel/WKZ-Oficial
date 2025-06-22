import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qlbwgucoqpqrkkmiyude.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsYndndWNvcXBxcmtrbWl5dWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTIwMjAsImV4cCI6MjA2NjE4ODAyMH0.-p3nraPctA9Cq_8PWSPpU4REJVoYfxJH31gcmltEAbw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);