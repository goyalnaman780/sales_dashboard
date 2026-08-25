import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://okxkxeqwlzoxhkiflrxx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reGt4ZXF3bHpveGhraWZscnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDgwMjMsImV4cCI6MjEwMDgyNDAyM30.yOfy2klYRfRxBhq_D39VxVRD8GZ6WEDmpM6A8g-n_VA";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testNewCredentials() {
  console.log("Testing Supabase SDK client...");
  
  const tables = ['orders', 'products', 'users', 'destinations'];
  for (const t of tables) {
    const { data, error, status } = await supabase.from(t).select('*').limit(5);
    console.log(`Table '${t}': status ${status}, error:`, error?.message || 'None', `, count:`, data?.length ?? 0);
    if (data && data.length > 0) {
      console.log(` Sample row from '${t}':`, data[0]);
    }
  }
}

testNewCredentials();
