import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KpiCards({ orders }) {
  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Category breakdown calculation
  const categoryTotals = {};
  orders.forEach(o => {
    const cat = o.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(o.amount) || 0);
  });

  let topCategory = 'N/A';
  let topCatAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > topCatAmount) {
      topCatAmount = amt;
      topCategory = cat;
    }
  });

  const topCatShare = totalRevenue > 0 ? Math.round((topCatAmount / totalRevenue) * 100) : 0;

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+14.2%',
      isPositive: true,
      subtext: 'vs. previous 30 days',
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400'
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: `${completedOrders} Completed`,
      isPositive: true,
      subtext: `${Math.round((completedOrders / (totalOrders || 1)) * 100)}% fulfillment rate`,
      icon: ShoppingBag,
      color: 'from-indigo-500/20 to-blue-500/5 text-indigo-400 border-indigo-500/20',
      iconBg: 'bg-indigo-500/10 text-indigo-400'
    },
    {
      title: 'Average Order Value (AOV)',
      value: `$${avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+6.8%',
      isPositive: true,
      subtext: 'Per completed order',
      icon: TrendingUp,
      color: 'from-purple-500/20 to-pink-500/5 text-purple-400 border-purple-500/20',
      iconBg: 'bg-purple-500/10 text-purple-400'
    },
    {
      title: 'Top Category',
      value: topCategory,
      change: `${topCatShare}% share`,
      isPositive: true,
      subtext: `$${topCatAmount.toLocaleString()} total revenue`,
      icon: Award,
      color: 'from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={index}
            className={`glass-panel glass-card-hover rounded-2xl p-5 border bg-gradient-to-br ${card.color} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                {card.value}
              </div>
              
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`inline-flex items-center font-semibold px-1.5 py-0.5 rounded-md ${
                  card.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {card.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {card.change}
                </span>
                <span className="text-slate-400 truncate">{card.subtext}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
