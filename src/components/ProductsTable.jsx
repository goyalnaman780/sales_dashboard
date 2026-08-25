import React, { useState } from 'react';
import { Package, Search, Sparkles, X, TrendingUp } from 'lucide-react';

export default function ProductsTable({ products, onOpenSeedModal }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p => 
    !searchTerm ||
    (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.id && String(p.id).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg">Products & Inventory Catalog</h3>
          <p className="text-xs text-slate-400">Showing {filtered.length} products derived live from database orders</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search product name or category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-64"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 text-slate-400 hover:text-white p-1"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={onOpenSeedModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seed Products</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Product ID</th>
              <th className="py-3.5 px-4">Product Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-right">Unit Price</th>
              <th className="py-3.5 px-4 text-center">Orders Count</th>
              <th className="py-3.5 px-4 text-right">Total Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length > 0 ? (
              filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-indigo-400 font-semibold">{p.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2">
                    <Package className="w-4 h-4 text-indigo-400" />
                    <span>{p.name}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-200">
                    ${Number(p.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
                      {p.total_orders || 1} sales
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">
                    ${Number(p.total_revenue || p.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
