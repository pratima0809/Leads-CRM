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

    const leads = await db.lead.findMany({
      where: {
        orgId: org.id,
        OR: [
          { firstName: { contains: q } },
          { lastName: { contains: q } },
          { companyName: { contains: q } },
          { phone: { contains: q } },
        ],
      },
      orderBy: { score: 'desc' },
      take: 20,
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
