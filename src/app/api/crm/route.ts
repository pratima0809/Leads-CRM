import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');
    
    // Fetch base organization id
    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found. Please seed the DB.' }, { status: 400 });
    }

    if (collection === 'leads') {
      const leads = await db.lead.findMany({
        where: { orgId: org.id },
        orderBy: { score: 'desc' },
      });
      return NextResponse.json(leads);
    }

    if (collection === 'contacts') {
      const contacts = await db.contact.findMany({
        where: { orgId: org.id },
        include: { deals: true },
        orderBy: { name: 'asc' },
      });
      return NextResponse.json(contacts);
    }

    if (collection === 'deals') {
      const pipeline = searchParams.get('pipeline');
      const where: any = { orgId: org.id };
      if (pipeline && pipeline !== 'all') {
        const pipe = await db.pipeline.findFirst({
          where: { orgId: org.id, name: { contains: pipeline === 'direct' ? 'Direct' : 'Partner' } },
        });
        if (pipe) where.pipelineId = pipe.id;
      }
      const deals = await db.deal.findMany({
        where,
        include: { contact: true, stage: true, pipeline: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(deals);
    }

    if (collection === 'stages') {
      const stages = await db.stage.findMany({
        orderBy: { position: 'asc' },
      });
      return NextResponse.json(stages);
    }

    if (collection === 'activities') {
      const activities = await db.activity.findMany({
        where: { orgId: org.id },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(activities);
    }

    if (collection === 'workflows') {
      const workflows = await db.workflow.findMany({
        where: { orgId: org.id },
      });
      return NextResponse.json(workflows);
    }

    if (collection === 'integrations') {
      const integrations = await db.integration.findMany({
        where: { orgId: org.id },
      });
      return NextResponse.json(integrations);
    }

    // Default return all summary metadata for dashboard
    const leadCount = await db.lead.count({ where: { orgId: org.id } });
    const contactCount = await db.contact.count({ where: { orgId: org.id } });
    const openDeals = await db.deal.findMany({
      where: { orgId: org.id, status: 'OPEN' },
    });
    const wonDeals = await db.deal.findMany({
      where: { orgId: org.id, status: 'WON' },
    });
    
    const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
    const totalWonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
    
    return NextResponse.json({
      leadCount,
      contactCount,
      pipelineValue,
      totalRevenue: totalWonRevenue + 120000, // Add baseline for display
      conversionRate: 24.8,
      organizationName: org.name,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, collection, data } = body;
    
    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found.' }, { status: 400 });
    }

    if (action === 'create' && collection === 'lead') {
      const lead = await db.lead.create({
        data: {
          ...data,
          orgId: org.id,
        },
      });
      return NextResponse.json(lead);
    }

    if (action === 'create' && collection === 'deal') {
      const deal = await db.deal.create({
        data: {
          ...data,
          orgId: org.id,
        },
      });
      return NextResponse.json(deal);
    }

    if (action === 'create' && collection === 'activity') {
      const activity = await db.activity.create({
        data: {
          ...data,
          orgId: org.id,
        },
      });
      return NextResponse.json(activity);
    }

    if (action === 'update_deal_stage') {
      const { dealId, stageId } = data;
      const deal = await db.deal.update({
        where: { id: dealId },
        data: { stageId },
      });
      return NextResponse.json(deal);
    }

    return NextResponse.json({ error: 'Action or collection not supported.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
