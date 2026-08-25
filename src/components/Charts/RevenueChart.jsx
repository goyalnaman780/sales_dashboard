import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Calendar, DollarSign, ShoppingCart } from 'lucide-react';

export default function RevenueChart({ orders }) {
  const [metric, setMetric] = useState('revenue'); // 'revenue' | 'orders'

  // Aggregate orders by date (YYYY-MM-DD)
  const aggregatedMap = {};
  orders.forEach(o => {
    if (!o.created_at) return;
    const dateStr = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!aggregatedMap[dateStr]) {
      aggregatedMap[dateStr] = { date: dateStr, revenue: 0, ordersCount: 0, rawDate: new Date(o.created_at) };
    }
    aggregatedMap[dateStr].revenue += Number(o.amount) || 0;
    aggregatedMap[dateStr].ordersCount += 1;
  });

  const chartData = Object.values(aggregatedMap)
    .sort((a, b) => a.rawDate - b.rawDate);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-slate-700 shadow-2xl text-xs space-y-1">
          <p className="font-bold text-slate-200 border-b border-slate-700/60 pb-1">{label}</p>
          <p className="text-emerald-400 font-semibold flex items-center justify-between gap-4">
            <span>Revenue:</span>
            <span>${data.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </p>
          <p className="text-indigo-400 font-semibold flex items-center justify-between gap-4">
            <span>Orders Count:</span>
            <span>{data.ordersCount} orders</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between h-full">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-lg">Sales Performance Trend</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Revenue & volume breakdown over time</p>
        </div>

        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMetric('revenue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              metric === 'revenue' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue</span>
          </button>
          <button
            onClick={() => setMetric('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              metric === 'orders' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Order Volume</span>
          </button>
        </div>
      </div>

      {/* Chart Render */}
      <div className="w-full h-72">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(v) => metric === 'revenue' ? `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}` : v}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {metric === 'revenue' ? (
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              ) : (
                <Area 
                  type="monotone" 
                  dataKey="ordersCount" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorOrders)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No date data available to chart
          </div>
        )}
      </div>

    </div>
  );
}
