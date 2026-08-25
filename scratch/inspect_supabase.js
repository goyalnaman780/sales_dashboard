const SUPABASE_URL = "https://okxkxeqwlzoxhkiflrxx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reGt4ZXF3bHpveGhraWZscnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDgwMjMsImV4cCI6MjEwMDgyNDAyM30.yOfy2klYRfRxBhq_D39VxVRD8GZ6WEDmpM6A8g-n_VA";

async function inspectSupabase() {
  console.log("--- Inspecting OpenAPI Schema for New Supabase Credentials ---");
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_KEY}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!res.ok) {
      console.error("OpenAPI fetch failed:", res.status, res.statusText);
      return;
    }

    const openapi = await res.json();
    console.log("Title:", openapi.info?.title);
    console.log("Definitions/Tables found:");
    if (openapi.definitions) {
      for (const [tableName, definition] of Object.entries(openapi.definitions)) {
        console.log(`\nTable: "${tableName}"`);
        console.log("  Properties:", Object.keys(definition.properties || {}).join(", "));
        console.log("  Required:", definition.required || []);
      }
    } else {
      console.log("No definitions found in OpenAPI spec.");
    }
  } catch (err) {
    console.error("Error inspecting Supabase:", err);
  }
}

inspectSupabase();
