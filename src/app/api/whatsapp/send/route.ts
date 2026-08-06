import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { chatId, contactName, phone, text, templateId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    let chat;
    if (chatId) {
      chat = await db.chat.findUnique({ where: { id: chatId } });
      if (chat) {
        const msgs = JSON.parse(chat.messages || '[]');
        msgs.push({ sender: 'agent', text, time: new Date().toISOString(), read: true });
        chat = await db.chat.update({
          where: { id: chatId },
          data: { messages: JSON.stringify(msgs), updatedAt: new Date() },
        });
      }
    }

    if (!chat && contactName && phone) {
      chat = await db.chat.create({
        data: {
          id: `chat-${Date.now()}`,
          contactName,
          phone,
          orgId: org.id,
          messages: JSON.stringify([{ sender: 'agent', text, time: new Date().toISOString(), read: true }]),
        },
      });
    }

    if (!chat) {
      return NextResponse.json({ error: 'chatId or contactName+phone required' }, { status: 400 });
    }

    await db.activity.create({
      data: {
        type: 'WHATSAPP',
        subject: 'WhatsApp Sent',
        content: text.substring(0, 100),
        orgId: org.id,
        chatId: chat.id,
      },
    });

    return NextResponse.json({ chat, message: 'Message sent successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
