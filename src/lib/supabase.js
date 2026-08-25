import { createClient } from '@supabase/supabase-js';
import { generateMockOrders, MOCK_PRODUCTS, MOCK_CUSTOMERS } from './mockData.js';

const DEFAULT_URL = "https://okxkxeqwlzoxhkiflrxx.supabase.co";
const DEFAULT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reGt4ZXF3bHpveGhraWZscnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDgwMjMsImV4cCI6MjEwMDgyNDAyM30.yOfy2klYRfRxBhq_D39VxVRD8GZ6WEDmpM6A8g-n_VA";

export function getActiveCredentials() {
  const storedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('VITE_SUPABASE_URL') : null;
  const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem('VITE_SUPABASE_ANON_KEY') : null;
  
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : null;
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : null;

  return {
    url: (storedUrl || envUrl || DEFAULT_URL).trim(),
    anonKey: (storedKey || envKey || DEFAULT_ANON_KEY).trim()
  };
}

const initialCreds = getActiveCredentials();
export let SUPABASE_URL = initialCreds.url;
export let SUPABASE_ANON_KEY = initialCreds.anonKey;

export let supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function updateSupabaseCredentials(newUrl, newAnonKey) {
  SUPABASE_URL = newUrl.trim();
  SUPABASE_ANON_KEY = newAnonKey.trim();

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('VITE_SUPABASE_URL', SUPABASE_URL);
    localStorage.setItem('VITE_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);
  }

  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabase;
}

export function resetSupabaseCredentials() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('VITE_SUPABASE_URL');
    localStorage.removeItem('VITE_SUPABASE_ANON_KEY');
  }
  SUPABASE_URL = DEFAULT_URL;
  SUPABASE_ANON_KEY = DEFAULT_ANON_KEY;
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabase;
}

/**
 * Standardize order objects across different table column names
 */
export function normalizeOrder(o, index = 0) {
  const quantity = Number(o.quantity || o.qty || o.count) || 1;
  const amount = Number(o.amount || o.total || o.total_amount || o.total_price) || 0;
  const unitPrice = Number(o.unit_price || o.price || o.cost) || (amount && quantity ? amount / quantity : 0);

  const rawDate = o.created_at || o.order_date_time || o.order_date || o.date;
  let parsedDate;
  try {
    parsedDate = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString();
  } catch (e) {
    parsedDate = new Date().toISOString();
  }

  return {
    id: o.id || o.order_no || o.order_id || `ORD-${1000 + index}`,
    created_at: parsedDate,
    customer_name: (o.customer_name || o.customer || o.client || o.name || (o.user_id ? `Customer ${o.user_id}` : `Customer ${index + 1}`)).trim(),
    customer_email: o.customer_email || o.email || (o.user_id ? `user${o.user_id}@client.com` : 'client@enterprise.com'),
    company: o.company || o.client_company || 'Enterprise Corp',
    region: o.region || o.country || o.location || 'Global',
    product_name: o.product_name || o.product || o.item || o.productName || (o.product_id ? `Product ${o.product_id}` : 'Enterprise Product'),
    category: o.category || o.product_category || 'eSIM & Telecom',
    quantity: quantity,
    unit_price: unitPrice,
    amount: amount || (quantity * unitPrice),
    status: o.status || 'Completed'
  };
}

/**
 * Fallback dataset generation when Supabase is unreachable or unconfigured
 */
export function getFallbackTablesData(errorMsg = 'Supabase host unreachable or unconfigured.') {
  const rawOrders = generateMockOrders();
  const normalizedOrders = rawOrders.map((o, idx) => normalizeOrder(o, idx));

  // Derive products
  const derivedProductsMap = new Map();
  MOCK_PRODUCTS.forEach(p => {
    derivedProductsMap.set(p.name.toLowerCase(), {
      ...p,
      total_orders: 0,
      total_revenue: 0
    });
  });

  normalizedOrders.forEach(o => {
    const prodName = o.product_name || 'Enterprise Product';
    const key = prodName.toLowerCase();
    if (!derivedProductsMap.has(key)) {
      derivedProductsMap.set(key, {
        id: `prod_${derivedProductsMap.size + 1}`,
        name: prodName,
        category: o.category || 'General',
        price: Number(o.unit_price) || 0,
        stock: Math.floor(Math.random() * 80) + 20,
        total_orders: 0,
        total_revenue: 0
      });
    }
    const prod = derivedProductsMap.get(key);
    prod.total_orders += 1;
    prod.total_revenue += Number(o.amount) || 0;
  });

  // Derive users
  const derivedUsersMap = new Map();
  MOCK_CUSTOMERS.forEach(u => {
    derivedUsersMap.set(u.email.toLowerCase(), {
      ...u,
      total_orders: 0,
      total_spent: 0
    });
  });

  normalizedOrders.forEach(o => {
    const email = o.customer_email || 'client@enterprise.com';
    const key = email.toLowerCase();
    if (!derivedUsersMap.has(key)) {
      derivedUsersMap.set(key, {
        id: `usr_${derivedUsersMap.size + 1}`,
        name: o.customer_name || 'Valued Customer',
        email: email,
        company: o.company || 'Enterprise Corp',
        region: o.region || 'North America',
        total_orders: 0,
        total_spent: 0
      });
    }
    const usr = derivedUsersMap.get(key);
    usr.total_orders += 1;
    usr.total_spent += Number(o.amount) || 0;
  });

  const fallbackDestinations = [
    { id: 1, destination_name: 'North America HQ' },
    { id: 2, destination_name: 'European Distribution Center' },
    { id: 3, destination_name: 'APAC Sales Hub' },
    { id: 4, destination_name: 'EMEA Direct Office' }
  ];

  return {
    orders: normalizedOrders,
    products: Array.from(derivedProductsMap.values()),
    users: Array.from(derivedUsersMap.values()),
    destinations: fallbackDestinations,
    connected: false,
    isFallback: true,
    error: errorMsg
  };
}

/**
 * Helper to fetch all orders with pagination (handling 2,500+ rows)
 */
export async function fetchAllOrdersPaginated() {
  let allOrders = [];
  let page = 0;
  const pageSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .range(from, to);

    if (error) {
      console.error('Error fetching orders chunk:', error);
      break;
    }

    if (data && data.length > 0) {
      allOrders = allOrders.concat(data);
      if (data.length < pageSize) {
        hasMore = false;
      } else {
        page++;
      }
    } else {
      hasMore = false;
    }
  }

  return allOrders;
}

export async function fetchAllUsersPaginated() {
  let allUsers = [];
  let page = 0;
  const pageSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .range(from, to);

    if (error) {
      console.error('Error fetching users chunk:', error);
      break;
    }

    if (data && data.length > 0) {
      allUsers = allUsers.concat(data);
      if (data.length < pageSize) {
        hasMore = false;
      } else {
        page++;
      }
    } else {
      hasMore = false;
    }
  }

  return allUsers;
}

/**
 * Fetch all main tables from Supabase: orders, products, users, destinations
 */
export async function fetchAllTablesData() {
  const result = {
    orders: [],
    products: [],
    users: [],
    destinations: [],
    connected: false,
    isFallback: false,
    error: null
  };

  try {
    const [rawOrders, productsRes, rawUsers, destRes] = await Promise.all([
      fetchAllOrdersPaginated(),
      supabase.from('products').select('*'),
      fetchAllUsersPaginated(),
      supabase.from('destinations').select('*')
    ]);

    const usersData = rawUsers || [];

    // Build user and product lookup maps for cross-table enrichment
    const productsMap = new Map();
    (productsRes.data || []).forEach(p => {
      if (p.prod_id || p.id) {
        productsMap.set(String(p.prod_id || p.id), p);
      }
    });

    const usersMap = new Map();
    usersData.forEach(u => {
      if (u.user_id || u.id) {
        usersMap.set(String(u.user_id || u.id), u);
      }
    });

    const enrichedRawOrders = (rawOrders || []).map(o => {
      const u = usersMap.get(String(o.user_id));
      const p = productsMap.get(String(o.product_id));

      return {
        ...o,
        customer_name: o.customer_name || u?.name?.trim() || (o.user_id ? `User ${o.user_id}` : undefined),
        customer_email: o.customer_email || u?.email || (u?.mobile ? `${u.mobile}@client.com` : undefined),
        product_name: o.product_name || p?.productName || p?.name || (o.product_id ? `Product ${o.product_id}` : undefined),
        category: o.category || p?.category || 'eSIM & Telecom',
        unit_price: o.unit_price || p?.amount || o.amount
      };
    });

    const normalizedOrders = enrichedRawOrders.map((o, idx) => normalizeOrder(o, idx));

    if (normalizedOrders.length > 0) {
      result.orders = normalizedOrders;
      result.connected = true;
    }

    // 1. Derive & Aggregate Rich Products from orders + products table
    const derivedProductsMap = new Map();

    (productsRes.data || []).forEach(p => {
      const pName = p.productName || p.name;
      if (p && pName) {
        derivedProductsMap.set(pName.toLowerCase(), {
          id: p.prod_id || p.id || `prod_${derivedProductsMap.size + 1}`,
          name: pName,
          category: p.category || 'eSIM & Telecom',
          price: Number(p.amount || p.price) || 0,
          stock: p.stock || 100,
          total_orders: 0,
          total_revenue: 0
        });
      }
    });

    normalizedOrders.forEach(o => {
      const prodName = o.product_name || 'Enterprise Product';
      const key = prodName.toLowerCase();
      
      if (!derivedProductsMap.has(key)) {
        derivedProductsMap.set(key, {
          id: `prod_${derivedProductsMap.size + 1}`,
          name: prodName,
          category: o.category || 'eSIM & Telecom',
          price: Number(o.unit_price) || (Number(o.amount) / Number(o.quantity || 1)) || 0,
          stock: Math.floor(Math.random() * 80) + 20,
          total_orders: 0,
          total_revenue: 0
        });
      }
      
      const prod = derivedProductsMap.get(key);
      prod.total_orders += 1;
      prod.total_revenue += Number(o.amount) || 0;
      if (!prod.price && o.unit_price) prod.price = Number(o.unit_price);
    });

    result.products = Array.from(derivedProductsMap.values());

    // 2. Derive & Aggregate Users/Customers from orders + users table
    const derivedUsersMap = new Map();

    usersData.forEach(u => {
      if (u && (u.name || u.email || u.mobile)) {
        const email = u.email || (u.mobile ? `${u.mobile}@client.com` : `user_${u.user_id}@client.com`);
        const key = email.toLowerCase();
        derivedUsersMap.set(key, {
          id: u.user_id || u.id || `usr_${derivedUsersMap.size + 1}`,
          name: u.name?.trim() || 'Anonymous User',
          email: email,
          company: u.company || 'Enterprise Corp',
          region: u.region || 'Global',
          total_orders: 0,
          total_spent: 0
        });
      }
    });

    normalizedOrders.forEach(o => {
      const name = o.customer_name || 'Customer';
      const email = o.customer_email || `${name.toLowerCase().replace(/\s+/g, '.')}@client.com`;
      const key = email.toLowerCase();

      if (!derivedUsersMap.has(key)) {
        derivedUsersMap.set(key, {
          id: `usr_${derivedUsersMap.size + 1}`,
          name: name,
          email: email,
          company: o.company || 'Enterprise Corp',
          region: o.region || 'Global',
          total_orders: 0,
          total_spent: 0
        });
      }

      const usr = derivedUsersMap.get(key);
      usr.total_orders += 1;
      usr.total_spent += Number(o.amount) || 0;
    });

    result.users = Array.from(derivedUsersMap.values());

    if (destRes.data) result.destinations = destRes.data;

    // If no orders were returned and an error was present or connection failed
    if (!result.connected && normalizedOrders.length === 0) {
      const errDetail = productsRes?.error?.message || "Could not fetch rows from orders or products table.";
      return getFallbackTablesData(`Supabase query failed: ${errDetail}`);
    }

  } catch (err) {
    console.warn("Supabase fetch failed with exception, triggering fallback mode:", err);
    return getFallbackTablesData(`Connection failure: ${err.message || 'Supabase host unreachable'}`);
  }

  return result;
}


