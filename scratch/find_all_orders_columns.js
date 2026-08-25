const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

const candidateCols = [
  "order_no", "created_by", "user_id", "product_id", "amount",
  "order_date", "order_status", "status_id", "quantity", "qty",
  "unit_price", "price", "discount", "tax", "shipping_address",
  "billing_address", "created_at", "updated_at", "inserted_at",
  "id", "uuid", "code", "notes", "remarks", "payment_method",
  "payment_status", "currency", "customer_id", "client_id",
  "channel", "store_id", "branch_id", "salesperson_id", "rep_id"
];

async function findCols() {
  console.log("Testing columns on 'orders'...");
  const validCols = [];
  for (const c of candidateCols) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=${c}&limit=1`, { headers });
    if (res.ok) {
      validCols.push(c);
      console.log(`✅ FOUND COLUMN: "${c}"`);
    } else {
      const errText = await res.text();
      // Parse hint if any
      try {
        const parsed = JSON.parse(errText);
        if (parsed.hint) {
          console.log(`  💡 Hint for "${c}": ${parsed.hint}`);
        }
      } catch (e) {}
    }
  }
  console.log("\nSummary of valid columns in orders table:", validCols);
}

findCols();
