const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

async function probeColumns() {
  console.log("Probing current columns in 'orders'...");
  const testCols = [
    "id", "order_no", "order_id", "user_id", "product_id", "customer_name",
    "customer_email", "company", "region", "product_name", "category",
    "quantity", "unit_price", "amount", "status", "created_at", "created_by"
  ];

  const valid = [];
  for (const col of testCols) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=${col}&limit=1`, { headers });
    if (res.ok) {
      valid.push(col);
      console.log(`✅ Column exists: "${col}"`);
    } else {
      const errText = await res.text();
      try {
        const parsed = JSON.parse(errText);
        if (parsed.hint) console.log(`  💡 Hint for "${col}": ${parsed.hint}`);
      } catch (e) {}
    }
  }

  console.log("\nCurrent valid columns on 'orders':", valid);
}

probeColumns();
