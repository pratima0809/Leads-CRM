import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { content, chatId } = await request.json();

    if (!content || !chatId) {
      return NextResponse.json({ error: 'content and chatId are required' }, { status: 400 });
    }

    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const note = await db.note.create({
      data: { content, chatId },
    });

    await db.activity.create({
      data: {
        type: 'NOTE',
        subject: 'Note Added',
        content,
        orgId: org.id,
        chatId,
      },
    });

    return NextResponse.json({ note, message: 'Note added successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
