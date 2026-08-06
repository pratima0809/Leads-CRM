import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }
    const leads = await db.lead.findMany({
      where: { orgId: org.id },
      orderBy: { score: 'desc' },
      include: { activities: { take: 3, orderBy: { createdAt: 'desc' } } },
    });
    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName, lastName, email, phone, companyName, industry, description,
      source, score, status, priority, dealValue, assignedUserId,
    } = body;

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'firstName and lastName are required' }, { status: 400 });
    }

    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        firstName, lastName,
        email: email || null,
        phone: phone || null,
        companyName: companyName || null,
        industry: industry || null,
        description: description || null,
        source: source || 'WEBSITE',
        score: score ?? 0,
        status: status || 'NEW',
        priority: priority || 'MEDIUM',
        dealValue: dealValue ?? 0,
        assignedUserId: assignedUserId || null,
        orgId: org.id,
      },
    });

    await db.activity.create({
      data: {
        type: 'NOTE',
        subject: 'Lead Created',
        content: `New lead created: ${firstName} ${lastName}${companyName ? ` (${companyName})` : ''}`,
        orgId: org.id,
        leadId: lead.id,
      },
    });

    return NextResponse.json({ lead, message: 'Lead created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
