import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const chats = await db.chat.findMany({
      where: {
        orgId: org.id,
        OR: q ? [
          { contactName: { contains: q } },
          { phone: { contains: q } },
        ] : undefined,
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(chats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
