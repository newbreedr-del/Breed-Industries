/**
 * Breed Industries — Scheduled reminder processor.
 *
 * Finds every `scheduled_reminders` row that is due (status 'pending' and
 * scheduled_at in the past) and sends it via WhatsApp. Recurrence is handled by
 * the DB trigger on the table (it creates the next occurrence when a row flips
 * to 'sent'), so this function only has to send and mark the outcome.
 *
 * Called from:
 *   - /api/cron/daily-ops          (production schedule)
 *   - /api/reminders/process       (manual "run due now" test button)
 */

import { supabaseAdmin } from '@/lib/supabase';
import { sendText, formatPhone } from '@/lib/whatsapp';

export interface ProcessResult {
  due: number;
  sent: number;
  failed: number;
  skippedNoPhone: number;
  details: { id: string; title: string; outcome: string }[];
}

export async function processDueReminders(limit = 200): Promise<ProcessResult> {
  const nowIso = new Date().toISOString();

  const { data: due, error } = await supabaseAdmin
    .from('scheduled_reminders')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', nowIso)
    .order('scheduled_at', { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);

  const res: ProcessResult = { due: due?.length ?? 0, sent: 0, failed: 0, skippedNoPhone: 0, details: [] };

  for (const r of due ?? []) {
    const phone = r.phone_number;
    const message = r.message_text || r.description || r.title;

    if (!phone) {
      res.skippedNoPhone++;
      res.details.push({ id: r.id, title: r.title, outcome: 'skipped (no phone)' });
      continue;
    }

    try {
      const result = await sendText(formatPhone(phone), message);
      if (result.success) {
        // Flip to 'sent' — the DB trigger schedules the next occurrence if recurring.
        await supabaseAdmin
          .from('scheduled_reminders')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            whatsapp_sent: true,
            wa_message_id: result.messageId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', r.id);
        res.sent++;
        res.details.push({ id: r.id, title: r.title, outcome: 'sent' });
      } else {
        await supabaseAdmin
          .from('scheduled_reminders')
          .update({ status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', r.id);
        res.failed++;
        res.details.push({ id: r.id, title: r.title, outcome: `failed: ${result.error ?? 'unknown'}` });
      }
    } catch (e: any) {
      await supabaseAdmin
        .from('scheduled_reminders')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', r.id);
      res.failed++;
      res.details.push({ id: r.id, title: r.title, outcome: `error: ${e?.message ?? 'unknown'}` });
    }
  }

  return res;
}
