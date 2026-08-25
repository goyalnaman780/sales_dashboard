import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { SUPABASE_SETUP_SQL, SUPABASE_RLS_FIX_SQL } from '../lib/sqlScripts';
import { SUPABASE_URL } from '../lib/supabase';

export default function SqlSetupModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeScript, setActiveScript] = useState('rls_fix'); // 'rls_fix' | 'full_setup'

  if (!isOpen) return null;

  const currentSql = activeScript === 'rls_fix' ? SUPABASE_RLS_FIX_SQL : SUPABASE_SETUP_SQL;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Supabase Database Setup & RLS Script</h3>
              <p className="text-xs text-slate-400">Run SQL in your Supabase Dashboard SQL Editor</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Script Selection Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveScript('rls_fix')}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeScript === 'rls_fix'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Unlock Existing 2,531+ Rows (SAFE)</span>
          </button>

          <button
            onClick={() => setActiveScript('full_setup')}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeScript === 'full_setup'
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Full DB Rebuild & Fresh Sample Data</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-3 mb-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-indigo-300">
                {activeScript === 'rls_fix' ? '⚡ 1-Step Fix for Your 2,531 Rows:' : 'Quick 2-Step Setup:'}
              </p>
              <ol className="list-decimal list-inside text-slate-400 mt-1 space-y-0.5">
                <li>Click <strong>Copy SQL Code</strong> below.</li>
                <li>Open your Supabase SQL Editor, paste & click <strong>Run</strong>!</li>
              </ol>
            </div>
            <a
              href={sqlEditorUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md whitespace-nowrap"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* SQL Code Block */}
        <div className="relative flex-1 min-h-[220px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400">
              {activeScript === 'rls_fix' ? 'unlock_2531_existing_rows.sql' : 'supabase_sales_setup.sql'}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy SQL Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="flex-1 p-4 overflow-y-auto font-mono text-[11px] text-indigo-200 leading-relaxed">
            {currentSql}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
