'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Send, Trash2, Copy, Check, Loader2, Shield, Eye, Clock, Ban, RefreshCw, Users, Upload, X, Image } from 'lucide-react';

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
  const [showBulk, setShowBulk] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [bulkCreating, setBulkCreating] = useState(false);
  const [bulkResults, setBulkResults] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBulkImage, setUploadingBulkImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bulkImagePreview, setBulkImagePreview] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    recipient_email: '',
    recipient_name: '',
    invite_type: 'document',
    expires_hours: 72,
    max_views: 10,
    content_title: '',
    content_message: '',
    image_url: '',
  });

  // Bulk form state
  const [bulkForm, setBulkForm] = useState({
    recipients_text: '', // CSV format: email,name
    invite_type: 'document',
    expires_hours: 72,
    max_views: 10,
    content_title: '',
    content_message: '',
    image_url: '',
    send_emails: true,
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
          image_url: form.image_url || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowCreate(false);
        setForm({ recipient_email: '', recipient_name: '', invite_type: 'document', expires_hours: 72, max_views: 10, content_title: '', content_message: '', image_url: '' });
        setImagePreview(null);
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

  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkCreating(true);
    setBulkResults(null);

    try {
      // Parse CSV text into recipients array
      const lines = bulkForm.recipients_text.trim().split('\n').filter(line => line.trim());
      const recipients = lines.map(line => {
        const parts = line.split(',').map(p => p.trim());
        return {
          email: parts[0],
          name: parts[1] || null,
        };
      }).filter(r => r.email);

      if (recipients.length === 0) {
        alert('Please add at least one email address');
        setBulkCreating(false);
        return;
      }

      const res = await fetch('/api/invites/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          invite_type: bulkForm.invite_type,
          expires_hours: bulkForm.expires_hours,
          max_views: bulkForm.max_views,
          content_title: bulkForm.content_title,
          content_message: bulkForm.content_message,
          image_url: bulkForm.image_url || null,
          send_emails: bulkForm.send_emails,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBulkResults(data);
        fetchInvites();
        if (data.created === recipients.length) {
          setShowBulk(false);
          setBulkForm({
            recipients_text: '',
            invite_type: 'document',
            expires_hours: 72,
            max_views: 10,
            content_title: '',
            content_message: '',
            image_url: '',
            send_emails: true,
          });
          setBulkImagePreview(null);
        }
      }
    } catch (err) {
      console.error('Bulk create failed:', err);
    } finally {
      setBulkCreating(false);
    }
  };

  const handleImageUpload = async (file: File, isBulk: boolean = false) => {
    if (isBulk) {
      setUploadingBulkImage(true);
    } else {
      setUploadingImage(true);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/invites/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        if (isBulk) {
          setBulkForm({ ...bulkForm, image_url: data.url });
          setBulkImagePreview(data.url);
        } else {
          setForm({ ...form, image_url: data.url });
          setImagePreview(data.url);
        }
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image');
    } finally {
      if (isBulk) {
        setUploadingBulkImage(false);
      } else {
        setUploadingImage(false);
      }
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
          <button
            onClick={() => setShowBulk(!showBulk)}
            className="bg-white/10 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Bulk Invite
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
              <div className="md:col-span-2">
                <label className="text-white/70 text-sm block mb-2">Image (optional)</label>
                {!imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, false);
                      }}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#00e87e]/50 transition ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-8 h-8 text-[#00e87e] animate-spin mb-2" />
                          <p className="text-white/50 text-sm">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-white/40 mb-2" />
                          <p className="text-white/60 text-sm">Click to upload image</p>
                          <p className="text-white/40 text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setForm({ ...form, image_url: '' });
                      }}
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full p-1.5 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
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

        {/* Bulk Invite Form */}
        {showBulk && (
          <div className="glass-card p-6 mb-8 border border-blue-500/20">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Bulk Invite Sender
            </h3>
            <form onSubmit={handleBulkCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-white/70 text-sm block mb-1">Recipients (CSV: email,name - one per line)</label>
                <textarea
                  value={bulkForm.recipients_text}
                  onChange={(e) => setBulkForm({ ...bulkForm, recipients_text: e.target.value })}
                  placeholder="john@example.com, John Smith&#10;jane@example.com, Jane Doe&#10;bob@example.com, Bob Johnson"
                  rows={6}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 font-mono resize-none"
                />
                <p className="text-white/40 text-xs mt-1">Format: email,name (one per line). Name is optional.</p>
              </div>
              <div>
                <label className="text-white/70 text-sm block mb-1">Invite Type</label>
                <select
                  value={bulkForm.invite_type}
                  onChange={(e) => setBulkForm({ ...bulkForm, invite_type: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
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
                    value={bulkForm.expires_hours}
                    onChange={(e) => setBulkForm({ ...bulkForm, expires_hours: parseInt(e.target.value) || 72 })}
                    min={1}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm block mb-1">Max Views</label>
                  <input
                    type="number"
                    value={bulkForm.max_views}
                    onChange={(e) => setBulkForm({ ...bulkForm, max_views: parseInt(e.target.value) || 10 })}
                    min={1}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-white/70 text-sm block mb-1">Content Title (Email Subject)</label>
                <input
                  type="text"
                  value={bulkForm.content_title}
                  onChange={(e) => setBulkForm({ ...bulkForm, content_title: e.target.value })}
                  placeholder="e.g. Project Proposal - Confidential"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-white/70 text-sm block mb-1">Content Message (Email Body)</label>
                <textarea
                  value={bulkForm.content_message}
                  onChange={(e) => setBulkForm({ ...bulkForm, content_message: e.target.value })}
                  placeholder="The content the recipient will see after verification..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-white/70 text-sm block mb-2">Image (optional)</label>
                {!bulkImagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, true);
                      }}
                      className="hidden"
                      id="bulk-image-upload"
                      disabled={uploadingBulkImage}
                    />
                    <label
                      htmlFor="bulk-image-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-blue-500/50 transition ${uploadingBulkImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadingBulkImage ? (
                        <>
                          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                          <p className="text-white/50 text-sm">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-white/40 mb-2" />
                          <p className="text-white/60 text-sm">Click to upload image</p>
                          <p className="text-white/40 text-xs mt-1">Same image for all recipients · PNG, JPG, GIF up to 5MB</p>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img src={bulkImagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setBulkImagePreview(null);
                        setBulkForm({ ...bulkForm, image_url: '' });
                      }}
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full p-1.5 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="send_emails"
                  checked={bulkForm.send_emails}
                  onChange={(e) => setBulkForm({ ...bulkForm, send_emails: e.target.checked })}
                  className="w-4 h-4 rounded bg-white/10 border-white/20"
                />
                <label htmlFor="send_emails" className="text-white/70 text-sm">Send invite links via email to all recipients</label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={bulkCreating}
                  className="bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-500/90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {bulkCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Create Bulk Invites
                </button>
                <button
                  type="button"
                  onClick={() => { setShowBulk(false); setBulkResults(null); }}
                  className="text-white/50 hover:text-white px-4 py-2 transition"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Bulk Results */}
            {bulkResults && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-white font-medium mb-3">Bulk Invite Results</h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{bulkResults.total}</p>
                    <p className="text-white/50 text-xs">Total</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-3 text-center border border-green-500/20">
                    <p className="text-2xl font-bold text-green-400">{bulkResults.created}</p>
                    <p className="text-green-400/70 text-xs">Created</p>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-3 text-center border border-red-500/20">
                    <p className="text-2xl font-bold text-red-400">{bulkResults.failed}</p>
                    <p className="text-red-400/70 text-xs">Failed</p>
                  </div>
                </div>
                {bulkResults.errors && bulkResults.errors.length > 0 && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm font-medium mb-2">Errors:</p>
                    <ul className="text-red-400/70 text-xs space-y-1">
                      {bulkResults.errors.map((err: any, i: number) => (
                        <li key={i}>{err.email}: {err.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
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
