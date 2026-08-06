import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: Request, context: any) {
  try {
    const body = await request.json();
    const activity = await db.activity.update({
      where: { id: context.params.id },
      data: {
        type: body.type,
        subject: body.subject,
        content: body.content,
        sentiment: body.sentiment,
        durationSecs: body.durationSecs,
      },
    });
    return NextResponse.json({ activity, message: 'Activity updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await db.activity.delete({ where: { id: context.params.id } });
    return NextResponse.json({ message: 'Activity deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
