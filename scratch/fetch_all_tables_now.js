const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

async function fetchAllNow() {
  console.log("=== FETCHING ALL TABLES NOW FROM SUPABASE ===");

  const tables = ["orders", "products", "users", "destinations"];

  for (const table of tables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers });
      if (res.ok) {
        const rows = await res.json();
        console.log(`\n========================================`);
        console.log(`TABLE: "${table}" | Total Rows: ${rows.length}`);
        if (rows.length > 0) {
          console.log(`Columns (${Object.keys(rows[0]).length}):`, Object.keys(rows[0]));
          console.log(`All Data Rows:`);
          console.log(JSON.stringify(rows, null, 2));
        } else {
          console.log(`No rows in "${table}" (or restricted by RLS policy).`);
        }
      } else {
        console.log(`\nTABLE: "${table}" Returned HTTP ${res.status}: ${await res.text()}`);
      }
    } catch (e) {
      console.error(`Error querying ${table}:`, e.message);
    }
  }
}

fetchAllNow();
