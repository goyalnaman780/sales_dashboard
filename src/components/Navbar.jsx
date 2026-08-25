import React from 'react';
import { 
  TrendingUp, 
  Database, 
  RefreshCw, 
  Plus, 
  Code2, 
  Sparkles, 
  Sun, 
  Moon, 
  ShieldAlert,
  CheckCircle2,
  Search,
  X
} from 'lucide-react';

export default function Navbar({ 
  dbStatus, 
  onRefresh, 
  onOpenNewOrder, 
  onOpenSqlModal, 
  onOpenSeedModal,
  onOpenConfigModal,
  isDarkMode,
  setIsDarkMode,
  isRefreshing,
  isLiveDb,
  globalSearchTerm = '',
  setGlobalSearchTerm = () => {}
}) {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand Logo & Connection Badge */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Naman's Sales Dashboard
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Supabase Live
                </span>
              </div>
              <p className="text-xs text-slate-400">Enterprise Sales Intelligence & Analytics</p>
            </div>
          </div>

          {/* Database Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs">
            {isLiveDb ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Connected ({dbStatus.ordersCount} orders)
                </span>
              </>
            ) : (
              <button
                onClick={onOpenConfigModal}
                className="flex items-center gap-1 text-amber-300 font-medium hover:text-amber-200 transition-colors"
                title="Click to configure Supabase URL & Anon Key"
              >
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                <ShieldAlert className="w-3.5 h-3.5" /> <span>Offline / Mock Mode (Config DB)</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Global Search Bar in Navbar */}
          <div className="relative flex items-center min-w-[180px] sm:min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search all records..."
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {globalSearchTerm && (
              <button
                type="button"
                onClick={() => setGlobalSearchTerm('')}
                className="absolute right-2 text-slate-400 hover:text-white p-0.5"
                title="Clear Search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>

          <button
            onClick={onOpenConfigModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-colors"
            title="Configure Supabase Project URL & Anon Key"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Config DB</span>
          </button>

          <button
            onClick={onOpenSeedModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-colors"
            title="Seed real sample data into Supabase"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Seed DB</span>
          </button>

          <button
            onClick={onOpenSqlModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
            title="View & Copy SQL setup script for Supabase"
          >
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
            <span>SQL Setup</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            title="Toggle Theme Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>

      </div>
    </header>
  );
}

