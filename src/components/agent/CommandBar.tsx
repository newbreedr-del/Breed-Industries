'use client';

/**
 * Breed Industries - ⌘K Command Bar (the "whisper" interface)
 * ──────────────────────────────────────────────────────────
 * Press ⌘K (Mac) / Ctrl+K (Windows) anywhere in the admin panel to summon the
 * super-agent. Type a request in plain English:
 *   "how are we doing this month"
 *   "show unpaid invoices"
 *   "mark INV-014 as paid"
 *   "run a tender scrape"
 *   "whatsapp 0821234567 that their documents are ready"
 *
 * Read requests answer instantly. Anything that changes data or sends a message
 * comes back as a confirm card - nothing happens until you click Confirm.
 *
 * Mounted globally via src/app/admin/layout.tsx.
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, CornerDownLeft, Loader2, ShieldCheck, X } from 'lucide-react';

interface PendingAction {
  tool: string;
  description: string;
  args: Record<string, any>;
}

interface Turn {
  role: 'user' | 'agent';
  text: string;
  pending?: PendingAction[];
}

export default function CommandBar() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [lastMessage, setLastMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Global hotkey
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, loading]);

  async function send(message: string, confirm = false) {
    setLoading(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, confirm }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const msg =
          data?.error?.code === 'UNAUTHENTICATED'
            ? 'Your session expired - please sign in again.'
            : data?.error?.message || 'Something went wrong.';
        setTurns((t) => [...t, { role: 'agent', text: msg }]);
        return;
      }
      setTurns((t) => [
        ...t,
        { role: 'agent', text: data.reply, pending: confirm ? [] : data.pendingActions },
      ]);
    } catch {
      setTurns((t) => [...t, { role: 'agent', text: 'Network error - try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    setTurns((t) => [...t, { role: 'user', text: message }]);
    setLastMessage(message);
    setInput('');
    send(message, false);
  }

  function confirmActions() {
    if (!lastMessage) return;
    setTurns((t) => [...t, { role: 'user', text: '✓ Confirmed' }]);
    send(lastMessage, true);
  }

  // Don't surface the agent on the login screen (unauthenticated).
  if (pathname?.startsWith('/admin/login')) return null;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command bar"
        className="fixed bottom-24 right-6 z-[60] flex items-center gap-2 rounded-full bg-[#FF9F00] px-4 py-3 font-heading text-sm font-semibold text-[#0B1118] shadow-lg shadow-black/40 transition hover:scale-105"
      >
        <Sparkles size={18} />
        Ask Agent
        <kbd className="ml-1 rounded bg-black/20 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#121820] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 font-heading text-sm font-semibold text-white">
            <Sparkles size={16} className="text-[#FF9F00]" />
            Operations Agent
          </div>
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Transcript */}
        {turns.length > 0 && (
          <div ref={scrollRef} className="max-h-[42vh] space-y-3 overflow-y-auto px-4 py-4">
            {turns.map((t, i) => (
              <div key={i} className={t.role === 'user' ? 'text-right' : 'text-left'}>
                <div
                  className={
                    t.role === 'user'
                      ? 'inline-block rounded-xl bg-[#FF9F00]/15 px-3 py-2 text-sm text-white'
                      : 'inline-block max-w-full whitespace-pre-wrap rounded-xl bg-white/5 px-3 py-2 text-left text-sm text-white/90'
                  }
                >
                  {t.text}
                </div>

                {t.pending && t.pending.length > 0 && (
                  <div className="mt-2 space-y-2 rounded-xl border border-[#FF9F00]/30 bg-[#FF9F00]/5 p-3 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF9F00]">
                      <ShieldCheck size={14} /> Needs your confirmation
                    </div>
                    {t.pending.map((p, j) => (
                      <div key={j} className="text-sm text-white/90">• {p.description}</div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={confirmActions}
                        disabled={loading}
                        className="rounded-lg bg-[#FF9F00] px-3 py-1.5 text-xs font-semibold text-[#0B1118] hover:opacity-90 disabled:opacity-50"
                      >
                        Confirm &amp; run
                      </button>
                      <button
                        onClick={() => setTurns((cur) => cur.map((x, k) => (k === i ? { ...x, pending: [] } : x)))}
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Loader2 size={14} className="animate-spin" /> Working…
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything… “show unpaid invoices”, “mark INV-014 paid”"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-1 rounded-lg bg-[#FF9F00] px-3 py-1.5 text-xs font-semibold text-[#0B1118] disabled:opacity-40"
          >
            <CornerDownLeft size={14} />
          </button>
        </form>

        {turns.length === 0 && (
          <div className="border-t border-white/5 px-4 py-2 text-[11px] text-white/30">
            Try: “how are we doing this month” · “latest tender matches” · “run a tender scrape”
          </div>
        )}
      </div>
    </div>
  );
}
