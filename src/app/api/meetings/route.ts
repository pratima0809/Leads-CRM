import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'today';
    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    let dateFilter: any = { date: today };
    if (range === 'upcoming') dateFilter = { date: { gte: today } };
    if (range === 'all') dateFilter = {};

    const meetings = await db.meeting.findMany({
      where: { chat: { orgId: org.id }, ...dateFilter },
      include: { chat: { select: { contactName: true, phone: true } } },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(meetings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, date, time, type, link, notes, customerName, customerPhone, chatId } = body;

    if (!date || !time || !type || !chatId) {
      return NextResponse.json({ error: 'date, time, type, and chatId are required' }, { status: 400 });
    }

    const validTypes = ['GOOGLE_MEET', 'ZOOM', 'OFFICE', 'PHONE_CALL'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: `type must be one of: ${validTypes.join(', ')}` }, { status: 400 });
    }

    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const meeting = await db.meeting.create({
      data: {
        title: title || null,
        date, time, type,
        link: link || null,
        notes: notes || null,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        chatId,
        status: 'SCHEDULED',
      },
    });

    await db.activity.create({
      data: {
        type: 'MEETING',
        subject: 'Meeting Scheduled',
        content: `${title || type.replace(/_/g, ' ')} meeting scheduled for ${date} at ${time}${customerName ? ` with ${customerName}` : ''}`,
        orgId: org.id,
        chatId,
      },
    });

    return NextResponse.json({ meeting, message: 'Meeting scheduled successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
