const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

async function testInsert() {
  console.log("Attempting to insert test order into Supabase...");
  const sampleOrder = {
    id: `ORD-${Date.now().toString().slice(-4)}`,
    customer_name: "Test Customer",
    customer_email: "test@example.com",
    company: "Acme Test Co",
    region: "North America",
    product_name: "MacBook Pro 16\"",
    category: "Electronics",
    quantity: 1,
    unit_price: 2499,
    amount: 2499,
    status: "Completed"
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify(sampleOrder)
  });

  console.log("Insert status:", res.status);
  const text = await res.text();
  console.log("Insert response:", text);

  // Fetch again
  const getRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*`, { headers });
  const rows = await getRes.json();
  console.log(`Current orders in database: ${rows.length} rows`);
}

testInsert();
