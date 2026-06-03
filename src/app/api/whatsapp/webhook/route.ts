import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendText, notifyAdmin, formatPhone, getConnectionState } from '@/lib/whatsapp';

export const runtime = 'nodejs';

// ── Admin command processor ───────────────────────────────────────────────────
// When the admin messages the business number, the agent interprets commands.
//
// Commands:
//   SEND 27820001234 <message>   →  forward message to that number
//   @27820001234 <message>       →  shorthand send
//   STATUS                       →  reply with connection status
//   LIST                         →  list CRM clients with phone numbers
//   HELP                         →  command reference

async function handleAdminCommand(text: string, adminPhone: string): Promise<void> {
  const raw = text.trim();
  const upper = raw.toUpperCase();

  // STATUS
  if (upper === 'STATUS') {
    const state = await getConnectionState();
    await sendText(adminPhone, `🤖 *Breed Agent Status*\nConnection: *${state.state}*\nInstance: breed-agent\n\nReply HELP for commands.`);
    return;
  }

  // HELP
  if (upper === 'HELP') {
    await sendText(adminPhone,
      `🤖 *Breed Agent — Commands*\n\n` +
      `*Send to client:*\nSEND 27820001234 Your message here\n\n` +
      `*Shorthand send:*\n@27820001234 Your message here\n\n` +
      `*List CRM clients:*\nLIST\n\n` +
      `*Connection status:*\nSTATUS\n\n` +
      `*This help:*\nHELP`
    );
    return;
  }

  // LIST — top 20 CRM clients with phones
  if (upper === 'LIST') {
    const { data: clients } = await supabaseAdmin
      .from('crm_clients')
      .select('company_name, contact_name, contact_phone')
      .not('contact_phone', 'is', null)
      .order('company_name')
      .limit(20);

    if (!clients?.length) {
      await sendText(adminPhone, '📋 No CRM clients with phone numbers found.');
      return;
    }

    const lines = clients.map((c, i) => {
      const num = formatPhone(c.contact_phone);
      return `${i + 1}. *${c.company_name || c.contact_name}*\n   ${num}`;
    }).join('\n\n');

    await sendText(adminPhone, `📋 *CRM Clients (${clients.length})*\n\n${lines}\n\n_Use: SEND <number> <message>_`);
    return;
  }

  // SEND <number> <message>
  const sendMatch = raw.match(/^(?:SEND\s+|@)(\+?[\d\s\-]+)\s+([\s\S]+)$/i);
  if (sendMatch) {
    const targetPhone = formatPhone(sendMatch[1].trim());
    const message = sendMatch[2].trim();

    if (!targetPhone || targetPhone.length < 10) {
      await sendText(adminPhone, `❌ Invalid number: "${sendMatch[1].trim()}"\n\nFormat: SEND 27820001234 Your message`);
      return;
    }

    const result = await sendText(targetPhone, message);

    if (result.success) {
      await sendText(adminPhone, `✅ *Sent* to ${targetPhone}\n\n"${message.slice(0, 100)}${message.length > 100 ? '…' : ''}"`);
    } else {
      await sendText(adminPhone, `❌ *Failed* to send to ${targetPhone}\nError: ${result.error}`);
    }
    return;
  }

  // Unknown command — echo back with hint
  await sendText(adminPhone, `🤖 Command not recognised.\nReply *HELP* for a list of commands.\n\nYou said: "${raw.slice(0, 100)}"`);
}

// ── Webhook handler ───────────────────────────────────────────────────────────

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
        const adminNumber = formatPhone(process.env.WHATSAPP_ADMIN_NUMBER ?? '');
        const isAdmin = adminNumber && phone === adminNumber;

        // Log to DB
        try {
          await supabaseAdmin.from('whatsapp_messages').insert({
            direction: 'inbound',
            phone,
            message: text.slice(0, 2000),
            status: 'received',
            sender_name: isAdmin ? 'ADMIN' : (pushName || null),
          });
        } catch { /* non-critical */ }

        if (isAdmin) {
          // Admin messaging the agent — treat as a command
          console.log(`[WA Webhook] 🔑 Admin command: ${text.slice(0, 100)}`);
          handleAdminCommand(text, adminNumber).catch(err =>
            console.error('[WA Webhook] Admin command error:', err.message)
          );
        } else {
          // External client message — auto-reply with admin contact info, then notify admin
          console.log(`[WA Webhook] Inbound from ${pushName || phone}: ${text.slice(0, 100)}`);
          
          // Auto-reply: Tell them to contact admin number
          const adminNumberDisplay = adminNumber ? `0${adminNumber.slice(2)}` : 'admin';
          sendText(phone, 
            `Hi ${pushName || 'there'},\n\n` +
            `This is an automated line for updates and reminders only.\n\n` +
            `For assistance, please contact us directly:\n` +
            `📞 WhatsApp: ${adminNumberDisplay}\n` +
            `🌐 www.thebreed.co.za\n\n` +
            `— Breed Industries`
          ).catch(() => {});
          
          // Notify admin about the message
          notifyAdmin(
            `💬 *Inbound WhatsApp*\nFrom: ${pushName || 'Unknown'}\nNumber: ${phone}\n\n"${text.slice(0, 300)}"\n\n_Reply: SEND ${phone} <your message>_`
          ).catch(() => {});
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
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[WA Webhook] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
