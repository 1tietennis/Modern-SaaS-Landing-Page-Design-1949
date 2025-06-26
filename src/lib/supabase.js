import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://okjexaborhpirigndvco.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ramV4YWJvcmhwaXJpZ25kdmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4OTE4MTUsImV4cCI6MjA2NjQ2NzgxNX0.ocdz_TVEeRvR305Nga-u0WvUkP7pqXB26vWiBSErFzg'

if (SUPABASE_URL === 'https://your-project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase