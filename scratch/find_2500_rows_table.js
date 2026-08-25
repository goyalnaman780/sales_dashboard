const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Prefer": "count=exact"
};

const candidateTables = [
  "orders", "products", "users", "destinations", "sales", "sales_data", "sales_orders", 
  "order_items", "customers", "clients", "leads", "deals", "transactions", 
  "invoices", "payments", "revenue", "stores", "categories", "regions", 
  "fact_sales", "dim_products", "dim_customers", "daily_sales", "monthly_sales",
  "tbl_sales", "tbl_orders", "data", "records", "sales_report", "opportunity",
  "opportunities", "contacts", "accounts", "teams", "reps", "sales_reps",
  "subscriptions", "plans", "pricing", "commissions", "goals", "targets",
  "sheet1", "sheet_1", "dataset", "sales_dataset", "Superstore", "superstore",
  "orders_raw", "raw_orders", "csv_data", "import", "imported_orders"
];

async function scanCounts() {
  console.log("=== SCANNING TABLE ROW COUNTS ===");
  for (const table of candidateTables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, { headers });
      if (res.status !== 404) {
        const countHeader = res.headers.get("content-range");
        const rows = await res.json();
        console.log(`Table "${table}": HTTP ${res.status} | Content-Range: ${countHeader} | Sample rows length: ${rows.length}`);
        if (rows && rows.length > 0) {
          console.log(`  Columns for "${table}":`, Object.keys(rows[0]));
          console.log(`  Sample row:`, JSON.stringify(rows[0], null, 2));
        }
      }
    } catch (e) {
      console.error(`Error on ${table}:`, e.message);
    }
  }
}

scanCounts();
