import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import KpiCards from './components/KpiCards';
import RevenueChart from './components/Charts/RevenueChart';
import CategoryPieChart from './components/Charts/CategoryPieChart';
import TopProductsChart from './components/Charts/TopProductsChart';
import OrderStatusChart from './components/Charts/OrderStatusChart';
import OrdersTable from './components/OrdersTable';
import ProductsTable from './components/ProductsTable';
import UsersTable from './components/UsersTable';
import DestinationsTable from './components/DestinationsTable';
import TableTabs from './components/TableTabs';
import NewOrderModal from './components/NewOrderModal';
import SqlSetupModal from './components/SqlSetupModal';
import SeedDataModal from './components/SeedDataModal';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import { supabase, fetchAllTablesData } from './lib/supabase';
import { RefreshCw, CheckCircle2, ShieldAlert, Terminal, Settings } from 'lucide-react';

export default function App() {
  const [data, setData] = useState({
    orders: [],
    products: [],
    users: [],
    destinations: []
  });

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'users' | 'destinations'
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [dbErrorMessage, setDbErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Modals
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Toggle theme class on body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Main Data Fetcher
  const loadAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchAllTablesData();
      
      // Update state with fetched data (whether live or fallback mock)
      setData({
        orders: res.orders || [],
        products: res.products || [],
        users: res.users || [],
        destinations: res.destinations || []
      });

      if (res.connected) {
        setIsLiveDb(true);
        setDbErrorMessage(null);
      } else {
        setIsLiveDb(false);
        setDbErrorMessage(res.error || 'Supabase host unreachable');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setIsLiveDb(false);
      setDbErrorMessage(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load and Realtime listener
  useEffect(() => {
    loadAllData();

    // Subscribe to Supabase real-time updates across tables
    try {
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          loadAllData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn("Realtime subscription inactive:", e.message);
    }
  }, [loadAllData]);

  // Handlers
  const handleOrderAdded = (newOrder) => {
    setData(prev => ({ ...prev, orders: [newOrder, ...prev.orders] }));
  };

  const handleDataSeeded = (seededOrders) => {
    setData(prev => ({ ...prev, orders: seededOrders }));
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Navbar */}
      <Navbar
        dbStatus={{ ordersCount: data.orders.length, productsCount: data.products.length, usersCount: data.users.length }}
        onRefresh={loadAllData}
        onOpenNewOrder={() => setIsNewOrderOpen(true)}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenSeedModal={() => setIsSeedModalOpen(true)}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isRefreshing={isRefreshing}
        isLiveDb={isLiveDb}
        globalSearchTerm={globalSearchTerm}
        setGlobalSearchTerm={setGlobalSearchTerm}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Connection Banner */}
        {isLiveDb ? (
          <div className="glass-panel rounded-2xl border border-emerald-500/30 p-4 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 mt-0.5 sm:mt-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-200 text-sm">Supabase Database Connected Live</h4>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  Fetching live tables: <strong className="text-white">orders</strong> ({data.orders.length} rows), <strong className="text-white">destinations</strong> ({data.destinations.length} rows), <strong className="text-white">products</strong> ({data.products.length} rows), <strong className="text-white">users</strong> ({data.users.length} rows).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-indigo-400" />
                <span>Config Credentials</span>
              </button>

              <button
                onClick={() => setIsSqlModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>SQL Editor Script</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-amber-500/30 p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5 sm:mt-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-amber-200 text-sm">Offline / Fallback Analytics Mode Active</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    Supabase Host Unreachable
                  </span>
                </div>
                <p className="text-xs text-amber-300/80 mt-0.5 leading-relaxed">
                  {dbErrorMessage ? `Reason: ${dbErrorMessage}. ` : ''}
                  Currently rendering local fallback sales analytics. Enter your live Supabase URL & Anon Key to connect.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configure Credentials</span>
              </button>

              <button
                onClick={() => setIsSqlModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-200 font-semibold text-xs border border-amber-500/30 transition-colors flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>SQL Setup</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton or Dashboard Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium text-slate-400">Fetching live database telemetry from Supabase...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards Header */}
            <KpiCards orders={data.orders} />

            {/* Main Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart orders={data.orders} />
              </div>
              <div>
                <CategoryPieChart orders={data.orders} />
              </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopProductsChart orders={data.orders} />
              <OrderStatusChart orders={data.orders} />
            </div>

            {/* Table Navigation & Table Views */}
            <div className="space-y-4">
              <TableTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                counts={{
                  orders: data.orders.length,
                  products: data.products.length,
                  users: data.users.length,
                  destinations: data.destinations.length
                }}
              />

              {activeTab === 'orders' && <OrdersTable orders={data.orders} globalSearchTerm={globalSearchTerm} />}
              {activeTab === 'products' && <ProductsTable products={data.products} onOpenSeedModal={() => setIsSeedModalOpen(true)} />}
              {activeTab === 'users' && <UsersTable users={data.users} onOpenSeedModal={() => setIsSeedModalOpen(true)} />}
              {activeTab === 'destinations' && <DestinationsTable destinations={data.destinations} onRefresh={loadAllData} />}
            </div>
          </>
        )}

      </main>

      {/* Modals */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onOrderAdded={handleOrderAdded}
      />

      <SqlSetupModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      <SeedDataModal
        isOpen={isSeedModalOpen}
        onClose={() => setIsSeedModalOpen(false)}
        onDataSeeded={handleDataSeeded}
      />

      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSaveSuccess={loadAllData}
      />

    </div>
  );
}

