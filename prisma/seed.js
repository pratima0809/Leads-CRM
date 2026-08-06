const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up
  await db.meeting.deleteMany({});
  await db.chat.deleteMany({});
  await db.activity.deleteMany({});
  await db.workflow.deleteMany({});
  await db.integration.deleteMany({});
  await db.deal.deleteMany({});
  await db.stage.deleteMany({});
  await db.pipeline.deleteMany({});
  await db.contact.deleteMany({});
  await db.lead.deleteMany({});
  await db.user.deleteMany({});
  await db.organization.deleteMany({});

  // 1. Create Demo Org
  const org = await db.organization.create({
    data: {
      name: 'Acme Manufacturing Corp',
    },
  });
  console.log(`Created organization: ${org.name}`);

  // 2. Create Users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  const adminUser = await db.user.create({
    data: {
      email: 'admin@revenueos.com',
      name: 'Sarah Connor',
      passwordHash,
      role: 'ADMIN',
      orgId: org.id,
    },
  });

  const salesRep = await db.user.create({
    data: {
      email: 'alex@revenueos.com',
      name: 'Alex Mercer',
      passwordHash,
      role: 'MEMBER',
      orgId: org.id,
    },
  });
  console.log('Created Users: Sarah Connor (Admin), Alex Mercer (Member)');

  // 3. Create Pipelines and Stages
  const directPipeline = await db.pipeline.create({
    data: { name: 'Direct Sales', orgId: org.id },
  });
  const partnerPipeline = await db.pipeline.create({
    data: { name: 'Partner Sales', orgId: org.id },
  });

  const stages = [
    { name: 'Lead Qualified', probability: 20, position: 0 },
    { name: 'Meeting Scheduled', probability: 40, position: 1 },
    { name: 'Proposal Sent', probability: 60, position: 2 },
    { name: 'Negotiation', probability: 80, position: 3 },
    { name: 'Closed Won', probability: 100, position: 4 },
    { name: 'Closed Lost', probability: 0, position: 5 },
  ];

  const dbStages = [];
  for (const s of stages) {
    const stage = await db.stage.create({
      data: {
        name: s.name,
        probability: s.probability,
        position: s.position,
        pipelineId: directPipeline.id,
      },
    });
    dbStages.push(stage);
  }
  console.log(`Created pipeline 'Direct Sales' with ${dbStages.length} stages.`);

  const partnerStages = [];
  for (const s of stages) {
    const stage = await db.stage.create({
      data: {
        name: s.name,
        probability: s.probability,
        position: s.position,
        pipelineId: partnerPipeline.id,
      },
    });
    partnerStages.push(stage);
  }
  console.log(`Created pipeline 'Partner Sales' with ${partnerStages.length} stages.`);

  // 4. Create Contacts
  const contactsData = [
    { name: 'John Doe', email: 'john@abcmetals.com', phone: '+1 555 1234', companyName: 'ABC Metals LLC', healthScore: 92, nps: 9 },
    { name: 'Jane Smith', email: 'jane@apexedu.org', phone: '+1 555 5678', companyName: 'Apex Education Group', healthScore: 78, nps: 8 },
    { name: 'Robert Johnson', email: 'robert@apexhealth.com', phone: '+1 555 8765', companyName: 'Apex Health Systems', healthScore: 45, nps: 5 },
    { name: 'Emily Davis', email: 'emily@horizonre.com', phone: '+1 555 4321', companyName: 'Horizon Real Estate', healthScore: 95, nps: 10 },
    { name: 'Michael Brown', email: 'michael@capitaltrust.com', phone: '+1 555 9876', companyName: 'Capital Trust Partners', healthScore: 85, nps: 8 },
  ];

  const dbContacts = [];
  for (const c of contactsData) {
    const contact = await db.contact.create({
      data: {
        ...c,
        orgId: org.id,
      },
    });
    dbContacts.push(contact);
  }
  console.log(`Created ${dbContacts.length} contacts.`);

  // 5. Create Leads
  const leadsData = [
    { firstName: 'James', lastName: 'Wilson', email: 'j.wilson@indiamanufacturing.com', phone: '+91 98765 43210', companyName: 'India Manufacturing Ltd', source: 'INDIAMART', score: 85, status: 'QUALIFYING', aiRiskScore: 12, aiSummary: 'High buying intent for steel alloys. Budget confirmed. Ready for sales contact.' },
    { firstName: 'Priyah', lastName: 'Sharma', email: 'priyah.s@eduquest.in', phone: '+91 91234 56789', companyName: 'EduQuest Academy', source: 'WEBSITE', score: 95, status: 'NEW', aiRiskScore: 5, aiSummary: 'Downloaded brochure and requested callback. High relevance to automation workflow templates.' },
    { firstName: 'David', lastName: 'Miller', email: 'david@millermedical.com', phone: '+1 555 6543', companyName: 'Miller Medical Group', source: 'GOOGLE_ADS', score: 60, status: 'CONTACTED', aiRiskScore: 45, aiSummary: 'Interested in Telephony integrations. Security/compliance concerns are causing hesitation.' },
    { firstName: 'Amit', lastName: 'Patel', email: 'amit@patelbuilders.com', phone: '+91 98123 45678', companyName: 'Patel Developers', source: 'JUSTDIAL', score: 40, status: 'COLD', aiRiskScore: 80, aiSummary: 'Called back but user did not pick up. Flagged as high risk of churn or low intent.' },
    { firstName: 'Carlos', lastName: 'Gomez', email: 'carlos@gomezlogistics.com', phone: '+52 55 1234 5678', companyName: 'Gomez Logistics Services', source: 'WHATSAPP', score: 78, status: 'NEW', aiRiskScore: 15, aiSummary: 'Enquired via WhatsApp API for API keys and tracking pricing. Fit is strong.' },
  ];

  const dbLeads = [];
  for (const l of leadsData) {
    const lead = await db.lead.create({
      data: {
        ...l,
        orgId: org.id,
        assignedUserId: salesRep.id,
      },
    });
    dbLeads.push(lead);
  }
  console.log(`Created ${dbLeads.length} leads.`);

  // 6. Create Deals
  const dealsData = [
    { name: 'ABC Metals Bulk Supply', value: 45000.0, status: 'OPEN', ageDays: 12, aiHealthStatus: 'HOT', contactIndex: 0, stageIndex: 1, pipelineId: directPipeline.id },
    { name: 'Apex Edu LMS Enterprise License', value: 24000.0, status: 'OPEN', ageDays: 32, aiHealthStatus: 'STUCK', contactIndex: 1, stageIndex: 2, pipelineId: directPipeline.id },
    { name: 'Apex Health Call Center Contract', value: 85000.0, status: 'OPEN', ageDays: 45, aiHealthStatus: 'AT_RISK', contactIndex: 2, stageIndex: 3, pipelineId: directPipeline.id },
    { name: 'Horizon Commercial Listing Suite', value: 15000.0, status: 'WON', ageDays: 5, aiHealthStatus: 'HOT', contactIndex: 3, stageIndex: 4, pipelineId: partnerPipeline.id },
    { name: 'Capital Trust Advisory Retention', value: 60000.0, status: 'OPEN', ageDays: 8, aiHealthStatus: 'HOT', contactIndex: 4, stageIndex: 0, pipelineId: partnerPipeline.id },
    { name: 'GreenLeaf ERP Implementation', value: 95000.0, status: 'OPEN', ageDays: 18, aiHealthStatus: 'HOT', contactIndex: 0, stageIndex: 1, pipelineId: partnerPipeline.id },
    { name: 'NovaTech Cloud Migration', value: 120000.0, status: 'OPEN', ageDays: 28, aiHealthStatus: 'AT_RISK', contactIndex: 1, stageIndex: 2, pipelineId: partnerPipeline.id },
    { name: 'Sahyadri Telemedicine Suite', value: 72000.0, status: 'OPEN', ageDays: 10, aiHealthStatus: 'HOT', contactIndex: 2, stageIndex: 0, pipelineId: directPipeline.id },
  ];

  const dbDeals = [];
  for (const d of dealsData) {
    const stages = d.pipelineId === directPipeline.id ? dbStages : partnerStages;
    const deal = await db.deal.create({
      data: {
        name: d.name,
        value: d.value,
        status: d.status,
        ageDays: d.ageDays,
        aiHealthStatus: d.aiHealthStatus,
        orgId: org.id,
        contactId: dbContacts[d.contactIndex].id,
        pipelineId: d.pipelineId,
        stageId: stages[d.stageIndex].id,
        assignedUserId: salesRep.id,
      },
    });
    dbDeals.push(deal);
  }
  console.log(`Created ${dbDeals.length} deals.`);

  // 7. Create Activities
  const activitiesData = [
    {
      type: 'CALL',
      subject: 'Inbound Call - Discovery on Steel Supply',
      content: 'TRANSCRIPT:\nAgent: Thanks for calling Acme. What steel specifications do you need?\nProspect: We need 50 tons of ASTM A36 structural carbon steel plates.\nAgent: We can deliver that in 2 weeks. I will draft a quote.\n\nAI SUMMARY:\n- Buyer is looking for ASTM A36 steel plate supply.\n- Volume: 50 tons.\n- Sentiment: Positive. High intent.\n- Action Item: Send draft proposal by tomorrow morning.',
      sentiment: 'POSITIVE',
      durationSecs: 180,
      recordingUrl: 'https://example.com/recordings/call_1029.mp3',
      contactIndex: 0,
    },
    {
      type: 'WHATSAPP',
      subject: 'WhatsApp Chat - Apex Edu LMS Inquiry',
      content: 'Customer: Hello, does your system support single-sign-on (SSO) with Okta?\nRep: Yes, we support Okta, Azure AD, and standard SAML 2.0. Would you like a demo?\nCustomer: Yes, that would be helpful. Let\'s schedule for Thursday.',
      sentiment: 'NEUTRAL',
      contactIndex: 1,
    },
    {
      type: 'EMAIL',
      subject: 'Follow-up on Call Center Contract Proposal',
      content: 'Sent detailed contract proposal with enterprise SLAs. Awaiting review from Robert\'s compliance team. Robert mentioned they have budget constraints this quarter.',
      sentiment: 'NEGATIVE',
      contactIndex: 2,
    },
    {
      type: 'NOTE',
      subject: 'Internal Note - Strategic Account Expansion',
      content: 'Emily is planning to open a new commercial branch in Boston. They will need 15 additional seats by September. Keep close relationship.',
      sentiment: 'POSITIVE',
      contactIndex: 3,
    },
  ];

  for (const act of activitiesData) {
    await db.activity.create({
      data: {
        type: act.type,
        subject: act.subject,
        content: act.content,
        sentiment: act.sentiment,
        durationSecs: act.durationSecs || null,
        recordingUrl: act.recordingUrl || null,
        orgId: org.id,
        userId: adminUser.id,
        contactId: dbContacts[act.contactIndex].id,
      },
    });
  }
  console.log('Created contact activity timeline entries.');

  // 8. Create Workflows
  const workflowsData = [
    {
      name: 'New Lead Auto-Responder',
      isActive: true,
      triggerType: 'LEAD_CREATED',
      actionsJson: JSON.stringify([
        { action: 'SEND_WHATSAPP', templateId: 'welcome_template', delayMins: 2 },
        { action: 'ASSIGN_LEAD', logic: 'round_robin', teamId: 'sales' },
        { action: 'CREATE_TASK', taskName: 'Qualifying Call within 24h', priority: 'HIGH' }
      ]),
    },
    {
      name: 'Deal Won Team Alert & Billing',
      isActive: true,
      triggerType: 'DEAL_WON',
      actionsJson: JSON.stringify([
        { action: 'NOTIFY_TEAM', channel: 'Slack', template: 'Woohoo! Deal {dealName} worth ${dealValue} has been closed by {owner}!' },
        { action: 'GENERATE_PROPOSAL', format: 'Invoice', integration: 'Stripe' },
        { action: 'UPDATE_CRM', status: 'Converted' }
      ]),
    },
  ];

  for (const wf of workflowsData) {
    await db.workflow.create({
      data: {
        ...wf,
        orgId: org.id,
      },
    });
  }
  console.log('Created automation workflows.');

  // 9. Create Integrations
  const integrationsData = [
    { provider: 'WHATSAPP', isActive: true, credentials: '{"phone_number_id": "102839281729", "token": "wh_mock_token_abc123"}' },
    { provider: 'SLACK', isActive: true, credentials: '{"webhook_url": "https://hooks.slack.com/services/mock"}' },
    { provider: 'STRIPE', isActive: true, credentials: '{"publishable_key": "pk_test_mock", "secret_key": "sk_test_mock"}' },
    { provider: 'GOOGLE', isActive: false },
    { provider: 'SAP', isActive: false },
  ];

  for (const intg of integrationsData) {
    await db.integration.create({
      data: {
        ...intg,
        orgId: org.id,
      },
    });
  }
  console.log('Created integrations list.');

  console.log('Seeding completed successfully!');
  await db.$disconnect();
}

main().catch(err => {
  console.error('Error during seed run:', err);
  db.$disconnect();
  process.exit(1);
});
