import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_APP_URL
const supabaseKey = import.meta.env.VITE_APP_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
    realtime: {
        enabled: false
    }
});

export default supabase;