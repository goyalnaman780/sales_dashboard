const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

const targetTables = [
  "orders", 
  "destination", 
  "destinations", 
  "order_destination", 
  "order_destinations",
  "product", 
  "products", 
  "users", 
  "user"
];

async function fetchTablesData() {
  console.log("Checking requested tables data...");

  for (const table of targetTables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=10`, { headers });
      console.log(`\n----------------------------------------`);
      console.log(`TABLE NAME: "${table}" | HTTP Status: ${res.status}`);
      if (res.ok) {
        const rows = await res.json();
        console.log(`Rows returned: ${rows.length}`);
        if (rows.length > 0) {
          console.log(`Columns found:`, Object.keys(rows[0]));
          console.log(`Sample data:`, JSON.stringify(rows, null, 2));
        } else {
          console.log(`Table exists, but returned 0 rows (or RLS policy is restricting rows for anon key).`);
        }
      } else {
        const text = await res.text();
        console.log(`Error message: ${text}`);
      }
    } catch (e) {
      console.error(`Error querying ${table}:`, e.message);
    }
  }
}

fetchTablesData();
