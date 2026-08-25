const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Accept": "application/openapi+json"
};

async function fetchFullSchema() {
  console.log("--- Fetching Complete Supabase OpenAPI Schema ---");
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, { headers });
    console.log("Status:", res.status);
    if (!res.ok) {
      console.log("Response text:", await res.text());
      return;
    }

    const data = await res.json();
    console.log("Title:", data.info?.title);
    const definitions = data.definitions || {};
    console.log(`Found ${Object.keys(definitions).length} table definitions:\n`);

    for (const [tableName, schema] of Object.entries(definitions)) {
      console.log(`========================================`);
      console.log(`TABLE: "${tableName}"`);
      console.log(`Description: ${schema.description || 'N/A'}`);
      console.log(`Columns (${Object.keys(schema.properties || {}).length}):`);
      for (const [propName, propDetails] of Object.entries(schema.properties || {})) {
        console.log(`  - ${propName} (${propDetails.type || propDetails.format || 'unknown'}) ${propDetails.description ? `: ${propDetails.description}` : ''}`);
      }
      console.log(`========================================\n`);
    }

    // Now let's test fetching sample data from each table found!
    for (const tableName of Object.keys(definitions)) {
      try {
        const sampleRes = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=5`, {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          }
        });
        if (sampleRes.ok) {
          const sampleRows = await sampleRes.json();
          console.log(`DATA SAMPLE for "${tableName}" (${sampleRows.length} rows returned):`);
          console.log(JSON.stringify(sampleRows, null, 2));
        } else {
          console.log(`Data fetch for "${tableName}" returned ${sampleRes.status}: ${await sampleRes.text()}`);
        }
      } catch (e) {
        console.error(`Error fetching data for ${tableName}:`, e.message);
      }
    }

  } catch (err) {
    console.error("Error fetching schema:", err);
  }
}

fetchFullSchema();
