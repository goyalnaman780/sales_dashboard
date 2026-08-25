const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

const tables = ["orders", "products", "users"];

async function inspectTable(table) {
  console.log(`\n=== Probing Table: "${table}" ===`);
  const words = [
    "id", "order_no", "order_id", "user_id", "product_id", "customer_id",
    "created_at", "created_by", "updated_at", "date", "order_date",
    "amount", "price", "unit_price", "total", "cost", "quantity", "qty",
    "status", "state", "type", "name", "title", "description",
    "email", "company", "region", "country", "city", "phone",
    "category", "sku", "stock", "inventory", "role", "is_active"
  ];

  const found = [];
  for (const w of words) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${w}&limit=1`, { headers });
    if (res.ok) {
      found.push(w);
    } else {
      const errText = await res.text();
      try {
        const parsed = JSON.parse(errText);
        if (parsed.hint && parsed.hint.includes("column")) {
          console.log(`  💡 Hint on "${w}": ${parsed.hint}`);
        }
      } catch (e) {}
    }
  }
  console.log(`✅ Table "${table}" confirmed columns:`, found);
}

async function run() {
  for (const t of tables) {
    await inspectTable(t);
  }
}

run();
