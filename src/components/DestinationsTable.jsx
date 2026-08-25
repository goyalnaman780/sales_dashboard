import React, { useState } from 'react';
import { MapPin, Search, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DestinationsTable({ destinations, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newDestName, setNewDestName] = useState('');
  const [adding, setAdding] = useState(false);

  const filtered = destinations.filter(d => 
    !searchTerm || (d.destination_name && d.destination_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddDestination = async (e) => {
    e.preventDefault();
    if (!newDestName.trim()) return;
    setAdding(true);
    try {
      await supabase.from('destinations').insert([{ destination_name: newDestName.trim() }]);
      setNewDestName('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg">Sales Destinations Table</h3>
          <p className="text-xs text-slate-400">Live destinations table ({destinations.length} records)</p>
        </div>

        <form onSubmit={handleAddDestination} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add new destination..."
            value={newDestName}
            onChange={e => setNewDestName(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={adding}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Destination Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length > 0 ? (
              filtered.map((d, index) => (
                <tr key={index} className="hover:bg-slate-900/60">
                  <td className="py-3 px-4 font-mono text-indigo-400 font-semibold">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{d.destination_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-12 text-center text-slate-500">
                  No destinations found in table. Type a destination name above and click <strong>Add</strong>!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
