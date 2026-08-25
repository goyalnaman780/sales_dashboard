import React from 'react';
import { ShoppingBag, Package, Users, MapPin } from 'lucide-react';

export default function TableTabs({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: counts.orders },
    { id: 'products', label: 'Products', icon: Package, count: counts.products },
    { id: 'users', label: 'Users', icon: Users, count: counts.users },
    { id: 'destinations', label: 'Destinations', icon: MapPin, count: counts.destinations },
  ];

  return (
    <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 w-fit">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              isActive ? 'bg-indigo-500/40 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
