const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

async function fetchOrdersData() {
  console.log("Fetching orders with order_no, user_id, product_id, amount, created_by...");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*`, { headers });
  if (res.ok) {
    const rows = await res.json();
    console.log(`Returned ${rows.length} rows:`);
    console.log(JSON.stringify(rows, null, 2));
  } else {
    console.log("Fetch error:", await res.text());
  }
}

fetchOrdersData();
