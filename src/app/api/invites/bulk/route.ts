import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipients, invite_type, expires_hours, max_views, content_title, content_message, send_emails, image_url } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'Recipients list is required' }, { status: 400 });
    }

    const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.thebreed.co.za';
    const results = [];
    const errors = [];

    for (const recipient of recipients) {
      try {
        const email = recipient.email?.toLowerCase().trim();
        const name = recipient.name || null;

        if (!email) {
          errors.push({ email: 'missing', error: 'Email address required' });
          continue;
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');
        const expires_at = new Date(Date.now() + (expires_hours || 72) * 60 * 60 * 1000).toISOString();

        // Create invite
        const { data: invite, error: inviteError } = await supabaseAdmin
          .from('invites')
          .insert({
            token,
            recipient_email: email,
            recipient_name: name,
            invite_type: invite_type || 'document',
            content: {
              title: content_title || null,
              message: content_message || null,
            },
            image_url: image_url || null,
            status: 'pending',
            expires_at,
            max_views: max_views || 10,
            created_by: 'admin',
          })
          .select()
          .single();

        if (inviteError) throw inviteError;

        const invite_url = `${base_url}/invite/${token}`;

        // Send email if requested
        if (send_emails) {
          await resend.emails.send({
            from: 'Breed Industries <info@thebreed.co.za>',
            to: email,
            subject: content_title || 'You have been invited to view a secure document',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #1a1a2e; margin: 0;">Breed Industries</h1>
                  <p style="color: #666; margin-top: 5px;">Secure Invitation</p>
                </div>
                <div style="background: #f8f9fa; border-radius: 12px; padding: 30px;">
                  <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                    ${name ? `Hi ${name},` : 'Hello,'}<br/>
                    ${content_message || 'You have been invited to view a secure document. Please click the button below to access it.'}
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${invite_url}" style="background: #1a1a2e; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                      View Secure Invite
                    </a>
                  </div>
                  <p style="color: #999; font-size: 13px; margin-top: 20px;">
                    This invite is locked to your device and email address. Please verify your identity when opening the link.<br/>
                    Expires in ${expires_hours || 72} hours.
                  </p>
                </div>
                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                  The Breed Industries (PTY) LTD · Reg: 2021/963126/07<br/>
                  12 Kings Road, Pinetown, Durban 3610
                </p>
              </div>
            `,
          });
        }

        results.push({
          email,
          name,
          invite_url,
          status: 'created',
        });
      } catch (err: any) {
        errors.push({
          email: recipient.email || 'unknown',
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      total: recipients.length,
      created: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (err: any) {
    console.error('Bulk invite error:', err);
    return NextResponse.json({ error: 'Bulk invite creation failed' }, { status: 500 });
  }
}
