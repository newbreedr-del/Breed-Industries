import { NextRequest, NextResponse } from 'next/server';
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
