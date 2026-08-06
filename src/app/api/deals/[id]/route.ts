import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: Request, context: any) {
  try {
    const body = await request.json();
    const deal = await db.deal.update({
      where: { id: context.params.id },
      data: {
        name: body.name,
        value: body.value,
        status: body.status,
        expectedCloseDate: body.expectedCloseDate,
        probability: body.probability,
        note: body.note,
        stageId: body.stageId,
        aiHealthStatus: body.aiHealthStatus,
      },
    });

    await db.activity.create({
      data: {
        type: 'NOTE',
        subject: 'Deal Updated',
        content: `Deal updated: ${deal.name} — ${body.status || 'updated'}`,
        orgId: deal.orgId,
        contactId: deal.contactId,
      },
    });

    return NextResponse.json({ deal, message: 'Deal updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await db.deal.delete({ where: { id: context.params.id } });
    return NextResponse.json({ message: 'Deal deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
