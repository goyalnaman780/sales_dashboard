import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  CheckCircle, 
  Truck, 
  Clock, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  PackageCheck,
  X
} from 'lucide-react';

const STATUS_BADGES = {
  Completed: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  Shipped: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Truck },
  Processing: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: PackageCheck },
  Pending: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
  Cancelled: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: XCircle },
};

export default function OrdersTable({ orders, globalSearchTerm = '' }) {
  const [searchTerm, setSearchTerm] = useState(globalSearchTerm);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sync global search term if provided
  React.useEffect(() => {
    if (globalSearchTerm !== undefined) {
      setSearchTerm(globalSearchTerm);
      setCurrentPage(1);
    }
  }, [globalSearchTerm]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(orders.map(o => o.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [orders]);

  // Filtering & Sorting
  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return orders.filter(order => {
      const matchesSearch = 
        !term ||
        (order.id && String(order.id).toLowerCase().includes(term)) ||
        (order.customer_name && String(order.customer_name).toLowerCase().includes(term)) ||
        (order.customer_email && String(order.customer_email).toLowerCase().includes(term)) ||
        (order.product_name && String(order.product_name).toLowerCase().includes(term)) ||
        (order.company && String(order.company).toLowerCase().includes(term)) ||
        (order.region && String(order.region).toLowerCase().includes(term)) ||
        (order.category && String(order.category).toLowerCase().includes(term)) ||
        (order.status && String(order.status).toLowerCase().includes(term)) ||
        (order.amount !== undefined && String(order.amount).includes(term));

      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || order.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'amount' || sortField === 'quantity') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (sortField === 'created_at') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, searchTerm, statusFilter, categoryFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (filteredOrders.length === 0) return;
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Company', 'Product', 'Category', 'Quantity', 'Amount', 'Status'];
    const rows = filteredOrders.map(o => [
      o.id,
      new Date(o.created_at).toISOString().split('T')[0],
      `"${o.customer_name || ''}"`,
      `"${o.customer_email || ''}"`,
      `"${o.company || ''}"`,
      `"${o.product_name || ''}"`,
      `"${o.category || ''}"`,
      o.quantity,
      o.amount,
      o.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6">
      
      {/* Header controls & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-slate-100 text-lg">Detailed Sales Transactions</h3>
          <p className="text-xs text-slate-400">Showing {filteredOrders.length} orders from Supabase database</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] sm:w-72 flex items-center">
            <button 
              type="button"
              onClick={() => setCurrentPage(1)}
              className="absolute left-3 text-slate-400 hover:text-indigo-400 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Search order, customer, product..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              onKeyDown={(e) => { if (e.key === 'Enter') setCurrentPage(1); }}
              className="w-full pl-9 pr-8 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                className="absolute right-2.5 text-slate-400 hover:text-white p-1"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Statuses</option>
              <option value="Completed" className="bg-slate-900 text-slate-200">Completed</option>
              <option value="Shipped" className="bg-slate-900 text-slate-200">Shipped</option>
              <option value="Processing" className="bg-slate-900 text-slate-200">Processing</option>
              <option value="Pending" className="bg-slate-900 text-slate-200">Pending</option>
              <option value="Cancelled" className="bg-slate-900 text-slate-200">Cancelled</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              {categories.map(c => (
                <option key={c} value={c} className="bg-slate-900 text-slate-200">
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/95 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  <span>Order ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('created_at')}>
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('customer_name')}>
                <div className="flex items-center gap-1">
                  <span>Customer</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('product_name')}>
                <div className="flex items-center gap-1">
                  <span>Product & Category</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('amount')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center cursor-pointer hover:text-white" onClick={() => handleSort('status')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => {
                const badge = STATUS_BADGES[order.status] || STATUS_BADGES.Pending;
                const StatusIcon = badge.icon;
                const formattedDate = order.created_at 
                  ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'N/A';

                return (
                  <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-400">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {formattedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{order.customer_name || 'Anonymous'}</div>
                      <div className="text-[11px] text-slate-400">{order.company || order.customer_email || 'Direct Sales'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{order.product_name}</div>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                        {order.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-extrabold text-emerald-400">
                        ${(Number(order.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400">Qty: {order.quantity || 1}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${badge.bg}`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                  No sales orders match your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">{filteredOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="font-semibold text-white">{filteredOrders.length}</span> results
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-slate-300 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
