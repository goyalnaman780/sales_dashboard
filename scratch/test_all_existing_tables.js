const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

const commonNames = [
  "orders", "products", "users", "sales", "customers", "deals", "leads", 
  "transactions", "invoices", "payments", "revenue", "stores", "categories", 
  "regions", "items", "order_items", "sales_data", "profiles", "subscriptions", 
  "plans", "commissions", "targets", "goals", "sales_reps", "teams", "accounts",
  "contacts", "opportunities", "records", "data", "metrics", "analytics",
  "dashboard", "vendors", "suppliers", "inventory", "shipments", "deliveries",
  "promotions", "coupons", "discounts", "refunds", "returns", "feedback",
  "reviews", "tickets", "logs", "events", "activities", "tasks", "notes"
];

async function scan() {
  console.log("Scanning database tables...");
  const existingTables = [];
  for (const name of commonNames) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${name}?select=*&limit=1`, { headers });
    if (res.status !== 404) {
      existingTables.push({ name, status: res.status });
      console.log(`Found existing table: "${name}" (Status: ${res.status})`);
    }
  }
  console.log("Summary of existing tables:", existingTables);
}

scan();
