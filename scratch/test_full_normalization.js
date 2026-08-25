import { createClient } from '@supabase/supabase-js';
import { normalizeOrder } from '../src/lib/supabase.js';

const SUPABASE_URL = "https://okxkxeqwlzoxhkiflrxx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reGt4ZXF3bHpveGhraWZscnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDgwMjMsImV4cCI6MjEwMDgyNDAyM30.yOfy2klYRfRxBhq_D39VxVRD8GZ6WEDmpM6A8g-n_VA";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testFullFetch() {
  console.log("=== FETCHING FULL LIVE DATA FROM USER'S SUPABASE ===");

  const [ordersRes, productsRes, usersRes, destRes] = await Promise.all([
    supabase.from('orders').select('*'),
    supabase.from('products').select('*'),
    supabase.from('users').select('*'),
    supabase.from('destinations').select('*')
  ]);

  console.log(`Orders count: ${ordersRes.data?.length}`);
  console.log(`Products count: ${productsRes.data?.length}`);
  console.log(`Users count: ${usersRes.data?.length}`);
  console.log(`Destinations count: ${destRes.data?.length}`);

  // Build lookup maps
  const productsMap = new Map();
  (productsRes.data || []).forEach(p => {
    if (p.prod_id || p.id) {
      productsMap.set(String(p.prod_id || p.id), p);
    }
  });

  const usersMap = new Map();
  (usersRes.data || []).forEach(u => {
    if (u.user_id || u.id) {
      usersMap.set(String(u.user_id || u.id), u);
    }
  });

  console.log("\nProducts Map sample keys:", Array.from(productsMap.keys()).slice(0, 5));
  console.log("Users Map sample keys:", Array.from(usersMap.keys()).slice(0, 5));

  const sampleRawOrder = ordersRes.data?.[0];
  console.log("\nRaw sample order:", sampleRawOrder);

  if (sampleRawOrder) {
    const userObj = usersMap.get(String(sampleRawOrder.user_id));
    const prodObj = productsMap.get(String(sampleRawOrder.product_id));

    console.log("Matched User Object:", userObj);
    console.log("Matched Product Object:", prodObj);

    const enrichedRawOrder = {
      ...sampleRawOrder,
      customer_name: userObj?.name || sampleRawOrder.customer_name,
      customer_email: userObj?.email || sampleRawOrder.customer_email || (userObj?.mobile ? `${userObj.mobile}@client.com` : undefined),
      product_name: prodObj?.productName || prodObj?.name || sampleRawOrder.product_name,
      category: prodObj?.category || 'eSIM & Telecom',
      unit_price: prodObj?.amount || sampleRawOrder.unit_price
    };

    console.log("\nNormalized order result:");
    console.log(normalizeOrder(enrichedRawOrder));
  }
}

testFullFetch();
