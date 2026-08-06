import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, context: any) {
  try {
    const lead = await db.lead.findUnique({
      where: { id: context.params.id },
      include: {
        activities: { orderBy: { createdAt: 'desc' }, take: 20 },
        assignedUser: { select: { id: true, name: true, email: true } },
        Chat: {
          include: {
            meetings: { orderBy: { createdAt: 'desc' }, take: 5 },
            notes: { orderBy: { createdAt: 'desc' }, take: 5 },
          },
        },
      },
    });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const body = await request.json();
    const lead = await db.lead.update({
      where: { id: context.params.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        companyName: body.companyName,
        industry: body.industry,
        description: body.description,
        source: body.source,
        score: body.score,
        status: body.status,
        priority: body.priority,
        dealValue: body.dealValue,
      },
    });

    await db.activity.create({
      data: {
        type: 'NOTE',
        subject: 'Lead Updated',
        content: `Lead updated: ${lead.firstName} ${lead.lastName}`,
        orgId: lead.orgId,
        leadId: lead.id,
      },
    });

    return NextResponse.json({ lead, message: 'Lead updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await db.lead.delete({ where: { id: context.params.id } });
    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
