export const SUPABASE_RLS_FIX_SQL = `-- ========================================================
-- QUICK RLS UNLOCK FOR EXISTING 2,531+ ROWS
-- Run this in your Supabase SQL Editor to grant public SELECT access
-- to your existing orders table WITHOUT modifying or deleting any rows!
-- ========================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Anon Select Orders" ON public.orders;
DROP POLICY IF EXISTS "Allow Public Read Orders" ON public.orders;

CREATE POLICY "Allow Public Read Orders" ON public.orders FOR SELECT USING (true);

NOTIFY pgrst, 'reload schema';
`;

export const SUPABASE_SETUP_SQL = `-- ========================================================
-- SUPABASE SALES DASHBOARD COMPLETE DATABASE SETUP & REFRESH
-- Run this script in your Supabase SQL Editor to rebuild tables,
-- grant RLS permissions, insert full 60+ sample orders, and reload schema cache.
-- ========================================================

-- 1. Drop existing tables to refresh schema cache clean
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.destinations CASCADE;

-- 2. Create Full Orders Table
CREATE TABLE public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    company TEXT,
    region TEXT,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INT DEFAULT 1,
    unit_price NUMERIC(10,2) DEFAULT 0.00,
    amount NUMERIC(10,2) DEFAULT 0.00,
    status TEXT DEFAULT 'Completed'
);

-- 3. Create Products Table
CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock INT DEFAULT 100
);

-- 4. Create Users / Customers Table
CREATE TABLE public.users (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company TEXT,
    region TEXT
);

-- 5. Create Destinations Table
CREATE TABLE public.destinations (
    id SERIAL PRIMARY KEY,
    destination_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS) & Grant Public Read/Write Access
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Create Public Access Policies
CREATE POLICY "Public Anon Select Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Anon Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Anon Update Orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public Anon Delete Orders" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Public Anon Select Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Anon Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Anon Select Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Anon Insert Users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Anon Select Destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Public Anon Insert Destinations" ON public.destinations FOR INSERT WITH CHECK (true);

-- 7. Insert Initial Full Products Data
INSERT INTO public.products (id, name, category, price, stock) VALUES
('prod_1', 'MacBook Pro 16"', 'Electronics', 2499.00, 45),
('prod_2', 'UltraWide Monitor 34"', 'Electronics', 799.00, 80),
('prod_3', 'Ergonomic Office Chair', 'Furniture', 349.00, 120),
('prod_4', 'Wireless Mechanical Keyboard', 'Electronics', 159.00, 200),
('prod_5', 'Standing Desk Pro', 'Furniture', 599.00, 65),
('prod_6', 'Noise-Canceling Headphones', 'Audio', 299.00, 150),
('prod_7', 'Smart Watch Series 9', 'Wearables', 399.00, 95),
('prod_8', 'SaaS Enterprise Annual Plan', 'Software', 1200.00, 999)
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Full Customers/Users Data
INSERT INTO public.users (id, name, email, company, region) VALUES
('usr_1', 'Sarah Jenkins', 'sarah.j@acmecorp.com', 'Acme Corp', 'North America'),
('usr_2', 'Michael Chen', 'm.chen@nexuslab.io', 'Nexus Lab', 'Asia Pacific'),
('usr_3', 'Elena Rostova', 'elena@techsphere.de', 'TechSphere', 'Europe'),
('usr_4', 'David Miller', 'd.miller@apexglobal.com', 'Apex Global', 'North America'),
('usr_5', 'Amara Okafor', 'amara@innovate.ng', 'Innovate Africa', 'EMEA'),
('usr_6', 'Carlos Gomez', 'carlos@soluciones.es', 'Soluciones IT', 'Europe'),
('usr_7', 'Jessica Taylor', 'jtaylor@cloudventures.com', 'Cloud Ventures', 'North America')
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Destinations
INSERT INTO public.destinations (destination_name)
VALUES ('North America HQ'), ('European Distribution Center'), ('APAC Sales Hub'), ('EMEA Direct Office')
ON CONFLICT DO NOTHING;

-- 8. Insert Full 60 Sample Orders
INSERT INTO public.orders (id, created_at, customer_name, customer_email, company, region, product_name, category, quantity, unit_price, amount, status)
VALUES
('ORD-1001', NOW() - INTERVAL '1 day', 'Sarah Jenkins', 'sarah.j@acmecorp.com', 'Acme Corp', 'North America', 'MacBook Pro 16"', 'Electronics', 1, 2499.00, 2499.00, 'Completed'),
('ORD-1002', NOW() - INTERVAL '2 days', 'Michael Chen', 'm.chen@nexuslab.io', 'Nexus Lab', 'Asia Pacific', 'UltraWide Monitor 34"', 'Electronics', 2, 799.00, 1598.00, 'Completed'),
('ORD-1003', NOW() - INTERVAL '2 days', 'Elena Rostova', 'elena@techsphere.de', 'TechSphere', 'Europe', 'Ergonomic Office Chair', 'Furniture', 4, 349.00, 1396.00, 'Shipped'),
('ORD-1004', NOW() - INTERVAL '3 days', 'David Miller', 'd.miller@apexglobal.com', 'Apex Global', 'North America', 'SaaS Enterprise Annual Plan', 'Software', 1, 1200.00, 1200.00, 'Completed'),
('ORD-1005', NOW() - INTERVAL '4 days', 'Amara Okafor', 'amara@innovate.ng', 'Innovate Africa', 'EMEA', 'Noise-Canceling Headphones', 'Audio', 3, 299.00, 897.00, 'Processing'),
('ORD-1006', NOW() - INTERVAL '5 days', 'Carlos Gomez', 'carlos@soluciones.es', 'Soluciones IT', 'Europe', 'Wireless Mechanical Keyboard', 'Electronics', 5, 159.00, 795.00, 'Completed'),
('ORD-1007', NOW() - INTERVAL '6 days', 'Jessica Taylor', 'jtaylor@cloudventures.com', 'Cloud Ventures', 'North America', 'Standing Desk Pro', 'Furniture', 2, 599.00, 1198.00, 'Completed'),
('ORD-1008', NOW() - INTERVAL '7 days', 'Sarah Jenkins', 'sarah.j@acmecorp.com', 'Acme Corp', 'North America', 'Smart Watch Series 9', 'Wearables', 2, 399.00, 798.00, 'Pending'),
('ORD-1009', NOW() - INTERVAL '8 days', 'Michael Chen', 'm.chen@nexuslab.io', 'Nexus Lab', 'Asia Pacific', 'MacBook Pro 16"', 'Electronics', 2, 2499.00, 4998.00, 'Completed'),
('ORD-1010', NOW() - INTERVAL '9 days', 'Elena Rostova', 'elena@techsphere.de', 'TechSphere', 'Europe', 'UltraWide Monitor 34"', 'Electronics', 1, 799.00, 799.00, 'Completed'),
('ORD-1011', NOW() - INTERVAL '10 days', 'David Miller', 'd.miller@apexglobal.com', 'Apex Global', 'North America', 'Standing Desk Pro', 'Furniture', 3, 599.00, 1797.00, 'Completed'),
('ORD-1012', NOW() - INTERVAL '11 days', 'Amara Okafor', 'amara@innovate.ng', 'Innovate Africa', 'EMEA', 'SaaS Enterprise Annual Plan', 'Software', 2, 1200.00, 2400.00, 'Completed'),
('ORD-1013', NOW() - INTERVAL '12 days', 'Carlos Gomez', 'carlos@soluciones.es', 'Soluciones IT', 'Europe', 'Noise-Canceling Headphones', 'Audio', 4, 299.00, 1196.00, 'Shipped'),
('ORD-1014', NOW() - INTERVAL '13 days', 'Jessica Taylor', 'jtaylor@cloudventures.com', 'Cloud Ventures', 'North America', 'MacBook Pro 16"', 'Electronics', 1, 2499.00, 2499.00, 'Completed'),
('ORD-1015', NOW() - INTERVAL '14 days', 'Sarah Jenkins', 'sarah.j@acmecorp.com', 'Acme Corp', 'North America', 'Wireless Mechanical Keyboard', 'Electronics', 6, 159.00, 954.00, 'Completed'),
('ORD-1016', NOW() - INTERVAL '15 days', 'Michael Chen', 'm.chen@nexuslab.io', 'Nexus Lab', 'Asia Pacific', 'Ergonomic Office Chair', 'Furniture', 2, 349.00, 698.00, 'Completed'),
('ORD-1017', NOW() - INTERVAL '16 days', 'Elena Rostova', 'elena@techsphere.de', 'TechSphere', 'Europe', 'Smart Watch Series 9', 'Wearables', 3, 399.00, 1197.00, 'Processing'),
('ORD-1018', NOW() - INTERVAL '17 days', 'David Miller', 'd.miller@apexglobal.com', 'Apex Global', 'North America', 'UltraWide Monitor 34"', 'Electronics', 2, 799.00, 1598.00, 'Completed'),
('ORD-1019', NOW() - INTERVAL '18 days', 'Amara Okafor', 'amara@innovate.ng', 'Innovate Africa', 'EMEA', 'Standing Desk Pro', 'Furniture', 1, 599.00, 599.00, 'Completed'),
('ORD-1020', NOW() - INTERVAL '19 days', 'Carlos Gomez', 'carlos@soluciones.es', 'Soluciones IT', 'Europe', 'SaaS Enterprise Annual Plan', 'Software', 5, 1200.00, 6000.00, 'Completed'),
('ORD-1021', NOW() - INTERVAL '20 days', 'Jessica Taylor', 'jtaylor@cloudventures.com', 'Cloud Ventures', 'North America', 'Noise-Canceling Headphones', 'Audio', 2, 299.00, 598.00, 'Shipped'),
('ORD-1022', NOW() - INTERVAL '21 days', 'Sarah Jenkins', 'sarah.j@acmecorp.com', 'Acme Corp', 'North America', 'MacBook Pro 16"', 'Electronics', 2, 2499.00, 4998.00, 'Completed'),
('ORD-1023', NOW() - INTERVAL '22 days', 'Michael Chen', 'm.chen@nexuslab.io', 'Nexus Lab', 'Asia Pacific', 'Wireless Mechanical Keyboard', 'Electronics', 10, 159.00, 1590.00, 'Completed'),
('ORD-1024', NOW() - INTERVAL '23 days', 'Elena Rostova', 'elena@techsphere.de', 'TechSphere', 'Europe', 'Ergonomic Office Chair', 'Furniture', 5, 349.00, 1745.00, 'Completed'),
('ORD-1025', NOW() - INTERVAL '24 days', 'David Miller', 'd.miller@apexglobal.com', 'Apex Global', 'North America', 'Smart Watch Series 9', 'Wearables', 4, 399.00, 1596.00, 'Completed'),
('ORD-1026', NOW() - INTERVAL '25 days', 'Amara Okafor', 'amara@innovate.ng', 'Innovate Africa', 'EMEA', 'UltraWide Monitor 34"', 'Electronics', 3, 799.00, 2397.00, 'Pending'),
('ORD-1027', NOW() - INTERVAL '26 days', 'Carlos Gomez', 'carlos@soluciones.es', 'Soluciones IT', 'Europe', 'Standing Desk Pro', 'Furniture', 2, 599.00, 1198.00, 'Completed'),
('ORD-1028', NOW() - INTERVAL '27 days', 'Jessica Taylor', 'jtaylor@cloudventures.com', 'Cloud Ventures', 'North America', 'SaaS Enterprise Annual Plan', 'Software', 1, 1200.00, 1200.00, 'Completed'),
('ORD-1029', NOW() - INTERVAL '28 days', 'Sarah Jenkins', 'sarah.j@acmecorp.com', 'Acme Corp', 'North America', 'Noise-Canceling Headphones', 'Audio', 5, 299.00, 1495.00, 'Completed'),
('ORD-1030', NOW() - INTERVAL '29 days', 'Michael Chen', 'm.chen@nexuslab.io', 'Nexus Lab', 'Asia Pacific', 'MacBook Pro 16"', 'Electronics', 1, 2499.00, 2499.00, 'Completed'),
('ORD-1031', NOW() - INTERVAL '30 days', 'Elena Rostova', 'elena@techsphere.de', 'TechSphere', 'Europe', 'Wireless Mechanical Keyboard', 'Electronics', 4, 159.00, 636.00, 'Completed'),
('ORD-1032', NOW() - INTERVAL '31 days', 'David Miller', 'd.miller@apexglobal.com', 'Apex Global', 'North America', 'Ergonomic Office Chair', 'Furniture', 3, 349.00, 1047.00, 'Shipped'),
('ORD-1033', NOW() - INTERVAL '32 days', 'Amara Okafor', 'amara@innovate.ng', 'Innovate Africa', 'EMEA', 'Smart Watch Series 9', 'Wearables', 2, 399.00, 798.00, 'Completed'),
('ORD-1034', NOW() - INTERVAL '33 days', 'Carlos Gomez', 'carlos@soluciones.es', 'Soluciones IT', 'Europe', 'UltraWide Monitor 34"', 'Electronics', 2, 799.00, 1598.00, 'Completed'),
('ORD-1035', NOW() - INTERVAL '34 days', 'Jessica Taylor', 'jtaylor@cloudventures.com', 'Cloud Ventures', 'North America', 'Standing Desk Pro', 'Furniture', 4, 599.00, 2396.00, 'Completed'),
('ORD-1036', NOW() - INTERVAL '35 days', 'Sarah Jenkins', 'sarah.j@acmecorp.com', 'Acme Corp', 'North America', 'SaaS Enterprise Annual Plan', 'Software', 3, 1200.00, 3600.00, 'Completed'),
('ORD-1037', NOW() - INTERVAL '36 days', 'Michael Chen', 'm.chen@nexuslab.io', 'Nexus Lab', 'Asia Pacific', 'Noise-Canceling Headphones', 'Audio', 2, 299.00, 598.00, 'Processing'),
('ORD-1038', NOW() - INTERVAL '37 days', 'Elena Rostova', 'elena@techsphere.de', 'TechSphere', 'Europe', 'MacBook Pro 16"', 'Electronics', 2, 2499.00, 4998.00, 'Completed'),
('ORD-1039', NOW() - INTERVAL '38 days', 'David Miller', 'd.miller@apexglobal.com', 'Apex Global', 'North America', 'Wireless Mechanical Keyboard', 'Electronics', 8, 159.00, 1272.00, 'Completed'),
('ORD-1040', NOW() - INTERVAL '39 days', 'Amara Okafor', 'amara@innovate.ng', 'Innovate Africa', 'EMEA', 'Ergonomic Office Chair', 'Furniture', 1, 349.00, 349.00, 'Completed'),
('ORD-1041', NOW() - INTERVAL '40 days', 'Carlos Gomez', 'carlos@soluciones.es', 'Soluciones IT', 'Europe', 'Smart Watch Series 9', 'Wearables', 5, 399.00, 1995.00, 'Completed'),
('ORD-1042', NOW() - INTERVAL '41 days', 'Jessica Taylor', 'jtaylor@cloudventures.com', 'Cloud Ventures', 'North America', 'UltraWide Monitor 34"', 'Electronics', 3, 799.00, 2397.00, 'Shipped'),
('ORD-1043', NOW() - INTERVAL '42 days', 'Sarah Jenkins', 'sarah.j@acmecorp.com', 'Acme Corp', 'North America', 'Standing Desk Pro', 'Furniture', 2, 599.00, 1198.00, 'Completed'),
('ORD-1044', NOW() - INTERVAL '43 days', 'Michael Chen', 'm.chen@nexuslab.io', 'Nexus Lab', 'Asia Pacific', 'SaaS Enterprise Annual Plan', 'Software', 2, 1200.00, 2400.00, 'Completed'),
('ORD-1045', NOW() - INTERVAL '44 days', 'Elena Rostova', 'elena@techsphere.de', 'TechSphere', 'Europe', 'Noise-Canceling Headphones', 'Audio', 6, 299.00, 1794.00, 'Completed'),
('ORD-1046', NOW() - INTERVAL '45 days', 'David Miller', 'd.miller@apexglobal.com', 'Apex Global', 'North America', 'MacBook Pro 16"', 'Electronics', 1, 2499.00, 2499.00, 'Completed'),
('ORD-1047', NOW() - INTERVAL '46 days', 'Amara Okafor', 'amara@innovate.ng', 'Innovate Africa', 'EMEA', 'Wireless Mechanical Keyboard', 'Electronics', 3, 159.00, 477.00, 'Completed'),
('ORD-1048', NOW() - INTERVAL '47 days', 'Carlos Gomez', 'carlos@soluciones.es', 'Soluciones IT', 'Europe', 'Ergonomic Office Chair', 'Furniture', 2, 349.00, 698.00, 'Pending'),
('ORD-1049', NOW() - INTERVAL '48 days', 'Jessica Taylor', 'jtaylor@cloudventures.com', 'Cloud Ventures', 'North America', 'Smart Watch Series 9', 'Wearables', 1, 399.00, 399.00, 'Completed'),
('ORD-1050', NOW() - INTERVAL '49 days', 'Sarah Jenkins', 'sarah.j@acmecorp.com', 'Acme Corp', 'North America', 'UltraWide Monitor 34"', 'Electronics', 4, 799.00, 3196.00, 'Completed'),
('ORD-1051', NOW() - INTERVAL '50 days', 'Michael Chen', 'm.chen@nexuslab.io', 'Nexus Lab', 'Asia Pacific', 'Standing Desk Pro', 'Furniture', 1, 599.00, 599.00, 'Completed'),
('ORD-1052', NOW() - INTERVAL '51 days', 'Elena Rostova', 'elena@techsphere.de', 'TechSphere', 'Europe', 'SaaS Enterprise Annual Plan', 'Software', 4, 1200.00, 4800.00, 'Completed'),
('ORD-1053', NOW() - INTERVAL '53 days', 'David Miller', 'd.miller@apexglobal.com', 'Apex Global', 'North America', 'Noise-Canceling Headphones', 'Audio', 2, 299.00, 598.00, 'Completed'),
('ORD-1054', NOW() - INTERVAL '55 days', 'Amara Okafor', 'amara@innovate.ng', 'Innovate Africa', 'EMEA', 'MacBook Pro 16"', 'Electronics', 3, 2499.00, 7497.00, 'Completed'),
('ORD-1055', NOW() - INTERVAL '57 days', 'Carlos Gomez', 'carlos@soluciones.es', 'Soluciones IT', 'Europe', 'Wireless Mechanical Keyboard', 'Electronics', 5, 159.00, 795.00, 'Completed'),
('ORD-1056', NOW() - INTERVAL '58 days', 'Jessica Taylor', 'jtaylor@cloudventures.com', 'Cloud Ventures', 'North America', 'Ergonomic Office Chair', 'Furniture', 3, 349.00, 1047.00, 'Shipped'),
('ORD-1057', NOW() - INTERVAL '60 days', 'Sarah Jenkins', 'sarah.j@acmecorp.com', 'Acme Corp', 'North America', 'Smart Watch Series 9', 'Wearables', 2, 399.00, 798.00, 'Completed'),
('ORD-1058', NOW() - INTERVAL '62 days', 'Michael Chen', 'm.chen@nexuslab.io', 'Nexus Lab', 'Asia Pacific', 'UltraWide Monitor 34"', 'Electronics', 1, 799.00, 799.00, 'Completed'),
('ORD-1059', NOW() - INTERVAL '64 days', 'Elena Rostova', 'elena@techsphere.de', 'TechSphere', 'Europe', 'Standing Desk Pro', 'Furniture', 2, 599.00, 1198.00, 'Completed'),
('ORD-1060', NOW() - INTERVAL '65 days', 'David Miller', 'd.miller@apexglobal.com', 'Apex Global', 'North America', 'SaaS Enterprise Annual Plan', 'Software', 2, 1200.00, 2400.00, 'Completed')
ON CONFLICT (id) DO NOTHING;

-- 9. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

`;
