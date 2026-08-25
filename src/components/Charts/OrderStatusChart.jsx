import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Layers } from 'lucide-react';

const STATUS_COLORS = {
  Completed: '#10b981', // Emerald
  Shipped: '#3b82f6',   // Blue
  Processing: '#8b5cf6',// Purple
  Pending: '#f59e0b',   // Amber
  Cancelled: '#f43f5e'  // Rose
};

export default function OrderStatusChart({ orders }) {
  const statusMap = { Completed: 0, Shipped: 0, Processing: 0, Pending: 0, Cancelled: 0 };
  orders.forEach(o => {
    const status = o.status || 'Pending';
    statusMap[status] = (statusMap[status] || 0) + 1;
  });

  const chartData = Object.entries(statusMap).map(([status, count]) => ({
    status,
    count
  }));

  return (
    <div className="glass-panel glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-slate-100 text-lg">Order Status Distribution</h3>
        </div>
        <p className="text-xs text-slate-400">Order fulfillment lifecycle breakdown</p>
      </div>

      <div className="w-full h-64 mt-4">
        {orders.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="status" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-panel p-2.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-200">{data.status}</p>
                        <p className="text-indigo-400 font-semibold">{data.count} orders</p>
                      </div>
                    );
                  }
                  return null;
                }} 
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`status-cell-${index}`} 
                    fill={STATUS_COLORS[entry.status] || '#6366f1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No order status data available
          </div>
        )}
      </div>
    </div>
  );
}
