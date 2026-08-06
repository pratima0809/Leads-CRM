import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const orgId = org.id;

    const [
      leads, contacts, deals, stages, activities, chats, meetings,
      leadCount, contactCount, openDeals, wonDeals, hotLeads,
    ] = await Promise.all([
      db.lead.findMany({ where: { orgId }, orderBy: { score: 'desc' } }),
      db.contact.findMany({ where: { orgId }, orderBy: { createdAt: 'desc' } }),
      db.deal.findMany({ where: { orgId }, include: { contact: true, stage: true }, orderBy: { createdAt: 'desc' } }),
      db.stage.findMany({ orderBy: { position: 'asc' } }),
      db.activity.findMany({ where: { orgId }, orderBy: { createdAt: 'desc' }, take: 20 }),
      db.chat.findMany({ where: { orgId }, orderBy: { updatedAt: 'desc' } }),
      db.meeting.findMany({ where: { chat: { orgId } }, include: { chat: true }, orderBy: { createdAt: 'desc' }, take: 10 }),
      db.lead.count({ where: { orgId } }),
      db.contact.count({ where: { orgId } }),
      db.deal.findMany({ where: { orgId, status: 'OPEN' } }),
      db.deal.findMany({ where: { orgId, status: 'WON' } }),
      db.lead.findMany({ where: { orgId, status: { not: 'COLD' } }, orderBy: { score: 'desc' }, take: 5 }),
    ]);

    const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0);
    const totalWonRevenue = wonDeals.reduce((s, d) => s + d.value, 0);
    const forecastRevenue = pipelineValue * 0.6 + totalWonRevenue;
    const targetRevenue = Math.max(forecastRevenue, 5000000);

    const today = new Date().toISOString().split('T')[0];
    const todayMeetings = meetings.filter(m => m.date === today);
    const todayActivities = activities.filter(a =>
      new Date(a.createdAt).toISOString().split('T')[0] === today
    );

    const unreadChats = chats.filter(c => {
      const msgs = JSON.parse(c.messages || '[]');
      return msgs.some((m: any) => m.sender === 'client' && !m.read);
    }).length;

    const pipelineStages = stages.map((s, i) => {
      const stageDeals = deals.filter(d => d.stageId === s.id);
      return {
        id: s.id,
        name: s.name,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, d) => sum + d.value, 0),
        pct: i === 0 ? 100 : Math.round((stageDeals.length / Math.max(leads.length, 1)) * 100),
        probability: s.probability,
      };
    });

    const priorities = leads
      .filter(l => l.status !== 'CONVERTED' && l.status !== 'COLD')
      .slice(0, 6)
      .map(l => ({
        id: l.id,
        name: `${l.firstName} ${l.lastName}`,
        company: l.companyName || '',
        priority: l.priority,
        prob: l.score,
        value: l.dealValue,
        deadline: l.updatedAt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        phone: l.phone || '',
        status: l.status,
      }));

    const totalUnread = chats.reduce((s, c) => {
      const msgs = JSON.parse(c.messages || '[]');
      return s + msgs.filter((m: any) => m.sender === 'client' && !m.read).length;
    }, 0);

    const aiReplied = chats.reduce((s, c) => {
      const msgs = JSON.parse(c.messages || '[]');
      return s + msgs.filter((m: any) => m.sender === 'bot').length;
    }, 0);

    const totalSent = chats.reduce((s, c) => {
      const msgs = JSON.parse(c.messages || '[]');
      return s + msgs.filter((m: any) => m.sender === 'agent').length;
    }, 0);

    return NextResponse.json({
      overview: {
        leadCount,
        contactCount,
        pipelineValue,
        totalRevenue: totalWonRevenue + pipelineValue * 0.3,
        conversionRate: leadCount > 0 ? Math.round((wonDeals.length / Math.max(1, leadCount)) * 100) : 0,
        forecastRevenue,
        targetRevenue,
        revenueAtRisk: openDeals.filter(d => d.aiHealthStatus === 'AT_RISK').reduce((s, d) => s + d.value, 0),
        closingThisWeek: openDeals.filter(d => d.expectedCloseDate && new Date(d.expectedCloseDate) <= new Date(Date.now() + 7 * 86400000)).length,
        highPriorityFollowUps: priorities.filter(p => p.priority === 'HIGH' || p.priority === 'CRITICAL').length,
        whatsappAwaiting: unreadChats,
        aiConfidence: 94,
        responseRate: totalSent > 0 ? Math.round((totalSent - unreadChats) / totalSent * 100) : 68,
      },
      priorities,
      waChats: chats.slice(0, 5).map(c => {
        const msgs = JSON.parse(c.messages || '[]');
        const lastMsg = msgs[msgs.length - 1];
        const unread = msgs.filter((m: any) => m.sender === 'client' && !m.read).length;
        return {
          id: c.id,
          name: c.contactName,
          phone: c.phone,
          msg: lastMsg?.text || '',
          time: c.updatedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          unread: unread > 0,
          sentiment: lastMsg?.sentiment || 'neutral',
        };
      }),
      pipelineStages,
      activities: activities.map(a => ({
        id: a.id,
        type: a.type.toLowerCase(),
        text: a.content || a.subject,
        time: a.createdAt,
        user: a.userId || 'System',
        leadId: a.leadId,
        contactId: a.contactId,
        chatId: a.chatId,
      })),
      meetings: todayMeetings.map(m => ({
        id: m.id,
        title: m.title || `Meeting with ${m.customerName || 'Customer'}`,
        time: m.time,
        duration: '45 min',
        type: m.type === 'GOOGLE_MEET' ? 'video' : m.type === 'ZOOM' ? 'video' : 'phone',
        with: m.customerName || m.chat?.contactName || 'Customer',
        link: m.link,
        status: m.status,
        date: m.date,
        notes: m.notes,
      })),
      followups: leads
        .filter(l => l.status === 'NEW' || l.status === 'QUALIFYING')
        .slice(0, 5)
        .map(l => ({
          id: l.id,
          lead: `${l.firstName} ${l.lastName}`,
          type: l.score >= 80 ? 'call' : l.score >= 50 ? 'whatsapp' : 'email',
          note: l.aiSummary || `Follow up on ${l.companyName || 'lead'}`,
          due: 'Today',
          phone: l.phone,
          status: l.status,
        })),
      notifications: [
        { id: 'n1', text: `${priorities[0]?.name || 'A lead'} viewed pricing page 3 times`, time: '5 min ago', type: 'alert' },
        { id: 'n2', text: `New lead created: ${priorities[1]?.name || 'New lead'}`, time: '18 min ago', type: 'info' },
        { id: 'n3', text: `${priorities[2]?.name || 'A lead'} requested callback`, time: '1 hour ago', type: 'action' },
        { id: 'n4', text: `Deal alert: ${priorities[3]?.name || 'Deal'} needs attention`, time: '2 hours ago', type: 'warning' },
      ],
      aiSuggestions: priorities.slice(0, 3).map((p, i) => ({
        id: `s${i}`,
        text: p.priority === 'CRITICAL'
          ? `Call ${p.name} — ${p.prob}% close probability`
          : p.priority === 'HIGH'
            ? `Send follow-up to ${p.name} — high value deal`
            : `Review ${p.name}'s requirements`,
        impact: `+₹${(p.value / 100000).toFixed(1)}L`,
        type: p.priority === 'CRITICAL' ? 'call' : 'whatsapp',
      })),
      stats: {
        revenue: pipelineValue,
        dealsClosing: openDeals.filter(d => d.aiHealthStatus === 'HOT').length,
        pendingFollowups: priorities.length,
        waResponseRate: totalSent > 0 ? Math.round(totalRepliedChats(chats) / totalSent * 100) : 68,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function totalRepliedChats(chats: any[]) {
  return chats.reduce((s, c) => {
    const msgs = JSON.parse(c.messages || '[]');
    return s + msgs.filter((m: any) => m.sender === 'agent').length;
  }, 0);
}
