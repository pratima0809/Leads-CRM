import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, context: any) {
  try {
    const meeting = await db.meeting.findUnique({
      where: { id: context.params.id },
      include: { chat: { select: { contactName: true, phone: true } } },
    });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }
    return NextResponse.json(meeting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const body = await request.json();
    const meeting = await db.meeting.update({
      where: { id: context.params.id },
      data: {
        title: body.title,
        date: body.date,
        time: body.time,
        type: body.type,
        status: body.status,
        link: body.link,
        notes: body.notes,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
      },
      include: { chat: true },
    });

    await db.activity.create({
      data: {
        type: 'MEETING',
        subject: body.status === 'CANCELLED' ? 'Meeting Cancelled' : body.status === 'COMPLETED' ? 'Meeting Completed' : 'Meeting Updated',
        content: `Meeting ${body.status?.toLowerCase() || 'updated'}: ${meeting.title || 'Meeting'} on ${meeting.date}`,
        orgId: meeting.chat.orgId,
        chatId: meeting.chatId,
      },
    });

    return NextResponse.json({ meeting, message: 'Meeting updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await db.meeting.delete({ where: { id: context.params.id } });
    return NextResponse.json({ message: 'Meeting deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
