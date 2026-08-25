import React, { useState } from 'react';
import { Users, Search, Sparkles } from 'lucide-react';

export default function UsersTable({ users, onOpenSeedModal }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = users.filter(u => 
    !searchTerm ||
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.company && u.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg">Users & Customers Directory</h3>
          <p className="text-xs text-slate-400">Live users table ({users.length} registered customers)</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={onOpenSeedModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seed Users</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Region</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length > 0 ? (
              filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-900/60">
                  <td className="py-3 px-4 font-mono text-indigo-400 font-semibold">{u.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{u.name}</td>
                  <td className="py-3 px-4 text-slate-300">{u.email}</td>
                  <td className="py-3 px-4 text-slate-300">{u.company || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-300">{u.region || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  No users found in database table. Click <strong>Seed Users</strong> to populate!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
