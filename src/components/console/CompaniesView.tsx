'use client';

import React, { useState } from 'react';
import {
  Search,
  Users,
  Sparkles,
  Star,
  Phone,
  Mail,
  ChevronRight,
  Globe,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

const industries = ['All Industries', 'Real Estate', 'Manufacturing', 'Technology', 'Healthcare', 'Finance', 'Education', 'Retail'];

const companies = [
  { id: 'c1', name: 'Horizon Real Estate', industry: 'Real Estate', logo: 'HR', health: 95, pipeline: 1850000, contacts: 12, owner: 'Sarah Connor', website: 'horizonrealty.in', annualRevenue: 50000000, activeDeals: 6, renewalDate: 'Sep 2026' },
  { id: 'c2', name: 'ABC Metals & Forgings', industry: 'Manufacturing', logo: 'AM', health: 88, pipeline: 920000, contacts: 7, owner: 'Sarah Connor', website: 'abcmetals.in', annualRevenue: 35000000, activeDeals: 4, renewalDate: 'Dec 2026' },
  { id: 'c3', name: 'Apex Educational Solutions', industry: 'Education', logo: 'AE', health: 72, pipeline: 420000, contacts: 5, owner: 'Rahul Sharma', website: 'apexedu.in', annualRevenue: 18000000, activeDeals: 3, renewalDate: 'Mar 2027' },
  { id: 'c4', name: 'NovaTech Software', industry: 'Technology', logo: 'NT', health: 91, pipeline: 2300000, contacts: 18, owner: 'Sarah Connor', website: 'novatech.dev', annualRevenue: 75000000, activeDeals: 9, renewalDate: 'Jan 2027' },
  { id: 'c5', name: 'Sahyadri Healthcare', industry: 'Healthcare', logo: 'SH', health: 84, pipeline: 780000, contacts: 9, owner: 'Rahul Sharma', website: 'sahyadrihealth.com', annualRevenue: 42000000, activeDeals: 5, renewalDate: 'Aug 2026' },
  { id: 'c6', name: 'Bharat Finance Group', industry: 'Finance', logo: 'BF', health: 67, pipeline: 340000, contacts: 4, owner: 'Aditi Mehta', website: 'bharatfinance.in', annualRevenue: 12000000, activeDeals: 2, renewalDate: 'Nov 2026' },
  { id: 'c7', name: 'GreenLeaf Retail Chain', industry: 'Retail', logo: 'GR', health: 79, pipeline: 560000, contacts: 8, owner: 'Sarah Connor', website: 'greenleafretail.com', annualRevenue: 28000000, activeDeals: 4, renewalDate: 'Feb 2027' },
];

const associatedContacts: Record<string, Array<{ name: string; role: string; lastContact: string; email: string; phone: string }>> = {
  c1: [
    { name: 'Emily Davis', role: 'Sales Director', lastContact: 'Today', email: 'emily@horizonrealty.in', phone: '+91 98765 43210' },
    { name: 'John Smith', role: 'Operations Manager', lastContact: '2 days ago', email: 'john@horizonrealty.in', phone: '+91 98765 43211' },
    { name: 'Sarah Lee', role: 'Procurement Head', lastContact: '5 days ago', email: 'sarah@horizonrealty.in', phone: '+91 98765 43212' },
  ],
  c4: [
    { name: 'Arun Nair', role: 'CTO', lastContact: 'Today', email: 'arun@novatech.dev', phone: '+91 99887 76655' },
    { name: 'Meera Iyer', role: 'VP Engineering', lastContact: '1 day ago', email: 'meera@novatech.dev', phone: '+91 99887 76656' },
    { name: 'Ravi Desai', role: 'Product Manager', lastContact: '3 days ago', email: 'ravi@novatech.dev', phone: '+91 99887 76657' },
    { name: 'Priya Krishnan', role: 'DevOps Lead', lastContact: '1 week ago', email: 'priya@novatech.dev', phone: '+91 99887 76658' },
  ],
};

const aiInsights: Record<string, Array<{ type: string; text: string; detail: string }>> = {
  c1: [
    { type: 'opportunity', text: 'Expansion opportunity detected', detail: '2 new projects in pipeline · 40% revenue uplift potential' },
    { type: 'hiring', text: 'Hiring increased 18% this quarter', detail: '5 new positions in sales and operations' },
    { type: 'upsell', text: 'High probability of upsell', detail: 'Existing contract renews in 3 months · 82% close probability' },
  ],
  c4: [
    { type: 'renewal', text: 'Renewal risk: Low', detail: 'CSAT score 4.8/5 · Last support ticket 14 days ago' },
    { type: 'engagement', text: 'Best engagement time: Tuesday 11 AM', detail: 'Based on 6 months of email and call patterns' },
    { type: 'deal', text: 'Estimated deal close probability: 82%', detail: '3 active negotiations · Avg deal size ₹7.5L' },
  ],
};

function HealthBadge({ score }: { score: number }) {
  const color = score >= 85 ? 'text-success bg-success-light/50 border-success-border/50' :
               score >= 70 ? 'text-warning bg-warning-light/50 border-warning-border/50' :
               'text-error bg-error-light/50 border-error-border/50';
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${color}`}>
      {score}%
    </span>
  );
}

export default function CompaniesView() {
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All Industries');

  const filtered = companies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchIndustry = industryFilter === 'All Industries' || c.industry === industryFilter;
    return matchSearch && matchIndustry;
  }).sort((a, b) => b.pipeline - a.pipeline);

  const contacts = associatedContacts[selectedCompany.id] || [];
  const insights = aiInsights[selectedCompany.id] || [];

  return (
    <div className="h-full flex gap-5 overflow-hidden">
      {/* Left Panel: Company List */}
      <div className="w-72 shrink-0 flex flex-col overflow-hidden bg-surface-card border border-border-default rounded-[12px]">
        <div className="p-4 border-b border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary">Companies</h3>
            <span className="text-[10px] font-semibold text-text-muted bg-surface-bg-alt px-1.5 py-0.5 rounded">{filtered.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-icon" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-bg border border-border-default rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustryFilter(ind)}
                className={`shrink-0 text-[10px] font-semibold px-2 py-1 rounded-md transition-colors ${
                  industryFilter === ind ? 'bg-accent text-white' : 'bg-surface-bg-alt text-text-secondary hover:bg-surface-bg'
                }`}
              >
                {ind === 'All Industries' ? 'All' : ind}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filtered.map((company) => (
            <button
              key={company.id}
              onClick={() => setSelectedCompany(company)}
              className={`w-full text-left px-4 py-3 border-b border-border-default/50 hover:bg-surface-bg-alt/50 transition-colors ${
                selectedCompany.id === company.id ? 'bg-surface-bg-alt border-l-2 border-l-accent' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                  {company.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-text-primary truncate">{company.name}</span>
                    <HealthBadge score={company.health} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Center Panel: Account Overview */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-5">
        {/* Company Header */}
        <div className="bg-surface-card border border-border-default rounded-[12px] p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-xl font-bold text-accent shrink-0">
              {selectedCompany.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">{selectedCompany.name}</h2>
                  <p className="text-xs text-text-secondary mt-0.5">{selectedCompany.industry}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-text-muted flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {selectedCompany.website}
                  </span>
                  <span className="text-[10px] font-medium text-text-muted flex items-center gap-1">
                    <UserPlus className="w-3 h-3" />
                    {selectedCompany.owner}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Associated Contacts */}
        <div className="bg-surface-card border border-border-default rounded-[12px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-text-primary">Associated Contacts</h3>
              <span className="text-[10px] font-semibold text-text-muted bg-surface-bg-alt px-1.5 py-0.5 rounded">{contacts.length}</span>
            </div>
            <button className="text-xs font-semibold text-accent/70 hover:text-accent transition-colors flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div key={contact.name} className="border border-border-default rounded-[10px] p-3 hover:bg-surface-bg-alt transition-colors cursor-pointer group">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary leading-tight truncate">{contact.name}</p>
                      <p className="text-[10px] text-text-muted leading-tight mt-0.5 truncate">{contact.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-text-muted shrink-0 whitespace-nowrap">{contact.lastContact}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-default/50">
                  <button className="flex-1 text-[10px] font-medium text-text-secondary hover:text-accent transition-colors flex items-center justify-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </button>
                  <button className="flex-1 text-[10px] font-medium text-text-secondary hover:text-accent transition-colors flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3" /> Call
                  </button>
                  <button className="text-[10px] font-medium text-accent hover:underline transition-colors flex items-center gap-0.5">
                    View <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: AI Account Intelligence */}
      <div className="w-72 shrink-0 flex flex-col overflow-hidden bg-surface-card border border-border-default rounded-[12px] relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/[0.03] rounded-full blur-2xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="p-4 border-b border-border-default relative z-10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-sm font-bold text-text-primary">AI Account Intelligence</h3>
            </div>
            <span className="text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> 94% confidence
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 relative z-10">
          {insights.map((insight, i) => (
            <div key={i} className="bg-accent/[0.03] border border-accent/10 rounded-[10px] p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Star className={`w-3.5 h-3.5 ${
                  insight.type === 'opportunity' ? 'text-success' :
                  insight.type === 'hiring' ? 'text-info' :
                  insight.type === 'upsell' ? 'text-accent' :
                  insight.type === 'renewal' ? 'text-success' :
                  insight.type === 'engagement' ? 'text-accent' :
                  'text-warning'
                }`} />
                <span className="text-xs font-semibold text-text-primary">{insight.text}</span>
              </div>
              <p className="text-[11px] text-text-muted font-medium leading-relaxed">{insight.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
