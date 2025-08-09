
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ttuzibwedktfttqoqwwh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dXppYndlZGt0ZnR0cW9xd3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3Mjc0MzYsImV4cCI6MjA3MDMwMzQzNn0.saOCtqwode0dGDGLcQpPQxKyov1mAVV9jVjsbOhVOhY"

if (!supabaseUrl) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
