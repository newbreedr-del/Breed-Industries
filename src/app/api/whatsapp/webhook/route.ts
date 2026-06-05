import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendText, notifyAdmin, formatPhone } from '@/lib/whatsapp';
import { processMessage, isOwner, routeClientMessageToAdmin } from '@/lib/whatsappAgent';

export const runtime = 'nodejs';

// ── Webhook handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    console.log('[WA Webhook]', event, JSON.stringify(body).slice(0, 200));

    // ── Inbound text message ─────────────────────────────────────────────────
    if ((event === 'MESSAGES_UPSERT' || event === 'messages.upsert') && data) {
      const phone: string = (data.key?.remoteJid ?? '').replace('@s.whatsapp.net', '').replace('@c.us', '');
      const fromMe: boolean = data.key?.fromMe ?? false;
      const text: string =
        data.message?.conversation ??
        data.message?.extendedTextMessage?.text ??
        '';
      const pushName: string = data.pushName ?? '';

      if (!fromMe && phone && text) {
        const ownerSending = isOwner(phone);

        // Log to DB
        try {
          await supabaseAdmin.from('whatsapp_messages').insert({
            direction: 'inbound',
            phone,
            message: text.slice(0, 2000),
            status: 'received',
            sender_name: ownerSending ? 'OWNER' : (pushName || null),
          });
        } catch { /* non-critical */ }

        if (ownerSending) {
          // ── Owner / admin message → full AI agent ──────────────────────────
          console.log(`[WA Webhook] 👑 Owner message: ${text.slice(0, 100)}`);

          // Process async — reply as fast as possible
          (async () => {
            try {
              const reply = await processMessage(phone, text, pushName || 'Owner');
              await sendText(phone, reply);
            } catch (err: any) {
              console.error('[WA Webhook] Owner agent error:', err.message);
              await sendText(phone, `❌ *Agent error*\n${err.message}`).catch(() => {});
            }
          })();

        } else {
          // ── Client / unknown message → AI + route to admin if needed ──────
          console.log(`[WA Webhook] 💬 Client message from ${pushName || phone}: ${text.slice(0, 100)}`);

          (async () => {
            try {
              // AI reply to client
              const reply = await processMessage(phone, text, pushName || '');
              await sendText(phone, reply);

              // Also notify admin of every inbound client message
              await routeClientMessageToAdmin(phone, text, pushName || '');
            } catch (err: any) {
              console.error('[WA Webhook] Client agent error:', err.message);
              // Fallback: generic reply + admin notification
              const adminNum = formatPhone(process.env.WHATSAPP_ADMIN_NUMBER ?? '');
              const adminDisplay = adminNum ? `0${adminNum.slice(2)}` : '060 496 4105';
              await sendText(phone,
                `Hi ${pushName || 'there'} 👋\n\nThank you for reaching out to *Breed Industries*!\n\n` +
                `Our team will get back to you shortly.\n\n` +
                `📞 For immediate assistance: *${adminDisplay}*\n` +
                `🌐 *www.thebreed.co.za*\n\n` +
                `_— Breed Industries_`
              ).catch(() => {});
              await notifyAdmin(
                `💬 *Inbound WhatsApp*\nFrom: ${pushName || 'Unknown'}\nNumber: ${phone}\n\n"${text.slice(0, 300)}"\n\n_Reply: SEND ${phone} <message>_`
              ).catch(() => {});
            }
          })();
        }
      }
    }

    // ── Connection state events ──────────────────────────────────────────────
    if (event === 'CONNECTION_UPDATE' || event === 'connection.update') {
      const state = data?.state ?? data?.instance?.state;
      console.log('[WA Webhook] Connection state:', state);
      if (state === 'close') {
        notifyAdmin(
          '⚠️ *Breed Agent Disconnected*\nSession dropped. Go to /admin/whatsapp to reconnect.'
        ).catch(() => {});
      }
      if (state === 'open') {
        notifyAdmin(
          '✅ *Breed Agent Connected*\nWhatsApp session is live. Send me any message to get started!\n\n_Powered by OpenRouter AI_ 🤖'
        ).catch(() => {});
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[WA Webhook] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
