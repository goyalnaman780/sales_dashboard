// High-quality mock dataset for instant preview and seeding

export const MOCK_PRODUCTS = [
  { id: 'prod_1', name: 'MacBook Pro 16"', category: 'Electronics', price: 2499, stock: 45 },
  { id: 'prod_2', name: 'UltraWide Monitor 34"', category: 'Electronics', price: 799, stock: 80 },
  { id: 'prod_3', name: 'Ergonomic Office Chair', category: 'Furniture', price: 349, stock: 120 },
  { id: 'prod_4', name: 'Wireless Mechanical Keyboard', category: 'Electronics', price: 159, stock: 200 },
  { id: 'prod_5', name: 'Standing Desk Pro', category: 'Furniture', price: 599, stock: 65 },
  { id: 'prod_6', name: 'Noise-Canceling Headphones', category: 'Audio', price: 299, stock: 150 },
  { id: 'prod_7', name: 'Smart Watch Series 9', category: 'Wearables', price: 399, stock: 95 },
  { id: 'prod_8', name: 'SaaS Enterprise Annual Plan', category: 'Software', price: 1200, stock: 999 },
];

export const MOCK_CUSTOMERS = [
  { id: 'usr_1', name: 'Sarah Jenkins', email: 'sarah.j@acmecorp.com', company: 'Acme Corp', region: 'North America' },
  { id: 'usr_2', name: 'Michael Chen', email: 'm.chen@nexuslab.io', company: 'Nexus Lab', region: 'Asia Pacific' },
  { id: 'usr_3', name: 'Elena Rostova', email: 'elena@techsphere.de', company: 'TechSphere', region: 'Europe' },
  { id: 'usr_4', name: 'David Miller', email: 'd.miller@apexglobal.com', company: 'Apex Global', region: 'North America' },
  { id: 'usr_5', name: 'Amara Okafor', email: 'amara@innovate.ng', company: 'Innovate Africa', region: 'EMEA' },
  { id: 'usr_6', name: 'Carlos Gomez', email: 'carlos@soluciones.es', company: 'Soluciones IT', region: 'Europe' },
  { id: 'usr_7', name: 'Jessica Taylor', email: 'jtaylor@cloudventures.com', company: 'Cloud Ventures', region: 'North America' }
];

export function generateMockOrders() {
  const statuses = ['Completed', 'Completed', 'Completed', 'Shipped', 'Processing', 'Pending', 'Cancelled'];
  const orders = [];
  const now = new Date();

  // Generate 60 orders spread over the last 60 days
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    orderDate.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));

    const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    const customer = MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const amount = product.price * quantity;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    orders.push({
      id: `ORD-${1000 + i}`,
      created_at: orderDate.toISOString(),
      customer_name: customer.name,
      customer_email: customer.email,
      company: customer.company,
      region: customer.region,
      product_name: product.name,
      category: product.category,
      quantity: quantity,
      unit_price: product.price,
      amount: amount,
      status: status
    });
  }

  return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
