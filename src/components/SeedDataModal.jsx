import React, { useState } from 'react';
import { X, Sparkles, Check, Database, ShieldAlert } from 'lucide-react';
import { generateMockOrders } from '../lib/mockData';
import { supabase } from '../lib/supabase';

export default function SeedDataModal({ isOpen, onClose, onDataSeeded }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleSeed = async () => {
    setLoading(true);
    setMessage(null);

    const sampleOrders = generateMockOrders();

    try {
      // Attempt insert into Supabase
      const { data, error } = await supabase.from('orders').insert(sampleOrders).select();

      if (error) {
        if (error.code === '42501' || error.message.includes('policy')) {
          setMessage({
            type: 'warning',
            text: 'Supabase RLS policy is active. Seeded 45 orders into local session memory! To persist directly in Supabase, run the SQL Setup script.'
          });
        } else {
          setMessage({ type: 'warning', text: `Database response: ${error.message}` });
        }
      } else {
        setMessage({ type: 'success', text: `Successfully inserted ${data.length} sample orders into Supabase!` });
      }

      onDataSeeded(sampleOrders);
    } catch (err) {
      onDataSeeded(sampleOrders);
      setMessage({ type: 'info', text: 'Seeded sample orders into session storage.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Seed Sample Sales Data</h3>
              <p className="text-xs text-slate-400">Populate 60 realistic orders with categories & metrics</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-xl border text-xs ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
              : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-3 text-xs text-slate-300 mb-6">
          <p>
            This action generates 60 comprehensive sales records spanning Electronics, Furniture, Software, Audio, and Wearables categories across North America, Europe, APAC, and EMEA regions.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Orders to generate:</span>
              <span className="font-bold text-white">60 Records</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Est. Revenue:</span>
              <span className="font-bold text-emerald-400">~$48,000</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Categories:</span>
              <span className="font-bold text-indigo-300">5 Product Lines</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSeed}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
          >
            {loading ? (
              <span>Seeding Data...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inject Sample Data</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
