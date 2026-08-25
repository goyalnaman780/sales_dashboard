const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

async function testOpenApi() {
  console.log("--- Test OpenAPI with header ---");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      ...headers,
      "Accept": "application/openapi+json"
    }
  });
  console.log("Status:", res.status);
  if (res.ok) {
    const data = await res.json();
    console.log("Definitions:", Object.keys(data.definitions || {}));
    for (const [table, def] of Object.entries(data.definitions || {})) {
      console.log(`Table: ${table}`);
      console.log("  Fields:", Object.keys(def.properties || {}));
    }
    return data;
  }
}

async function testCommonTables() {
  const commonTables = [
    "sales", "orders", "deals", "leads", "transactions", "customers", 
    "products", "invoices", "bookings", "tickets", "users", "profiles",
    "revenue", "payments", "analytics", "dashboard", "metrics", "items"
  ];
  console.log("\n--- Testing common table names ---");
  for (const table of commonTables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=2`, { headers });
      if (res.ok) {
        const rows = await res.json();
        console.log(`✅ Table Found: "${table}" (${rows.length} sample rows returned)`);
        if (rows.length > 0) {
          console.log("   Sample row keys:", Object.keys(rows[0]));
          console.log("   Sample row:", JSON.stringify(rows[0], null, 2));
        }
      } else if (res.status !== 404) {
        console.log(`⚠️ Table "${table}" returned status ${res.status}: ${await res.text()}`);
      }
    } catch (e) {
      console.error(`Error testing table ${table}:`, e.message);
    }
  }
}

async function run() {
  const openApiResult = await testOpenApi();
  if (!openApiResult) {
    await testCommonTables();
  }
}

run();
