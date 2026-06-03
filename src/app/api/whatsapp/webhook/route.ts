import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { notifyAdmin } from '@/lib/whatsapp';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    console.log('[WA Webhook]', event, JSON.stringify(body).slice(0, 200));

    // ── Inbound text message ─────────────────────────────────────────────────
    if ((event === 'MESSAGES_UPSERT' || event === 'messages.upsert') && data) {
      const phone = (data.key?.remoteJid ?? '').replace('@s.whatsapp.net', '').replace('@c.us', '');
      const fromMe: boolean = data.key?.fromMe ?? false;
      const text: string =
        data.message?.conversation ??
        data.message?.extendedTextMessage?.text ??
        '';
      const pushName: string = data.pushName ?? '';

      if (!fromMe && phone && text) {
        console.log(`[WA Webhook] Inbound from ${pushName || phone}: ${text}`);

        try {
          await supabaseAdmin.from('whatsapp_messages').insert({
            direction: 'inbound',
            phone,
            message: text.slice(0, 2000),
            status: 'received',
            sender_name: pushName || null,
          });
        } catch { /* non-critical */ }

        // Alert admin about inbound message so it can be actioned
        await notifyAdmin(`💬 *Inbound WhatsApp*\nFrom: ${pushName || phone}\nNumber: ${phone}\n\n"${text.slice(0, 300)}"`);
      }
    }

    // ── Connection state events ──────────────────────────────────────────────
    if (event === 'CONNECTION_UPDATE' || event === 'connection.update') {
      const state = data?.state ?? data?.instance?.state;
      console.log('[WA Webhook] Connection state:', state);

      if (state === 'open') {
        console.log('[WA Webhook] ✅ WhatsApp connected');
      } else if (state === 'close') {
        console.warn('[WA Webhook] ⚠️ WhatsApp disconnected');
        await notifyAdmin('⚠️ *Breed Agent Disconnected*\nWhatsApp session dropped. Check the admin panel at /admin/whatsapp to reconnect.').catch(() => {});
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[WA Webhook] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
