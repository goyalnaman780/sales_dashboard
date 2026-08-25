const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

async function probeTableSchema(table) {
  console.log(`\n=== PROBING SCHEMA FOR "${table}" ===`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=dummy_column_xyz_123&limit=1`, { headers });
  const text = await res.text();
  console.log(`Response for ${table}:`, text);
}

async function main() {
  await probeTableSchema("orders");
  await probeTableSchema("products");
  await probeTableSchema("users");
  await probeTableSchema("destinations");
}

main();
