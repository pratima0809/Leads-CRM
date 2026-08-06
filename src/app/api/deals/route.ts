import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pipeline = searchParams.get('pipeline');

    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const where: any = { orgId: org.id };
    if (pipeline && pipeline !== 'all') {
      const pipe = await db.pipeline.findFirst({
        where: { orgId: org.id, name: { contains: pipeline === 'direct' ? 'Direct' : 'Partner' } },
      });
      if (pipe) where.pipelineId = pipe.id;
    }

    const deals = await db.deal.findMany({
      where,
      include: { contact: true, stage: true, pipeline: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(deals);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, value, contactId, pipelineId, stageId, expectedCloseDate, probability, note, assignedUserId } = body;

    if (!name || !contactId || !pipelineId || !stageId) {
      return NextResponse.json({ error: 'name, contactId, pipelineId, and stageId are required' }, { status: 400 });
    }

    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const deal = await db.deal.create({
      data: {
        name,
        value: value ?? 0,
        status: 'OPEN',
        expectedCloseDate: expectedCloseDate || null,
        probability: probability ?? 0,
        note: note || null,
        aiHealthStatus: 'HOT',
        orgId: org.id,
        contactId,
        pipelineId,
        stageId,
        assignedUserId: assignedUserId || null,
      },
    });

    await db.activity.create({
      data: {
        type: 'NOTE',
        subject: 'Deal Created',
        content: `New deal created: ${name} (₹${(value || 0).toLocaleString()})`,
        orgId: org.id,
        contactId,
      },
    });

    return NextResponse.json({ deal, message: 'Deal created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
