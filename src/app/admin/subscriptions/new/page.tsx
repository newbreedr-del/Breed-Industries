'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, CheckCircle, Users } from 'lucide-react';

interface CRMClient {
  id: string;
  contact_name: string;
  company_name: string;
  email: string;
  contact_phone: string;
}

export default function NewSubscription() {
  const router = useRouter();
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    client_id: '',
    plan_type: 'basic',
    amount: 500,
    frequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    start_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/crm/clients?limit=100');
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        alert('Subscription created successfully!');
        router.push('/admin/subscriptions');
      } else {
        const error = await res.json();
        alert('Failed: ' + error.message);
      }
    } catch (err) {
      alert('Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  const selectedClient = clients.find(c => c.id === form.client_id);

  return (
    <div className="min-h-screen bg-[#0d1117] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/subscriptions" 
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Subscriptions
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">New Subscription</h1>
          </div>
          <p className="text-gray-400">Create a new recurring subscription for a client</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-xl p-6 space-y-6">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Client *
            </label>
            <select
              value={form.client_id}
              onChange={(e) => setForm({...form, client_id: e.target.value})}
              required
              className="w-full px-4 py-3 bg-slate-700 rounded-lg text-white border border-slate-600 focus:border-green-500 focus:outline-none"
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.contact_name} {client.company_name && `(${client.company_name})`}
                </option>
              ))}
            </select>
          </div>

          {selectedClient && (
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-gray-400">Selected Client:</p>
              <p className="font-medium text-white">{selectedClient.contact_name}</p>
              <p className="text-sm text-gray-400">{selectedClient.email}</p>
              <p className="text-sm text-gray-400">{selectedClient.contact_phone}</p>
            </div>
          )}

          {/* Plan Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Plan Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'basic', label: 'Basic', price: 500 },
                { value: 'standard', label: 'Standard', price: 1000 },
                { value: 'premium', label: 'Premium', price: 2500 }
              ].map(plan => (
                <button
                  key={plan.value}
                  type="button"
                  onClick={() => setForm({...form, plan_type: plan.value, amount: plan.price})}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    form.plan_type === plan.value
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : 'border-slate-600 bg-slate-700 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  <p className="font-medium">{plan.label}</p>
                  <p className="text-sm">R{plan.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (R) *
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({...form, amount: parseInt(e.target.value) || 0})}
              min={100}
              required
              className="w-full px-4 py-3 bg-slate-700 rounded-lg text-white border border-slate-600 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Billing Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Billing Frequency *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' }
              ].map(freq => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setForm({...form, frequency: freq.value as any})}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    form.frequency === freq.value
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-slate-600 bg-slate-700 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({...form, start_date: e.target.value})}
              required
              className="w-full px-4 py-3 bg-slate-700 rounded-lg text-white border border-slate-600 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Summary */}
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-white mb-2">Subscription Summary</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-400">
                Client: <span className="text-white">{selectedClient?.contact_name || 'Not selected'}</span>
              </p>
              <p className="text-gray-400">
                Plan: <span className="text-white capitalize">{form.plan_type}</span>
              </p>
              <p className="text-gray-400">
                Amount: <span className="text-white">R{form.amount} / {form.frequency}</span>
              </p>
              <p className="text-gray-400">
                Starts: <span className="text-white">{form.start_date}</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/admin/subscriptions"
              className="flex-1 px-4 py-3 bg-slate-700 rounded-lg text-center hover:bg-slate-600 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !form.client_id}
              className="flex-1 px-4 py-3 bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Create Subscription
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
