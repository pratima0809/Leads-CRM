import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { chatId, leadId } = await request.json();

    if (!chatId || !leadId) {
      return NextResponse.json({ error: 'chatId and leadId are required' }, { status: 400 });
    }

    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const [chat] = await Promise.all([
      db.chat.upsert({
        where: { id: chatId },
        update: { leadId },
        create: {
          id: chatId,
          phone: lead.phone || '',
          contactName: `${lead.firstName} ${lead.lastName}`,
          orgId: org.id,
          leadId,
          messages: '[]',
        },
      }),
      db.activity.create({
        data: {
          type: 'SYSTEM',
          subject: 'Lead Linked',
          content: `Linked to lead: ${lead.firstName} ${lead.lastName} (${lead.companyName || 'No company'})`,
          orgId: org.id,
          leadId,
          chatId,
        },
      }),
    ]);

    return NextResponse.json({ chat, message: 'Lead linked successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
