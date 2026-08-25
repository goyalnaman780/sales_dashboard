const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

async function inspectColumns() {
  console.log("--- Inspecting 'orders' table schema ---");
  // PostgREST OPTIONS request returns the OpenAPI schema for the table
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: "OPTIONS",
    headers
  });
  console.log("OPTIONS status:", res.status);
  console.log("OPTIONS headers:", Object.fromEntries(res.headers.entries()));
  
  // Also try selecting common columns to see which ones fail vs succeed
  const testCols = [
    "id", "order_id", "created_at", "date", "customer_name", "customer_id", 
    "user_id", "email", "amount", "total", "total_price", "price", "status", 
    "product_name", "product_id", "category", "quantity", "region", "company"
  ];

  for (const col of testCols) {
    const cRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=${col}&limit=1`, { headers });
    const text = await cRes.text();
    if (cRes.ok) {
      console.log(`✅ Column exists: "${col}"`);
    } else {
      console.log(`❌ Column error for "${col}": ${text}`);
    }
  }
}

inspectColumns();
