const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

const candidateTables = [
  "orders", "products", "users", "sales", "sales_data", "sales_orders", 
  "order_items", "customers", "clients", "leads", "deals", "transactions", 
  "invoices", "payments", "revenue", "stores", "categories", "regions", 
  "fact_sales", "dim_products", "dim_customers", "daily_sales", "monthly_sales",
  "tbl_sales", "tbl_orders", "data", "records", "sales_report", "opportunity",
  "opportunities", "contacts", "accounts", "teams", "reps", "sales_reps",
  "subscriptions", "plans", "pricing", "commissions", "goals", "targets"
];

async function checkTables() {
  console.log("Checking candidate tables for row count and schema...");
  for (const table of candidateTables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
        headers: {
          ...headers,
          "Prefer": "count=exact"
        }
      });
      if (res.ok) {
        const countHeader = res.headers.get("content-range");
        const rows = await res.json();
        console.log(`✅ Table Found: "${table}" | Count Range: ${countHeader} | Rows returned: ${rows.length}`);
        if (rows.length > 0) {
          console.log(`   Columns:`, Object.keys(rows[0]));
          console.log(`   Sample Data:`, rows[0]);
        }
      }
    } catch (e) {
      // ignore errors
    }
  }
}

checkTables();
