const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

async function testInsert() {
  console.log("--- Testing Insert into 'orders' ---");
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({})
    });
    console.log("Insert response status:", res.status);
    console.log("Insert response text:", await res.text());
  } catch (e) {
    console.error("Insert error:", e);
  }
}

async function testRpc() {
  console.log("--- Testing RPC ---");
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_sales`, {
      method: "POST",
      headers,
      body: JSON.stringify({})
    });
    console.log("RPC get_sales status:", res.status);
    console.log("RPC get_sales text:", await res.text());
  } catch (e) {
    console.error("RPC error:", e);
  }
}

testInsert();
testRpc();
