import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://oghibjysbqokcedkbicl.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
