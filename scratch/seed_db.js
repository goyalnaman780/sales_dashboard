import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hweqkpmehyyheimbazbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXFrcG1laHl5aGVpbWJhemJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTgwMzQsImV4cCI6MjEwMTk5NDAzNH0.3FnBKHjBkoKdHQTUmMenZBZxxU-2pWBdkLeyZXC8Ig4";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MOCK_PRODUCTS = [
  { id: 'prod_1', name: 'MacBook Pro 16"', category: 'Electronics', price: 2499, stock: 45 },
  { id: 'prod_2', name: 'UltraWide Monitor 34"', category: 'Electronics', price: 799, stock: 80 },
  { id: 'prod_3', name: 'Ergonomic Office Chair', category: 'Furniture', price: 349, stock: 120 },
  { id: 'prod_4', name: 'Wireless Mechanical Keyboard', category: 'Electronics', price: 159, stock: 200 },
  { id: 'prod_5', name: 'Standing Desk Pro', category: 'Furniture', price: 599, stock: 65 },
  { id: 'prod_6', name: 'Noise-Canceling Headphones', category: 'Audio', price: 299, stock: 150 },
  { id: 'prod_7', name: 'Smart Watch Series 9', category: 'Wearables', price: 399, stock: 95 },
  { id: 'prod_8', name: 'SaaS Enterprise Annual Plan', category: 'Software', price: 1200, stock: 999 },
];

const MOCK_USERS = [
  { id: 'usr_1', name: 'Sarah Jenkins', email: 'sarah.j@acmecorp.com', company: 'Acme Corp', region: 'North America' },
  { id: 'usr_2', name: 'Michael Chen', email: 'm.chen@nexuslab.io', company: 'Nexus Lab', region: 'Asia Pacific' },
  { id: 'usr_3', name: 'Elena Rostova', email: 'elena@techsphere.de', company: 'TechSphere', region: 'Europe' },
  { id: 'usr_4', name: 'David Miller', email: 'd.miller@apexglobal.com', company: 'Apex Global', region: 'North America' },
  { id: 'usr_5', name: 'Amara Okafor', email: 'amara@innovate.ng', company: 'Innovate Africa', region: 'EMEA' },
  { id: 'usr_6', name: 'Carlos Gomez', email: 'carlos@soluciones.es', company: 'Soluciones IT', region: 'Europe' },
  { id: 'usr_7', name: 'Jessica Taylor', email: 'jtaylor@cloudventures.com', company: 'Cloud Ventures', region: 'North America' }
];

async function seedProductsAndUsers() {
  console.log("Checking products table...");
  const { data: prodData } = await supabase.from('products').select('*');
  if (!prodData || prodData.length === 0) {
    console.log("Seeding products...");
    const { data, error } = await supabase.from('products').insert(MOCK_PRODUCTS).select();
    if (error) console.error("Error inserting products:", error.message);
    else console.log("Products inserted successfully:", data.length);
  } else {
    console.log("Products already exist:", prodData.length);
  }

  console.log("Checking users table...");
  const { data: userData } = await supabase.from('users').select('*');
  if (!userData || userData.length === 0) {
    console.log("Seeding users...");
    const { data, error } = await supabase.from('users').insert(MOCK_USERS).select();
    if (error) console.error("Error inserting users:", error.message);
    else console.log("Users inserted successfully:", data.length);
  } else {
    console.log("Users already exist:", userData.length);
  }
}

seedProductsAndUsers();
