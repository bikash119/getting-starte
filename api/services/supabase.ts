import { createClient , SupabaseClient} from '@supabase/supabase-js'


const supabaseClient = (env?:Env): SupabaseClient=> {
    const SUPABASE_URL = env?.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
    const SUPABASE_KEY = env?.SUPABASE_KEY || import.meta.env.VITE_SUPABASE_KEY
    const client = createClient(SUPABASE_URL, SUPABASE_KEY)
    return client
}
export default supabaseClient

