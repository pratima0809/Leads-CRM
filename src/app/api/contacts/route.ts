import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, phone, email, company, designation, chatId } = await request.json();

    if (!name || !phone) {
      return NextResponse.json({ error: 'name and phone are required' }, { status: 400 });
    }

    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const contact = await db.contact.create({
      data: {
        name,
        phone,
        email: email || null,
        companyName: company || null,
        orgId: org.id,
      },
    });

    if (chatId) {
      await db.chat.update({
        where: { id: chatId },
        data: { contactId: contact.id },
      });

      await db.activity.create({
        data: {
          type: 'NOTE',
          subject: 'Contact Created',
          content: `Created contact: ${name}${company ? ` (${company})` : ''}`,
          orgId: org.id,
          contactId: contact.id,
          chatId,
        },
      });
    }

    return NextResponse.json({ contact, message: 'Contact created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
