import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ServiceRequestCreateRequest } from '@/types/serviceRequest';
import { createServiceRequest, getServiceRequests } from '@/lib/serviceRequestStorage';
import { getServiceById } from '@/data/serviceDefinitions';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const serviceId = searchParams.get('serviceId') || undefined;
    const customerEmail = searchParams.get('customerEmail') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const offset = (page - 1) * limit;

    const { requests, total } = await getServiceRequests({
      status,
      serviceId,
      customerEmail,
      limit,
      offset
    });

    return NextResponse.json({
      requests,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ServiceRequestCreateRequest = await request.json();

    if (!body.serviceId || !body.customerName || !body.customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, customerName, customerEmail' },
        { status: 400 }
      );
    }

    const service = getServiceById(body.serviceId);
    if (!service) {
      return NextResponse.json(
        { error: 'Invalid service ID' },
        { status: 400 }
      );
    }

    const serviceRequest = await createServiceRequest({
      ...body,
      serviceName: service.name,
      serviceCategory: service.category
    });

    // Send email alert to admin
    const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
    const COMPANY_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);

        const docsHtml = (body.documents || []).length > 0
          ? `<p style="color:#ccc;margin:0 0 4px;"><strong style="color:#fff;">Documents uploaded:</strong> ${body.documents.map((d: any) => d.documentName || d.fileName).join(', ')}</p>`
          : '<p style="color:#999;margin:0 0 4px;font-size:12px;">No documents uploaded</p>';

        const emailHtml = `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#111;color:#fff;border-radius:8px;overflow:hidden;">
  <div style="background:#c8a96e;padding:20px 30px;">
    <h2 style="margin:0;color:#111;">🔔 New Service Request</h2>
    <p style="margin:6px 0 0;color:#333;font-size:14px;">${service.name} — ${service.category}</p>
  </div>
  <div style="padding:24px 30px;">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="color:#999;padding:5px 0;width:140px;">Client Name</td><td style="color:#fff;">${body.customerName}</td></tr>
      <tr><td style="color:#999;padding:5px 0;">Email</td><td><a href="mailto:${body.customerEmail}" style="color:#c8a96e;">${body.customerEmail}</a></td></tr>
      ${body.customerPhone ? `<tr><td style="color:#999;padding:5px 0;">Phone</td><td style="color:#fff;">${body.customerPhone}</td></tr>` : ''}
      ${body.customerCompany ? `<tr><td style="color:#999;padding:5px 0;">Company</td><td style="color:#fff;">${body.customerCompany}</td></tr>` : ''}
      <tr><td style="color:#999;padding:5px 0;">Service</td><td style="color:#fff;">${service.name}</td></tr>
      <tr><td style="color:#999;padding:5px 0;">Category</td><td style="color:#fff;">${service.category}</td></tr>
      <tr><td style="color:#999;padding:5px 0;">Starting Price</td><td style="color:#c8a96e;font-weight:bold;">${service.basePrice || 'TBC'}</td></tr>
      <tr><td style="color:#999;padding:5px 0;">Request ID</td><td style="color:#fff;font-size:12px;">${serviceRequest.id}</td></tr>
    </table>
    ${body.additionalNotes ? `<div style="background:#1a1a1a;border-left:3px solid #c8a96e;padding:12px 16px;margin-bottom:16px;border-radius:0 6px 6px 0;"><p style="margin:0;color:#ccc;font-size:13px;"><strong style="color:#fff;">Notes:</strong> ${body.additionalNotes}</p></div>` : ''}
    ${docsHtml}
    <div style="margin-top:24px;padding:12px 16px;background:#1a1a1a;border-radius:6px;">
      <p style="margin:0;color:#999;font-size:12px;">Submitted: ${new Date().toLocaleString('en-ZA')}</p>
      <p style="margin:6px 0 0;font-size:13px;"><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.thebreed.co.za'}/admin/service-requests" style="color:#c8a96e;">View in Admin Dashboard →</a></p>
    </div>
  </div>
</div>`;

        const emailResult = await resend.emails.send({
          from: `Breed Industries <${COMPANY_EMAIL}>`,
          to: COMPANY_EMAIL,
          replyTo: body.customerEmail,
          subject: `🔔 New Service Request — ${service.name} from ${body.customerName}`,
          html: emailHtml,
        });
        if (emailResult.error) {
          console.error('Resend error on service request email:', JSON.stringify(emailResult.error));
        } else {
          console.log('✅ Service request notification sent, id:', emailResult.data?.id);
        }
      } catch (emailError) {
        console.error('Failed to send service request email:', emailError instanceof Error ? emailError.message : emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      request: serviceRequest
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating service request:', error);
    return NextResponse.json(
      { error: 'Failed to create service request' },
      { status: 500 }
    );
  }
}
