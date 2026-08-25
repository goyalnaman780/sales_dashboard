import React, { useState } from 'react';
import { X, Plus, DollarSign, Package, User, Building, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function NewOrderModal({ isOpen, onClose, onOrderAdded }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    company: '',
    region: 'North America',
    product_name: 'MacBook Pro 16"',
    category: 'Electronics',
    quantity: 1,
    unit_price: 2499,
    status: 'Completed'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const amount = Number(formData.quantity) * Number(formData.unit_price);
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
      customer_name: formData.customer_name || 'Valued Customer',
      customer_email: formData.customer_email || 'client@example.com',
      company: formData.company || 'Enterprise Corp',
      region: formData.region,
      product_name: formData.product_name,
      category: formData.category,
      quantity: Number(formData.quantity),
      unit_price: Number(formData.unit_price),
      amount: amount,
      status: formData.status
    };

    try {
      // Attempt insert into Supabase
      const { data, error } = await supabase.from('orders').insert([newOrder]).select();
      
      if (error) {
        console.warn("Supabase insert warning/error:", error.message);
        // If RLS blocked, fallback to notifying user & updating local state
        if (error.code === '42501' || error.message.includes('policy')) {
          setErrorMsg("Note: Supabase RLS is restricting public insert. Added to local session state! (Run SQL Setup to fix database permissions).");
        } else {
          setErrorMsg(`Database message: ${error.message}`);
        }
      }

      onOrderAdded(newOrder);

      if (!error) {
        onClose();
      }
    } catch (err) {
      onOrderAdded(newOrder);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Create New Sales Order</h3>
              <p className="text-xs text-slate-400">Insert real-time record into Supabase orders table</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Customer Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alice Smith"
                  value={formData.customer_name}
                  onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Company / Email</label>
              <div className="relative">
                <Building className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Product & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Product Name</label>
              <div className="relative">
                <Package className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraWide Monitor"
                  value={formData.product_name}
                  onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Software">Software</option>
                <option value="Audio">Audio</option>
                <option value="Wearables">Wearables</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>

          {/* Price, Quantity, Region, Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.unit_price}
                onChange={e => setFormData({ ...formData, unit_price: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Region</label>
              <select
                value={formData.region}
                onChange={e => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-2 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="North America">NA</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">APAC</option>
                <option value="EMEA">EMEA</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-2 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Completed">Completed</option>
                <option value="Shipped">Shipped</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="text-slate-400">
              Total Amount: <span className="font-extrabold text-emerald-400 text-sm">${(formData.quantity * formData.unit_price).toLocaleString()}</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                {loading ? 'Submitting...' : 'Save Order'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
