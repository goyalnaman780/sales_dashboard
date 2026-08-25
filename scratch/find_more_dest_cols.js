const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

async function inspectDestinations() {
  console.log("--- Inspecting 'destinations' table columns ---");
  const testCols = [
    "id", "name", "city", "country", "region", "address", "zip_code", 
    "created_at", "destination_name", "location", "code"
  ];
  const validCols = [];
  for (const c of testCols) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/destinations?select=${c}&limit=1`, { headers });
    if (res.ok) {
      validCols.push(c);
      console.log(`✅ Column exists: "${c}"`);
    } else {
      const errText = await res.text();
      try {
        const parsed = JSON.parse(errText);
        if (parsed.hint) console.log(`  💡 Hint for "${c}": ${parsed.hint}`);
      } catch (e) {}
    }
  }
  console.log("Valid columns for 'destinations':", validCols);
}

inspectDestinations();
