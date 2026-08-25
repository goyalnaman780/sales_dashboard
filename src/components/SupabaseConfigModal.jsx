import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Key, 
  Link, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw, 
  Save, 
  ExternalLink,
  RotateCcw,
  Zap
} from 'lucide-react';
import { getActiveCredentials, updateSupabaseCredentials, resetSupabaseCredentials } from '../lib/supabase';

export default function SupabaseConfigModal({ isOpen, onClose, onSaveSuccess }) {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }

  useEffect(() => {
    if (isOpen) {
      const active = getActiveCredentials();
      setUrl(active.url);
      setAnonKey(active.anonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({ success: false, message: 'Please enter both Supabase URL and Anon Key.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const cleanUrl = url.trim().replace(/\/+$/, '');
    const cleanKey = anonKey.trim();

    try {
      // Test OpenAPI Rest Endpoint
      const res = await fetch(`${cleanUrl}/rest/v1/?apikey=${cleanKey}`, {
        method: 'GET',
        headers: {
          'apikey': cleanKey,
          'Authorization': `Bearer ${cleanKey}`
        }
      });

      if (res.ok) {
        setTestResult({
          success: true,
          message: 'Connection Successful! Valid Supabase Project API endpoint reachability verified.'
        });
      } else {
        const errorText = await res.text();
        setTestResult({
          success: false,
          message: `HTTP ${res.status} ${res.statusText}: ${errorText.substring(0, 100) || 'Invalid Anon Key or Project API disabled.'}`
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: `Connection Failed: ${err.message || 'Host ENOTFOUND. Please verify your Project URL.'}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({ success: false, message: 'Supabase URL and Anon Key cannot be empty.' });
      return;
    }

    const cleanUrl = url.trim().replace(/\/+$/, '');
    const cleanKey = anonKey.trim();

    updateSupabaseCredentials(cleanUrl, cleanKey);
    if (onSaveSuccess) onSaveSuccess();
    onClose();
  };

  const handleReset = () => {
    resetSupabaseCredentials();
    const active = getActiveCredentials();
    setUrl(active.url);
    setAnonKey(active.anonKey);
    setTestResult({
      success: true,
      message: 'Reset credentials to default system values.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Configure Live Supabase Credentials</h3>
              <p className="text-xs text-slate-400">Connect your custom Supabase database project</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Helper Banner */}
        <div className="mb-4 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-indigo-300">Where to find these in Supabase?</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Go to your <strong>Supabase Dashboard</strong> &rarr; <strong>Project Settings</strong> &rarr; <strong>API</strong>.
            </p>
          </div>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shrink-0"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Test Result Message Banner */}
        {testResult && (
          <div className={`mb-4 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            testResult.success 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">{testResult.message}</div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs flex-1">
          
          {/* Supabase URL Input */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Supabase Project URL
            </label>
            <div className="relative">
              <Link className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                required
                placeholder="https://xyzxyz.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Supabase Anon Key Input */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Supabase Anon / Public API Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <textarea
                required
                rows={3}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1 hover:bg-slate-900 transition-colors"
                title="Reset to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save & Connect</span>
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
