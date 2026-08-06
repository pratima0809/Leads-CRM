import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }
    const broadcasts = await db.broadcast.findMany({
      where: { orgId: org.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(broadcasts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, audience, templateId, message, scheduledAt } = body;

    if (!name || !message) {
      return NextResponse.json({ error: 'name and message are required' }, { status: 400 });
    }

    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const broadcast = await db.broadcast.create({
      data: {
        name,
        audience: audience || 'ALL_LEADS',
        templateId: templateId || null,
        message,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        scheduledAt: scheduledAt || null,
        orgId: org.id,
      },
    });

    await db.activity.create({
      data: {
        type: 'NOTE',
        subject: 'Broadcast Created',
        content: `Broadcast campaign created: ${name}`,
        orgId: org.id,
      },
    });

    return NextResponse.json({ broadcast, message: 'Broadcast created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
