'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Send, Trash2, Copy, Check, Loader2, Shield, Eye, Clock, Ban, RefreshCw } from 'lucide-react';

interface Invite {
  id: string;
  token: string;
  recipient_email: string;
  recipient_name: string | null;
  invite_type: string;
  content: any;
  device_fingerprint: string | null;
  status: string;
  expires_at: string;
  verified_at: string | null;
  view_count: number;
  max_views: number;
  created_at: string;
}

export default function AdminInvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Form state
  const [form, setForm] = useState({
    recipient_email: '',
    recipient_name: '',
    invite_type: 'document',
    expires_hours: 72,
    max_views: 10,
    content_title: '',
    content_message: '',
  });

  const fetchInvites = async () => {
    try {
      const res = await fetch('/api/invites');
      const data = await res.json();
      if (data.invites) setInvites(data.invites);
    } catch (err) {
      console.error('Failed to fetch invites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_email: form.recipient_email,
          recipient_name: form.recipient_name || null,
          invite_type: form.invite_type,
          expires_hours: form.expires_hours,
          max_views: form.max_views,
          content: {
            title: form.content_title || null,
            message: form.content_message || null,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowCreate(false);
        setForm({ recipient_email: '', recipient_name: '', invite_type: 'document', expires_hours: 72, max_views: 10, content_title: '', content_message: '' });
        fetchInvites();
        // Copy the invite URL
        if (data.invite_url) {
          navigator.clipboard.writeText(data.invite_url);
          setCopiedId(data.invite.id);
          setTimeout(() => setCopiedId(null), 3000);
        }
      }
    } catch (err) {
      console.error('Failed to create invite:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this invite? The recipient will no longer be able to view it.')) return;

    try {
      await fetch('/api/invites', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'revoked' }),
      });
      fetchInvites();
    } catch (err) {
      console.error('Failed to revoke:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this invite?')) return;

    try {
      await fetch(`/api/invites?id=${id}`, { method: 'DELETE' });
      fetchInvites();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const copyLink = (token: string, id: string) => {
    const url = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'verified': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'viewed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'revoked': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'expired': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-white/5 text-white/60 border-white/10';
    }
  };

  const isExpired = (expires_at: string) => new Date(expires_at) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white/50 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Secure Invites</h1>
              <p className="text-white/50 text-sm">Device-locked, single-person invitations</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-[#00e87e] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#00e87e]/90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Invite
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="glass-card p-6 mb-8 border border-[#00e87e]/20">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00e87e]" />
              Create Secure Invite
            </h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/70 text-sm block mb-1">Recipient Email *</label>
                <input
                  type="email"
                  value={form.recipient_email}
                  onChange={(e) => setForm({ ...form, recipient_email: e.target.value })}
                  required
                  placeholder="client@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#00e87e]/50"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm block mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={form.recipient_name}
                  onChange={(e) => setForm({ ...form, recipient_name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#00e87e]/50"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm block mb-1">Invite Type</label>
                <select
                  value={form.invite_type}
                  onChange={(e) => setForm({ ...form, invite_type: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00e87e]/50"
                >
                  <option value="document">Document</option>
                  <option value="proposal">Proposal</option>
                  <option value="quote">Quote</option>
                  <option value="contract">Contract</option>
                  <option value="confidential">Confidential</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 text-sm block mb-1">Expires (hours)</label>
                  <input
                    type="number"
                    value={form.expires_hours}
                    onChange={(e) => setForm({ ...form, expires_hours: parseInt(e.target.value) || 72 })}
                    min={1}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00e87e]/50"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm block mb-1">Max Views</label>
                  <input
                    type="number"
                    value={form.max_views}
                    onChange={(e) => setForm({ ...form, max_views: parseInt(e.target.value) || 10 })}
                    min={1}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00e87e]/50"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-white/70 text-sm block mb-1">Content Title</label>
                <input
                  type="text"
                  value={form.content_title}
                  onChange={(e) => setForm({ ...form, content_title: e.target.value })}
                  placeholder="e.g. Project Proposal - Confidential"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#00e87e]/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-white/70 text-sm block mb-1">Content Message</label>
                <textarea
                  value={form.content_message}
                  onChange={(e) => setForm({ ...form, content_message: e.target.value })}
                  placeholder="The content the recipient will see after verification..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#00e87e]/50 resize-none"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-[#00e87e] text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-[#00e87e]/90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Create & Copy Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="text-white/50 hover:text-white px-4 py-2 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Invites List */}
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-[#00e87e] animate-spin mx-auto" />
          </div>
        ) : invites.length === 0 ? (
          <div className="text-center py-16 glass-card">
            <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-white/60 font-medium">No invites yet</h3>
            <p className="text-white/40 text-sm mt-1">Create your first secure invite above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invites.map((invite) => {
              const expired = isExpired(invite.expires_at);
              const displayStatus = expired && invite.status !== 'revoked' ? 'expired' : invite.status;

              return (
                <div key={invite.id} className="glass-card p-4 border border-white/5 hover:border-white/10 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white/40" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm truncate">
                            {invite.recipient_name || invite.recipient_email}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(displayStatus)}`}>
                            {displayStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-white/40 text-xs">{invite.recipient_email}</span>
                          <span className="text-white/30 text-xs">·</span>
                          <span className="text-white/40 text-xs flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {invite.view_count}/{invite.max_views}
                          </span>
                          <span className="text-white/30 text-xs">·</span>
                          <span className="text-white/40 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {expired ? 'Expired' : `Expires ${new Date(invite.expires_at).toLocaleDateString()}`}
                          </span>
                          {invite.device_fingerprint && (
                            <>
                              <span className="text-white/30 text-xs">·</span>
                              <span className="text-[#00e87e]/60 text-xs">🔒 Device locked</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={() => copyLink(invite.token, invite.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-white/60 hover:text-white"
                        title="Copy invite link"
                      >
                        {copiedId === invite.id ? <Check className="w-4 h-4 text-[#00e87e]" /> : <Copy className="w-4 h-4" />}
                      </button>
                      {invite.status !== 'revoked' && !expired && (
                        <button
                          onClick={() => handleRevoke(invite.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 transition text-white/60 hover:text-red-400"
                          title="Revoke invite"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(invite.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 transition text-white/60 hover:text-red-400"
                        title="Delete invite"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Refresh */}
        <div className="text-center mt-6">
          <button
            onClick={fetchInvites}
            className="text-white/40 hover:text-white/70 text-sm flex items-center gap-1.5 mx-auto transition"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
