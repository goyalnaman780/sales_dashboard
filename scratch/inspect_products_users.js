const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

async function testFetchAll() {
  console.log("=== Fetching 'orders' ===");
  const ordersRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*`, { headers });
  const orders = await ordersRes.json();
  console.log(`Orders count: ${orders.length}`);

  console.log("\n=== Fetching 'products' ===");
  const productsRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, { headers });
  const products = await productsRes.json();
  console.log(`Products count: ${products.length}`);
  if (products.length > 0) console.log("Sample product:", products[0]);

  console.log("\n=== Fetching 'users' ===");
  const usersRes = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, { headers });
  const users = await usersRes.json();
  console.log(`Users count: ${users.length}`);
  if (users.length > 0) console.log("Sample user:", users[0]);

  console.log("\n=== Fetching 'destinations' ===");
  const destRes = await fetch(`${SUPABASE_URL}/rest/v1/destinations?select=*`, { headers });
  const destinations = await destRes.json();
  console.log(`Destinations count: ${destinations.length}`);
  if (destinations.length > 0) console.log("Sample destination:", destinations[0]);
}

testFetchAll();
